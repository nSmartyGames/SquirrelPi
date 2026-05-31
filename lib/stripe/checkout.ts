'use server'

import { stripe, PRICES } from './client'

export async function createMembershipCheckout(userId: string, email: string) {
  const session = await stripe.checkout.sessions.create({
    customer_email: email,
    mode: 'subscription',
    line_items: [{ price: PRICES.MEMBERSHIP, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=membership`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/account`,
    metadata: { userId },
  })
  return session.url
}

export async function createTemplateCheckout(
  userId: string,
  email: string,
  templateId: string,
  templateTitle: string
) {
  const session = await stripe.checkout.sessions.create({
    customer_email: email,
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: { name: templateTitle },
          unit_amount: PRICES.TEMPLATE,
        },
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/marketplace?success=template&templateId=${templateId}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/marketplace`,
    metadata: { userId, templateId },
  })
  return session.url
}
