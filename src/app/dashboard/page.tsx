import { currentUser } from '@clerk/nextjs/server'
import { FaCalendarAlt, FaUsers, FaCog, FaCircle } from 'react-icons/fa'
import Link from 'next/link'
import { syncUserWithDatabase } from '@/lib/auth'
import { getUserRegistrations } from '@/app/workshops/actions'

export default async function DashboardPage() {
  const clerkUser = await currentUser()

  if (!clerkUser) return null

  // Get user registrations
  const userRegistrations = await getUserRegistrations(clerkUser.id)


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
            Inregistrarile mele
          </h3>
          <div className="mt-5">
            {userRegistrations.length > 0 ? (
              <ul className="divide-y divide-border">
                {userRegistrations.map((workshop) => (
                  <li key={workshop.id} className="py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-foreground">{workshop.title}</p>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <span>{new Date(workshop.date).toLocaleDateString()}
                          </span>
                          <FaCircle className="inline-block size-[8px] fill-current" />
                          <span>{workshop.location}</span>
                          <FaCircle className="inline-block size-[8px] fill-current" />
                          <span>{workshop.currentParticipants} / {workshop.maxParticipants} locuri ocupate</span>
                        </div>
                      </div>
                      <Link
                        href={`/workshops/${workshop.id}`}
                        className="text-sm font-medium text-primary hover:underline"
                      >
                        Vezi detalii
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">Nu ai nicio înregistrare la workshopuri.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
