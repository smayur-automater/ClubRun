'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function SafeButton({ runId, userId }: { runId: string, userId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function markSafe() {
    setLoading(true)
    const supabase = createClient()
    await supabase.from('safety_checkins').upsert({ run_id: runId, user_id: userId })
    router.refresh()
  }

  return (
    <button onClick={markSafe} disabled={loading}
      className="bg-green-500 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50">
      {loading ? '…' : "✓ I'm safe"}
    </button>
  )
}
