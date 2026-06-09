import { createClient } from '@/lib/supabase/server'
import { getStripe } from '@/lib/stripe'
import { NextResponse } from 'next/server'

export async function POST() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: membership } = await supabase
    .from('club_members')
    .select('club_id')
    .eq('user_id', user.id)
    .eq('role', 'organiser')
    .single()

  if (!membership) return NextResponse.json({ error: 'Not an organiser' }, { status: 403 })

  const { data: sub } = await supabase
    .from('subscriptions')
    .select('stripe_customer_id')
    .eq('club_id', membership.club_id)
    .single()

  if (!sub?.stripe_customer_id) {
    return NextResponse.json({ error: 'No subscription found' }, { status: 404 })
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://clubrun.com.au'

  const session = await getStripe().billingPortal.sessions.create({
    customer: sub.stripe_customer_id,
    return_url: `${appUrl}/organiser/billing`,
  })

  return NextResponse.json({ url: session.url })
}
