'use server'

import base, { Tables, type AirtableRecord } from './client'
import type { Template } from '@/types'

function mapTemplate(record: AirtableRecord): Template {
  return {
    template_id: record.id,
    title: record.get('title') as string,
    category: record.get('category') as Template['category'],
    type: record.get('type_2d_or_3d') as Template['type'],
    preview_image: record.get('preview_image') as string,
    price: record.get('price') as number,
    description: record.get('description') as string,
    published: record.get('published') as boolean,
  }
}

export async function getTemplates(filters?: { type?: string; category?: string }): Promise<Template[]> {
  const records = await base(Tables.TEMPLATES)
    .select({
      filterByFormula: filters?.type
        ? `AND({published}=TRUE(), {type_2d_or_3d}='${filters.type}')`
        : `{published}=TRUE()`,
    })
    .all()
  return records.map(mapTemplate)
}

export async function getTemplateById(id: string): Promise<Template | null> {
  try {
    const record = await base(Tables.TEMPLATES).find(id)
    return mapTemplate(record)
  } catch {
    return null
  }
}

export async function getFeaturedTemplates(): Promise<Template[]> {
  const records = await base(Tables.TEMPLATES)
    .select({ filterByFormula: `{published}=TRUE()`, maxRecords: 6 })
    .all()
  return records.map(mapTemplate)
}
