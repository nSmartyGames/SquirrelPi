'use server'

import Airtable from 'airtable'
import base, { Tables, type AirtableRecord } from './client'
import type { Purchase } from '@/types'

function mapPurchase(record: AirtableRecord): Purchase {
  return {
    purchase_id: record.id,
    user_id: record.get('user_id') as string,
    template_id: record.get('template_id') as string,
    stripe_payment_id: record.get('stripe_payment_id') as string,
    purchase_date: record.get('purchase_date') as string,
  }
}

export async function getPurchasesByUser(userId: string): Promise<Purchase[]> {
  const records = await base()(Tables.PURCHASES)
    .select({ filterByFormula: `{user_id}='${userId}'` })
    .all()
  return records.map(mapPurchase)
}

export async function createPurchase(data: Omit<Purchase, 'purchase_id'>): Promise<Purchase> {
  const record = await base()(Tables.PURCHASES).create(data as unknown as Partial<Airtable.FieldSet>)
  return mapPurchase(record)
}

export async function userOwnsTemplate(userId: string, templateId: string): Promise<boolean> {
  const records = await base()(Tables.PURCHASES)
    .select({
      filterByFormula: `AND({user_id}='${userId}', {template_id}='${templateId}')`,
      maxRecords: 1,
    })
    .all()
  return records.length > 0
}
