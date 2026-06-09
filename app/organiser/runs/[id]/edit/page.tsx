'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function EditRunPage() {
  const router = useRouter()
  const params = useParams()
  const runId = params.id as string

  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [meetingPoint, setMeetingPoint] = useState('')
  const [distanceKm, setDistanceKm] = useState('')
  const [routeUrl, setRouteUrl] = useState('')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase.from('runs').select('*').eq('id', runId).single().then(({ data }) => {
      if (data) {
        setTitle(data.title)
        setDate(data.date)
        setTime(data.time.slice(0, 5))
        setMeetingPoint(data.meeting_point)
        setDistanceKm(data.distance_km?.toString() ?? '')
        setRouteUrl(data.route_url ?? '')
        setNotes(data.notes ?? '')
      }
      setFetching(false)
    })
  }, [runId])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.from('runs').update({
      title, date, time, meeting_point: meetingPoint,
      distance_km: distanceKm ? parseFloat(distanceKm) : null,
      route_url: routeUrl || null,
      notes: notes || null,
    }).eq('id', runId)

    if (error) { setError(error.message); setLoading(false); return }
    router.push(`/organiser/runs/${runId}`)
  }

  if (fetching) return <div className="min-h-screen flex items-center justify-center"><div className="text-gray-400">Loading…</div></div>

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Link href={`/organiser/runs/${runId}`} className="text-gray-500 hover:text-gray-700">←</Link>
          <h1 className="font-semibold text-gray-900">Edit Run</h1>
        </div>
      </nav>
      <main className="max-w-2xl mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          {error && <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500" />
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
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Distance (km)</label>
              <input type="number" step="0.1" min="0" value={distanceKm} onChange={e => setDistanceKm(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Route URL</label>
              <input type="url" value={routeUrl} onChange={e => setRouteUrl(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-orange-500 text-white py-2 rounded-lg font-semibold hover:bg-orange-600 disabled:opacity-50">
            {loading ? 'Saving…' : 'Save Changes'}
          </button>
        </form>
      </main>
    </div>
  )
}
