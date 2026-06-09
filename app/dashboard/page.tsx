import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: membership } = await supabase
    .from('club_members')
    .select('role')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .single()

  if (!membership) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <span className="text-4xl">🏃</span>
          <h1 className="text-xl font-bold text-gray-900 mt-4 mb-2">No club found</h1>
          <p className="text-gray-500">You are not a member of any club yet.</p>
        </div>
      </div>
    )
  }

  if (membership.role === 'organiser') {
    redirect('/organiser/dashboard')
  } else {
    redirect('/member/dashboard')
  }
}
