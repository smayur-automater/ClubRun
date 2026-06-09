import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function LeaderboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: membership } = await supabase
    .from('club_members')
    .select('club_id, clubs(name)')
    .eq('user_id', user.id)
    .eq('role', 'organiser')
    .single()

  if (!membership) redirect('/dashboard')

  // Get all club runs
  const { data: clubRuns } = await supabase
    .from('runs')
    .select('id, date')
    .eq('club_id', membership.club_id)
    .eq('status', 'completed')

  const clubRunIds = (clubRuns ?? []).map((r: any) => r.id)

  // Get all-time attendance for this club
  const { data: allTimeAttendance } = await supabase
    .from('attendance')
    .select('user_id')
    .in('run_id', clubRunIds.length ? clubRunIds : ['none'])

  // This month's runs
  const now = new Date()
  const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
  const thisMonthRunIds = (clubRuns ?? [])
    .filter((r: any) => r.date >= firstOfMonth)
    .map((r: any) => r.id)

  const { data: monthAttendance } = await supabase
    .from('attendance')
    .select('user_id')
    .in('run_id', thisMonthRunIds.length ? thisMonthRunIds : ['none'])

  // Get member profiles
  const { data: members } = await supabase
    .from('club_members')
    .select('user_id, profiles(first_name, last_name)')
    .eq('club_id', membership.club_id)
    .eq('status', 'active')

  // Count all-time
  const allTimeCounts: Record<string, number> = {}
  for (const a of allTimeAttendance ?? []) {
    allTimeCounts[a.user_id] = (allTimeCounts[a.user_id] ?? 0) + 1
  }

  // Count this month
  const monthCounts: Record<string, number> = {}
  for (const a of monthAttendance ?? []) {
    monthCounts[a.user_id] = (monthCounts[a.user_id] ?? 0) + 1
  }

  const memberMap: Record<string, string> = {}
  for (const m of members ?? []) {
    const p = (m as any).profiles
    memberMap[m.user_id] = [p?.first_name, p?.last_name].filter(Boolean).join(' ') || 'Unknown'
  }

  const allTimeBoard = Object.entries(allTimeCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([uid, count]) => ({ name: memberMap[uid] ?? 'Unknown', count }))

  const monthBoard = Object.entries(monthCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([uid, count]) => ({ name: memberMap[uid] ?? 'Unknown', count }))

  const medals = ['🥇', '🥈', '🥉']

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Link href="/organiser/dashboard" className="text-gray-500 hover:text-gray-700">←</Link>
          <h1 className="font-semibold text-gray-900">Leaderboard</h1>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* This month */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="font-semibold text-gray-900 mb-4">
              This Month 🗓️
              <span className="text-xs font-normal text-gray-400 ml-2">
                {now.toLocaleDateString('en-AU', { month: 'long' })}
              </span>
            </h2>
            {!monthBoard.length ? (
              <p className="text-sm text-gray-400">No completed runs this month</p>
            ) : (
              <div className="space-y-2">
                {monthBoard.map((entry, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-lg w-7">{medals[i] ?? `${i + 1}.`}</span>
                    <span className="flex-1 text-sm font-medium text-gray-800">{entry.name}</span>
                    <span className="text-sm font-bold text-orange-500">{entry.count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* All time */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="font-semibold text-gray-900 mb-4">All Time 🏆</h2>
            {!allTimeBoard.length ? (
              <p className="text-sm text-gray-400">No attendance recorded yet</p>
            ) : (
              <div className="space-y-2">
                {allTimeBoard.map((entry, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-lg w-7">{medals[i] ?? `${i + 1}.`}</span>
                    <span className="flex-1 text-sm font-medium text-gray-800">{entry.name}</span>
                    <span className="text-sm font-bold text-orange-500">{entry.count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-gray-400">
          Leaderboard counts runs marked as completed with attendance confirmed
        </p>
      </main>
    </div>
  )
}
