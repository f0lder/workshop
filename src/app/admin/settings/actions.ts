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
    const updates = {
      // Workshop settings
      globalRegistrationEnabled: formData.get('globalRegistrationEnabled') === 'on',
      paymentsEnabled: formData.get('paymentsEnabled') === 'on',
      workshopVisibleToPublic: formData.get('workshopVisibleToPublic') === 'on',
      requireApprovalForRegistration: formData.get('requireApprovalForRegistration') === 'on',
      allowCancelRegistration: formData.get('allowCancelRegistration') === 'on',
      maxWorkshopsPerUser: parseInt(formData.get('maxWorkshopsPerUser') as string) || 10,
      defaultMaxParticipants: parseInt(formData.get('defaultMaxParticipants') as string) || 20,
      defaultWorkshopDuration: parseInt(formData.get('defaultWorkshopDuration') as string) || 120,
      
      // Email settings
      sendEmailNotifications: formData.get('sendEmailNotifications') === 'on',
      sendRegistrationConfirmation: formData.get('sendRegistrationConfirmation') === 'on',
      sendCancellationNotification: formData.get('sendCancellationNotification') === 'on',
      
      // General settings
      maintenanceMode: formData.get('maintenanceMode') === 'on',
      registrationMessage: formData.get('registrationMessage') as string || '',
      footerText: formData.get('footerText') as string || '',
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
