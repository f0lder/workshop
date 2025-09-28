'use server'

import { currentUser } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'
import { Workshop, Registration, User } from '@/models'
import connectDB from '@/lib/mongodb'
import { syncUserWithDatabase } from '@/lib/auth'
import { User as UserType } from '@/types/models'

export async function createWorkshop(formData: FormData) {
  const clerkUser = await currentUser()
  
  if (!clerkUser) {
    throw new Error('Authentication required')
  }

  // Sync user and check if admin
  const user = await syncUserWithDatabase(clerkUser)
  
  if (user.role !== 'admin') {
    throw new Error('Admin access required')
  }

  await connectDB()

  // Extract form data
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const date = formData.get('date') as string
  const time = formData.get('time') as string
  const location = formData.get('location') as string
  const instructor = formData.get('instructor') as string
  const registrationStatus = formData.get('registrationStatus') as 'open' | 'closed'
  const maxParticipants = parseInt(formData.get('maxParticipants') as string)

  // Validate required fields
  if (!title || !description || !date || !time || !location || !instructor || !maxParticipants) {
    throw new Error('All required fields must be filled')
  }

  try {
    // Create the workshop
    const workshop = await Workshop.create({
      title,
      description,
      date: new Date(date),
      time,
      location,
      maxParticipants,
      currentParticipants: 0,
      instructor,
      registrationStatus: registrationStatus || 'open'
    })

    // Revalidate the admin workshops page
    revalidatePath('/admin/workshops')
    
    return { success: true, workshopId: workshop._id.toString() }
  } catch (error) {
    console.error('Error creating workshop:', error)
    throw new Error('Failed to create workshop')
  }
}

export async function updateWorkshop(workshopId: string, formData: FormData) {
  const clerkUser = await currentUser()
  
  if (!clerkUser) {
    throw new Error('Authentication required')
  }

  // Sync user and check if admin
  const user = await syncUserWithDatabase(clerkUser)
  
  if (user.role !== 'admin') {
    throw new Error('Admin access required')
  }

  await connectDB()

  // Extract form data
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const date = formData.get('date') as string
  const time = formData.get('time') as string
  const location = formData.get('location') as string
  const instructor = formData.get('instructor') as string
  const registrationStatus = formData.get('registrationStatus') as 'open' | 'closed'
  const maxParticipants = parseInt(formData.get('maxParticipants') as string)

  // Validate required fields
  if (!title || !description || !date || !time || !location || !instructor || !maxParticipants) {
    throw new Error('All required fields must be filled')
  }

  try {
    // Get the existing workshop to check current participants
    const existingWorkshop = await Workshop.findById(workshopId)
    
    if (!existingWorkshop) {
      throw new Error('Workshop not found')
    }

    // Validate that max participants is not less than current participants
    if (maxParticipants < existingWorkshop.currentParticipants) {
      throw new Error(`Maximum participants cannot be less than current participants (${existingWorkshop.currentParticipants})`)
    }

    // Update the workshop
    const workshop = await Workshop.findByIdAndUpdate(
      workshopId,
      {
        title,
        description,
        date: new Date(date),
        time,
        location,
        maxParticipants,
        instructor,
        registrationStatus: registrationStatus || 'open'
      },
      { new: true }
    )

    if (!workshop) {
      throw new Error('Workshop not found')
    }

    // Revalidate the admin workshops page
    revalidatePath('/admin/workshops')
    
    return { success: true, workshopId: workshop._id.toString() }
  } catch (error) {
    console.error('Error updating workshop:', error)
    throw new Error('Failed to update workshop')
  }
}

export async function deleteWorkshop(workshopId: string) {
  const clerkUser = await currentUser()
  
  if (!clerkUser) {
    throw new Error('Authentication required')
  }

  // Sync user and check if admin
  const user = await syncUserWithDatabase(clerkUser)
  
  if (user.role !== 'admin') {
    throw new Error('Admin access required')
  }

  await connectDB()

  try {
    // First, delete all registrations for this workshop
    await Registration.deleteMany({ workshopId })

    // Then delete the workshop
    const workshop = await Workshop.findByIdAndDelete(workshopId)

    if (!workshop) {
      throw new Error('Workshop not found')
    }

    // Revalidate the admin workshops page
    revalidatePath('/admin/workshops')
    
    return { success: true }
  } catch (error) {
    console.error('Error deleting workshop:', error)
    throw new Error('Failed to delete workshop')
  }
}

export async function toggleRegistrationStatus(workshopId: string) {
  const clerkUser = await currentUser()
  
  if (!clerkUser) {
    throw new Error('Authentication required')
  }

  // Sync user and check if admin
  const user = await syncUserWithDatabase(clerkUser)
  
  if (user.role !== 'admin') {
    throw new Error('Admin access required')
  }

  await connectDB()

  try {
    // Get the current workshop
    const workshop = await Workshop.findById(workshopId)
    
    if (!workshop) {
      throw new Error('Workshop not found')
    }

    // Toggle the registration status (handle undefined/null case)
    const currentStatus = workshop.registrationStatus || 'open'
    const newRegistrationStatus = currentStatus === 'open' ? 'closed' : 'open'
    
    // Update the workshop
    const updatedWorkshop = await Workshop.findByIdAndUpdate(
      workshopId,
      { registrationStatus: newRegistrationStatus },
      { new: true }
    )

    if (!updatedWorkshop) {
      throw new Error('Failed to update workshop')
    }

    // Revalidate the admin workshops page
    revalidatePath('/admin/workshops')
    revalidatePath('/workshops')
    
    return { 
      success: true, 
      newStatus: newRegistrationStatus,
      message: `Înregistrările au fost ${newRegistrationStatus === 'open' ? 'deschise' : 'închise'} pentru acest workshop.`
    }
  } catch (error) {
    console.error('Error toggling registration status:', error)
    throw new Error('Failed to toggle registration status')
  }
}


export async function getRegistrations(workshopId: string) : Promise<UserType[]>{
  const clerkUser = await currentUser()

  if (!clerkUser) {
    throw new Error('Authentication required')
  }

  // Sync user and check if admin
  const user = await syncUserWithDatabase(clerkUser)

  if (user.role !== 'admin') {
    throw new Error('Admin access required')
  }

  await connectDB()

  try {
    const registrations = await Registration.find({ workshopId }).lean()

    const users = await User.find({
      clerkId: { $in: registrations.map(reg => reg.userId) }
    })

    return users as UserType[];
  } catch (error) {
    console.error('Error fetching registrations:', error)
    throw new Error('Failed to fetch registrations')
  }
}