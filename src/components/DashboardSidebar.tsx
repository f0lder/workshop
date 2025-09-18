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

      {/* Mobile/Tablet Navigation */}
      <div className="lg:hidden bg-background border-b border-border">
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          {/* User Info */}
          <div className="flex items-center space-x-3">
            <div>
              <p className="text-sm font-medium text-foreground truncate max-w-[200px]">
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
            <span className="ml-2 hidden sm:inline">Ieșire</span>
          </button>
        </div>

        {/* 2-Column Navigation Grid */}
        <div className="p-3">
          <div className="grid grid-cols-2 gap-2">
            {isAdminPage ? (
              // Admin Navigation - 2 columns
              <>
                <Link
                  href="/admin"
                  className={`flex flex-col items-center p-3 text-xs font-medium rounded-md transition-colors text-center ${
                    pathname === '/admin'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                  }`}
                >
                  <FaChartBar className="h-5 w-5 mb-1" />
                  Dashboard
                </Link>

                <Link
                  href="/admin/workshops"
                  className={`flex flex-col items-center p-3 text-xs font-medium rounded-md transition-colors text-center ${
                    pathname.startsWith('/admin/workshops')
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                  }`}
                >
                  <FaCalendarAlt className="h-5 w-5 mb-1" />
                  Workshop-uri
                </Link>

                <Link
                  href="/admin/users"
                  className={`flex flex-col items-center p-3 text-xs font-medium rounded-md transition-colors text-center ${
                    pathname.startsWith('/admin/users')
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                  }`}
                >
                  <FaUsers className="h-5 w-5 mb-1" />
                  Utilizatori
                </Link>

                <Link
                  href="/admin/settings"
                  className={`flex flex-col items-center p-3 text-xs font-medium rounded-md transition-colors text-center ${
                    pathname.startsWith('/admin/settings')
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                  }`}
                >
                  <FaCogs className="h-5 w-5 mb-1" />
                  Setări
                </Link>

                <Link
                  href="/dashboard"
                  className="flex flex-col items-center p-3 text-xs font-medium rounded-md text-foreground hover:bg-accent hover:text-accent-foreground transition-colors text-center col-span-2"
                >
                  <FaHome className="h-5 w-5 mb-1" />
                  Dashboard Utilizator
                </Link>
              </>
            ) : (
              // User Dashboard Navigation - 2 columns
              <>
                <Link
                  href="/dashboard"
                  className={`flex flex-col items-center p-3 text-xs font-medium rounded-md transition-colors text-center ${
                    pathname === '/dashboard'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                  }`}
                >
                  <FaHome className="h-5 w-5 mb-1" />
                  Dashboard
                </Link>

                <Link
                  href="/dashboard/profile"
                  className={`flex flex-col items-center p-3 text-xs font-medium rounded-md transition-colors text-center ${
                    pathname === '/dashboard/profile'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                  }`}
                >
                  <FaUser className="h-5 w-5 mb-1" />
                  Profil
                </Link>

                <Link
                  href="/workshops"
                  className={`flex flex-col items-center p-3 text-xs font-medium rounded-md transition-colors text-center ${
                    pathname === '/workshops'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                  }`}
                >
                  <FaCalendarAlt className="h-5 w-5 mb-1" />
                  Workshop-uri
                </Link>

                {isAdmin && (
                  <Link
                    href="/admin"
                    className="flex flex-col items-center p-3 text-xs font-medium rounded-md text-foreground hover:bg-accent hover:text-accent-foreground transition-colors text-center"
                  >
                    <FaCog className="h-5 w-5 mb-1" />
                    Administrare
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
