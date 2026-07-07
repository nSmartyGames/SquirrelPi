import { NextRequest, NextResponse } from 'next/server'
import { getPartnerByApiKey } from '@/lib/airtable/partners'
import { createWebsite, updateWebsite, getWebsiteByPartnerTenant } from '@/lib/airtable/websites'
import type { Partner, PartnerBusinessData, Website } from '@/types'

const DEFAULT_VERTICAL = 'bookings'
const DRAFT_TEMPLATE_ID = 'partner-draft'

async function authenticate(request: NextRequest): Promise<Partner | null> {
  const authHeader = request.headers.get('authorization') ?? ''
  const [scheme, token] = authHeader.split(' ')
  if (scheme !== 'Bearer' || !token) return null
  return getPartnerByApiKey(token)
}

function generationStatus(website: Website): 'pending' | 'generated' {
  return website.html_content ? 'generated' : 'pending'
}

function siteResponse(website: Website, action?: 'created' | 'updated') {
  return {
    website_id: website.website_id,
    ...(action ? { status: action } : {}),
    generation_status: generationStatus(website),
    slug: website.slug ?? null,
    publish_status: website.publish_status,
  }
}

export async function POST(request: NextRequest) {
  const partner = await authenticate(request)
  if (!partner) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json().catch(() => null) as {
    external_tenant_id?: string
    vertical?: string
    business?: PartnerBusinessData
  } | null

  const externalTenantId = body?.external_tenant_id
  const business = body?.business
  if (!externalTenantId || !business?.name) {
    return NextResponse.json(
      { error: 'Missing required fields: external_tenant_id and business.name' },
      { status: 400 }
    )
  }

  const vertical = body?.vertical || DEFAULT_VERTICAL
  const businessData = JSON.stringify(business)

  const existing = await getWebsiteByPartnerTenant(partner.partner_id, externalTenantId)

  if (existing) {
    const updated = await updateWebsite(existing.website_id, {
      vertical,
      business_data: businessData,
    })
    return NextResponse.json(siteResponse(updated, 'updated'))
  }

  const created = await createWebsite({
    owner_id: `partner:${partner.partner_id}:${externalTenantId}`,
    template_id: DRAFT_TEMPLATE_ID,
    hosting_status: 'none',
    publish_status: 'draft',
    created_at: new Date().toISOString(),
    partner_id: partner.partner_id,
    external_tenant_id: externalTenantId,
    vertical,
    business_data: businessData,
  })

  return NextResponse.json(siteResponse(created, 'created'), { status: 201 })
}

export async function GET(request: NextRequest) {
  const partner = await authenticate(request)
  if (!partner) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const externalTenantId = request.nextUrl.searchParams.get('external_tenant_id')
  if (!externalTenantId) {
    return NextResponse.json({ error: 'Missing external_tenant_id query param' }, { status: 400 })
  }

  const website = await getWebsiteByPartnerTenant(partner.partner_id, externalTenantId)
  if (!website) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json(siteResponse(website))
}
