import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendNewRunEmail } from '@/lib/email'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { runId } = await request.json()
  const supabase = createClient()
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://clubrun.com.au'

  const { data: run } = await supabase
    .from('runs')
    .select('*, clubs(id, name), pace_groups(*)')
    .eq('id', runId)
    .single()

  if (!run) return NextResponse.json({ error: 'not found' }, { status: 404 })

  // Verify caller is organiser of this club
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: members } = await supabase
    .from('club_members')
    .select('user_id')
    .eq('club_id', run.club_id)
    .eq('status', 'active')

  if (!members?.length) return NextResponse.json({ sent: 0 })

  const adminSupabase = createAdminClient()
  const emails: string[] = []
  for (const m of members) {
    const { data: { user: memberUser } } = await adminSupabase.auth.admin.getUserById(m.user_id)
    if (memberUser?.email && memberUser.id !== user.id) emails.push(memberUser.email)
  }

  if (!emails.length) return NextResponse.json({ sent: 0 })

  await sendNewRunEmail(emails, {
    clubName: (run.clubs as any).name,
    runTitle: run.title,
    date: run.date,
    time: run.time,
    meetingPoint: run.meeting_point,
    distanceKm: run.distance_km,
    routeUrl: run.route_url,
    notes: run.notes,
    paceGroups: run.pace_groups,
    appUrl,
    runId: run.id,
  })

  return NextResponse.json({ sent: emails.length })
}
