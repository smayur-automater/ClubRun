import Stripe from 'stripe'

let _stripe: Stripe | null = null
export function getStripe() {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? 'placeholder', {
      apiVersion: '2026-05-27.dahlia' as const,
    })
  }
  return _stripe
}

export const PLANS = {
  free: {
    name: 'Free',
    price: 0,
    maxMembers: 15,
    maxRunsPerMonth: 2,
    emailNotifications: false,
  },
  club: {
    name: 'Club',
    price: 1900, // cents AUD
    maxMembers: Infinity,
    maxRunsPerMonth: Infinity,
    emailNotifications: true,
  },
}
