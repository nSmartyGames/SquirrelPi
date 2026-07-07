import Airtable from 'airtable'

export type AirtableRecord = Airtable.Record<Airtable.FieldSet>

export const Tables = {
  USERS: 'Users',
  TEMPLATES: 'Templates',
  PURCHASES: 'Purchases',
  MEMBERSHIPS: 'Memberships',
  WEBSITES: 'Websites',
  DOMAINS: 'Domains',
  AI_PROJECTS: 'AI Projects',
  PARTNERS: 'Partners',
} as const

function getBase() {
  return new Airtable({
    apiKey: process.env.AIRTABLE_API_KEY,
  }).base(process.env.AIRTABLE_BASE_ID!)
}

export default getBase
