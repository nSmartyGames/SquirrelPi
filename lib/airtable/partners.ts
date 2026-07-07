'use server'

import { createHash } from 'crypto'
import base, { Tables, type AirtableRecord } from './client'
import type { Partner } from '@/types'

function mapPartner(record: AirtableRecord): Partner {
  return {
    partner_id: record.get('partner_id') as string,
    name: record.get('name') as string,
    api_key_hash: record.get('api_key_hash') as string,
    revenue_share_pct: record.get('revenue_share_pct') as number,
    active: Boolean(record.get('active')),
    created_at: record.get('created_at') as string,
  }
}

export function hashApiKey(rawKey: string): string {
  return createHash('sha256').update(rawKey).digest('hex')
}

export async function getPartnerByApiKey(rawKey: string): Promise<Partner | null> {
  const hash = hashApiKey(rawKey)
  const records = await base()(Tables.PARTNERS)
    .select({ filterByFormula: `AND({api_key_hash}='${hash}', {active}=1)`, maxRecords: 1 })
    .all()
  return records.length > 0 ? mapPartner(records[0]) : null
}
