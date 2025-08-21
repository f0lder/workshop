import { createAdminClient } from '@/lib/supabase/admin'
import { FaCalendarAlt, FaPlus, FaEdit, FaUsers, FaMapMarkerAlt, FaClock } from 'react-icons/fa'
import Link from 'next/link'
import DeleteWorkshopButton from '@/components/DeleteWorkshopButton'

export default async function AdminWorkshopsPage() {
  const supabase = await createAdminClient()

  // Fetch all workshops with instructor information using admin client
  const { data: workshops, error } = await supabase
    .from('workshops')
    .select(`
      *,
      instructor:profiles(full_name, email)
    `)
    .order('date', { ascending: true })

  if (error) {
    console.error('Error fetching workshops:', error)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Workshop Management</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Create, edit, and manage workshops.
          </p>
        </div>
        <Link
          href="/admin/workshops/new"
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <FaPlus className="h-4 w-4 mr-2" />
          Create Workshop
        </Link>
      </div>

      {/* Workshops List */}
      <div className="bg-card shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:p-6">
          {workshops && workshops.length > 0 ? (
            <div className="grid gap-6">
              {workshops.map((workshop) => (
                <div
                  key={workshop.id}
                  className="border rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        {workshop.title}
                      </h3>
                      <p className="text-muted-foreground mb-4 line-clamp-2">
                        {workshop.description}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <FaCalendarAlt className="h-4 w-4 mr-2" />
                          {new Date(workshop.date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </div>

                        <div className="flex items-center">
                          <FaClock className="h-4 w-4 mr-2" />
                          {workshop.time}
                        </div>

                        <div className="flex items-center">
                          <FaMapMarkerAlt className="h-4 w-4 mr-2" />
                          {workshop.location}
                        </div>

                        <div className="flex items-center">
                          <FaUsers className="h-4 w-4 mr-2" />
                          {workshop.current_participants} / {workshop.max_participants}
                        </div>
                      </div>

                      {workshop.instructor && (
                        <div className="mt-3 text-sm text-muted-foreground">
                          <span className="font-medium">Instructor:</span>{' '}
                          {workshop.instructor.full_name || workshop.instructor.email}
                        </div>
                      )}

                      {/* Registration Progress */}
                      <div className="mt-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Registration Progress</span>
                          <span className="text-muted-foreground">
                            {Math.round((workshop.current_participants / workshop.max_participants) * 100)}%
                          </span>
                        </div>
                        <div className="mt-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${(workshop.current_participants / workshop.max_participants) * 100}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="ml-6 flex flex-col space-y-2">
                      <Link
                        href={`/admin/workshops/${workshop.id}/edit`}
                        className="inline-flex items-center px-3 py-2 border border-input shadow-sm text-sm leading-4 font-medium rounded-md text-foreground bg-card hover:bg-muted focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <FaEdit className="h-4 w-4 mr-1" />
                        Edit
                      </Link>
                      
                      <DeleteWorkshopButton workshopId={workshop.id} workshopTitle={workshop.title} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FaCalendarAlt className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-medium text-foreground">No workshops</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Get started by creating a new workshop.
              </p>
              <div className="mt-6">
                <Link
                  href="/admin/workshops/new"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <FaPlus className="h-4 w-4 mr-2" />
                  Create Workshop
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
