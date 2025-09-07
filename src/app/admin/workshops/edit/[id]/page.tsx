import { currentUser } from '@clerk/nextjs/server'
import { redirect, notFound } from 'next/navigation'
import { syncUserWithDatabase } from '@/lib/auth'
import connectDB from '@/lib/mongodb'
import { Workshop } from '@/models'
import WorkshopForm from '@/components/WorkshopForm'

interface EditWorkshopPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditWorkshopPage({ params }: EditWorkshopPageProps) {
  const clerkUser = await currentUser()
  
  if (!clerkUser) {
    redirect('/auth/login')
  }

  // Sync user and check if admin
  const user = await syncUserWithDatabase(clerkUser)
  
  if (user.role !== 'admin') {
    redirect('/unauthorized')
  }

  // Await params before using
  const { id } = await params

  await connectDB()

  // Fetch the workshop
  const workshop = await Workshop.findById(id).lean() as any

  if (!workshop) {
    notFound()
  }

  // Convert the workshop data to a serializable format
  const workshopData = {
    id: workshop._id.toString(),
    title: workshop.title,
    description: workshop.description,
    date: workshop.date.toISOString().split('T')[0], // Convert to YYYY-MM-DD format
    time: workshop.time,
    location: workshop.location,
    maxParticipants: workshop.maxParticipants,
    currentParticipants: workshop.currentParticipants,
    instructor: workshop.instructor,
    status: workshop.status,
    registrationStatus: workshop.registrationStatus || 'open'
  }

  return <WorkshopForm mode="edit" workshop={workshopData} />
}
