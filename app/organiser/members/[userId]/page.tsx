import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'

export default async function MemberDetailPage({ params }: { params: { userId: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  // Verify organiser
  const { data: myMembership } = await supabase
    .from('club_members')
    .select('club_id')
    .eq('user_id', user.id)
    .eq('role', 'organiser')
    .single()

  if (!myMembership) redirect('/dashboard')

  // Get target member
  const { data: member } = await supabase
    .from('club_members')
    .select('*, profiles(*)')
    .eq('club_id', myMembership.club_id)
    .eq('user_id', params.userId)
    .single()

  if (!member) notFound()

  const profile = member.profiles as any

  // Get attendance history
  const { data: attendanceRecords } = await supabase
    .from('attendance')
    .select('*, runs(title, date, distance_km)')
    .eq('user_id', params.userId)
    .order('confirmed_at', { ascending: false })

  // Filter to only this club's runs
  const { data: clubRuns } = await supabase
    .from('runs')
    .select('id')
    .eq('club_id', myMembership.club_id)

  const clubRunIds = new Set((clubRuns ?? []).map((r: any) => r.id))
  const clubAttendance = (attendanceRecords ?? []).filter((a: any) => clubRunIds.has(a.run_id))

  const totalRuns = clubAttendance.length
  const fullName = [profile?.first_name, profile?.last_name].filter(Boolean).join(' ') || 'Unknown'

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Link href="/organiser/members" className="text-gray-500 hover:text-gray-700">←</Link>
          <h1 className="font-semibold text-gray-900">{fullName}</h1>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-5">
        {/* Stats card */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center text-2xl font-bold text-orange-500">
              {(profile?.first_name?.[0] ?? '?').toUpperCase()}
            </div>
            <div>
              <div className="font-semibold text-gray-900 text-lg">{fullName}</div>
              <div className="text-orange-600 font-medium">{totalRuns} run{totalRuns !== 1 ? 's' : ''} with the club</div>
              <div className="text-xs text-gray-400 mt-0.5">
                Joined {new Date(member.joined_at).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
            </div>
          </div>
        </div>

        {/* PBs */}
        {(profile?.pb_5k || profile?.pb_10k || profile?.pb_half || profile?.pb_full) && (
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="font-medium text-gray-900 mb-3">Personal Bests</h2>
            <div className="grid grid-cols-2 gap-3">
              {profile.pb_5k && <div><span className="text-xs text-gray-400">5K</span><div className="font-semibold text-gray-900">{profile.pb_5k}</div></div>}
              {profile.pb_10k && <div><span className="text-xs text-gray-400">10K</span><div className="font-semibold text-gray-900">{profile.pb_10k}</div></div>}
              {profile.pb_half && <div><span className="text-xs text-gray-400">Half marathon</span><div className="font-semibold text-gray-900">{profile.pb_half}</div></div>}
              {profile.pb_full && <div><span className="text-xs text-gray-400">Marathon</span><div className="font-semibold text-gray-900">{profile.pb_full}</div></div>}
            </div>
          </div>
        )}

        {/* Emergency contact */}
        {profile?.emergency_contact && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="text-xs font-medium text-amber-700 mb-1">Emergency Contact</div>
            <div className="text-amber-900">{profile.emergency_contact}</div>
          </div>
        )}

        {/* Attendance history */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-medium text-gray-900 mb-3">Run History ({totalRuns})</h2>
          {!clubAttendance.length ? (
            <p className="text-sm text-gray-400">No recorded attendance yet</p>
          ) : (
            <div className="space-y-2">
              {clubAttendance.map((a: any) => (
                <div key={a.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <div className="text-sm font-medium text-gray-800">{a.runs?.title ?? 'Run'}</div>
                    <div className="text-xs text-gray-400">
                      {new Date(a.runs?.date).toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                  {a.runs?.distance_km && (
                    <span className="text-xs text-orange-600 font-medium">{a.runs.distance_km} km</span>
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
