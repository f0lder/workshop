import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaClock } from 'react-icons/fa'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Profile, Workshop } from '@/types/models'
import { registerForWorkshop } from './actions'
import Header from '@/components/Header'

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
    <div className="min-h-screen bg-muted">
      <Header user={user} profile={profile} variant="home" />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Available Workshops</h1>
          <p className="mt-2 text-muted-foreground">
            Discover and register for workshops that interest you.
          </p>
        </div>

        {/* Workshops Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {workshopsWithCounts.map((workshop) => (
            <div key={workshop.id} className="bg-card rounded-lg shadow-md overflow-hidden">
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
                    {new Date(workshop.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>

                  <div className="flex items-center text-sm text-muted-foreground">
                    <FaClock className="h-4 w-4 mr-2" />
                    {workshop.time || 'Time TBD'}
                  </div>

                  <div className="flex items-center text-sm text-muted-foreground">
                    <FaMapMarkerAlt className="h-4 w-4 mr-2" />
                    {workshop.location}
                  </div>

                  <div className="flex items-center text-sm text-muted-foreground">
                    <FaUsers className="h-4 w-4 mr-2" />
                    {workshop.current_participants} / {workshop.max_participants} participants
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-3">
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
                    <span className="ml-3 text-xs text-muted-foreground">
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
            <FaCalendarAlt className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-sm font-medium text-foreground">No workshops available</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Check back later for new workshop announcements.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
