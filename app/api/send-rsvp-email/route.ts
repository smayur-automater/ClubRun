import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendRsvpConfirmationEmail } from '@/lib/email'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { runId, userId, paceGroupId } = await request.json()
  const supabase = createClient()

  const { data: run } = await supabase
    .from('runs')
    .select('*, clubs(name), pace_groups(*)')
    .eq('id', runId)
    .single()

  if (!run) return NextResponse.json({ error: 'Run not found' }, { status: 404 })

  const { data: profile } = await supabase
    .from('profiles')
    .select('first_name')
    .eq('user_id', userId)
    .single()

  const adminSupabase = createAdminClient()
  const { data: { user } } = await adminSupabase.auth.admin.getUserById(userId)
  if (!user?.email) return NextResponse.json({ ok: false })

  const paceGroup = paceGroupId
    ? (run.pace_groups as any[])?.find((pg: any) => pg.id === paceGroupId)
    : null

  await sendRsvpConfirmationEmail(user.email, {
    firstName: profile?.first_name || 'Runner',
    clubName: (run.clubs as any).name,
    runTitle: run.title,
    date: run.date,
    time: run.time,
    meetingPoint: run.meeting_point,
    distanceKm: run.distance_km,
    paceGroupLabel: paceGroup?.label || null,
    appUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://clubrun.com.au',
  })

  return NextResponse.json({ ok: true })
}
