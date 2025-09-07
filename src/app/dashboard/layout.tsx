import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import DashboardSidebar from '@/components/DashboardSidebar'
import { syncUserWithDatabase } from '@/lib/auth'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const clerkUser = await currentUser()

  if (!clerkUser) {
    redirect('/auth/login')
  }

  // Sync Clerk user with our database and get user data
  const user = await syncUserWithDatabase(clerkUser)
  const isAdmin = user.role === 'admin'

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop: Flex layout with sidebar */}
      <div className="hidden lg:flex h-screen">
        <DashboardSidebar user={user} isAdmin={isAdmin} />
        
        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <main className="p-4 lg:p-8">
            {children}
          </main>
        </div>
      </div>

      {/* Mobile/Tablet: Single column layout */}
      <div className="lg:hidden">
        <DashboardSidebar user={user} isAdmin={isAdmin} />
        <main className="p-4">
          {children}
        </main>
      </div>
    </div>
  )
}
