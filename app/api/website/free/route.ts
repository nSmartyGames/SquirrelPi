import { NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import { createWebsite, getWebsitesByUser } from '@/lib/airtable/websites'
import { buildDefaultPage } from '@/lib/site-builder'

export async function POST() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const existing = await getWebsitesByUser(userId)
  if (existing.length > 0 && existing[0].slug) {
    const url = `${process.env.NEXT_PUBLIC_APP_URL}/sites/${existing[0].slug}`
    return NextResponse.json({ url, already_exists: true })
  }

  const user = await currentUser()
  const firstName = user?.firstName || ''
  const lastName = user?.lastName || ''
  const rawName = `${firstName}${lastName ? `-${lastName}` : ''}` || userId.slice(0, 12)

  const slug = rawName
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 32)

  const siteName = `${firstName || slug}'s Site`
  const html = buildDefaultPage(siteName)
  const url = `${process.env.NEXT_PUBLIC_APP_URL}/sites/${slug}`

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

  return NextResponse.json({ url, slug })
}
