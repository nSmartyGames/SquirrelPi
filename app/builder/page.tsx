import { currentUser } from '@clerk/nextjs/server'
import SiteBuilder from '@/components/builder/SiteBuilder'
import { getTemplateById } from '@/lib/airtable/templates'
import { getMembershipByUser } from '@/lib/airtable/memberships'
import base, { Tables } from '@/lib/airtable/client'
import { STARTER_TEMPLATES } from '@/lib/templates/starters'

export const metadata = { title: 'Site Builder — Squirrel Pi' }

export default async function BuilderPage({
  searchParams,
}: {
  searchParams: Promise<{ templateId?: string }>
}) {
  const [user, params] = await Promise.all([currentUser(), searchParams])

  let initialHtml: string | undefined
  if (params.templateId) {
    const local = STARTER_TEMPLATES.find(t => t.id === params.templateId)
    if (local) {
      initialHtml = local.bundle_html
    } else {
      const remote = await getTemplateById(params.templateId).catch(() => null)
      initialHtml = remote?.bundle_html
    }
  }

  const isPro = user
    ? await getMembershipByUser(user.id)
        .then(m => m?.status === 'active')
        .catch(() => false)
    : false

  let promptsUsed = 0
  if (user && !isPro) {
    const records = await base()(Tables.AI_PROJECTS)
      .select({ filterByFormula: `{owner_id}='${user.id}'`, fields: ['owner_id'] })
      .all()
      .catch(() => [])
    promptsUsed = records.length
  }

  return (
    <SiteBuilder
      initialHtml={initialHtml}
      isPro={isPro}
      promptsUsed={promptsUsed}
    />
  )
}
