'use client'

import { useTransition, useState } from 'react'
import ToggleSwitch from '@/components/ui/ToggleSwitch'
import { toggleRegistrationStatus } from '@/app/admin/workshops/actions'

interface WorkshopRegistrationToggleProps {
  workshopId: string
  currentStatus: 'open' | 'closed'
  workshopTitle: string
}

export default function WorkshopRegistrationToggle({ 
  workshopId, 
  currentStatus, 
  workshopTitle 
}: WorkshopRegistrationToggleProps) {
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleToggle = (checked: boolean) => {
    startTransition(async () => {
      try {
        setError('')
        setMessage('')
        
        const result = await toggleRegistrationStatus(workshopId)
        setMessage(result.message)
        
        // Clear message after 3 seconds
        setTimeout(() => setMessage(''), 3000)
      } catch (err) {
        console.error('Error toggling registration status:', err)
        setError(err instanceof Error ? err.message : 'A apărut o eroare.')
        setTimeout(() => setError(''), 3000)
      }
    })
  }

  // Handle undefined/null currentStatus with fallback to 'open'
  const status = currentStatus || 'open'
  const isOpen = status === 'open'

  return (
    <div className="space-y-1">
      <ToggleSwitch
        id={`registration-${workshopId}`}
        name={`registration-${workshopId}`}
        label="Înregistrări"
        description={isOpen ? 'Înregistrările sunt deschise' : 'Înregistrările sunt închise'}
        defaultChecked={isOpen}
        disabled={isPending}
        onChange={handleToggle}
      />
      
      {message && (
        <div className="text-xs text-green-600 dark:text-green-400">
          {message}
        </div>
      )}
      
      {error && (
        <div className="text-xs text-red-600 dark:text-red-400">
          {error}
        </div>
      )}
    </div>
  )
}
