'use server'

import { currentUser } from '@clerk/nextjs/server'
import { clerkClient } from '@clerk/nextjs/server'
import connectDB from '@/lib/mongodb'
import { User } from '@/models'
import { isUserAdmin } from '@/lib/auth'
import { redirect } from 'next/navigation'

export async function updateUserRole(formData: FormData) {
  try {
    // Check if current user is admin
    const clerkUser = await currentUser()
    if (!clerkUser) {
      redirect('/auth/login')
    }

    const isAdmin = await isUserAdmin(clerkUser.id)
    if (!isAdmin) {
      throw new Error('Nu aveți permisiunea să efectuați această acțiune.')
    }

    const userId = formData.get('userId') as string
    const newRole = formData.get('role') as 'user' | 'admin'

    if (!userId || !newRole) {
      throw new Error('Date invalide.')
    }

    if (newRole !== 'user' && newRole !== 'admin') {
      throw new Error('Rol invalid.')
    }

    // Don't allow changing own role
    if (userId === clerkUser.id) {
      throw new Error('Nu vă puteți modifica propriul rol.')
    }

    await connectDB()

    // Update role in MongoDB
    const updatedUser = await User.findOneAndUpdate(
      { clerkId: userId },
      { role: newRole },
      { new: true, upsert: true }
    )

    if (!updatedUser) {
      throw new Error('Utilizatorul nu a fost găsit.')
    }

    // Update role in Clerk's public metadata
    const client = await clerkClient()
    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        role: newRole
      }
    })

    return { 
      success: true, 
      message: `Rolul utilizatorului a fost actualizat cu succes la "${newRole === 'admin' ? 'Administrator' : 'Utilizator'}".` 
    }
  } catch (error) {
    console.error('Error updating user role:', error)
    throw new Error(error instanceof Error ? error.message : 'A apărut o eroare la actualizarea rolului.')
  }
}

export async function deleteUser(formData: FormData) {
  try {
    // Check if current user is admin
    const clerkUser = await currentUser()
    if (!clerkUser) {
      redirect('/auth/login')
    }

    const isAdmin = await isUserAdmin(clerkUser.id)
    if (!isAdmin) {
      throw new Error('Nu aveți permisiunea să efectuați această acțiune.')
    }

    const userId = formData.get('userId') as string

    if (!userId) {
      throw new Error('ID utilizator invalid.')
    }

    // Don't allow deleting own account
    if (userId === clerkUser.id) {
      throw new Error('Nu vă puteți șterge propriul cont.')
    }

    await connectDB()

    // Check if user to be deleted is admin
    const userToDelete = await User.findOne({ clerkId: userId })
    if (userToDelete?.role === 'admin') {
      // Count total admins
      const adminCount = await User.countDocuments({ role: 'admin' })
      if (adminCount <= 1) {
        throw new Error('Nu puteți șterge ultimul administrator din sistem.')
      }
    }

    // Delete user from MongoDB first
    const deletedUser = await User.findOneAndDelete({ clerkId: userId })

    // Delete user from Clerk
    const client = await clerkClient()
    await client.users.deleteUser(userId)

    return { 
      success: true, 
      message: 'Utilizatorul a fost șters cu succes din sistemul de autentificare și baza de date.' 
    }
  } catch (error) {
    console.error('Error deleting user:', error)
    throw new Error(error instanceof Error ? error.message : 'A apărut o eroare la ștergerea utilizatorului.')
  }
}
