import { currentUser } from '@clerk/nextjs/server'
import PageHeader from '@/components/layout/PageHeader'
import MembersContent from '@/components/members/MembersContent'

export default async function MembersPage() {
  const user = await currentUser()
  return (
    <>
      <PageHeader
        title="Members Area"
        subtitle="Exclusive content and benefits for members"
      />
      <MembersContent userId={user?.id || ''} />
    </>
  )
}
