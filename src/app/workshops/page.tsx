import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaClock } from 'react-icons/fa'
import { currentUser } from '@clerk/nextjs/server'
import Link from 'next/link'
import connectDB from '@/lib/mongodb'
import { Workshop, Registration } from '@/models'
import { WorkshopRegistrationButton } from '@/components/WorkshopRegistrationButton'

export default async function WorkshopsPage() {
  const clerkUser = await currentUser()

  // Connect to database and get workshops
  await connectDB()
  const workshops = await Workshop.find({ status: 'active' }).sort({ date: 1 })

  // Get user registrations if user is logged in
  let userRegistrations = []
  if (clerkUser) {
    userRegistrations = await Registration.find({ 
      userId: clerkUser.id,
      status: 'confirmed'
    })
  }

  // Map workshops with registration status
  const workshopsWithRegistration = workshops.map(workshop => {
    const isRegistered = userRegistrations.some(
      reg => reg.workshopId === workshop._id.toString()
    )
    
    return {
      id: workshop._id.toString(),
      title: workshop.title,
      description: workshop.description,
      date: workshop.date,
      time: workshop.time,
      location: workshop.location,
      maxParticipants: workshop.maxParticipants,
      current_participants: workshop.currentParticipants,
      max_participants: workshop.maxParticipants,
      instructor: workshop.instructor,
      status: workshop.status,
      registrationStatus: workshop.registrationStatus || 'open',
      user_registered: isRegistered
    }
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Page Header */}
          <div>
            <h1 className="text-2xl font-bold text-foreground">Workshop-uri disponibile</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Descoperă și înregistrează-te la workshop-urile care te interesează.
            </p>
          </div>
          {/* Workshops Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {workshopsWithRegistration.map((workshop) => (
              <div key={workshop.id} className="bg-card rounded-lg shadow border border-border overflow-hidden">
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {workshop.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    {workshop.description}
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <FaCalendarAlt className="h-4 w-4 mr-2" />
                      {new Date(workshop.date).toLocaleDateString('ro-RO', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </div>

                    <div className="flex items-center text-sm text-muted-foreground">
                      <FaClock className="h-4 w-4 mr-2" />
                      {workshop.time || 'Ora va fi anunțată'}
                    </div>

                    <div className="flex items-center text-sm text-muted-foreground">
                      <FaMapMarkerAlt className="h-4 w-4 mr-2" />
                      {workshop.location}
                    </div>

                    <div className="flex items-center text-sm text-muted-foreground">
                      <FaUsers className="h-4 w-4 mr-2" />
                      {workshop.current_participants} / {workshop.max_participants} participanți
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground mb-3">
                      Instructor: <span className="font-medium text-foreground">{workshop.instructor}</span>
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${(workshop.current_participants / workshop.max_participants) * 100}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                      <span className="ml-3 text-xs text-muted-foreground">
                        {Math.round((workshop.current_participants / workshop.max_participants) * 100)}% complet
                      </span>
                    </div>
                  </div>

                  <div className="mt-6">
                    {clerkUser ? (
                      <WorkshopRegistrationButton workshop={workshop} />
                    ) : (
                      <Link
                        href="/auth/signup"
                        className="w-full block text-center bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2 px-4 rounded-md transition duration-200"
                      >
                        Înregistrează-te pentru workshop
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {workshopsWithRegistration.length === 0 && (
            <div className="bg-card rounded-lg shadow border border-border">
              <div className="text-center py-12">
                <FaCalendarAlt className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-2 text-sm font-medium text-foreground">Nu sunt workshop-uri disponibile</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Reveniți mai târziu pentru noi anunțuri de workshop-uri.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
