'use server'

import Airtable from 'airtable'
import base, { Tables, type AirtableRecord } from './client'
import type { User } from '@/types'

function mapUser(record: AirtableRecord): User {
  return {
    user_id: record.id,
    email: record.get('email') as string,
    name: record.get('name') as string,
    membership_status: record.get('membership_status') as User['membership_status'],
    created_at: record.get('created_at') as string,
    stripe_customer_id: record.get('stripe_customer_id') as string | undefined,
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const records = await base(Tables.USERS)
    .select({ filterByFormula: `{email}='${email}'`, maxRecords: 1 })
    .all()
  return records.length > 0 ? mapUser(records[0]) : null
}

export async function createUser(data: Omit<User, 'user_id'>): Promise<User> {
  const record = await base(Tables.USERS).create({
    email: data.email,
    name: data.name,
    membership_status: data.membership_status,
    created_at: data.created_at,
    stripe_customer_id: data.stripe_customer_id || '',
  })
  return mapUser(record)
}

export async function updateUser(id: string, data: Partial<User>): Promise<User> {
  const record = await base(Tables.USERS).update(id, data as unknown as Partial<Airtable.FieldSet>)
  return mapUser(record)
}
