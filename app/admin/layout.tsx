import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { isAdmin } from '@/lib/admin'
import AppShell from '@/components/layout/AppShell'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')
  if (!isAdmin(userId)) redirect('/dashboard')
  return <AppShell>{children}</AppShell>
}
