import { NextRequest, NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import { createWebsite, getWebsitesByUser, getWebsiteById, updateWebsite } from '@/lib/airtable/websites'
import { buildDefaultPage } from '@/lib/site-builder'
import type { Website } from '@/types'

export async function POST(request: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json().catch(() => null) as {
    siteId?: string
    siteName?: string
    htmlContent?: string
  } | null

  let existing: Website | null = null
  try {
    if (body?.siteId) {
      const site = await getWebsiteById(body.siteId)
      if (site && site.owner_id === userId) existing = site
    } else {
      const sites = await getWebsitesByUser(userId)
      existing = sites.length > 0 ? sites[0] : null
    }
  } catch {
    return NextResponse.json({ error: 'Database unavailable' }, { status: 503 })
  }

  if (existing?.slug) {
    const url = `${process.env.NEXT_PUBLIC_APP_URL}/sites/${existing.slug}`
    if (body?.htmlContent) {
      try {
        await updateWebsite(existing.website_id, {
          html_content: body.htmlContent,
          hosting_status: 'active',
          publish_status: 'published',
        })
      } catch {
        return NextResponse.json({ error: 'Database unavailable' }, { status: 503 })
      }
    }
    return NextResponse.json({ url, already_exists: true })
  }

  const user = await currentUser()
  const firstName = user?.firstName || ''
  const lastName = user?.lastName || ''
  const rawName = body?.siteName || `${firstName}${lastName ? `-${lastName}` : ''}` || userId.slice(0, 12)

  const slug = rawName
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 32)

  const siteName = body?.siteName || firstName || slug
  const html = body?.htmlContent || buildDefaultPage(siteName)
  const url = `${process.env.NEXT_PUBLIC_APP_URL}/sites/${slug}`

  try {
    await createWebsite({
      owner_id: userId,
      template_id: '3',
      slug,
      domain: url,
      html_content: html,
      hosting_status: 'active',
      publish_status: 'published',
      created_at: new Date().toISOString(),
    })
  } catch {
    return NextResponse.json({ error: 'Database unavailable' }, { status: 503 })
  }

  return NextResponse.json({ url, slug })
}
