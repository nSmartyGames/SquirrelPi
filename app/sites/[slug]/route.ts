import { NextRequest, NextResponse } from 'next/server'
import { getWebsiteBySlug } from '@/lib/airtable/websites'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const site = await getWebsiteBySlug(slug)

  if (!site || !site.html_content) {
    return new NextResponse('Site not found', { status: 404 })
  }

  return new NextResponse(site.html_content, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}
