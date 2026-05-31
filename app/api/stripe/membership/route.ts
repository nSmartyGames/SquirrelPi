import { NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import { createMembershipCheckout } from '@/lib/stripe/checkout'

export async function POST() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await currentUser()
  const email = user?.emailAddresses[0]?.emailAddress || ''

  const url = await createMembershipCheckout(userId, email)
  return NextResponse.json({ url })
}
