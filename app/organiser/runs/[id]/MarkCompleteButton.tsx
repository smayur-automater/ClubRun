'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function MarkCompleteButton({ runId }: { runId: string }) {
  const router = useRouter()

  async function markComplete() {
    const supabase = createClient()
    await supabase.from('runs').update({ status: 'completed' }).eq('id', runId)
    router.refresh()
  }

  return (
    <button onClick={markComplete}
      className="text-sm border border-green-200 px-3 py-1.5 rounded-lg text-green-700 hover:bg-green-50">
      ✓ Mark complete
    </button>
  )
}
