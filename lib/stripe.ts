import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
})

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
