// Usage:
//   npm i -D playwright && npx playwright install chromium
//   node scripts/scrape-amazon-uk.mjs "resistance bands"
// Scrapes the FIRST product image from amazon.co.uk search (residential IP,
// real browser => passes AWS WAF where server-side fetch gets 503/202).
// Output: public/amazon/<slug>.json { query, image, asin, productUrl }

import { writeFileSync, mkdirSync } from 'node:fs'

const query = process.argv.slice(2).join(' ').trim()
if (!query) {
  console.error('Usage: node scripts/scrape-amazon-uk.mjs "<niche>"')
  process.exit(1)
}

const { chromium } = await import('playwright')
const browser = await chromium.launch({ headless: true })
const page = await browser.newPage({
  userAgent:
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
  locale: 'en-GB',
})
await page.goto(`https://www.amazon.co.uk/s?k=${encodeURIComponent(query)}`, {
  waitUntil: 'domcontentloaded',
  timeout: 60000,
})
await page.waitForSelector('div[data-component-type="s-search-result"]', {
  timeout: 30000,
})

const first = await page.evaluate(() => {
  const card = document.querySelector(
    'div[data-component-type="s-search-result"]',
  )
  if (!card) return null
  const img =
    card.querySelector('img.s-image') ||
    card.querySelector('img[data-image-latency]')
  const link = card.querySelector('a[href*="/dp/"]')
  const asin =
    card.getAttribute('data-asin') ||
    (link?.getAttribute('href')?.match(/\/dp\/([A-Z0-9]{10})/)?.[1] ?? null)
  return {
    image: img?.getAttribute('src') || null,
    asin,
    productUrl: asin ? `https://www.amazon.co.uk/dp/${asin}` : null,
  }
})

await browser.close()

if (!first?.image) {
  console.error('No product image found (blocked or empty results)')
  process.exit(2)
}

const slug = query.toLowerCase().replace(/[^a-z0-9]+/g, '-')
mkdirSync('public/amazon', { recursive: true })
const out = `public/amazon/${slug}.json`
writeFileSync(out, JSON.stringify({ query, ...first }, null, 2))
console.log(JSON.stringify({ ...first, file: out }, null, 2))
