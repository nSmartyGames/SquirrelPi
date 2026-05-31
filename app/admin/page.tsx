import PageHeader from '@/components/layout/PageHeader'
import AdminDashboard from '@/components/admin/AdminDashboard'

export default function AdminPage() {
  return (
    <>
      <PageHeader
        title="Admin"
        subtitle="Platform management and analytics"
      />
      <AdminDashboard />
    </>
  )
}
