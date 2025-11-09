'use server'

import { currentUser } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'
import { updateAppSettings, resetAppSettings } from '@/lib/settings'
import { syncUserWithDatabase } from '@/lib/auth'

export async function updateSettings(formData: FormData) {
  const clerkUser = await currentUser()
  
  if (!clerkUser) {
    throw new Error('Authentication required')
  }

  // Sync user and check if admin
  const user = await syncUserWithDatabase(clerkUser)
  
  if (user.role !== 'admin') {
    throw new Error('Admin access required')
  }

  try {
    // Extract form data
    const registrationStartTimeStr = formData.get('registrationStartTime') as string
    const registrationDeadlineStr = formData.get('registrationDeadline') as string
    
    const updates = {
      // Workshop settings
      globalRegistrationEnabled: formData.get('globalRegistrationEnabled') === 'on',
      paymentsEnabled: formData.get('paymentsEnabled') === 'on',
      workshopVisibleToPublic: formData.get('workshopVisibleToPublic') === 'on',
      allowCancelRegistration: formData.get('allowCancelRegistration') === 'on',
      registrationStartTime: registrationStartTimeStr ? new Date(registrationStartTimeStr) : undefined,
      registrationDeadline: registrationDeadlineStr ? new Date(registrationDeadlineStr) : undefined,
      defaultMaxParticipants: parseInt(formData.get('defaultMaxParticipants') as string) || 20,
    }

    // Update settings
    await updateAppSettings(updates)

    // Revalidate pages that might use settings
    revalidatePath('/admin/settings')
    revalidatePath('/workshops')
    revalidatePath('/')
    
    return { success: true }
  } catch (error) {
    console.error('Error updating settings:', error)
    throw new Error('Failed to update settings')
  }
}

export async function resetSettings() {
  const clerkUser = await currentUser()
  
  if (!clerkUser) {
    throw new Error('Authentication required')
  }

  // Sync user and check if admin
  const user = await syncUserWithDatabase(clerkUser)
  
  if (user.role !== 'admin') {
    throw new Error('Admin access required')
  }

  try {
    // Reset settings to defaults
    await resetAppSettings()

    // Revalidate pages that might use settings
    revalidatePath('/admin/settings')
    revalidatePath('/workshops')
    revalidatePath('/')
    
    return { success: true }
  } catch (error) {
    console.error('Error resetting settings:', error)
    throw new Error('Failed to reset settings')
  }
}
