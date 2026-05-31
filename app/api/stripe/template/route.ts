import { NextRequest, NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import { createTemplateCheckout } from '@/lib/stripe/checkout'

export async function POST(request: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { templateId, templateTitle } = await request.json()
  if (!templateId || !templateTitle) {
    return NextResponse.json({ error: 'Missing templateId or templateTitle' }, { status: 400 })
  }

  const user = await currentUser()
  const email = user?.emailAddresses[0]?.emailAddress || ''

  const url = await createTemplateCheckout(userId, email, templateId, templateTitle)
  return NextResponse.json({ url })
}
