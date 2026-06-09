import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import InviteCopy from '@/components/InviteCopy'

export default async function OrganiserDashboard() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: membership } = await supabase
    .from('club_members')
    .select('*, clubs(*)')
    .eq('user_id', user.id)
    .eq('role', 'organiser')
    .eq('status', 'active')
    .single()

  if (!membership) redirect('/dashboard')

  const club = membership.clubs as any

  const { data: runs } = await supabase
    .from('runs')
    .select('*, rsvps(id, status)')
    .eq('club_id', club.id)
    .eq('status', 'scheduled')
    .gte('date', new Date().toISOString().split('T')[0])
    .order('date', { ascending: true })
    .limit(5)

  const { count: memberCount } = await supabase
    .from('club_members')
    .select('*', { count: 'exact', head: true })
    .eq('club_id', club.id)
    .eq('status', 'active')

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const inviteUrl = `${appUrl}/join/${club.invite_token}`

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏃</span>
            <span className="font-bold text-gray-900">{club.name}</span>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <Link href="/organiser/members" className="text-sm text-gray-600 hover:text-gray-900">Members</Link>
            <Link href="/organiser/runs" className="text-sm text-gray-600 hover:text-gray-900">All Runs</Link>
            <Link href="/organiser/leaderboard" className="text-sm text-gray-600 hover:text-gray-900">Leaderboard</Link>
            <Link href="/organiser/billing" className="text-sm text-gray-600 hover:text-gray-900">Billing</Link>
            <Link href="/organiser/runs/new"
              className="bg-orange-500 text-white text-sm px-4 py-2 rounded-lg font-medium hover:bg-orange-600">
              + New Run
            </Link>
            <Link href="/auth/signout" className="text-sm text-gray-500 hover:text-gray-700">Sign out</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="text-3xl font-bold text-orange-500">{memberCount ?? 0}</div>
            <div className="text-sm text-gray-500 mt-1">Members</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="text-3xl font-bold text-orange-500">{runs?.length ?? 0}</div>
            <div className="text-sm text-gray-500 mt-1">Upcoming runs</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="text-sm font-medium text-gray-700 mb-2">Invite link</div>
            <InviteCopy url={inviteUrl} />
          </div>
        </div>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Upcoming Runs</h2>
            <Link href="/organiser/runs/new" className="text-sm text-orange-600 hover:text-orange-700 font-medium">
              Add run →
            </Link>
          </div>
          {!runs?.length ? (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
              <p className="text-gray-500 mb-4">No upcoming runs scheduled</p>
              <Link href="/organiser/runs/new"
                className="bg-orange-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-orange-600">
                Create your first run
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {runs.map((run: any) => {
                const goingCount = run.rsvps?.filter((r: any) => r.status === 'going').length ?? 0
                return (
                  <Link key={run.id} href={`/organiser/runs/${run.id}`}
                    className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between hover:border-orange-200 transition-colors">
                    <div>
                      <div className="font-medium text-gray-900">{run.title}</div>
                      <div className="text-sm text-gray-500 mt-0.5">
                        {new Date(run.date).toLocaleDateString('en-AU', {
                          weekday: 'short', day: 'numeric', month: 'short',
                        })}{' '}
                        at {run.time.slice(0, 5)} · {run.meeting_point}
                      </div>
                      {run.distance_km && (
                        <div className="text-sm text-orange-600 mt-0.5">{run.distance_km} km</div>
                      )}
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-xl font-bold text-gray-900">{goingCount}</div>
                      <div className="text-xs text-gray-500">going</div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
