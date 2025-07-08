import { createClient } from '@/lib/supabase/server'
import { FaCalendarAlt, FaUsers, FaMapMarkerAlt, FaClock } from 'react-icons/fa'
import { Profile, WorkshopRegistration } from '@/types/models'

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  // Get user profile
  const { data: profile }: { data: Profile | null } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Get user's registered workshops
  const { data: userRegistrations }: { data: WorkshopRegistration[] | null } = await supabase
    .from('workshop_registrations')
    .select('*, workshop:workshops(*)')
    .eq('user_id', user.id)

  const userWorkshops = userRegistrations || []
  
  // Filter for upcoming workshops (future dates)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const upcomingWorkshops = userWorkshops.filter((registration: WorkshopRegistration) => {
    if (!registration.workshop?.date) return false
    const workshopDate = new Date(registration.workshop.date)
    return workshopDate >= today
  })

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {profile?.full_name || user.email}!
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Here&apos;s what&apos;s happening with your workshops today.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FaCalendarAlt className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Registered Workshops
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {userWorkshops.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FaClock className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Upcoming This Week
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {upcomingWorkshops.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FaUsers className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Account Type
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 capitalize">
                    {profile?.role || 'User'}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FaMapMarkerAlt className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Member Since
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {profile?.created_at ? new Date(profile.created_at).getFullYear() : new Date().getFullYear()}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <a
              href="/workshops"
              className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
            >
              <div className="flex-shrink-0">
                <FaCalendarAlt className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="absolute inset-0" aria-hidden="true" />
                <p className="text-sm font-medium text-gray-900">Browse Workshops</p>
                <p className="text-sm text-gray-500">Find and register for new workshops</p>
              </div>
            </a>

            <a
              href="/dashboard/profile"
              className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
            >
              <div className="flex-shrink-0">
                <FaUsers className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="absolute inset-0" aria-hidden="true" />
                <p className="text-sm font-medium text-gray-900">Update Profile</p>
                <p className="text-sm text-gray-500">Manage your account settings</p>
              </div>
            </a>

            {profile?.role === 'admin' && (
              <a
                href="/admin"
                className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
              >
                <div className="flex-shrink-0">
                  <FaMapMarkerAlt className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="absolute inset-0" aria-hidden="true" />
                  <p className="text-sm font-medium text-gray-900">Admin Panel</p>
                  <p className="text-sm text-gray-500">Manage workshops and users</p>
                </div>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Your Registered Workshops
          </h3>
          
          {userWorkshops.length > 0 ? (
            <div className="space-y-4">
              {userWorkshops.map((registration: WorkshopRegistration) => (
                <div key={registration.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">
                        {registration.workshop?.title}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {registration.workshop?.description}
                      </p>
                      
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center text-sm text-gray-500">
                          <FaCalendarAlt className="h-4 w-4 mr-2" />
                          {registration.workshop?.date && 
                            new Date(registration.workshop.date).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })
                          }
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-500">
                          <FaClock className="h-4 w-4 mr-2" />
                          {registration.workshop?.time || 'Time TBD'}
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-500">
                          <FaMapMarkerAlt className="h-4 w-4 mr-2" />
                          {registration.workshop?.location}
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-500">
                          <FaUsers className="h-4 w-4 mr-2" />
                          {registration.workshop?.current_participants} / {registration.workshop?.max_participants} participants
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-500">
                      Registered on: {new Date(registration.registered_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FaCalendarAlt className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No registered workshops</h3>
              <p className="mt-1 text-sm text-gray-500">
                Register for workshops to see your activity here.
              </p>
              <div className="mt-6">
                <a
                  href="/workshops"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Browse Workshops
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
