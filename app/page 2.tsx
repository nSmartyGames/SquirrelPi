import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import AppShell from '@/components/layout/AppShell'
import HomepageContent from '@/components/layout/HomepageContent'

export default async function HomePage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  return (
    <AppShell>
      <HomepageContent />
    </AppShell>
  )
}
