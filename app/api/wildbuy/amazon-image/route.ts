import { NextRequest, NextResponse } from 'next/server'

// GET /api/wildbuy/amazon-image?q=resistance+bands&domain=www.amazon.co.uk
// Scrapes the first product image from an Amazon UK search page.
//
// Notes:
// - Amazon bot protection (AWS WAF / captcha / 503) frequently blocks
//   datacenter IPs (e.g. Vercel). This route detects blocks and returns
//   451 with { blocked: true } so the UI can fall back gracefully.
// - If RAINFOREST_API_KEY is set, it uses Rainforest (residential proxy)
//   which reliably bypasses the block.
// - For 100% reliable local runs use scripts/scrape-amazon-uk.mjs
//   (Playwright, residential IP) instead.

const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'

function isBlocked(status: number, html: string) {
  return (
    status === 503 ||
    status === 202 ||
    html.includes('api-services-support@amazon.com') ||
    html.includes('AwsWafIntegration') ||
    html.includes('Enter the characters you see below') ||
    html.includes('Sorry! Something went wrong') ||
    html.length < 5000
  )
}

// Extract first real product image from Amazon search HTML.
// Amazon embeds hi-res images in data-image-source-density / data-image-latency
// JSON blobs plus plain s-image <img> tags. Filter out sprites/logos.
function extractFirstImage(html: string): { image: string | null; asin: string | null } {
  const seen: string[] = []

  // 1) JSON blobs: "imageUrl":"https://m.media-amazon.com/images/I/....jpg"
  const jsonRe = /https:\/\/m\.media-amazon\.com\/images\/I\/[A-Za-z0-9._\-+]+?\.(?:jpg|jpeg|png|webp)/g
  const jsonHits = html.match(jsonRe) || []
  for (const u of jsonHits) {
    if (/spinner|loading|transparent|grey-pixel|1x1/i.test(u)) continue
    if (!seen.includes(u)) seen.push(u)
  }

  // 2) <img src="https://m.media-amazon.com/...">
  const imgRe = /<img[^>]+src="(https:\/\/m\.media-amazon\.com\/[^"]+)"/g
  let m: RegExpExecArray | null
  while ((m = imgRe.exec(html)) !== null) {
    const u = m[1].replace(/&amp;/g, '&')
    if (/sprite|logo|favicon|arrow|star|nav-/i.test(u)) continue
    if (!seen.includes(u)) seen.push(u)
  }

  // Prefer a product image ( /images/I/ ) over UI chrome
  const best =
    seen.find((u) => /\/images\/I\//.test(u) && !/SS40|FMwebp/i.test(u)) ||
    seen[0] ||
    null

  // First ASIN on the page (dp link)
  const asinMatch = html.match(/\/(?:dp|gp\/product)\/([A-Z0-9]{10})/)
  return { image: best, asin: asinMatch ? asinMatch[1] : null }
}

async function viaRainforest(query: string, domain: string) {
  const key = process.env.RAINFOREST_API_KEY
  if (!key) return null
  const url =
    `https://api.rainforestapi.com/request?api_key=${key}` +
    `&type=search&amazon_domain=${domain}&search_term=${encodeURIComponent(query)}`
  const res = await fetch(url, { next: { revalidate: 86400 } })
  if (!res.ok) throw new Error(`Rainforest error: ${res.status}`)
  const data = await res.json()
  const first = data?.search_results?.[0]
  if (!first?.image) return null
  return {
    image: first.image as string,
    asin: (first.asin as string) || null,
    productUrl:
      (first.link as string) ||
      `https://${domain}/s?k=${encodeURIComponent(query)}`,
    source: 'rainforest',
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = (searchParams.get('q') || '').trim()
  const domain = (searchParams.get('domain') || 'www.amazon.co.uk').trim()

  if (!query) {
    return NextResponse.json({ error: 'Missing ?q= query' }, { status: 400 })
  }

  try {
    // Preferred: Rainforest residential proxy when configured
    const rf = await viaRainforest(query, domain)
    if (rf) return NextResponse.json({ query, domain, ...rf, blocked: false })

    const searchUrl = `https://${domain}/s?k=${encodeURIComponent(query)}`
    const res = await fetch(searchUrl, {
      headers: {
        'User-Agent': UA,
        'Accept-Language': 'en-GB,en;q=0.9',
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        Referer: `https://${domain}/`,
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Site': 'same-origin',
        'Sec-Fetch-Mode': 'navigate',
      },
      // Don't cache blocks
      cache: 'no-store',
    })
    const html = await res.text()

    if (isBlocked(res.status, html)) {
      return NextResponse.json(
        {
          query,
          domain,
          blocked: true,
          image: null,
          message:
            'Amazon blocked this server IP (WAF/captcha). Set RAINFOREST_API_KEY or run scripts/scrape-amazon-uk.mjs locally.',
          searchUrl,
        },
        { status: 451 },
      )
    }

    const { image, asin } = extractFirstImage(html)
    if (!image) {
      return NextResponse.json(
        { query, domain, blocked: false, image: null, searchUrl },
        { status: 404 },
      )
    }

    return NextResponse.json({
      query,
      domain,
      image,
      asin,
      productUrl: asin
        ? `https://${domain}/dp/${asin}`
        : searchUrl,
      searchUrl,
      source: 'scrape',
      blocked: false,
    })
  } catch (error) {
    console.error('amazon-image API error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 },
    )
  }
}
