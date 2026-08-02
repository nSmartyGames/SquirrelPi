import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { uploadImageToBlob } from '@/lib/vercelBlob'

const GRAPH_VERSION = 'v21.0'

export async function POST(request: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { imageDataUrl, caption } = await request.json()
  if (!imageDataUrl) return NextResponse.json({ error: 'Missing imageDataUrl' }, { status: 400 })

  const igAccountId = process.env.META_IG_BUSINESS_ACCOUNT_ID
  const pageAccessToken = process.env.META_PAGE_ACCESS_TOKEN
  if (!igAccountId || !pageAccessToken) {
    return NextResponse.json({ error: 'Instagram posting is not configured' }, { status: 503 })
  }

  try {
    const imageUrl = await uploadImageToBlob(imageDataUrl)

    const containerRes = await fetch(
      `https://graph.facebook.com/${GRAPH_VERSION}/${igAccountId}/media`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image_url: imageUrl,
          caption: caption || '',
          access_token: pageAccessToken,
        }),
      }
    ).then(r => r.json())

    if (!containerRes.id) {
      return NextResponse.json({ error: 'Failed to create media container', detail: containerRes }, { status: 502 })
    }

    const publishRes = await fetch(
      `https://graph.facebook.com/${GRAPH_VERSION}/${igAccountId}/media_publish`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creation_id: containerRes.id,
          access_token: pageAccessToken,
        }),
      }
    ).then(r => r.json())

    if (!publishRes.id) {
      return NextResponse.json({ error: 'Failed to publish', detail: publishRes }, { status: 502 })
    }

    return NextResponse.json({ postId: publishRes.id, imageUrl })
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Unknown error' }, { status: 500 })
  }
}
