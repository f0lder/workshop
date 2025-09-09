'use server'

import { currentUser } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'
import { Workshop, Registration } from '@/models'
import connectDB from '@/lib/mongodb'
import { getAppSettings } from '@/lib/settings'

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
    const [appSettings, workshop, existingRegistration, userRegistrationsCount] = await Promise.all([
      getAppSettings(),
      Workshop.findById(workshopId),
      Registration.findOne({ userId: clerkUser.id, workshopId }),
      Registration.countDocuments({ userId: clerkUser.id, status: 'confirmed' })
    ])

    if (!workshop) {
      throw new Error('Workshop not found')
    }

    // Check global registration settings
    if (!appSettings.globalRegistrationEnabled) {
      throw new Error('Global registration is disabled')
    }

    if (action === 'register') {
      // Validate registration conditions
      if (workshop.registrationStatus === 'closed') {
        throw new Error('Registrations are closed for this workshop')
      }

      if (userRegistrationsCount >= appSettings.maxWorkshopsPerUser) {
        throw new Error(`You have reached the maximum workshops limit (${appSettings.maxWorkshopsPerUser})`)
      }

      if (existingRegistration) {
        throw new Error('Already registered for this workshop')
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
