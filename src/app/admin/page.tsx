import { createAdminClient } from '@/lib/supabase/admin'
import { FaUsers, FaCalendarAlt, FaUserPlus, FaCog } from 'react-icons/fa'

export default async function AdminDashboard() {
  // We only use the admin client for this page
  const adminSupabase = await createAdminClient()

  // Get real statistics from the database using admin client
  const [
    { count: totalUsers },
    { count: totalWorkshops },
    { count: totalRegistrations }
  ] = await Promise.all([
    adminSupabase.from('profiles').select('*', { count: 'exact', head: true }),
    adminSupabase.from('workshops').select('*', { count: 'exact', head: true }),
    adminSupabase.from('workshop_registrations').select('*', { count: 'exact', head: true })
  ])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-card overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage workshops, users, and system settings.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-card overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FaUsers className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-muted-foreground truncate">
                    Total Users
                  </dt>
                  <dd className="text-lg font-medium text-foreground">
                    {totalUsers || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FaCalendarAlt className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-muted-foreground truncate">
                    Total Workshops
                  </dt>
                  <dd className="text-lg font-medium text-foreground">
                    {totalWorkshops || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FaUserPlus className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-muted-foreground truncate">
                    Total Registrations
                  </dt>
                  <dd className="text-lg font-medium text-foreground">
                    {totalRegistrations || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FaCog className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-muted-foreground truncate">
                    System Status
                  </dt>
                  <dd className="text-lg font-medium text-green-600">
                    Active
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-card shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-foreground mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <a
              href="/admin/workshops/new"
              className="relative rounded-lg border border-input bg-card px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
            >
              <div className="flex-shrink-0">
                <FaCalendarAlt className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="absolute inset-0" aria-hidden="true" />
                <p className="text-sm font-medium text-foreground">Create Workshop</p>
                <p className="text-sm text-muted-foreground">Add a new workshop to the system</p>
              </div>
            </a>

            <a
              href="/admin/users"
              className="relative rounded-lg border border-input bg-card px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
            >
              <div className="flex-shrink-0">
                <FaUsers className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="absolute inset-0" aria-hidden="true" />
                <p className="text-sm font-medium text-foreground">Manage Users</p>
                <p className="text-sm text-muted-foreground">View and manage user accounts</p>
              </div>
            </a>

            <a
              href="/admin/workshops"
              className="relative rounded-lg border border-input bg-card px-6 py-5 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
            >
              <div className="flex-shrink-0">
                <FaCog className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="absolute inset-0" aria-hidden="true" />
                <p className="text-sm font-medium text-foreground">Manage Workshops</p>
                <p className="text-sm text-muted-foreground">View and edit existing workshops</p>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-card shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-foreground mb-4">
            Recent Activity
          </h3>
          <div className="text-center py-8">
            <FaCalendarAlt className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-medium text-foreground">No recent activity</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              System activity will appear here once you start managing workshops and users.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
