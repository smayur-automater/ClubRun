import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'

export default async function RunSafetyPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: run } = await supabase
    .from('runs').select('*, clubs(name)').eq('id', params.id).single()
  if (!run) notFound()

  const { data: membership } = await supabase
    .from('club_members').select('role').eq('club_id', run.club_id).eq('user_id', user.id).single()
  if (!membership || membership.role !== 'organiser') redirect('/dashboard')

  // People who attended
  const { data: attendance } = await supabase
    .from('attendance')
    .select('user_id, profiles(first_name, last_name)')
    .eq('run_id', run.id)

  // Safety check-ins
  const { data: checkins } = await supabase
    .from('safety_checkins')
    .select('user_id, confirmed_at')
    .eq('run_id', run.id)

  const safeIds = new Set((checkins ?? []).map((c: any) => c.user_id))
  const safeCount = safeIds.size
  const totalAttended = attendance?.length ?? 0

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Link href={`/organiser/runs/${run.id}`} className="text-gray-500 hover:text-gray-700">←</Link>
          <div>
            <h1 className="font-semibold text-gray-900">Safety Check-ins</h1>
            <p className="text-xs text-gray-400">{run.title}</p>
          </div>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between">
          <span className="text-gray-600">Members checked in safe</span>
          <span className="text-2xl font-bold text-green-500">{safeCount} <span className="text-sm font-normal text-gray-400">/ {totalAttended}</span></span>
        </div>

        {!attendance?.length ? (
          <div className="text-center py-8 text-gray-400">No attendance recorded for this run</div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-50">
            {attendance.map((a: any) => {
              const p = a.profiles
              const name = [p?.first_name, p?.last_name].filter(Boolean).join(' ') || 'Unknown'
              const isSafe = safeIds.has(a.user_id)
              return (
                <div key={a.user_id} className="flex items-center justify-between px-4 py-3">
                  <span className="font-medium text-gray-800">{name}</span>
                  {isSafe ? (
                    <span className="text-green-600 text-sm font-medium">✓ Safe</span>
                  ) : (
                    <span className="text-gray-300 text-sm">Not yet</span>
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
