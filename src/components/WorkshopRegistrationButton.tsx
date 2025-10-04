'use client'

import { Workshop } from '@/types/models'
import { useTransition } from 'react'
import { useToast } from '@/components/ui/ToastProvider'
import { registerForWorkshop } from '@/app/workshops/actions'
import { useMongoUser } from '@/hooks/useMongoUser'
import Link from 'next/link'

interface WorkshopRegistrationButtonProps {
  workshop: Workshop
  onRegistrationChange?: () => Promise<void>
  onOptimisticUpdate?: (workshopId: string, isRegistered: boolean) => void
  isGlobalRegistrationClosed?: boolean
}

// Simple CSS spinner component
function Spinner() {
  return (
    <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" />
  )
}

export function WorkshopRegistrationButton({ workshop, onOptimisticUpdate, isGlobalRegistrationClosed }: WorkshopRegistrationButtonProps) {
  const { user: mongoUser, isLoading: isLoadingUser, error } = useMongoUser()
  const [isPending, startTransition] = useTransition()
  const { showToast } = useToast()

  // Show loading state while user data is loading
  if (isLoadingUser) {
    return (
      <div className="w-full text-center py-2 px-4 bg-gray-100 text-gray-600 rounded-md border border-gray-300">
        <Spinner /> Se încarcă...
      </div>
    )
  }

  // Show error state if user data failed to load
  if (error) {
    return (
      <div className="w-full text-center py-2 px-4 bg-red-100 text-red-600 rounded-md border border-red-300">
        Eroare la încărcarea datelor utilizatorului
      </div>
    )
  }

  // If no user is logged in, don't show the button
  if (!mongoUser) {
    return null
  }

  // Check if user is registered
  const isRegistered = !!workshop.user_registered
  const isFull = workshop.currentParticipants >= workshop.maxParticipants
  
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

  if (!isGlobalRegistrationClosed) {
    
    return (
      <div className="w-full text-center py-2 px-4 bg-gray-100 text-gray-600 rounded-md border border-gray-300">
        Înregistrările sunt închise
      </div>
    )
  }
  
  // If user has unpaid access level, show link to payment page
  if (mongoUser.accessLevel === 'unpaid') {
    return (
      <Link href="/payment" className="w-full">
        <button
          type="button"
          className="w-full font-medium py-2 px-4 rounded-md transition duration-200 flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white"
        >
          Cumpără bilet pentru a te înregistra
        </button>
      </Link>
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
        disabled={isPending || (isFull && !isRegistered) || (!isGlobalRegistrationClosed && !isRegistered)}
        className={`w-full font-medium py-2 px-4 rounded-md transition duration-200 flex items-center justify-center gap-2 ${
          isPending ? 'bg-gray-400 text-white cursor-wait' :
          isFull && !isRegistered
            ? 'bg-gray-400 cursor-not-allowed text-white'
            : isRegistered
            ? 'bg-destructive hover:bg-destructive/90 text-destructive-foreground'
            : 'bg-primary hover:bg-primary/90 text-primary-foreground'
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
