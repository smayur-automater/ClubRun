import { createClient } from '@/lib/supabase/server'
import { getStripe } from '@/lib/stripe'
import { NextResponse } from 'next/server'
import type Stripe from 'stripe'

export async function POST(request: Request) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = getStripe().webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = createClient()

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const clubId = session.metadata?.club_id
    const subscriptionId = session.subscription as string
    if (clubId) {
      await supabase.from('subscriptions').upsert({
        club_id: clubId,
        stripe_subscription_id: subscriptionId,
        stripe_customer_id: session.customer as string,
        plan: 'club',
        status: 'trialing',
      })
    }
  }

  if (event.type === 'customer.subscription.updated') {
    const sub = event.data.object as Stripe.Subscription
    const clubId = sub.metadata?.club_id
    if (clubId) {
      await supabase.from('subscriptions').update({
        status: sub.status,
        plan: sub.status === 'active' || sub.status === 'trialing' ? 'club' : 'free',
      }).eq('stripe_subscription_id', sub.id)
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    const sub = event.data.object as Stripe.Subscription
    await supabase.from('subscriptions').update({
      plan: 'free',
      status: 'cancelled',
      stripe_subscription_id: null,
    }).eq('stripe_subscription_id', sub.id)
  }

  if (event.type === 'invoice.payment_failed') {
    const invoice = event.data.object as Stripe.Invoice & { subscription?: string | { id: string } | null }
    const subId = typeof invoice.subscription === 'string'
      ? invoice.subscription
      : (invoice.subscription as { id: string } | null)?.id
    if (subId) {
      await supabase.from('subscriptions').update({ status: 'past_due' }).eq('stripe_subscription_id', subId)
    }
  }

  return NextResponse.json({ received: true })
}
