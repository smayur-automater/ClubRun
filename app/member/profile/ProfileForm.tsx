'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Profile {
  first_name?: string | null
  last_name?: string | null
  phone?: string | null
  emergency_contact?: string | null
  pb_5k?: string | null
  pb_10k?: string | null
  pb_half?: string | null
  pb_full?: string | null
}

export default function ProfileForm({ profile, userId }: { profile: Profile | null; userId: string }) {
  const [firstName, setFirstName] = useState(profile?.first_name ?? '')
  const [lastName, setLastName] = useState(profile?.last_name ?? '')
  const [phone, setPhone] = useState(profile?.phone ?? '')
  const [emergencyContact, setEmergencyContact] = useState(profile?.emergency_contact ?? '')
  const [pb5k, setPb5k] = useState(profile?.pb_5k ?? '')
  const [pb10k, setPb10k] = useState(profile?.pb_10k ?? '')
  const [pbHalf, setPbHalf] = useState(profile?.pb_half ?? '')
  const [pbFull, setPbFull] = useState(profile?.pb_full ?? '')
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSaved(false)

    const supabase = createClient()
    const { error } = await supabase.from('profiles').upsert({
      user_id: userId,
      first_name: firstName || null,
      last_name: lastName || null,
      phone: phone || null,
      emergency_contact: emergencyContact || null,
      pb_5k: pb5k || null,
      pb_10k: pb10k || null,
      pb_half: pbHalf || null,
      pb_full: pbFull || null,
    })

    if (error) { setError(error.message) } else { setSaved(true) }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}
      {saved && <div className="bg-green-50 text-green-700 px-4 py-3 rounded-lg text-sm">Profile saved!</div>}

      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
        <h2 className="font-medium text-gray-900">Personal details</h2>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First name</label>
            <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last name</label>
            <input type="text" value={lastName} onChange={e => setLastName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="+61 4xx xxx xxx" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Emergency contact</label>
          <input type="text" value={emergencyContact} onChange={e => setEmergencyContact(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Name — phone number" />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
        <h2 className="font-medium text-gray-900">Personal bests</h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: '5K', value: pb5k, set: setPb5k, placeholder: '25:30' },
            { label: '10K', value: pb10k, set: setPb10k, placeholder: '52:00' },
            { label: 'Half marathon', value: pbHalf, set: setPbHalf, placeholder: '1:55:00' },
            { label: 'Marathon', value: pbFull, set: setPbFull, placeholder: '4:10:00' },
          ].map(f => (
            <div key={f.label}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
              <input type="text" value={f.value} onChange={e => f.set(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder={f.placeholder} />
            </div>
          ))}
        </div>
      </div>

      <button type="submit" disabled={loading}
        className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 disabled:opacity-50">
        {loading ? 'Saving…' : 'Save Profile'}
      </button>
    </form>
  )
}
