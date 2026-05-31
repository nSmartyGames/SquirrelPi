import { currentUser } from '@clerk/nextjs/server'
import PageHeader from '@/components/layout/PageHeader'
import AccountContent from '@/components/dashboard/AccountContent'
import { getMembershipByUser } from '@/lib/airtable/memberships'

export default async function AccountPage() {
  const user = await currentUser()
  const membership = user ? await getMembershipByUser(user.id) : null

  return (
    <>
      <PageHeader title="Account" subtitle="Manage your profile and subscription" />
      <AccountContent
        name={`${user?.firstName || ''} ${user?.lastName || ''}`.trim()}
        email={user?.emailAddresses[0]?.emailAddress || ''}
        userId={user?.id || ''}
        membershipStatus={membership?.status ?? null}
      />
    </>
  )
}
