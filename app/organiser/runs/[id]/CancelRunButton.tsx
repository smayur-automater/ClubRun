'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function CancelRunButton({ runId }: { runId: string }) {
  const router = useRouter()

  async function cancel() {
    if (!confirm('Cancel this run? Members will not be automatically notified.')) return
    const supabase = createClient()
    await supabase.from('runs').update({ status: 'cancelled' }).eq('id', runId)
    router.refresh()
  }

  return (
    <button onClick={cancel}
      className="text-sm border border-red-200 px-3 py-1.5 rounded-lg text-red-600 hover:bg-red-50">
      Cancel run
    </button>
  )
}
