'use server'

import { currentUser } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'
import { Workshop, Registration } from '@/models'
import connectDB from '@/lib/mongodb'
import { getAppSettings } from '@/lib/settings'
import { Workshop as WorkshopType } from '@/types/models'

export async function registerForWorkshop(formData: FormData): Promise<void> {
  const clerkUser = await currentUser()
  
  const workshopId = formData.get('workshopId') as string
  const action = formData.get('action') as string

  if (!clerkUser) {
    throw new Error('Authentication required')
  }

  await connectDB()

  try {
    // Get all data in parallel for faster execution
    const [appSettings, workshop, existingRegistration] = await Promise.all([
      getAppSettings(),
      Workshop.findById(workshopId),
      Registration.findOne({ userId: clerkUser.id, workshopId })
    ])

    if (!workshop) {
      throw new Error('Workshop not found')
    }

    // Check global registration settings
    if (!appSettings.globalRegistrationEnabled) {
      throw new Error('Inregistrarile sunt inchise in acest moment')
    }

    if (action === 'register') {
      // Validate registration conditions
      
      if (existingRegistration) {
        throw new Error('Ești deja înregistrat la acest workshop')
      }
      
      // Count total workshops user is registered for (excluding current one)
      const userRegistrationsCount = await Registration.countDocuments({ 
        userId: clerkUser.id,
        workshopId: { $ne: workshopId } // Exclude current workshop
      })

      // Maximum 2 workshops at any given time
      if (userRegistrationsCount >= 2) {
        throw new Error('Poți fi înregistrat la maxim 2 workshop-uri simultan')
      }

      // Get current registration count for this workshop
      const currentRegistrations = await Registration.countDocuments({ workshopId })
      if (currentRegistrations >= workshop.maxParticipants) {
        throw new Error('Workshop is full')
      }

      // Perform registration and update count atomically
      await Promise.all([
        Registration.create({
          userId: clerkUser.id,
          workshopId,
          status: 'confirmed'
        }),
        Workshop.findByIdAndUpdate(workshopId, {
          currentParticipants: currentRegistrations + 1
        })
      ])

    } else if (action === 'cancel') {
      if (!appSettings.allowCancelRegistration) {
        throw new Error('Registration cancellation is not allowed')
      }

      if (!existingRegistration) {
        throw new Error('No registration found to cancel')
      }

      // Get current count and perform cancellation atomically
      const currentRegistrations = await Registration.countDocuments({ workshopId })
      
      await Promise.all([
        Registration.findOneAndDelete({ userId: clerkUser.id, workshopId }),
        Workshop.findByIdAndUpdate(workshopId, {
          currentParticipants: Math.max(0, currentRegistrations - 1)
        })
      ])
    }

  } catch (error) {
    console.error('Registration action error:', error)
    throw error // Re-throw to let the client handle the error
  }

  // Only revalidate on success
  revalidatePath('/workshops')
  revalidatePath('/dashboard')
}


export async function getUserRegistrations(userId: string): Promise<WorkshopType[]> {
  await connectDB()

  try {
    const registrations = await Registration.find({ userId }).lean()

    if (registrations.length === 0) {
      return []
    }

    const workshops = await Workshop.find({
      _id: { $in: registrations.map(reg => reg.workshopId) }
    }).sort({ date: 1 }) // Sort by date ascending

    return workshops as WorkshopType[]
  } catch (error) {
    console.error('Error fetching user registrations:', error)
    return []
  }
}

export async function getWorkshopById(workshopId: string): Promise<WorkshopType | null> {
  // Validate ObjectId format before making database query
  if (!workshopId || workshopId.length !== 24 || !/^[0-9a-fA-F]{24}$/.test(workshopId)) {
    console.log('Invalid ObjectId format:', workshopId)
    return null
  }

  await connectDB()

  try {
    const workshop = await Workshop.findById(workshopId).lean()
    return workshop as WorkshopType | null
  } catch (error) {
    console.error('Error fetching workshop by ID:', error)
    return null
  }
}

export async function getIsRegisteredForWorkshop( workshopId: string): Promise<boolean> {


  const clerkUser = await currentUser()

  if (!clerkUser) {
    return false
  }

  await connectDB()

  try {
    const registration = await Registration.findOne({ userId: clerkUser.id, workshopId }).lean()
    return registration !== null
  } catch (error) {
    console.error('Error checking workshop registration:', error)
    return false
  }
}

export async function getAllWorkshops(): Promise<WorkshopType[]> {
  await connectDB()

  try {
    const workshops = await Workshop.find({}).sort({ date: 1 }).lean()
    return workshops as unknown as WorkshopType[]
  } catch (error) {
    console.error('Error fetching workshops:', error)
    return []
  }
}