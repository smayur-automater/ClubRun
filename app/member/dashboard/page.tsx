import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import RSVPButton from './RSVPButton'

export default async function MemberDashboard() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: membership } = await supabase
    .from('club_members')
    .select('*, clubs(*)')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .single()

  if (!membership) redirect('/dashboard')
  if (membership.role === 'organiser') redirect('/organiser/dashboard')

  const club = membership.clubs as any

  const { data: runs } = await supabase
    .from('runs')
    .select('*, pace_groups(*), rsvps(id, status, user_id)')
    .eq('club_id', club.id)
    .eq('status', 'scheduled')
    .gte('date', new Date().toISOString().split('T')[0])
    .order('date', { ascending: true })
    .limit(5)

  const { data: profile } = await supabase
    .from('profiles')
    .select('first_name')
    .eq('user_id', user.id)
    .single()

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏃</span>
            <span className="font-bold text-gray-900">{club.name}</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/member/runs" className="text-sm text-gray-600 hover:text-gray-900">All Runs</Link>
            <Link href="/member/attendance" className="text-sm text-gray-600 hover:text-gray-900">My Runs</Link>
            <Link href="/member/safety" className="text-sm text-gray-600 hover:text-gray-900">Safety</Link>
            <Link href="/member/profile" className="text-sm text-gray-600 hover:text-gray-900">Profile</Link>
            <Link href="/auth/signout" className="text-sm text-gray-500 hover:text-gray-700">Sign out</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Hey {profile?.first_name || 'there'} 👋
          </h1>
          {club.location && <p className="text-gray-500 text-sm mt-1">{club.location}</p>}
        </div>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Upcoming Runs</h2>
            <Link href="/member/runs" className="text-sm text-orange-600 hover:text-orange-700 font-medium">
              See all →
            </Link>
          </div>
          {!runs?.length ? (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-400">
              No upcoming runs scheduled
            </div>
          ) : (
            <div className="space-y-4">
              {runs.map((run: any) => {
                const myRsvp = run.rsvps?.find((r: any) => r.user_id === user.id)
                const goingCount = run.rsvps?.filter((r: any) => r.status === 'going').length ?? 0
                return (
                  <div key={run.id} className="bg-white rounded-xl border border-gray-200 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="font-medium text-gray-900">{run.title}</div>
                        <div className="text-sm text-gray-500 mt-0.5">
                          {new Date(run.date).toLocaleDateString('en-AU', {
                            weekday: 'short', day: 'numeric', month: 'short',
                          })}{' '}
                          at {run.time.slice(0, 5)}
                        </div>
                        <div className="text-sm text-gray-500">{run.meeting_point}</div>
                        {run.distance_km && (
                          <div className="text-sm text-orange-600 mt-0.5">{run.distance_km} km</div>
                        )}
                        {run.route_url && (
                          <a href={run.route_url} target="_blank" rel="noopener noreferrer"
                            className="text-xs text-orange-500 hover:underline mt-0.5 block">
                            View route →
                          </a>
                        )}
                        <div className="text-xs text-gray-400 mt-1">{goingCount} going</div>
                        {run.notes && (
                          <p className="text-xs text-gray-500 mt-1 pt-1 border-t border-gray-100">{run.notes}</p>
                        )}
                      </div>
                      <RSVPButton run={run} currentRsvp={myRsvp} userId={user.id} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
