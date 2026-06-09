'use client'

import { useState } from 'react'

export default function InviteCopy({ url }: { url: string }) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex gap-2">
      <input readOnly value={url} className="flex-1 text-xs border border-gray-200 rounded px-2 py-1 bg-gray-50 truncate min-w-0" />
      <button onClick={copy} className="text-xs bg-orange-500 text-white px-2 py-1 rounded hover:bg-orange-600 whitespace-nowrap">
        {copied ? 'Copied!' : 'Copy'}
      </button>
    </div>
  )
}
