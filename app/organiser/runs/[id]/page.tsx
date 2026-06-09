import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import CancelRunButton from './CancelRunButton'

export default async function RunDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: run } = await supabase
    .from('runs')
    .select('*, clubs(*), pace_groups(*), rsvps(*, profiles(first_name, last_name), pace_groups(label))')
    .eq('id', params.id)
    .single()

  if (!run) notFound()

  const { data: membership } = await supabase
    .from('club_members')
    .select('role')
    .eq('club_id', run.club_id)
    .eq('user_id', user.id)
    .single()

  if (!membership || membership.role !== 'organiser') redirect('/dashboard')

  const goingRsvps = run.rsvps?.filter((r: any) => r.status === 'going') ?? []
  const maybeRsvps = run.rsvps?.filter((r: any) => r.status === 'maybe') ?? []

  const byPaceGroup: Record<string, any[]> = {}
  const ungrouped: any[] = []
  for (const rsvp of goingRsvps) {
    if (rsvp.pace_groups?.label) {
      const label = rsvp.pace_groups.label
      if (!byPaceGroup[label]) byPaceGroup[label] = []
      byPaceGroup[label].push(rsvp)
    } else {
      ungrouped.push(rsvp)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/organiser/dashboard" className="text-gray-500 hover:text-gray-700">←</Link>
            <h1 className="font-semibold text-gray-900">{run.title}</h1>
          </div>
          <div className="flex gap-2">
            <Link href={`/organiser/runs/${run.id}/edit`}
              className="text-sm border border-gray-200 px-3 py-1.5 rounded-lg text-gray-600 hover:bg-gray-50">
              Edit
            </Link>
            {run.status === 'scheduled' && <CancelRunButton runId={run.id} />}
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {run.status === 'cancelled' && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg font-medium">
            This run has been cancelled
          </div>
        )}

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Date</span>
              <div className="font-medium mt-0.5">
                {new Date(run.date).toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
            </div>
            <div>
              <span className="text-gray-500">Time</span>
              <div className="font-medium mt-0.5">{run.time.slice(0,5)}</div>
            </div>
            <div>
              <span className="text-gray-500">Meeting point</span>
              <div className="font-medium mt-0.5">{run.meeting_point}</div>
            </div>
            {run.distance_km && (
              <div>
                <span className="text-gray-500">Distance</span>
                <div className="font-medium mt-0.5">{run.distance_km} km</div>
              </div>
            )}
            {run.route_url && (
              <div className="col-span-2">
                <span className="text-gray-500">Route</span>
                <div className="mt-0.5">
                  <a href={run.route_url} target="_blank" rel="noopener noreferrer"
                    className="text-orange-600 hover:underline font-medium">View route →</a>
                </div>
              </div>
            )}
            {run.notes && (
              <div className="col-span-2">
                <span className="text-gray-500">Notes</span>
                <div className="font-medium mt-0.5">{run.notes}</div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900 mb-4">
            RSVPs — {goingRsvps.length} going, {maybeRsvps.length} maybe
          </h2>

          {Object.entries(byPaceGroup).map(([label, rsvps]) => (
            <div key={label} className="mb-4">
              <div className="text-sm font-medium text-orange-600 mb-2">{label}</div>
              <div className="space-y-1">
                {rsvps.map((r: any) => (
                  <div key={r.id} className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0"></span>
                    {r.profiles?.first_name} {r.profiles?.last_name}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {ungrouped.length > 0 && (
            <div className="mb-4">
              <div className="text-sm font-medium text-gray-500 mb-2">No pace group selected</div>
              <div className="space-y-1">
                {ungrouped.map((r: any) => (
                  <div key={r.id} className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0"></span>
                    {r.profiles?.first_name} {r.profiles?.last_name}
                  </div>
                ))}
              </div>
            </div>
          )}

          {maybeRsvps.length > 0 && (
            <div>
              <div className="text-sm font-medium text-yellow-600 mb-2">Maybe ({maybeRsvps.length})</div>
              <div className="space-y-1">
                {maybeRsvps.map((r: any) => (
                  <div key={r.id} className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="w-2 h-2 rounded-full bg-yellow-400 flex-shrink-0"></span>
                    {r.profiles?.first_name} {r.profiles?.last_name}
                  </div>
                ))}
              </div>
            </div>
          )}

          {(!run.rsvps || run.rsvps.length === 0) && (
            <p className="text-gray-400 text-sm">No RSVPs yet</p>
          )}
        </div>
      </main>
    </div>
  )
}
