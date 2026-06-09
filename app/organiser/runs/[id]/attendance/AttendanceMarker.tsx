'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Runner {
  userId: string
  name: string
}

export default function AttendanceMarker({
  runId,
  rsvps,
  initialAttended,
}: {
  runId: string
  rsvps: Runner[]
  initialAttended: string[]
}) {
  const [attended, setAttended] = useState<Set<string>>(new Set(initialAttended))
  const [pending, setPending] = useState<Set<string>>(new Set())

  async function toggle(userId: string) {
    if (pending.has(userId)) return
    setPending(p => new Set(p).add(userId))
    const supabase = createClient()
    const isAttended = attended.has(userId)

    if (isAttended) {
      await supabase.from('attendance').delete().eq('run_id', runId).eq('user_id', userId)
      setAttended(a => { const n = new Set(a); n.delete(userId); return n })
    } else {
      await supabase.from('attendance').upsert({ run_id: runId, user_id: userId })
      setAttended(a => new Set(a).add(userId))
    }

    setPending(p => { const n = new Set(p); n.delete(userId); return n })
  }

  const count = attended.size

  return (
    <div>
      <div className="flex items-center justify-between mb-4 bg-white rounded-xl border border-gray-200 px-4 py-3">
        <span className="text-sm text-gray-600">Confirmed attendance</span>
        <span className="text-2xl font-bold text-orange-500">{count} <span className="text-sm font-normal text-gray-400">/ {rsvps.length}</span></span>
      </div>
      <div className="space-y-2">
        {rsvps.map(r => {
          const isPresent = attended.has(r.userId)
          const isLoading = pending.has(r.userId)
          return (
            <button
              key={r.userId}
              onClick={() => toggle(r.userId)}
              disabled={isLoading}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all ${
                isPresent
                  ? 'border-green-400 bg-green-50'
                  : 'border-gray-200 bg-white'
              } ${isLoading ? 'opacity-50' : 'hover:border-orange-300'}`}
            >
              <span className={`font-medium ${isPresent ? 'text-green-800' : 'text-gray-700'}`}>
                {r.name}
              </span>
              <span className={`text-lg ${isPresent ? 'text-green-500' : 'text-gray-300'}`}>
                {isLoading ? '…' : isPresent ? '✓' : '○'}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
