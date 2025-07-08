'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function registerForWorkshop(formData: FormData): Promise<void> {
  const supabase = await createClient()
  const workshopId = formData.get('workshopId') as string
  const action = formData.get('action') as string

  // Get user data
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    console.error('Authentication required')
    revalidatePath('/workshops')
    return
  }

  // Get workshop to check if it's full
  const { data: workshop } = await supabase
    .from('workshops')
    .select('*')
    .eq('id', workshopId)
    .single()

  if (!workshop) {
    console.error('Workshop not found')
    revalidatePath('/workshops')
    return
  }

  try {
    if (action === 'register') {
      // Check if already registered
      const { data: existingRegistration } = await supabase
        .from('workshop_registrations')
        .select('*')
        .eq('workshop_id', workshopId)
        .eq('user_id', user.id)
        .single()

      if (existingRegistration) {
        console.log('Already registered')
        revalidatePath('/workshops')
        return
      }

      // Check if workshop is full
      if (workshop.current_participants >= workshop.max_participants) {
        console.log('Workshop is full')
        revalidatePath('/workshops')
        return
      }

      // Add registration
      const { error } = await supabase
        .from('workshop_registrations')
        .insert({
          user_id: user.id,
          workshop_id: workshopId,
        })

      if (error) {
        console.error('Registration error:', error)
        revalidatePath('/workshops')
        return
      }

      // Update participant count
      await supabase
        .from('workshops')
        .update({ current_participants: workshop.current_participants + 1 })
        .eq('id', workshopId)

    } else if (action === 'cancel') {
      // Remove registration
      const { error } = await supabase
        .from('workshop_registrations')
        .delete()
        .eq('user_id', user.id)
        .eq('workshop_id', workshopId)

      if (error) {
        console.error('Cancellation error:', error)
        revalidatePath('/workshops')
        return
      }

      // Update participant count
      await supabase
        .from('workshops')
        .update({ current_participants: Math.max(0, workshop.current_participants - 1) })
        .eq('id', workshopId)
    }
  } catch (error) {
    console.error('Registration action error:', error)
  }

  // Always revalidate at the end
  revalidatePath('/workshops')
  revalidatePath('/dashboard')
}
