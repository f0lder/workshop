import { currentUser } from '@clerk/nextjs/server'
import { FaCalendarAlt, FaUsers, FaCog } from 'react-icons/fa'
import Link from 'next/link'
import { syncUserWithDatabase } from '@/lib/auth'

export default async function DashboardPage() {
  const clerkUser = await currentUser()
  
  if (!clerkUser) return null

  // Sync user with database
  const user = await syncUserWithDatabase(clerkUser)

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-card overflow-hidden shadow-lg border border-border rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h1 className="text-2xl font-bold text-foreground">
            Bine ai venit, {clerkUser.firstName && clerkUser.lastName ? `${clerkUser.firstName} ${clerkUser.lastName}` : clerkUser.emailAddresses?.[0]?.emailAddress}!
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Iată ce se întâmplă cu workshopurile tale astăzi.
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-card overflow-hidden shadow border border-border rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FaCalendarAlt className="h-8 w-8 text-primary" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-muted-foreground truncate">
                    Workshop înregistrate
                  </dt>
                  <dd className="text-lg font-medium text-foreground">
                    0
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card overflow-hidden shadow border border-border rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FaUsers className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-muted-foreground truncate">
                    Urmează
                  </dt>
                  <dd className="text-lg font-medium text-foreground">
                    0
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card overflow-hidden shadow border border-border rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FaCog className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-muted-foreground truncate">
                    Rol
                  </dt>
                  <dd className="text-lg font-medium text-foreground">
                    {user.role === 'admin' ? 'Administrator' : 'Utilizator'}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-card shadow border border-border rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-foreground">
            Acțiuni rapide
          </h3>
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Link
              href="/workshops"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90"
            >
              <FaCalendarAlt className="mr-2 h-4 w-4" />
              Vezi workshop-urile
            </Link>
            <Link
              href="/dashboard/profile"
              className="inline-flex items-center px-4 py-2 border border-input text-sm font-medium rounded-md text-foreground bg-background hover:bg-accent"
            >
              <FaCog className="mr-2 h-4 w-4" />
              Editează profilul
            </Link>
            {user.role === 'admin' && (
              <Link
                href="/admin"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-orange-700 bg-orange-100 hover:bg-orange-200"
              >
                <FaUsers className="mr-2 h-4 w-4" />
                Panou Admin
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Recent Workshops */}
      <div className="bg-card shadow border border-border rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-foreground">
            Workshop-urile mele
          </h3>
          <div className="mt-5">
            <div className="text-center py-12">
              <FaCalendarAlt className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-medium text-foreground">Nu ești înregistrat la niciun workshop</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Începe prin a explora workshop-urile disponibile.
              </p>
              <div className="mt-6">
                <Link
                  href="/workshops"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90"
                >
                  <FaCalendarAlt className="mr-2 h-4 w-4" />
                  Explorează workshop-urile
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
