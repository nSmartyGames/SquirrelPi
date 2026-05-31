import { currentUser } from '@clerk/nextjs/server'
import PageHeader from '@/components/layout/PageHeader'
import DashboardContent from '@/components/dashboard/DashboardContent'

export default async function DashboardPage() {
  const user = await currentUser()

  return (
    <>
      <PageHeader
        title="My Websites"
        subtitle={`Welcome back, ${user?.firstName || 'there'}`}
      />
      <DashboardContent userId={user?.id || ''} />
    </>
  )
}
