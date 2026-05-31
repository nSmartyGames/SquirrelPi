import Airtable from 'airtable'

const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
}).base(process.env.AIRTABLE_BASE_ID!)

export const Tables = {
  USERS: 'Users',
  TEMPLATES: 'Templates',
  PURCHASES: 'Purchases',
  WEBSITES: 'Websites',
  DOMAINS: 'Domains',
  AI_PROJECTS: 'AI Projects',
} as const

export default base
