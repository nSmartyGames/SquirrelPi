import { currentUser } from '@clerk/nextjs/server'
import PageHeader from '@/components/layout/PageHeader'
import PurchasesContent from '@/components/dashboard/PurchasesContent'
import { getPurchasesByUser } from '@/lib/airtable/purchases'
import { getUserByEmail, createUser } from '@/lib/airtable/users'

export default async function PurchasesPage() {
  const user = await currentUser()
  if (!user) return null

  const email = user.emailAddresses[0]?.emailAddress || ''

  // Upsert user in Airtable
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

  const purchases = await getPurchasesByUser(user.id)

  return (
    <>
      <PageHeader
        title="My Purchases"
        subtitle="Templates you own"
      />
      <PurchasesContent purchases={purchases} />
    </>
  )
}
