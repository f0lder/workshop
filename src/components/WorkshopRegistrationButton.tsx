'use client'

import { Workshop } from '@/types/models'
import { useState } from 'react'
import { useToast } from '@/components/ui/ToastProvider'

interface WorkshopRegistrationButtonProps {
  workshop: Workshop
  userId?: string | null
}

export function WorkshopRegistrationButton({ workshop }: WorkshopRegistrationButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { showToast } = useToast()
  
  // Check if user is registered
  const isRegistered = !!workshop.user_registered
  const isFull = workshop.current_participants >= workshop.max_participants
  
  async function handleSubmit() {
    setIsLoading(true)
    
    try {
      // Form action will be handled by server action
      if (isRegistered) {
        showToast('Successfully cancelled workshop registration', 'info')
      } else {
        showToast('Successfully registered for workshop', 'success')
      }
    } catch (err) {
      showToast('An error occurred. Please try again.', 'error')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <form action={handleSubmit}>
      <input type="hidden" name="workshopId" value={workshop.id} />
      <input 
        type="hidden" 
        name="action" 
        value={isRegistered ? 'cancel' : 'register'} 
      />
      <button
        type="submit"
        disabled={isLoading || (isFull && !isRegistered)}
        className={`w-full font-medium py-2 px-4 rounded-md transition duration-200 ${
          isLoading ? 'bg-gray-400 text-white cursor-wait' :
          isFull && !isRegistered
            ? 'bg-gray-400 cursor-not-allowed text-white'
            : isRegistered
            ? 'bg-green-600 hover:bg-green-700 text-white'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
      >
        {isLoading ? 'Processing...' :
          isFull && !isRegistered
            ? 'Workshop Full'
            : isRegistered
            ? 'Cancel Registration'
            : 'Register Now'
        }
      </button>
    </form>
  )
}
