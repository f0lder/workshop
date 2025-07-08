'use client'

import { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  FaCalendarAlt, 
  FaCog, 
  FaSignOutAlt, 
  FaUserCog,
  FaHome
} from 'react-icons/fa'

interface Profile {
  id: string
  email: string
  full_name: string | null
  role: 'admin' | 'user'
  created_at: string
  updated_at: string
}

interface DashboardNavProps {
  user: User
  profile: Profile | null
}

export default function DashboardNav({ user, profile }: DashboardNavProps) {
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const isAdmin = profile?.role === 'admin'

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center">
              <FaCalendarAlt className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">WorkshopApp</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="/dashboard"
              className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium flex items-center"
            >
              <FaHome className="h-4 w-4 mr-1" />
              Dashboard
            </Link>

            <Link
              href="/dashboard/workshops"
              className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium flex items-center"
            >
              <FaCalendarAlt className="h-4 w-4 mr-1" />
              Workshops
            </Link>

            {isAdmin && (
              <Link
                href="/admin"
                className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium flex items-center"
              >
                <FaUserCog className="h-4 w-4 mr-1" />
                Admin
              </Link>
            )}

            <Link
              href="/dashboard/profile"
              className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium flex items-center"
            >
              <FaCog className="h-4 w-4 mr-1" />
              Profile
            </Link>

            <div className="relative">
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-700">
                  {profile?.full_name || user.email}
                </span>
                <button
                  onClick={handleSignOut}
                  className="text-gray-400 hover:text-gray-600 p-2 rounded-md"
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
