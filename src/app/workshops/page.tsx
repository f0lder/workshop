import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaClock, FaSignOutAlt, FaUser } from 'react-icons/fa'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Profile, Workshop } from '@/types/models'
import { registerForWorkshop } from './actions'

export default async function WorkshopsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Get user profile if logged in
  let profile: Profile | null = null
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    profile = data
  }

  // Fetch workshops using the regular client with appropriate RLS policies
  const { data: workshops, error } = await supabase
    .from('workshops')
    .select(`
      *,
      instructor:profiles(full_name, email),
      registrations:workshop_registrations(id, user_id)
    `)
    .order('date', { ascending: true })

  if (error) {
    console.error('Error fetching workshops:', error)
  }

  // Calculate current participants for each workshop
  const workshopsWithCounts: Workshop[] = (workshops as Workshop[] || []).map(workshop => ({
    ...workshop,
    current_participants: workshop.registrations?.length || 0,
    user_registered: user ? !!workshop.registrations?.some((reg) => reg.user_id === user.id) : false
  }))

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <FaCalendarAlt className="h-8 w-8 text-blue-600" />
              <Link href="/" className="ml-2 text-2xl font-bold text-gray-900">
                WorkshopApp
              </Link>
            </div>
            
            {user ? (
              // Logged in user navigation
              <div className="flex items-center space-x-4">
                <Link
                  href="/dashboard"
                  className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Dashboard
                </Link>
                
                {profile?.role === 'admin' && (
                  <Link
                    href="/admin"
                    className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Admin
                  </Link>
                )}
                
                <div className="flex items-center space-x-2">
                  <FaUser className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-700">
                    {profile?.full_name || user.email}
                  </span>
                </div>
                
                <form action="/auth/signout" method="post">
                  <button
                    type="submit"
                    className="text-gray-400 hover:text-gray-600 p-2 rounded-md"
                    title="Sign out"
                  >
                    <FaSignOutAlt className="h-4 w-4" />
                  </button>
                </form>
              </div>
            ) : (
              // Guest user navigation
              <div className="flex space-x-4">
                <Link
                  href="/auth/login"
                  className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Available Workshops</h1>
          <p className="mt-2 text-gray-600">
            Discover and register for workshops that interest you.
          </p>
        </div>

        {/* Workshops Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {workshopsWithCounts.map((workshop) => (
            <div key={workshop.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {workshop.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {workshop.description}
                </p>

                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-500">
                    <FaCalendarAlt className="h-4 w-4 mr-2" />
                    {new Date(workshop.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>

                  <div className="flex items-center text-sm text-gray-500">
                    <FaClock className="h-4 w-4 mr-2" />
                    {workshop.time || 'Time TBD'}
                  </div>

                  <div className="flex items-center text-sm text-gray-500">
                    <FaMapMarkerAlt className="h-4 w-4 mr-2" />
                    {workshop.location}
                  </div>

                  <div className="flex items-center text-sm text-gray-500">
                    <FaUsers className="h-4 w-4 mr-2" />
                    {workshop.current_participants} / {workshop.max_participants} participants
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-3">
                    Instructor: <span className="font-medium">{workshop.instructor?.full_name || 'TBD'}</span>
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{
                            width: `${(workshop.current_participants / workshop.max_participants) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                    <span className="ml-3 text-xs text-gray-500">
                      {Math.round((workshop.current_participants / workshop.max_participants) * 100)}% full
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  {user ? (
                    <form action={registerForWorkshop}>
                      <input type="hidden" name="workshopId" value={workshop.id} />
                      <input 
                        type="hidden" 
                        name="action" 
                        value={workshop.user_registered ? 'cancel' : 'register'} 
                      />
                      <button
                        type="submit"
                        className={`w-full font-medium py-2 px-4 rounded-md transition duration-200 ${
                          workshop.current_participants >= workshop.max_participants && !workshop.user_registered
                            ? 'bg-gray-400 cursor-not-allowed text-white'
                            : workshop.user_registered
                            ? 'bg-green-600 hover:bg-green-700 text-white'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                        disabled={workshop.current_participants >= workshop.max_participants && !workshop.user_registered}
                      >
                        {workshop.current_participants >= workshop.max_participants && !workshop.user_registered
                          ? 'Workshop Full'
                          : workshop.user_registered
                          ? 'Cancel Registration'
                          : 'Register Now'}
                      </button>
                    </form>
                  ) : (
                    <Link
                      href="/auth/signup"
                      className="w-full block text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200"
                    >
                      Sign Up to Register
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {workshopsWithCounts.length === 0 && (
          <div className="text-center py-12">
            <FaCalendarAlt className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No workshops available</h3>
            <p className="mt-1 text-sm text-gray-500">
              Check back later for new workshop announcements.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
