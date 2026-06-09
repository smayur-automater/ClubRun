import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function MembersPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: membership } = await supabase
    .from('club_members')
    .select('club_id')
    .eq('user_id', user.id)
    .eq('role', 'organiser')
    .single()

  if (!membership) redirect('/dashboard')

  const { data: members } = await supabase
    .from('club_members')
    .select('*, profiles(*)')
    .eq('club_id', membership.club_id)
    .eq('status', 'active')
    .order('joined_at', { ascending: true })

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <Link href="/organiser/dashboard" className="text-gray-500 hover:text-gray-700">←</Link>
          <h1 className="font-semibold text-gray-900">Members ({members?.length ?? 0})</h1>
        </div>
      </nav>
      <main className="max-w-3xl mx-auto px-4 py-6">
        {!members?.length ? (
          <div className="text-center py-12 text-gray-400">No members yet</div>
        ) : (
          <div className="space-y-3">
            {members.map((m: any) => {
              const p = m.profiles
              const fullName = [p?.first_name, p?.last_name].filter(Boolean).join(' ') || 'Unknown'
              return (
                <Link key={m.id} href={`/organiser/members/${m.user_id}`} className="bg-white rounded-xl border border-gray-200 p-4 block hover:border-orange-200 transition-colors">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{fullName}</span>
                        {m.role === 'organiser' && (
                          <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">Organiser</span>
                        )}
                      </div>
                      {p?.phone && <div className="text-sm text-gray-500 mt-0.5">{p.phone}</div>}
                      <div className="text-xs text-gray-400 mt-1">
                        Joined {new Date(m.joined_at).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    </div>
                    <div className="text-right text-xs text-gray-500 space-y-0.5">
                      {p?.pb_5k && <div>5K: {p.pb_5k}</div>}
                      {p?.pb_10k && <div>10K: {p.pb_10k}</div>}
                      {p?.pb_half && <div>Half: {p.pb_half}</div>}
                      {p?.pb_full && <div>Full: {p.pb_full}</div>}
                    </div>
                  </div>
                  {p?.emergency_contact && (
                    <div className="mt-2 text-xs bg-amber-50 text-amber-700 px-3 py-1.5 rounded-lg">
                      Emergency: {p.emergency_contact}
                    </div>
                  )}
              </Link>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
