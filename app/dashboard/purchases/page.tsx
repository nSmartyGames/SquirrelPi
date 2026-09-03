import { currentUser } from '@clerk/nextjs/server'
import PageHeader from '@/components/layout/PageHeader'
import PurchasesContent from '@/components/dashboard/PurchasesContent'
import { getPurchasesByUser } from '@/lib/airtable/purchases'
import { getWebsitesByUser } from '@/lib/airtable/websites'
import { getUserByEmail, createUser } from '@/lib/airtable/users'
import { getTemplatesByIds } from '@/lib/airtable/templates'

export default async function PurchasesPage() {
  const user = await currentUser()
  if (!user) return null

  const email = user.emailAddresses[0]?.emailAddress || ''

  // Upsert user in Airtable
  try {
    const existing = await getUserByEmail(email)
    if (!existing) {
      await createUser({
        email,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        membership_status: 'none',
        created_at: new Date().toISOString(),
        stripe_customer_id: '',
      })
    }
  } catch {}

  const [purchases, websites] = await Promise.all([
    getPurchasesByUser(user.id).catch(() => []),
    getWebsitesByUser(user.id).catch(() => []),
  ])

  const templateIds = [
    ...purchases.map(p => p.template_id),
    ...websites.map(w => w.template_id),
  ]
  const templates = await getTemplatesByIds(templateIds).catch(() => [])
  const previewImageByTemplateId = new Map(templates.map(t => [t.template_id, t.preview_image]))

  const purchasesWithPreview = purchases.map(p => ({
    ...p,
    previewImage: previewImageByTemplateId.get(p.template_id),
  }))
  const websitesWithPreview = websites.map(w => ({
    ...w,
    previewImage: previewImageByTemplateId.get(w.template_id),
  }))

  return (
    <>
      <PageHeader
        title="My Stack"
        subtitle="Templates you own"
      />
      <PurchasesContent purchases={purchasesWithPreview} websites={websitesWithPreview} />
    </>
  )
}
