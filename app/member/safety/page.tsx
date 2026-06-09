import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import SafeButton from './SafeButton'

export default async function SafetyPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: membership } = await supabase
    .from('club_members')
    .select('club_id')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .single()

  if (!membership) redirect('/dashboard')

  // Most recent completed/past runs I attended
  const { data: recentRuns } = await supabase
    .from('runs')
    .select('*')
    .eq('club_id', membership.club_id)
    .lte('date', new Date().toISOString().split('T')[0])
    .order('date', { ascending: false })
    .limit(5)

  // Check which ones I attended
  const runIds = (recentRuns ?? []).map((r: any) => r.id)
  const { data: myAttendance } = await supabase
    .from('attendance')
    .select('run_id')
    .eq('user_id', user.id)
    .in('run_id', runIds.length ? runIds : ['none'])

  const attendedIds = new Set((myAttendance ?? []).map((a: any) => a.run_id))
  const attendedRuns = (recentRuns ?? []).filter((r: any) => attendedIds.has(r.id))

  // Check existing safety check-ins
  const { data: checkins } = await supabase
    .from('safety_checkins')
    .select('run_id')
    .eq('user_id', user.id)
    .in('run_id', runIds.length ? runIds : ['none'])

  const checkedInIds = new Set((checkins ?? []).map((c: any) => c.run_id))

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Link href="/member/dashboard" className="text-gray-500 hover:text-gray-700">←</Link>
          <h1 className="font-semibold text-gray-900">Safety Check-in</h1>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        <p className="text-sm text-gray-500">Let your organiser know you got home safely after a run.</p>

        {!attendedRuns.length ? (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-400">
            No recent runs to check in for
          </div>
        ) : (
          <div className="space-y-3">
            {attendedRuns.map((run: any) => {
              const isSafe = checkedInIds.has(run.id)
              return (
                <div key={run.id} className="bg-white rounded-xl border border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">{run.title}</div>
                      <div className="text-sm text-gray-400">
                        {new Date(run.date).toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short' })}
                      </div>
                    </div>
                    {isSafe ? (
                      <span className="bg-green-100 text-green-700 text-sm font-medium px-3 py-1.5 rounded-full">
                        ✓ Marked safe
                      </span>
                    ) : (
                      <SafeButton runId={run.id} userId={user.id} />
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
