import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { deployToPages } from '@/lib/cloudflare/pages'

export async function POST(request: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { projectName, siteName, htmlContent } = await request.json()
  if (!projectName || !siteName) {
    return NextResponse.json({ error: 'Missing projectName or siteName' }, { status: 400 })
  }

  // Slugify project name: lowercase, alphanumeric + hyphens only
  const slug = projectName
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 28)

  const finalSlug = `sq-${slug}`

  const result = await deployToPages(finalSlug, htmlContent || '', siteName)

  return NextResponse.json({
    url: result.url,
    deploymentId: result.deploymentId,
    pagesUrl: `https://${finalSlug}.pages.dev`,
  })
}
