import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { FaCalendarAlt, FaPlus, FaEdit, FaUsers, FaMapMarkerAlt, FaClock } from 'react-icons/fa'
import Link from 'next/link'
import { syncUserWithDatabase } from '@/lib/auth'
import connectDB from '@/lib/mongodb'
import { Workshop } from '@/models'
import DeleteWorkshopButton from '@/components/DeleteWorkshopButton'

export default async function AdminWorkshopsPage() {
  const clerkUser = await currentUser()
  
  if (!clerkUser) {
    redirect('/auth/login')
  }

  // Sync user and check if admin
  const user = await syncUserWithDatabase(clerkUser)
  
  if (user.role !== 'admin') {
    redirect('/unauthorized')
  }

  await connectDB()

  // Fetch all workshops
  const workshops = await Workshop.find({}).sort({ date: 1 }).lean()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Gestionare Workshop-uri</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Creați, editați și gestionați workshop-urile.
          </p>
        </div>
        <Link
          href="/admin/workshops/new"
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90"
        >
          <FaPlus className="mr-2 h-4 w-4" />
          Workshop nou
        </Link>
      </div>

      {/* Workshops List */}
      <div className="bg-card shadow border border-border overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-border">
          {workshops && workshops.length > 0 ? (
            workshops.map((workshop: any) => (
              <li key={workshop._id.toString()}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-foreground truncate">
                            {workshop.title}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {workshop.description}
                          </p>
                        </div>
                        <div className="ml-2 flex-shrink-0 flex space-x-2">
                          <Link
                            href={`/admin/workshops/edit/${workshop._id}`}
                            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-primary-foreground bg-primary hover:bg-primary/90"
                          >
                            <FaEdit className="mr-1 h-3 w-3" />
                            Editează
                          </Link>
                          <DeleteWorkshopButton 
                            workshopId={workshop._id.toString()} 
                            workshopTitle={workshop.title}
                          />
                        </div>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-muted-foreground space-x-4">
                        <div className="flex items-center">
                          <FaCalendarAlt className="flex-shrink-0 mr-1.5 h-4 w-4" />
                          {new Date(workshop.date).toLocaleDateString('ro-RO')} la {workshop.time}
                        </div>
                        <div className="flex items-center">
                          <FaMapMarkerAlt className="flex-shrink-0 mr-1.5 h-4 w-4" />
                          {workshop.location}
                        </div>
                        <div className="flex items-center">
                          <FaUsers className="flex-shrink-0 mr-1.5 h-4 w-4" />
                          {workshop.currentParticipants || 0}/{workshop.maxParticipants} participanți
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <li>
              <div className="px-4 py-12 text-center">
                <FaCalendarAlt className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-2 text-sm font-medium text-foreground">Niciun workshop</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Începeți prin a crea primul workshop.
                </p>
                <div className="mt-6">
                  <Link
                    href="/admin/workshops/new"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90"
                  >
                    <FaPlus className="mr-2 h-4 w-4" />
                    Workshop nou
                  </Link>
                </div>
              </div>
            </li>
          )}
        </ul>
      </div>
    </div>
  )
}
