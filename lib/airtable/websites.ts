'use server'

import Airtable from 'airtable'
import base, { Tables, type AirtableRecord } from './client'
import type { Website } from '@/types'

function mapWebsite(record: AirtableRecord): Website {
  return {
    website_id: record.id,
    owner_id: record.get('owner_id') as string,
    template_id: record.get('template_id') as string,
    domain: record.get('domain') as string | undefined,
    hosting_status: record.get('hosting_status') as Website['hosting_status'],
    publish_status: record.get('publish_status') as Website['publish_status'],
    created_at: record.get('created_at') as string,
  }
}

export async function getWebsitesByUser(userId: string): Promise<Website[]> {
  const records = await base(Tables.WEBSITES)
    .select({ filterByFormula: `{owner_id}='${userId}'` })
    .all()
  return records.map(mapWebsite)
}

export async function createWebsite(data: Omit<Website, 'website_id'>): Promise<Website> {
  const record = await base(Tables.WEBSITES).create(data as unknown as Partial<Airtable.FieldSet>)
  return mapWebsite(record)
}

export async function updateWebsite(id: string, data: Partial<Website>): Promise<Website> {
  const record = await base(Tables.WEBSITES).update(id, data as unknown as Partial<Airtable.FieldSet>)
  return mapWebsite(record)
}
