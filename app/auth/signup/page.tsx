'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function SignupPage() {
  const router = useRouter()
  const [step, setStep] = useState<'account' | 'club'>('account')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [clubName, setClubName] = useState('')
  const [clubLocation, setClubLocation] = useState('')
  const [clubDescription, setClubDescription] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    if (step === 'account') {
      setStep('club')
      return
    }

    setLoading(true)
    setError('')
    const supabase = createClient()

    const { data: authData, error: signupError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { first_name: firstName, last_name: lastName, role: 'organiser' } }
    })
    if (signupError) {
      setError(signupError.message)
      setLoading(false)
      return
    }

    const userId = authData.user?.id
    if (!userId) { setError('Signup failed'); setLoading(false); return }

    await supabase.from('profiles').upsert({ user_id: userId, first_name: firstName, last_name: lastName })

    const { data: club, error: clubError } = await supabase.from('clubs').insert({
      name: clubName,
      description: clubDescription || null,
      location: clubLocation || null,
      created_by: userId,
    }).select().single()

    if (clubError) { setError(clubError.message); setLoading(false); return }

    await supabase.from('club_members').insert({
      club_id: club.id,
      user_id: userId,
      role: 'organiser',
    })

    await supabase.from('subscriptions').insert({ club_id: club.id, plan: 'free' })

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="text-center mb-8">
          <span className="text-4xl">🏃</span>
          <h1 className="text-2xl font-bold text-gray-900 mt-2">
            {step === 'account' ? 'Create your account' : 'Set up your club'}
          </h1>
          <p className="text-gray-500 mt-1">
            {step === 'account' ? 'Step 1 of 2' : 'Step 2 of 2'}
          </p>
        </div>
        <form onSubmit={handleSignup} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
          )}
          {step === 'account' ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First name</label>
                  <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last name</label>
                  <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="you@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={8}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Min. 8 characters" />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Club name *</label>
                <input type="text" value={clubName} onChange={e => setClubName(e.target.value)} required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Sydney Striders" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input type="text" value={clubLocation} onChange={e => setClubLocation(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Sydney, NSW" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={clubDescription} onChange={e => setClubDescription(e.target.value)} rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="A friendly running club for all abilities…" />
              </div>
            </>
          )}
          <button type="submit" disabled={loading}
            className="w-full bg-orange-500 text-white py-2 rounded-lg font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50">
            {loading ? 'Creating…' : step === 'account' ? 'Continue →' : 'Create Club'}
          </button>
          {step === 'club' && (
            <button type="button" onClick={() => setStep('account')}
              className="w-full text-gray-500 text-sm hover:text-gray-700">
              ← Back
            </button>
          )}
        </form>
        {step === 'account' && (
          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-orange-600 font-medium hover:underline">Sign in</Link>
          </p>
        )}
      </div>
    </div>
  )
}
