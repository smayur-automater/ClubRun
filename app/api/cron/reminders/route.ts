import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendRunReminderEmail } from '@/lib/email'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createClient()
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://clubrun.com.au'

  // Get runs happening tomorrow
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const tomorrowStr = tomorrow.toISOString().split('T')[0]

  const { data: runs } = await supabase
    .from('runs')
    .select('*, clubs(id, name), rsvps(user_id, status), pace_groups(label, leader_name)')
    .eq('date', tomorrowStr)
    .eq('status', 'scheduled')

  if (!runs?.length) return NextResponse.json({ sent: 0 })

  const adminSupabase = createAdminClient()
  let sent = 0
  for (const run of runs) {
    const goingRsvps = run.rsvps?.filter((r: any) => r.status === 'going') ?? []
    if (!goingRsvps.length) continue

    const userIds = goingRsvps.map((r: any) => r.user_id)

    const emails: string[] = []
    for (const uid of userIds) {
      const { data: { user } } = await adminSupabase.auth.admin.getUserById(uid)
      if (user?.email) emails.push(user.email)
    }

    if (!emails.length) continue

    await sendRunReminderEmail(emails, {
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
      goingCount: goingRsvps.length,
    })
    sent++
  }

  return NextResponse.json({ sent, runsChecked: runs.length })
}
