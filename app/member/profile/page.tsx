import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import ProfileForm from './ProfileForm'

export default async function ProfilePage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single()

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Link href="/member/dashboard" className="text-gray-500 hover:text-gray-700">←</Link>
          <h1 className="font-semibold text-gray-900">My Profile</h1>
        </div>
      </nav>
      <main className="max-w-2xl mx-auto px-4 py-6">
        <ProfileForm profile={profile} userId={user.id} />
      </main>
    </div>
  )
}
