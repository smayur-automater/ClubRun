import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import BillingActions from './BillingActions'

export default async function BillingPage({
  searchParams,
}: {
  searchParams: { success?: string; cancelled?: string }
}) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: membership } = await supabase
    .from('club_members')
    .select('club_id, clubs(name)')
    .eq('user_id', user.id)
    .eq('role', 'organiser')
    .single()

  if (!membership) redirect('/dashboard')

  const { data: sub } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('club_id', membership.club_id)
    .single()

  const plan = sub?.plan ?? 'free'
  const status = sub?.status ?? 'active'
  const isClub = plan === 'club' && (status === 'active' || status === 'trialing')

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Link href="/organiser/dashboard" className="text-gray-500 hover:text-gray-700">
            ←
          </Link>
          <h1 className="font-semibold text-gray-900">Billing</h1>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {searchParams.success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg font-medium">
            🎉 You&apos;re now on the Club plan — all features are unlocked!
          </div>
        )}
        {searchParams.cancelled && (
          <div className="bg-gray-50 border border-gray-200 text-gray-600 px-4 py-3 rounded-lg">
            Upgrade cancelled. You&apos;re still on the Free plan.
          </div>
        )}

        {/* Current plan badge */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-500">Current plan</div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-2xl font-bold text-gray-900">{isClub ? 'Club' : 'Free'}</span>
              {status === 'trialing' && (
                <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
                  Trial
                </span>
              )}
              {status === 'past_due' && (
                <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                  Payment overdue
                </span>
              )}
              {status === 'cancelled' && (
                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                  Cancelled
                </span>
              )}
            </div>
          </div>
          <div className="text-right">
            {isClub ? (
              <div className="text-lg font-semibold text-gray-900">
                A$19<span className="text-sm font-normal text-gray-500">/mo</span>
              </div>
            ) : (
              <div className="text-lg font-semibold text-green-600">Free</div>
            )}
          </div>
        </div>

        {/* Plan comparison */}
        <div className="grid grid-cols-2 gap-4">
          <div
            className={`bg-white rounded-xl border-2 p-5 ${!isClub ? 'border-orange-200' : 'border-gray-100'}`}
          >
            <div className="font-semibold text-gray-900 mb-1">Free</div>
            <div className="text-2xl font-bold text-gray-900 mb-4">
              $0<span className="text-sm font-normal text-gray-500">/mo</span>
            </div>
            <ul className="space-y-2 text-sm">
              <li className="text-gray-600">✓ 1 club</li>
              <li className="text-gray-600">✓ Up to 15 members</li>
              <li className="text-gray-600">✓ 2 runs per month</li>
              <li className="text-gray-400">✗ Email notifications</li>
            </ul>
            {!isClub && (
              <div className="mt-3 text-xs text-orange-600 font-medium">✓ Your current plan</div>
            )}
          </div>

          <div
            className={`bg-white rounded-xl border-2 p-5 ${isClub ? 'border-orange-400' : 'border-gray-100'}`}
          >
            <div className="font-semibold text-gray-900 mb-1">Club</div>
            <div className="text-2xl font-bold text-gray-900 mb-4">
              $19<span className="text-sm font-normal text-gray-500">/mo AUD</span>
            </div>
            <ul className="space-y-2 text-sm">
              <li className="text-gray-600">✓ Unlimited members</li>
              <li className="text-gray-600">✓ Unlimited runs</li>
              <li className="text-gray-600">✓ Email notifications</li>
              <li className="text-gray-600">✓ 30-day free trial</li>
            </ul>
            {isClub && (
              <div className="mt-3 text-xs text-orange-600 font-medium">✓ Your current plan</div>
            )}
          </div>
        </div>

        <BillingActions isClub={isClub} hasCustomer={!!sub?.stripe_customer_id} />
      </main>
    </div>
  )
}
