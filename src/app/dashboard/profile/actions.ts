'use server'

import { currentUser, clerkClient } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'
import { syncUserWithDatabase } from '@/lib/auth'

export async function updateProfile(formData: FormData) {
  const clerkUser = await currentUser()
  
  if (!clerkUser) {
    throw new Error('Authentication required')
  }

  const firstName = formData.get('firstName') as string
  const lastName = formData.get('lastName') as string

  try {
    // Update the user in Clerk using clerkClient
    const clerk = await clerkClient()
    await clerk.users.updateUser(clerkUser.id, {
      firstName: firstName || undefined,
      lastName: lastName || undefined,
    })

    // Get the updated user data
    const updatedClerkUser = await clerk.users.getUser(clerkUser.id)

    // Then sync with our MongoDB database
    await syncUserWithDatabase(updatedClerkUser)

    // Revalidate the profile page to reflect changes
    revalidatePath('/dashboard/profile')
    
    return { success: true, message: 'Profilul a fost actualizat cu succes!' }
  } catch (error) {
    console.error('Error updating profile:', error)
    throw new Error('A apărut o eroare la actualizarea profilului.')
  }
}
