'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

interface PaceGroupInput {
  label: string
  min_pace: string
  max_pace: string
  leader_name: string
}

export default function NewRunPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('06:00')
  const [meetingPoint, setMeetingPoint] = useState('')
  const [distanceKm, setDistanceKm] = useState('')
  const [routeUrl, setRouteUrl] = useState('')
  const [notes, setNotes] = useState('')
  const [paceGroups, setPaceGroups] = useState<PaceGroupInput[]>([
    { label: '', min_pace: '', max_pace: '', leader_name: '' }
  ])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function addPaceGroup() {
    setPaceGroups([...paceGroups, { label: '', min_pace: '', max_pace: '', leader_name: '' }])
  }

  function removePaceGroup(i: number) {
    setPaceGroups(paceGroups.filter((_, idx) => idx !== i))
  }

  function updatePaceGroup(i: number, field: keyof PaceGroupInput, value: string) {
    const updated = [...paceGroups]
    updated[i][field] = value
    setPaceGroups(updated)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/auth/login'); return }

    const { data: membership } = await supabase
      .from('club_members')
      .select('club_id')
      .eq('user_id', user.id)
      .eq('role', 'organiser')
      .single()

    if (!membership) { setError('Not an organiser'); setLoading(false); return }

    const { data: run, error: runError } = await supabase.from('runs').insert({
      club_id: membership.club_id,
      title,
      date,
      time,
      meeting_point: meetingPoint,
      distance_km: distanceKm ? parseFloat(distanceKm) : null,
      route_url: routeUrl || null,
      notes: notes || null,
      created_by: user.id,
    }).select().single()

    if (runError) { setError(runError.message); setLoading(false); return }

    const validGroups = paceGroups.filter(g => g.label.trim())
    if (validGroups.length > 0) {
      await supabase.from('pace_groups').insert(
        validGroups.map(g => ({
          run_id: run.id,
          label: g.label,
          min_pace: g.min_pace || null,
          max_pace: g.max_pace || null,
          leader_name: g.leader_name || null,
        }))
      )
    }

    router.push(`/organiser/runs/${run.id}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Link href="/organiser/dashboard" className="text-gray-500 hover:text-gray-700">←</Link>
          <h1 className="font-semibold text-gray-900">New Run</h1>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}

          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
            <h2 className="font-medium text-gray-900">Run details</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Saturday Morning Run" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time *</label>
                <input type="time" value={time} onChange={e => setTime(e.target.value)} required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Meeting point *</label>
              <input type="text" value={meetingPoint} onChange={e => setMeetingPoint(e.target.value)} required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Centennial Park, Gate 1" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Distance (km)</label>
                <input type="number" step="0.1" min="0" value={distanceKm} onChange={e => setDistanceKm(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="10" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Route URL</label>
                <input type="url" value={routeUrl} onChange={e => setRouteUrl(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Strava/Garmin link" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Bring water, wear bright colours…" />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-medium text-gray-900">Pace groups</h2>
              <button type="button" onClick={addPaceGroup}
                className="text-sm text-orange-600 hover:text-orange-700 font-medium">
                + Add group
              </button>
            </div>
            {paceGroups.map((g, i) => (
              <div key={i} className="border border-gray-100 rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Group {i + 1}</span>
                  {paceGroups.length > 1 && (
                    <button type="button" onClick={() => removePaceGroup(i)} className="text-red-400 hover:text-red-600 text-sm">Remove</button>
                  )}
                </div>
                <input type="text" value={g.label} onChange={e => updatePaceGroup(i, 'label', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Group label (e.g. Fast 4:30–5:00 min/km)" />
                <div className="grid grid-cols-2 gap-2">
                  <input type="text" value={g.min_pace} onChange={e => updatePaceGroup(i, 'min_pace', e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Min pace (4:30)" />
                  <input type="text" value={g.max_pace} onChange={e => updatePaceGroup(i, 'max_pace', e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Max pace (5:00)" />
                </div>
                <input type="text" value={g.leader_name} onChange={e => updatePaceGroup(i, 'leader_name', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Pace leader name (optional)" />
              </div>
            ))}
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50">
            {loading ? 'Creating…' : 'Create Run'}
          </button>
        </form>
      </main>
    </div>
  )
}
