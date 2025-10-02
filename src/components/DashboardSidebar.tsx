import Link from 'next/link'
import {
  FaUser,
  FaCalendarAlt,
  FaChartBar,
  FaUsers,
  FaHome,
  FaCogs,
  FaCreditCard
} from 'react-icons/fa'
import { User } from '@/types/models'
import SignOutButton from '@/components/signOutButton'

interface DashboardSidebarProps {
  user: User
  isAdmin: boolean
}

export default function DashboardSidebar({ user, isAdmin }: DashboardSidebarProps) {
  const baseLinks = [
    { href: '/dashboard', icon: FaHome, label: 'Dashboard' },
    { href: '/dashboard/profile', icon: FaUser, label: 'Profil' },
    { href: '/workshops', icon: FaCalendarAlt, label: 'Workshop-uri' },
    { href: '/payment', icon: FaCreditCard, label: 'Cumpără Bilet' },
  ]

  const adminLinks = [
    { href: '/admin', icon: FaChartBar, label: 'Dashboard Admin' },
    { href: '/admin/workshops', icon: FaCalendarAlt, label: 'Administrare Workshop-uri' },
    { href: '/admin/users', icon: FaUsers, label: 'Administrare Utilizatori' },
    { href: '/admin/payments', icon: FaCreditCard, label: 'Administrare Plăți' },
    { href: '/admin/settings', icon: FaCogs, label: 'Setări Aplicație' },
  ]

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
              {baseLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-foreground hover:bg-accent hover:text-accent-foreground transition-colors whitespace-nowrap"
                >
                  <link.icon className="mr-3 h-4 w-4 flex-shrink-0" />
                  {link.label}
                </Link>
              ))}

              {isAdmin && (
                <>
                  <div className="border-t border-border my-4" />
                  {adminLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-foreground hover:bg-accent hover:text-accent-foreground transition-colors whitespace-nowrap"
                    >
                      <link.icon className="mr-3 h-4 w-4 flex-shrink-0" />
                      {link.label}
                    </Link>
                  ))}
                </>
              )}
            </nav>

            {/* Sign Out */}
            <div className="border-t border-border mt-4 pt-4 min-w-max">
              <SignOutButton />
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Navigation */}
      <div className="lg:hidden bg-background border-b border-border">
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
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
          <SignOutButton />
        </div>

        {/* Navigation Grid */}
        <div className="p-3">
          <div className="grid grid-cols-2 gap-2">
            {baseLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex flex-col items-center p-3 text-xs font-medium rounded-md text-foreground hover:bg-accent hover:text-accent-foreground transition-colors text-center"
              >
                <link.icon className="h-5 w-5 mb-1" />
                {link.label}
              </Link>
            ))}

            {isAdmin && adminLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex flex-col items-center p-3 text-xs font-medium rounded-md text-foreground hover:bg-accent hover:text-accent-foreground transition-colors text-center"
              >
                <link.icon className="h-5 w-5 mb-1" />
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}