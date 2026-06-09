import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function MyAttendancePage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: membership } = await supabase
    .from('club_members')
    .select('club_id, joined_at, clubs(name)')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .single()

  if (!membership) redirect('/dashboard')

  // Get all club run ids
  const { data: clubRuns } = await supabase
    .from('runs')
    .select('id')
    .eq('club_id', membership.club_id)

  const clubRunIds = (clubRuns ?? []).map((r: any) => r.id)

  const { data: attendance } = await supabase
    .from('attendance')
    .select('*, runs(title, date, distance_km, meeting_point)')
    .eq('user_id', user.id)
    .in('run_id', clubRunIds.length ? clubRunIds : ['none'])
    .order('confirmed_at', { ascending: false })

  const total = attendance?.length ?? 0
  const totalKm = (attendance ?? []).reduce((sum: number, a: any) => sum + (a.runs?.distance_km ?? 0), 0)

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Link href="/member/dashboard" className="text-gray-500 hover:text-gray-700">←</Link>
          <h1 className="font-semibold text-gray-900">My Runs</h1>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <div className="text-3xl font-bold text-orange-500">{total}</div>
            <div className="text-sm text-gray-500 mt-1">Runs completed</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <div className="text-3xl font-bold text-orange-500">{totalKm > 0 ? `${totalKm.toFixed(0)}` : '—'}</div>
            <div className="text-sm text-gray-500 mt-1">km total</div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-medium text-gray-900 mb-3">Run History</h2>
          {!attendance?.length ? (
            <p className="text-sm text-gray-400">No runs recorded yet — get out there! 🏃</p>
          ) : (
            <div className="space-y-3">
              {attendance.map((a: any) => (
                <div key={a.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <div className="text-sm font-medium text-gray-800">{a.runs?.title ?? 'Run'}</div>
                    <div className="text-xs text-gray-400">
                      {new Date(a.runs?.date).toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                  {a.runs?.distance_km && (
                    <span className="text-sm font-semibold text-orange-500">{a.runs.distance_km} km</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
