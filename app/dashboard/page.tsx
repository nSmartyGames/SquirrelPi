import { currentUser } from '@clerk/nextjs/server'
import PageHeader from '@/components/layout/PageHeader'
import DashboardContent from '@/components/dashboard/DashboardContent'
import { getWebsitesByUser, getPartnerWebsites } from '@/lib/airtable/websites'

const PARTNER_VIEWER_EMAIL = 'lucian.virtic@hotmail.com'

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ website?: string; success?: string }>
}) {
  const user = await currentUser()
  const params = await searchParams
  const websites = user ? await getWebsitesByUser(user.id).catch(() => []) : []

  const canViewPartnerSites = user?.emailAddresses.some(
    (e) => e.emailAddress === PARTNER_VIEWER_EMAIL
  )
  const partnerWebsites = canViewPartnerSites
    ? await getPartnerWebsites().catch(() => [])
    : []

  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle={`Welcome back, ${user?.firstName || 'there'}`}
      />
      <DashboardContent
        userId={user?.id || ''}
        websites={websites}
        newWebsiteUrl={params.website}
        partnerWebsites={partnerWebsites}
      />
    </>
  )
}
