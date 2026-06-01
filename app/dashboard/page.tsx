import { currentUser } from '@clerk/nextjs/server'
import PageHeader from '@/components/layout/PageHeader'
import DashboardContent from '@/components/dashboard/DashboardContent'
import { getWebsitesByUser } from '@/lib/airtable/websites'

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ website?: string; success?: string }>
}) {
  const user = await currentUser()
  const params = await searchParams
  const websites = user ? await getWebsitesByUser(user.id).catch(() => []) : []

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
      />
    </>
  )
}
