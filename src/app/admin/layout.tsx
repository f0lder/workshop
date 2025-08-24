import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import DashboardSidebar from '@/components/DashboardSidebar'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Use admin client to check user role (bypasses RLS)
  const adminSupabase = await createAdminClient()
  const { data: profile, error } = await adminSupabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error || !profile || profile.role !== 'admin') {
    console.log('Admin Layout - Access denied, redirecting')
    redirect('/unauthorized')
  }

  const isAdmin = profile?.role === 'admin'

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop: Flex layout with sidebar */}
      <div className="hidden lg:flex h-screen">
        <DashboardSidebar user={user} profile={profile} isAdmin={isAdmin} />
        
        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <main className="p-4 lg:p-8">
            {children}
          </main>
        </div>
      </div>

      {/* Mobile/Tablet: Single column layout */}
      <div className="lg:hidden">
        <DashboardSidebar user={user} profile={profile} isAdmin={isAdmin} />
        <main className="p-4">
          {children}
        </main>
      </div>
    </div>
  )
}
