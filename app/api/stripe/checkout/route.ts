import { createClient } from '@/lib/supabase/server'
import { getStripe } from '@/lib/stripe'
import { NextResponse } from 'next/server'

export async function POST() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: membership } = await supabase
    .from('club_members')
    .select('club_id, clubs(name)')
    .eq('user_id', user.id)
    .eq('role', 'organiser')
    .single()

  if (!membership) return NextResponse.json({ error: 'Not an organiser' }, { status: 403 })

  const { data: sub } = await supabase
    .from('subscriptions')
    .select('stripe_customer_id')
    .eq('club_id', membership.club_id)
    .single()

  let customerId = sub?.stripe_customer_id

  if (!customerId) {
    const customer = await getStripe().customers.create({
      email: user.email,
      metadata: { club_id: membership.club_id, user_id: user.id },
    })
    customerId = customer.id
    await supabase.from('subscriptions').upsert({
      club_id: membership.club_id,
      stripe_customer_id: customerId,
    })
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://clubrun.com.au'

  const session = await getStripe().checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: process.env.STRIPE_CLUB_PRICE_ID!, quantity: 1 }],
    subscription_data: {
      trial_period_days: 30,
      metadata: { club_id: membership.club_id },
    },
    success_url: `${appUrl}/organiser/billing?success=1`,
    cancel_url: `${appUrl}/organiser/billing?cancelled=1`,
    metadata: { club_id: membership.club_id },
  })

  return NextResponse.json({ url: session.url })
}
