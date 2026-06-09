import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function MemberRunsPage() {
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

  const { data: runs } = await supabase
    .from('runs')
    .select('*, pace_groups(*), rsvps(id, status, user_id)')
    .eq('club_id', membership.club_id)
    .eq('status', 'scheduled')
    .gte('date', new Date().toISOString().split('T')[0])
    .order('date', { ascending: true })

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Link href="/member/dashboard" className="text-gray-500 hover:text-gray-700">←</Link>
          <h1 className="font-semibold text-gray-900">Upcoming Runs</h1>
        </div>
      </nav>
      <main className="max-w-2xl mx-auto px-4 py-6">
        {!runs?.length ? (
          <div className="text-center py-12 text-gray-400">No upcoming runs</div>
        ) : (
          <div className="space-y-3">
            {runs.map((run: any) => {
              const myRsvp = run.rsvps?.find((r: any) => r.user_id === user.id)
              const goingCount = run.rsvps?.filter((r: any) => r.status === 'going').length ?? 0
              return (
                <div key={run.id} className="bg-white rounded-xl border border-gray-200 p-4">
                  <div className="flex justify-between items-start gap-3">
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
                        <div className="text-sm text-orange-600">{run.distance_km} km</div>
                      )}
                      {run.route_url && (
                        <a href={run.route_url} target="_blank" rel="noopener noreferrer"
                          className="text-xs text-orange-500 hover:underline">
                          View route →
                        </a>
                      )}
                      <div className="text-xs text-gray-400 mt-1">{goingCount} going</div>
                      {run.pace_groups?.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {run.pace_groups.map((pg: any) => (
                            <span key={pg.id} className="text-xs bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full">
                              {pg.label}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    {myRsvp && (
                      <span className={`text-xs px-2 py-1 rounded-full font-medium shrink-0 ${
                        myRsvp.status === 'going' ? 'bg-green-100 text-green-700' :
                        myRsvp.status === 'maybe' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-600'
                      }`}>
                        {myRsvp.status === 'going' ? 'Going' : myRsvp.status === 'maybe' ? 'Maybe' : 'Not going'}
                      </span>
                    )}
                  </div>
                  {run.notes && (
                    <p className="text-sm text-gray-500 mt-2 pt-2 border-t border-gray-100">{run.notes}</p>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
