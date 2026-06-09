import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AllRunsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: membership } = await supabase
    .from('club_members')
    .select('club_id')
    .eq('user_id', user.id)
    .eq('role', 'organiser')
    .single()

  if (!membership) redirect('/dashboard')

  const { data: runs } = await supabase
    .from('runs')
    .select('*, rsvps(id, status)')
    .eq('club_id', membership.club_id)
    .order('date', { ascending: false })

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/organiser/dashboard" className="text-gray-500 hover:text-gray-700">←</Link>
            <h1 className="font-semibold text-gray-900">All Runs</h1>
          </div>
          <Link href="/organiser/runs/new" className="bg-orange-500 text-white text-sm px-4 py-2 rounded-lg font-medium hover:bg-orange-600">
            + New Run
          </Link>
        </div>
      </nav>
      <main className="max-w-3xl mx-auto px-4 py-6">
        {!runs?.length ? (
          <div className="text-center py-12 text-gray-400">No runs yet</div>
        ) : (
          <div className="space-y-3">
            {runs.map((run: any) => {
              const goingCount = run.rsvps?.filter((r: any) => r.status === 'going').length ?? 0
              return (
                <Link key={run.id} href={`/organiser/runs/${run.id}`}
                  className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between hover:border-orange-200 transition-colors">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">{run.title}</span>
                      {run.status === 'cancelled' && (
                        <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">Cancelled</span>
                      )}
                      {run.status === 'completed' && (
                        <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">Completed</span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500 mt-0.5">
                      {new Date(run.date).toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                      {' '}at {run.time.slice(0,5)}
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-lg font-bold text-gray-900">{goingCount}</div>
                    <div className="text-xs text-gray-500">going</div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
