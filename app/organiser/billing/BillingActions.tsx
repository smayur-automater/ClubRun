'use client'

import { useState } from 'react'

export default function BillingActions({ isClub }: { isClub: boolean; hasCustomer: boolean }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleUpgrade() {
    setLoading(true)
    setError('')
    const res = await fetch('/api/stripe/checkout', { method: 'POST' })
    const data = await res.json()
    if (data.url) {
      window.location.href = data.url
    } else {
      setError('Could not start checkout. Please try again.')
      setLoading(false)
    }
  }

  async function handlePortal() {
    setLoading(true)
    setError('')
    const res = await fetch('/api/stripe/portal', { method: 'POST' })
    const data = await res.json()
    if (data.url) {
      window.location.href = data.url
    } else {
      setError('Could not open billing portal. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="space-y-3">
      {error && <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}
      {isClub ? (
        <button
          onClick={handlePortal}
          disabled={loading}
          className="w-full bg-white border border-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Opening portal…' : 'Manage subscription →'}
        </button>
      ) : (
        <>
          <button
            onClick={handleUpgrade}
            disabled={loading}
            className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Redirecting to Stripe…' : 'Start 30-day free trial →'}
          </button>
          <p className="text-center text-xs text-gray-400">No card required for trial · Cancel anytime</p>
        </>
      )}
    </div>
  )
}
