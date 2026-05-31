import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-05-27.dahlia',
})

export const PRICES = {
  MEMBERSHIP: process.env.STRIPE_MEMBERSHIP_PRICE_ID!,
  TEMPLATE: 1300, // $13.00 in cents
}
