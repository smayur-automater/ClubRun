import { Resend } from 'resend'

// Lazy-initialize so build doesn't fail without env vars present
let _resend: Resend | null = null
function getResend() {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY ?? 'placeholder')
  return _resend
}
function FROM() { return process.env.RESEND_FROM_EMAIL || 'runs@clubrun.com.au' }

function baseLayout(title: string, body: string) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f9fafb; margin: 0; padding: 0; }
  .container { max-width: 560px; margin: 40px auto; background: white; border-radius: 12px; border: 1px solid #e5e7eb; overflow: hidden; }
  .header { background: #f97316; padding: 24px; text-align: center; }
  .header h1 { color: white; margin: 0; font-size: 20px; }
  .body { padding: 32px; color: #374151; line-height: 1.6; }
  .body h2 { color: #111827; margin-top: 0; }
  .detail-row { display: flex; gap: 8px; margin: 6px 0; font-size: 15px; }
  .label { color: #6b7280; min-width: 120px; }
  .btn { display: inline-block; background: #f97316; color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; margin: 16px 0; }
  .footer { padding: 16px 32px; border-top: 1px solid #f3f4f6; font-size: 12px; color: #9ca3af; text-align: center; }
  .pace-group { background: #fff7ed; border: 1px solid #fed7aa; border-radius: 8px; padding: 12px 16px; margin: 8px 0; }
  .member-row { padding: 6px 0; border-bottom: 1px solid #f3f4f6; font-size: 14px; }
</style>
</head>
<body>
<div class="container">
  <div class="header"><h1>🏃 ClubRun</h1></div>
  <div class="body">${body}</div>
  <div class="footer">ClubRun · Running club management · <a href="https://clubrun.com.au" style="color:#9ca3af;">clubrun.com.au</a></div>
</div>
</body>
</html>`
}

export interface RunEmailData {
  clubName: string
  runTitle: string
  date: string
  time: string
  meetingPoint: string
  distanceKm?: number | null
  routeUrl?: string | null
  notes?: string | null
  paceGroups?: { label: string; leader_name?: string | null }[]
  appUrl: string
  runId: string
}

export async function sendNewRunEmail(to: string[], data: RunEmailData) {
  const dateStr = new Date(data.date).toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long' })
  const paceGroupsHtml = data.paceGroups?.length
    ? `<p style="font-weight:600;margin-bottom:6px;">Pace groups:</p>` +
      data.paceGroups.map(g => `<div class="pace-group">🏃 ${g.label}${g.leader_name ? ` — led by ${g.leader_name}` : ''}</div>`).join('')
    : ''

  const body = `
    <h2>New run posted — ${data.runTitle}</h2>
    <p>${data.clubName} has a new run scheduled!</p>
    <div class="detail-row"><span class="label">📅 Date</span><span>${dateStr}</span></div>
    <div class="detail-row"><span class="label">⏰ Time</span><span>${data.time.slice(0,5)}</span></div>
    <div class="detail-row"><span class="label">📍 Meeting point</span><span>${data.meetingPoint}</span></div>
    ${data.distanceKm ? `<div class="detail-row"><span class="label">📏 Distance</span><span>${data.distanceKm} km</span></div>` : ''}
    ${data.routeUrl ? `<div class="detail-row"><span class="label">🗺️ Route</span><a href="${data.routeUrl}" style="color:#f97316;">${data.routeUrl}</a></div>` : ''}
    ${paceGroupsHtml}
    ${data.notes ? `<p style="background:#f9fafb;padding:12px;border-radius:8px;font-size:14px;">${data.notes}</p>` : ''}
    <a href="${data.appUrl}/member/dashboard" class="btn">RSVP Now</a>
  `

  return getResend().emails.send({
    from: FROM(),
    to,
    subject: `New run: ${data.runTitle} — ${dateStr}`,
    html: baseLayout(`New run: ${data.runTitle}`, body),
  })
}

export async function sendRsvpConfirmationEmail(to: string, data: {
  firstName: string
  clubName: string
  runTitle: string
  date: string
  time: string
  meetingPoint: string
  distanceKm?: number | null
  paceGroupLabel?: string | null
  appUrl: string
}) {
  const dateStr = new Date(data.date).toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long' })

  const body = `
    <h2>You're in, ${data.firstName}! 🎉</h2>
    <p>Your RSVP for <strong>${data.runTitle}</strong> is confirmed.</p>
    <div class="detail-row"><span class="label">📅 Date</span><span>${dateStr}</span></div>
    <div class="detail-row"><span class="label">⏰ Time</span><span>${data.time.slice(0,5)}</span></div>
    <div class="detail-row"><span class="label">📍 Meet at</span><span>${data.meetingPoint}</span></div>
    ${data.distanceKm ? `<div class="detail-row"><span class="label">📏 Distance</span><span>${data.distanceKm} km</span></div>` : ''}
    ${data.paceGroupLabel ? `<div class="pace-group">🏃 Your pace group: <strong>${data.paceGroupLabel}</strong></div>` : ''}
    <p style="color:#6b7280;font-size:14px;">See you out there! Don't forget to stay hydrated.</p>
    <a href="${data.appUrl}/member/dashboard" class="btn">View Run Details</a>
  `

  return getResend().emails.send({
    from: FROM(),
    to: [to],
    subject: `RSVP confirmed: ${data.runTitle} — ${dateStr}`,
    html: baseLayout('RSVP Confirmed', body),
  })
}

export async function sendRunReminderEmail(to: string[], data: RunEmailData & { goingCount: number }) {
  const body = `
    <h2>Run reminder — tomorrow! ⏰</h2>
    <p><strong>${data.runTitle}</strong> is happening tomorrow. ${data.goingCount} runners are going.</p>
    <div class="detail-row"><span class="label">⏰ Time</span><span>${data.time.slice(0,5)}</span></div>
    <div class="detail-row"><span class="label">📍 Meet at</span><span>${data.meetingPoint}</span></div>
    ${data.distanceKm ? `<div class="detail-row"><span class="label">📏 Distance</span><span>${data.distanceKm} km</span></div>` : ''}
    ${data.routeUrl ? `<a href="${data.routeUrl}" style="color:#f97316;text-decoration:none;">🗺️ View route</a><br>` : ''}
    ${data.notes ? `<p style="background:#fff7ed;padding:12px;border-radius:8px;font-size:14px;border-left:3px solid #f97316;">${data.notes}</p>` : ''}
    <p style="font-size:14px;color:#6b7280;">Sleep well tonight — you've got a run tomorrow 💪</p>
    <a href="${data.appUrl}/member/dashboard" class="btn">View Details</a>
  `

  return getResend().emails.send({
    from: FROM(),
    to,
    subject: `Reminder: ${data.runTitle} is tomorrow at ${data.time.slice(0,5)}`,
    html: baseLayout('Run Reminder', body),
  })
}

export interface WeeklySummaryData {
  clubName: string
  runs: {
    title: string
    date: string
    time: string
    meetingPoint: string
    distanceKm?: number | null
    goingCount: number
  }[]
  appUrl: string
}

export async function sendWeeklySummaryEmail(to: string[], data: WeeklySummaryData) {
  const runsHtml = data.runs.length
    ? data.runs.map(r => {
        const dateStr = new Date(r.date).toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short' })
        return `
          <div style="border:1px solid #e5e7eb;border-radius:8px;padding:14px;margin:8px 0;">
            <div style="font-weight:600;color:#111827;">${r.title}</div>
            <div style="font-size:14px;color:#6b7280;margin-top:4px;">${dateStr} at ${r.time.slice(0,5)} · ${r.meetingPoint}</div>
            ${r.distanceKm ? `<div style="font-size:13px;color:#f97316;margin-top:2px;">${r.distanceKm} km</div>` : ''}
            <div style="font-size:13px;color:#6b7280;margin-top:4px;">${r.goingCount} going</div>
          </div>`
      }).join('')
    : '<p style="color:#9ca3af;">No runs scheduled next week.</p>'

  const body = `
    <h2>Your week ahead with ${data.clubName} 🏃</h2>
    <p>Here's what's coming up next week:</p>
    ${runsHtml}
    <a href="${data.appUrl}/member/dashboard" class="btn">View & RSVP</a>
  `

  return getResend().emails.send({
    from: FROM(),
    to,
    subject: `${data.clubName} — your runs next week`,
    html: baseLayout('Weekly Summary', body),
  })
}
