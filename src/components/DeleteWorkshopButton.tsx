'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FaTrash } from 'react-icons/fa'

interface DeleteWorkshopButtonProps {
  workshopId: string
  workshopTitle: string
}

export default function DeleteWorkshopButton({ workshopId, workshopTitle }: DeleteWorkshopButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    setIsDeleting(true)
    
    try {
      const response = await fetch(`/api/admin/workshops/${workshopId}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (!response.ok) {
        console.error('Error deleting workshop:', result.error)
        alert('Failed to delete workshop: ' + (result.error || 'Unknown error'))
      } else {
        router.refresh()
        setShowConfirm(false)
      }
    } catch (error) {
      console.error('Error deleting workshop:', error)
      alert('Failed to delete workshop')
    } finally {
      setIsDeleting(false)
    }
  }

  if (showConfirm) {
    return (
      <div className="space-y-2">
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-sm text-red-700 mb-2">
            Delete &quot;{workshopTitle}&quot;?
          </p>
          <div className="flex space-x-2">
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
            >
              {isDeleting ? 'Deleting...' : 'Yes, Delete'}
            </button>
            <button
              onClick={() => setShowConfirm(false)}
              disabled={isDeleting}
              className="inline-flex items-center px-2 py-1 border border-input text-xs font-medium rounded text-foreground bg-card hover:bg-muted focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-card hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
    >
      <FaTrash className="h-4 w-4 mr-1" />
      Delete
    </button>
  )
}
