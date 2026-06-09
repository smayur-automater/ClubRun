import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendWeeklySummaryEmail } from '@/lib/email'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createClient()
  const adminSupabase = createAdminClient()
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://clubrun.com.au'

  // Next 7 days
  const today = new Date()
  const nextWeek = new Date()
  nextWeek.setDate(today.getDate() + 7)

  const { data: clubs } = await supabase.from('clubs').select('id, name')
  if (!clubs?.length) return NextResponse.json({ sent: 0 })

  let sent = 0
  for (const club of clubs) {
    const { data: runs } = await supabase
      .from('runs')
      .select('*, rsvps(status)')
      .eq('club_id', club.id)
      .eq('status', 'scheduled')
      .gte('date', today.toISOString().split('T')[0])
      .lte('date', nextWeek.toISOString().split('T')[0])
      .order('date', { ascending: true })

    if (!runs?.length) continue

    // Get all active member emails
    const { data: members } = await supabase
      .from('club_members')
      .select('user_id')
      .eq('club_id', club.id)
      .eq('status', 'active')

    if (!members?.length) continue

    const emails: string[] = []
    for (const m of members) {
      const { data: { user } } = await adminSupabase.auth.admin.getUserById(m.user_id)
      if (user?.email) emails.push(user.email)
    }

    if (!emails.length) continue

    await sendWeeklySummaryEmail(emails, {
      clubName: club.name,
      runs: runs.map(r => ({
        title: r.title,
        date: r.date,
        time: r.time,
        meetingPoint: r.meeting_point,
        distanceKm: r.distance_km,
        goingCount: (r.rsvps as any[])?.filter((rv: any) => rv.status === 'going').length ?? 0,
      })),
      appUrl,
    })
    sent++
  }

  return NextResponse.json({ sent, clubsProcessed: clubs.length })
}
