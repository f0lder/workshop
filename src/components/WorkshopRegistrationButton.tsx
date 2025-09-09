'use client'

import { Workshop } from '@/types/models'
import { useTransition } from 'react'
import { useToast } from '@/components/ui/ToastProvider'
import { registerForWorkshop } from '@/app/workshops/actions'

interface WorkshopRegistrationButtonProps {
  workshop: Workshop
  userId?: string | null
  onRegistrationChange?: () => Promise<void>
  onOptimisticUpdate?: (workshopId: string, isRegistered: boolean) => void
}

// Simple CSS spinner component
function Spinner() {
  return (
    <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" />
  )
}

export function WorkshopRegistrationButton({ workshop, onOptimisticUpdate }: WorkshopRegistrationButtonProps) {
  const [isPending, startTransition] = useTransition()
  const { showToast } = useToast()
  
  // Check if user is registered
  const isRegistered = !!workshop.user_registered
  const isFull = workshop.current_participants >= workshop.maxParticipants
  const isRegistrationClosed = workshop.registrationStatus === 'closed'
  
  async function handleSubmit(formData: FormData) {
    const action = formData.get('action') as string
    const willBeRegistered = action === 'register'
    const workshopId = String(workshop.id || workshop._id || '')
    
    // Optimistic update for instant visual feedback
    if (onOptimisticUpdate) {
      onOptimisticUpdate(workshopId, willBeRegistered)
    }
    
    startTransition(async () => {
      try {
        await registerForWorkshop(formData)
        
        // Show success message for immediate feedback
        if (isRegistered) {
          showToast('Te-ai dezînscris cu succes de la workshop', 'info')
        } else {
          showToast('Te-ai înscris cu succes la workshop!', 'success')
        }
        
        // No need to refresh - optimistic update already handled the UI
        
      } catch (error) {
        // Revert optimistic update on error
        if (onOptimisticUpdate) {
          onOptimisticUpdate(workshopId, !willBeRegistered)
        }
        
        // Handle specific error messages from the server
        const errorMessage = error instanceof Error ? error.message : 'A apărut o eroare. Te rugăm încearcă din nou.'
        showToast(errorMessage, 'error')
        console.error('Registration error:', error)
      }
    })
  }

  // If registration is closed and user is not registered, show message
  if (isRegistrationClosed && !isRegistered) {
    return (
      <div className="w-full text-center py-2 px-4 bg-gray-100 text-gray-600 rounded-md border">
        Înregistrările sunt închise
      </div>
    )
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
        disabled={isPending || (isFull && !isRegistered) || (isRegistrationClosed && !isRegistered)}
        className={`w-full font-medium py-2 px-4 rounded-md transition duration-200 flex items-center justify-center gap-2 ${
          isPending ? 'bg-gray-400 text-white cursor-wait' :
          isFull && !isRegistered
            ? 'bg-gray-400 cursor-not-allowed text-white'
            : isRegistered
            ? 'bg-red-600 hover:bg-red-700 text-white'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
      >
        {isPending && <Spinner />}
        {isPending ? 'Se procesează...' :
          isFull && !isRegistered
            ? 'Workshop complet'
            : isRegistered
            ? 'Anulează înregistrarea'
            : 'Înregistrează-te acum'
        }
      </button>
    </form>
  )
}
