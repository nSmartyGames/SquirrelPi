import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/client'
import { createPurchase } from '@/lib/airtable/purchases'
import { createMembership, updateMembershipBySubscriptionId } from '@/lib/airtable/memberships'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object
      const userId = session.metadata?.userId
      const templateId = session.metadata?.templateId

      if (session.mode === 'payment' && userId && templateId) {
        await createPurchase({
          user_id: userId,
          template_id: templateId,
          stripe_payment_id: session.payment_intent as string,
          purchase_date: new Date().toISOString(),
        })
      }

      if (session.mode === 'subscription' && userId) {
        await createMembership({
          user_id: userId,
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: session.subscription as string,
          status: 'active',
          created_at: new Date().toISOString(),
        })
      }
      break
    }

    case 'invoice.paid': {
      const invoice = event.data.object
      const customerId = invoice.customer as string
      if (customerId) {
        // membership renewal - keep status active
      }
      break
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object
      const status = subscription.status === 'active' ? 'active'
        : subscription.status === 'canceled' ? 'cancelled'
        : 'past_due'
      await updateMembershipBySubscriptionId(subscription.id, { status })
      break
    }
  }

  return NextResponse.json({ received: true })
}
