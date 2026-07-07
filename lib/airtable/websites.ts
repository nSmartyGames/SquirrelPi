'use server'

import Airtable from 'airtable'
import base, { Tables, type AirtableRecord } from './client'
import type { Website } from '@/types'

function mapWebsite(record: AirtableRecord): Website {
  return {
    website_id: record.id,
    owner_id: record.get('owner_id') as string,
    template_id: record.get('template_id') as string,
    slug: record.get('slug') as string | undefined,
    domain: record.get('domain') as string | undefined,
    html_content: record.get('html_content') as string | undefined,
    hosting_status: record.get('hosting_status') as Website['hosting_status'],
    publish_status: record.get('publish_status') as Website['publish_status'],
    created_at: record.get('created_at') as string,
    partner_id: record.get('partner_id') as string | undefined,
    external_tenant_id: record.get('external_tenant_id') as string | undefined,
    vertical: record.get('vertical') as string | undefined,
    business_data: record.get('business_data') as string | undefined,
  }
}

export async function getWebsiteBySlug(slug: string): Promise<Website | null> {
  const records = await base()(Tables.WEBSITES)
    .select({ filterByFormula: `{slug}='${slug}'`, maxRecords: 1 })
    .all()
  return records.length > 0 ? mapWebsite(records[0]) : null
}

export async function getWebsitesByUser(userId: string): Promise<Website[]> {
  const records = await base()(Tables.WEBSITES)
    .select({ filterByFormula: `{owner_id}='${userId}'` })
    .all()
  return records.map(mapWebsite)
}

function escapeFormulaValue(value: string): string {
  return value.replace(/'/g, "\\'")
}

export async function getWebsiteByPartnerTenant(
  partnerId: string,
  externalTenantId: string
): Promise<Website | null> {
  const records = await base()(Tables.WEBSITES)
    .select({
      filterByFormula: `AND({partner_id}='${escapeFormulaValue(partnerId)}', {external_tenant_id}='${escapeFormulaValue(externalTenantId)}')`,
      maxRecords: 1,
    })
    .all()
  return records.length > 0 ? mapWebsite(records[0]) : null
}

export async function createWebsite(data: Omit<Website, 'website_id'>): Promise<Website> {
  const record = await base()(Tables.WEBSITES).create(data as unknown as Partial<Airtable.FieldSet>)
  return mapWebsite(record)
}

export async function updateWebsite(id: string, data: Partial<Website>): Promise<Website> {
  const record = await base()(Tables.WEBSITES).update(id, data as unknown as Partial<Airtable.FieldSet>)
  return mapWebsite(record)
}
