'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useClerk } from '@clerk/nextjs'
import { 
  FaUser, 
  FaCog, 
  FaCalendarAlt, 
  FaChartBar, 
  FaUsers, 
  FaHome,
  FaSignOutAlt,
  FaCogs
} from 'react-icons/fa'
import { User } from '@/types/models'

interface DashboardSidebarProps {
  user: User
  isAdmin: boolean
}

export default function DashboardSidebar({ user, isAdmin }: DashboardSidebarProps) {
  const pathname = usePathname()
  const isAdminPage = pathname.startsWith('/admin')
  const { signOut } = useClerk()

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block lg:flex-shrink-0">
        <div className="h-full bg-background border-r border-border">
          <div className="flex flex-col h-full p-4 min-w-max">
            {/* User Info */}
            <div className="flex items-center p-4 border-b border-border mb-4 min-w-max">
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground whitespace-nowrap">
                  {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.email}
                </p>
                <p className="text-xs text-muted-foreground whitespace-nowrap">
                  {isAdmin ? 'Administrator' : 'Utilizator'}
                </p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 min-w-max">
              {isAdminPage ? (
                // Admin Navigation
                <>
                  <Link
                    href="/admin"
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                      pathname === '/admin'
                        ? 'bg-primary text-primary-foreground'
                        : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                    }`}
                  >
                    <FaChartBar className="mr-3 h-4 w-4 flex-shrink-0" />
                    Dashboard Admin
                  </Link>

                  <Link
                    href="/admin/workshops"
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                      pathname.startsWith('/admin/workshops')
                        ? 'bg-primary text-primary-foreground'
                        : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                    }`}
                  >
                    <FaCalendarAlt className="mr-3 h-4 w-4 flex-shrink-0" />
                    Administrare Workshop-uri
                  </Link>

                  <Link
                    href="/admin/users"
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                      pathname.startsWith('/admin/users')
                        ? 'bg-primary text-primary-foreground'
                        : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                    }`}
                  >
                    <FaUsers className="mr-3 h-4 w-4 flex-shrink-0" />
                    Administrare Utilizatori
                  </Link>

                  <Link
                    href="/admin/settings"
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                      pathname.startsWith('/admin/settings')
                        ? 'bg-primary text-primary-foreground'
                        : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                    }`}
                  >
                    <FaCogs className="mr-3 h-4 w-4 flex-shrink-0" />
                    Setări Aplicație
                  </Link>

                  <div className="border-t border-border my-4 pt-4">
                    <Link
                      href="/dashboard"
                      className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-foreground hover:bg-accent hover:text-accent-foreground transition-colors whitespace-nowrap"
                    >
                      <FaHome className="mr-3 h-4 w-4 flex-shrink-0" />
                      Dashboard Utilizator
                    </Link>
                  </div>
                </>
              ) : (
                // User Dashboard Navigation
                <>
                  <Link
                    href="/dashboard"
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                      pathname === '/dashboard'
                        ? 'bg-primary text-primary-foreground'
                        : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                    }`}
                  >
                    <FaHome className="mr-3 h-4 w-4 flex-shrink-0" />
                    Dashboard
                  </Link>

                  <Link
                    href="/dashboard/profile"
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                      pathname === '/dashboard/profile'
                        ? 'bg-primary text-primary-foreground'
                        : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                    }`}
                  >
                    <FaUser className="mr-3 h-4 w-4 flex-shrink-0" />
                    Profil
                  </Link>

                  <Link
                    href="/workshops"
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                      pathname === '/workshops'
                        ? 'bg-primary text-primary-foreground'
                        : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                    }`}
                  >
                    <FaCalendarAlt className="mr-3 h-4 w-4 flex-shrink-0" />
                    Workshop-uri
                  </Link>

                  {isAdmin && (
                    <div className="border-t border-border my-4 pt-4">
                      <Link
                        href="/admin"
                        className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-foreground hover:bg-accent hover:text-accent-foreground transition-colors whitespace-nowrap"
                      >
                        <FaCog className="mr-3 h-4 w-4 flex-shrink-0" />
                        Administrare
                      </Link>
                    </div>
                  )}
                </>
              )}
            </nav>

            {/* Sign Out */}
            <div className="border-t border-border mt-4 pt-4 min-w-max">
              <button
                onClick={handleSignOut}
                className="flex items-center w-full px-3 py-2 text-sm font-medium rounded-md text-destructive hover:bg-destructive/10 transition-colors whitespace-nowrap"
              >
                <FaSignOutAlt className="mr-3 h-4 w-4 flex-shrink-0" />
                Deconectare
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile/Tablet Navigation - Above Content */}
      <div className="lg:hidden bg-background border-b border-border mb-4">
        <div className="flex items-center justify-between p-4">
          {/* User Info */}
          <div className="flex items-center space-x-3">
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">
                {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.email}
              </p>
              <p className="text-xs text-muted-foreground">
                {isAdmin ? 'Administrator' : 'Utilizator'}
              </p>
            </div>
          </div>

          {/* Sign Out Button */}
          <button
            onClick={handleSignOut}
            className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-destructive hover:bg-destructive/10 transition-colors"
          >
            <FaSignOutAlt className="h-4 w-4" />
          </button>
        </div>

        {/* Mobile Navigation Tabs */}
        <div className="flex overflow-x-auto px-4 pb-4 space-x-2">
          {isAdminPage ? (
            // Admin Navigation Tabs
            <>
              <Link
                href="/admin"
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
                  pathname === '/admin'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                <FaChartBar className="mr-2 h-4 w-4" />
                Dashboard
              </Link>

              <Link
                href="/admin/workshops"
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
                  pathname.startsWith('/admin/workshops')
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                <FaCalendarAlt className="mr-2 h-4 w-4" />
                Workshop-uri
              </Link>

              <Link
                href="/admin/users"
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
                  pathname.startsWith('/admin/users')
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                <FaUsers className="mr-2 h-4 w-4" />
                Utilizatori
              </Link>

              <Link
                href="/dashboard"
                className="flex items-center px-3 py-2 text-sm font-medium rounded-md whitespace-nowrap text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <FaHome className="mr-2 h-4 w-4" />
                Dashboard Utilizator
              </Link>
            </>
          ) : (
            // User Dashboard Navigation Tabs
            <>
              <Link
                href="/dashboard"
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
                  pathname === '/dashboard'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                <FaHome className="mr-2 h-4 w-4" />
                Dashboard
              </Link>

              <Link
                href="/dashboard/profile"
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
                  pathname === '/dashboard/profile'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                <FaUser className="mr-2 h-4 w-4" />
                Profil
              </Link>

              <Link
                href="/workshops"
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
                  pathname === '/workshops'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                <FaCalendarAlt className="mr-2 h-4 w-4" />
                Workshop-uri
              </Link>

              {isAdmin && (
                <Link
                  href="/admin"
                  className="flex items-center px-3 py-2 text-sm font-medium rounded-md whitespace-nowrap text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  <FaCog className="mr-2 h-4 w-4" />
                  Administrare
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </>
  )
}
