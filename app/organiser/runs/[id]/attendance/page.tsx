import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import AttendanceMarker from './AttendanceMarker'

export default async function AttendancePage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: run } = await supabase
    .from('runs')
    .select('*, clubs(name)')
    .eq('id', params.id)
    .single()

  if (!run) notFound()

  // Verify organiser
  const { data: membership } = await supabase
    .from('club_members')
    .select('role')
    .eq('club_id', run.club_id)
    .eq('user_id', user.id)
    .single()

  if (!membership || membership.role !== 'organiser') redirect('/dashboard')

  // Get going RSVPs with profiles
  const { data: rsvps } = await supabase
    .from('rsvps')
    .select('*, profiles(first_name, last_name)')
    .eq('run_id', run.id)
    .eq('status', 'going')

  // Get existing attendance
  const { data: attendance } = await supabase
    .from('attendance')
    .select('user_id')
    .eq('run_id', run.id)

  const attendedSet = new Set((attendance ?? []).map((a: any) => a.user_id))

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Link href={`/organiser/runs/${run.id}`} className="text-gray-500 hover:text-gray-700">←</Link>
          <div>
            <h1 className="font-semibold text-gray-900">Mark Attendance</h1>
            <p className="text-xs text-gray-400">{run.title} · {new Date(run.date).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}</p>
          </div>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {!rsvps?.length ? (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-400">
            No RSVPs for this run
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-gray-500 mb-4">Tap each runner who showed up. Changes save instantly.</p>
            <AttendanceMarker
              runId={run.id}
              rsvps={(rsvps ?? []).map((r: any) => ({
                userId: r.user_id,
                name: [r.profiles?.first_name, r.profiles?.last_name].filter(Boolean).join(' ') || 'Unknown',
              }))}
              initialAttended={Array.from(attendedSet)}
            />
          </div>
        )}
      </main>
    </div>
  )
}
