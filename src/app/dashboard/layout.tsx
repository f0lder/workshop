import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardSidebar from '@/components/DashboardSidebar'

export default async function DashboardLayout({
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

  // Get user profile to determine role
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

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
