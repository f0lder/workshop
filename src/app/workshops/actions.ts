'use server'

import { currentUser } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'
import { Workshop, Registration } from '@/models'
import connectDB from '@/lib/mongodb'
import { syncUserWithDatabase } from '@/lib/auth'
import { getAppSettings } from '@/lib/settings'

export async function registerForWorkshop(formData: FormData): Promise<void> {
  const clerkUser = await currentUser()
  const workshopId = formData.get('workshopId') as string
  const action = formData.get('action') as string

  if (!clerkUser) {
    console.error('Authentication required')
    revalidatePath('/workshops')
    return
  }

  // Sync user with database
  await syncUserWithDatabase(clerkUser)
  
  // Get app settings to check global registration settings
  const appSettings = await getAppSettings()
  
  await connectDB()

  // Check if global registration is enabled
  if (!appSettings.globalRegistrationEnabled) {
    console.log('Global registration is disabled')
    revalidatePath('/workshops')
    return
  }

  // Get workshop to check if it's full
  const workshop = await Workshop.findById(workshopId)

  if (!workshop) {
    console.error('Workshop not found')
    revalidatePath('/workshops')
    return
  }

  try {
    if (action === 'register') {
      // Check if registrations are open
      if (workshop.registrationStatus === 'closed') {
        console.log('Registrations are closed for this workshop')
        revalidatePath('/workshops')
        return
      }

      // Check if user has reached maximum workshops limit
      const userRegistrationsCount = await Registration.countDocuments({ 
        userId: clerkUser.id, 
        status: 'confirmed' 
      })
      
      if (userRegistrationsCount >= appSettings.maxWorkshopsPerUser) {
        console.log(`User has reached maximum workshops limit (${appSettings.maxWorkshopsPerUser})`)
        revalidatePath('/workshops')
        return
      }

      // Check if already registered
      const existingRegistration = await Registration.findOne({
        userId: clerkUser.id,
        workshopId
      })

      if (existingRegistration) {
        console.log('Already registered')
        revalidatePath('/workshops')
        return
      }

      // Check if workshop is full
      const currentRegistrations = await Registration.countDocuments({ workshopId })
      if (currentRegistrations >= workshop.maxParticipants) {
        console.log('Workshop is full')
        revalidatePath('/workshops')
        return
      }

      // Add registration
      await Registration.create({
        userId: clerkUser.id,
        workshopId,
        status: 'confirmed'
      })

      // Update participant count
      await Workshop.findByIdAndUpdate(workshopId, {
        currentParticipants: currentRegistrations + 1
      })

    } else if (action === 'cancel') {
      // Check if cancellation is allowed
      if (!appSettings.allowCancelRegistration) {
        console.log('Registration cancellation is not allowed')
        revalidatePath('/workshops')
        return
      }

      // Remove registration
      await Registration.findOneAndDelete({
        userId: clerkUser.id,
        workshopId
      })

      // Update participant count
      const currentRegistrations = await Registration.countDocuments({ workshopId })
      await Workshop.findByIdAndUpdate(workshopId, {
        currentParticipants: currentRegistrations
      })
    }
  } catch (error) {
    console.error('Registration action error:', error)
  }

  // Always revalidate at the end
  revalidatePath('/workshops')
  revalidatePath('/dashboard')
}
