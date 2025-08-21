'use client'

import { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  FaCalendarAlt, 
  FaUsers, 
  FaSignOutAlt, 
  FaHome,
  FaChartBar
} from 'react-icons/fa'

interface AdminNavProps {
  user: User
}

export default function AdminNav({ user }: AdminNavProps) {
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <nav className="bg-card shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/admin" className="flex items-center">
              <FaCalendarAlt className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-foreground">Admin Panel</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="/admin"
              className="text-muted-foreground hover:text-foreground px-3 py-2 rounded-md text-sm font-medium flex items-center"
            >
              <FaChartBar className="h-4 w-4 mr-1" />
              Dashboard
            </Link>

            <Link
              href="/admin/workshops"
              className="text-muted-foreground hover:text-foreground px-3 py-2 rounded-md text-sm font-medium flex items-center"
            >
              <FaCalendarAlt className="h-4 w-4 mr-1" />
              Workshops
            </Link>

            <Link
              href="/admin/users"
              className="text-muted-foreground hover:text-foreground px-3 py-2 rounded-md text-sm font-medium flex items-center"
            >
              <FaUsers className="h-4 w-4 mr-1" />
              Users
            </Link>

            <Link
              href="/dashboard"
              className="text-muted-foreground hover:text-foreground px-3 py-2 rounded-md text-sm font-medium flex items-center"
            >
              <FaHome className="h-4 w-4 mr-1" />
              User Dashboard
            </Link>

            <div className="relative">
              <div className="flex items-center space-x-3">
                <span className="text-sm text-foreground">
                  {user.email}
                </span>
                <button
                  onClick={handleSignOut}
                  className="text-muted-foreground hover:text-muted-foreground p-2 rounded-md"
                  title="Sign out"
                >
                  <FaSignOutAlt className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
