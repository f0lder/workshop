import Link from 'next/link'
import { FaCalendarAlt, FaUsers, FaMapMarkerAlt } from 'react-icons/fa'
import { createClient } from '@/lib/supabase/server'

export default async function HomePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Get user profile if logged in
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    // Profile data available if needed later
    void data
  }
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-foreground sm:text-5xl md:text-6xl">
            Discover Amazing
            <span className="text-primary"> Workshops</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-muted-foreground sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Join workshops, learn new skills, and connect with like-minded people. 
            Our platform makes it easy to find and register for workshops that interest you.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            {user ? (
              // Logged in user CTAs
              <>
                <div className="rounded-md shadow">
                  <Link
                    href="/dashboard"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90 md:py-4 md:text-lg md:px-10"
                  >
                    Go to Dashboard
                  </Link>
                </div>
                <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                  <Link
                    href="/workshops"
                    className="w-full flex items-center justify-center px-8 py-3 border border-border text-base font-medium rounded-md text-primary bg-card hover:bg-accent md:py-4 md:text-lg md:px-10"
                  >
                    Browse Workshops
                  </Link>
                </div>
              </>
            ) : (
              // Guest user CTAs
              <>
                <div className="rounded-md shadow">
                  <Link
                    href="/auth/signup"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90 md:py-4 md:text-lg md:px-10"
                  >
                    Get Started
                  </Link>
                </div>
                <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                  <Link
                    href="/workshops"
                    className="w-full flex items-center justify-center px-8 py-3 border border-border text-base font-medium rounded-md text-primary bg-card hover:bg-accent md:py-4 md:text-lg md:px-10"
                  >
                    Browse Workshops
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="mt-20">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-primary-foreground mx-auto">
                <FaCalendarAlt className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-lg font-medium text-foreground">Easy Scheduling</h3>
              <p className="mt-2 text-base text-muted-foreground">
                Browse workshops by date, time, and location. Find the perfect workshop that fits your schedule.
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-primary-foreground mx-auto">
                <FaUsers className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-lg font-medium text-foreground">Expert Instructors</h3>
              <p className="mt-2 text-base text-muted-foreground">
                Learn from experienced professionals and industry experts who are passionate about sharing their knowledge.
              </p>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-primary-foreground mx-auto">
                <FaMapMarkerAlt className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-lg font-medium text-foreground">Multiple Locations</h3>
              <p className="mt-2 text-base text-muted-foreground">
                Workshops available at various locations, making it convenient for you to attend.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
