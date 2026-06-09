'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface PaceGroup {
  id: string
  label: string
}

interface RunWithGroups {
  id: string
  pace_groups: PaceGroup[]
}

interface RSVP {
  id: string
  status: string
  pace_group_id: string | null
}

export default function RSVPButton({
  run,
  currentRsvp,
  userId,
}: {
  run: RunWithGroups
  currentRsvp: RSVP | null | undefined
  userId: string
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [selectedPaceGroup, setSelectedPaceGroup] = useState<string>(currentRsvp?.pace_group_id ?? '')
  const [status, setStatus] = useState<string>(currentRsvp?.status ?? 'going')

  async function saveRsvp() {
    setLoading(true)
    const supabase = createClient()

    if (currentRsvp) {
      await supabase
        .from('rsvps')
        .update({ status, pace_group_id: selectedPaceGroup || null })
        .eq('id', currentRsvp.id)
    } else {
      await supabase.from('rsvps').insert({
        run_id: run.id,
        user_id: userId,
        status,
        pace_group_id: selectedPaceGroup || null,
      })
    }

    setShowModal(false)
    setLoading(false)
    router.refresh()
  }

  const statusColors: Record<string, string> = {
    going: 'bg-green-100 text-green-700',
    maybe: 'bg-yellow-100 text-yellow-700',
    not_going: 'bg-red-100 text-red-600',
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className={`text-xs px-3 py-1.5 rounded-full font-medium whitespace-nowrap ${
          currentRsvp
            ? statusColors[currentRsvp.status]
            : 'bg-orange-500 text-white hover:bg-orange-600'
        }`}
      >
        {currentRsvp
          ? currentRsvp.status === 'going'
            ? '✓ Going'
            : currentRsvp.status === 'maybe'
            ? '? Maybe'
            : '✗ Not going'
          : 'RSVP'}
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-sm p-5 space-y-4">
            <h3 className="font-semibold text-gray-900">RSVP to this run</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Are you coming?</label>
              <div className="flex gap-2">
                {(['going', 'maybe', 'not_going'] as const).map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStatus(s)}
                    className={`flex-1 py-2 text-sm rounded-lg border font-medium transition-colors ${
                      status === s
                        ? 'border-orange-500 bg-orange-50 text-orange-700'
                        : 'border-gray-200 text-gray-600'
                    }`}
                  >
                    {s === 'going' ? 'Going' : s === 'maybe' ? 'Maybe' : 'No'}
                  </button>
                ))}
              </div>
            </div>

            {status === 'going' && run.pace_groups?.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select pace group</label>
                <select
                  value={selectedPaceGroup}
                  onChange={e => setSelectedPaceGroup(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">No preference</option>
                  {run.pace_groups.map((pg: PaceGroup) => (
                    <option key={pg.id} value={pg.id}>{pg.label}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2 border border-gray-200 rounded-lg text-sm text-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={saveRsvp}
                disabled={loading}
                className="flex-1 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 disabled:opacity-50"
              >
                {loading ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
