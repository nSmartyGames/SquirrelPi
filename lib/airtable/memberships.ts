'use server'

import Airtable from 'airtable'
import base, { Tables, type AirtableRecord } from './client'

export interface Membership {
  membership_id: string
  user_id: string
  stripe_customer_id: string
  stripe_subscription_id: string
  status: 'active' | 'pro_max' | 'cancelled' | 'past_due'
  created_at: string
}

function mapMembership(record: AirtableRecord): Membership {
  return {
    membership_id: record.id,
    user_id: record.get('user_id') as string,
    stripe_customer_id: record.get('stripe_customer_id') as string,
    stripe_subscription_id: record.get('stripe_subscription_id') as string,
    status: record.get('status') as Membership['status'],
    created_at: record.get('created_at') as string,
  }
}

export async function createMembership(data: Omit<Membership, 'membership_id'>): Promise<Membership> {
  const record = await base()(Tables.MEMBERSHIPS).create(data as unknown as Partial<Airtable.FieldSet>)
  return mapMembership(record)
}

export async function getMembershipByUser(userId: string): Promise<Membership | null> {
  const records = await base()(Tables.MEMBERSHIPS)
    .select({ filterByFormula: `{user_id}='${userId}'`, maxRecords: 1 })
    .all()
  return records.length > 0 ? mapMembership(records[0]) : null
}

export async function updateMembershipBySubscriptionId(
  subscriptionId: string,
  data: Partial<Omit<Membership, 'membership_id'>>
): Promise<void> {
  const records = await base()(Tables.MEMBERSHIPS)
    .select({ filterByFormula: `{stripe_subscription_id}='${subscriptionId}'`, maxRecords: 1 })
    .all()
  if (records.length > 0) {
    await base()(Tables.MEMBERSHIPS).update(records[0].id, data as unknown as Partial<Airtable.FieldSet>)
  }
}
