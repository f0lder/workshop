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
          <div className="mimesiss-section-header">
            <h1 className="text-3xl font-bold mb-2">Programul MIMESISS 2025</h1>
            <p className="mimesiss-text-secondary text-lg">
              Sesiunea de Comunicări Științifice Medico-Militare pentru Studenți
            </p>
            <div className="mt-4 flex items-center space-x-6">
              <div className="flex items-center">
                <FaCalendarAlt className="h-5 w-5 mr-2" />
                <span>13-16 Noiembrie 2025</span>
              </div>
              <div className="flex items-center">
                <FaMapMarkerAlt className="h-5 w-5 mr-2" />
                <span>Spitalul militar central „Dr. Carol Davila"</span>
              </div>
            </div>
          </div>

          {/* Conference Sections */}
          {workshopsWithRegistration.length === 0 && (
            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
              {/* Medical Section */}
              <div className="mimesiss-section-card">
                <div className="bg-primary p-4 text-primary-foreground">
                  <h3 className="text-xl font-semibold">Secțiunea Medical</h3>
                </div>
                <div className="p-6">
                  <p className="text-muted-foreground mb-4">
                    Prezentări de lucrări științifice în domeniul medicinei generale, 
                    cercetare medicală și studii clinice.
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <FaClock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>Program va fi anunțat</span>
                    </div>
                    <div className="flex items-center">
                      <FaUsers className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>Participanți activi cu abstract</span>
                    </div>
                  </div>
                  <div className="mt-6">
                    <button className="mimesiss-btn-card">
                      Înregistrează-te ca participant activ
                    </button>
                  </div>
                </div>
              </div>

              {/* Military Medical Section */}
              <div className="mimesiss-section-card">
                <div className="bg-blue-600 p-4 text-white">
                  <h3 className="text-xl font-semibold">Secțiunea Medico-Militară</h3>
                </div>
                <div className="p-6">
                  <p className="text-muted-foreground mb-4">
                    Lucrări specializate în medicina militară, medicină de urgență 
                    în conflict și îngrijirea personalului militar.
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <FaClock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>Program va fi anunțat</span>
                    </div>
                    <div className="flex items-center">
                      <FaUsers className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>Participanți activi cu abstract</span>
                    </div>
                  </div>
                  <div className="mt-6">
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200">
                      Înregistrează-te ca participant activ
                    </button>
                  </div>
                </div>
              </div>

              {/* E-Poster Section */}
              <div className="mimesiss-section-card">
                <div className="bg-purple-600 p-4 text-white">
                  <h3 className="text-xl font-semibold">Secțiunea E-Poster</h3>
                </div>
                <div className="p-6">
                  <p className="text-muted-foreground mb-4">
                    Prezentări în format digital, poster interactiv cu discuții 
                    și sesiuni de întrebări și răspunsuri.
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <FaClock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>Program va fi anunțat</span>
                    </div>
                    <div className="flex items-center">
                      <FaUsers className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>Participanți activi cu poster</span>
                    </div>
                  </div>
                  <div className="mt-6">
                    <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md transition duration-200">
                      Înregistrează-te ca participant activ
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Dynamic Workshops */}
          {workshopsWithRegistration.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {workshopsWithRegistration.map((workshop) => (
                <div key={workshop.id} className="mimesiss-section-card">
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
          )}

          {/* Info Section */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-3">
              Informații importante despre înregistrare
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-300">
              <div>
                <h4 className="font-medium mb-2">Participanți pasivi:</h4>
                <ul className="space-y-1">
                  <li>• Acces la toate conferințele</li>
                  <li>• Materiale de curs incluse</li>
                  <li>• Certificat de participare</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Participanți activi:</h4>
                <ul className="space-y-1">
                  <li>• Toate beneficiile participanților pasivi</li>
                  <li>• Prezentare lucrare științifică</li>
                  <li>• Șanse de câștigare a premiilor</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-700">
              <Link 
                href="/info" 
                className="inline-flex items-center text-primary hover:text-primary/80 font-medium"
              >
                Vezi toate informațiile despre înregistrare →
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
