'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Ticket } from '@/types/models'
import { deleteTicket } from './actions'

interface TicketCardProps {
  ticket: Ticket
}

export function TicketCard({ ticket }: TicketCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm('Sigur doriți să ștergeți acest bilet?')) {
      return
    }

    setIsDeleting(true)
    try {
      await deleteTicket(ticket._id || ticket.id || '')
      console.log('Delete ticket:', ticket._id || ticket.id)
      router.refresh()
    } catch (error) {
      console.error('Error deleting ticket:', error)
      alert('A apărut o eroare la ștergerea biletului')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="mimesiss-section-card hover:shadow-lg transition-shadow duration-200">
      <div className="p-6 flex flex-col h-full">
        {/* Ticket Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-foreground mb-1">
              {ticket.title || 'Fără titlu'}
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-primary">
                {ticket.price} RON
              </span>
            </div>
          </div>
          <svg className="w-8 h-8 text-primary/20" fill="currentColor" viewBox="0 0 24 24">
            <path d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
          </svg>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {ticket.description}
        </p>

        {/* Features */}
        <div className="flex-1 mb-4">
          <h4 className="text-xs font-semibold text-foreground uppercase tracking-wide mb-2">
            Caracteristici
          </h4>
          <ul className="space-y-1">
            {ticket.features.map((feature, index) => (
              <li 
                key={index} 
                className="text-sm text-muted-foreground flex items-start"
              >
                <svg className="w-4 h-4 mr-2 mt-0.5 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Actions */}
        <div className="pt-4 border-t border-border flex gap-2">
          <Link 
            href={`/admin/tickets/${ticket._id || ticket.id}`} 
            className="flex-1 text-center bg-primary/10 hover:bg-primary/20 text-primary font-medium py-2 px-4 rounded-md transition duration-200 text-sm"
          >
            Editează
          </Link>
          <button 
            className="flex-1 text-center bg-destructive/10 hover:bg-destructive/20 text-destructive font-medium py-2 px-4 rounded-md transition duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? 'Se șterge...' : 'Șterge'}
          </button>
        </div>
      </div>
    </div>
  )
}
