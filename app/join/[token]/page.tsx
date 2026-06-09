import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import JoinForm from './JoinForm'

export default async function JoinPage({ params }: { params: { token: string } }) {
  const supabase = createClient()

  const { data: club } = await supabase
    .from('clubs')
    .select('id, name, description, location')
    .eq('invite_token', params.token)
    .single()

  if (!club) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <span className="text-4xl">😕</span>
          <h1 className="text-xl font-bold text-gray-900 mt-4 mb-2">Invalid invite link</h1>
          <p className="text-gray-500">This link is not valid. Ask your organiser for a new one.</p>
        </div>
      </div>
    )
  }

  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    const { data: existing } = await supabase
      .from('club_members')
      .select('id')
      .eq('club_id', club.id)
      .eq('user_id', user.id)
      .single()

    if (!existing) {
      await supabase.from('club_members').insert({
        club_id: club.id,
        user_id: user.id,
        role: 'member',
      })
    }
    redirect('/member/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <span className="text-5xl">🏃</span>
          <h1 className="text-2xl font-bold text-gray-900 mt-3">Join {club.name}</h1>
          {club.location && <p className="text-gray-500 mt-1">{club.location}</p>}
          {club.description && <p className="text-gray-600 mt-2 text-sm">{club.description}</p>}
        </div>
        <JoinForm clubId={club.id} clubName={club.name} />
      </div>
    </div>
  )
}
