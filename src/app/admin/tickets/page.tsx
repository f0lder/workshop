import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { syncUserWithDatabase } from '@/lib/auth'
import { getAllTickets } from '@/app/admin/tickets/actions'
import Link from 'next/link'
import { TicketCard } from './TicketCard'

export default async function AdminSettingsPage() {
  const clerkUser = await currentUser()
  
  if (!clerkUser) {
	redirect('/auth/login')
  }

  // Sync user and check if admin
  const user = await syncUserWithDatabase(clerkUser)
  
  if (user.role !== 'admin') {
	redirect('/unauthorized')
  }

  const tickets = await getAllTickets()

  return (
	<div className="space-y-8">
	  {/* Header */}
	  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
		<div>
		  <h1 className="text-3xl font-bold text-foreground">Setări bilete</h1>
		  <p className="mt-2 text-sm text-muted-foreground">
			Gestionați tipurile de bilete pentru eveniment
		  </p>
		</div>
		<Link 
		  href="/admin/tickets/new" 
		  className="mimesiss-button-primary inline-flex items-center justify-center whitespace-nowrap"
		>
		  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
		  </svg>
		  Adaugă bilet
		</Link>
	  </div>

	  {/* Ticket Cards Grid */}
	  {tickets.length === 0 ? (
		<div className="text-center py-12 mimesiss-section-card">
		  <svg className="mx-auto h-12 w-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
		  </svg>
		  <h3 className="mt-2 text-lg font-medium text-foreground">Nu există bilete</h3>
		  <p className="mt-1 text-sm text-muted-foreground">
			Începeți prin a crea primul tip de bilet.
		  </p>
		  <div className="mt-6">
			<Link href="/admin/tickets/new" className="mimesiss-button-primary inline-flex items-center">
			  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
			  </svg>
			  Adaugă primul bilet
			</Link>
		  </div>
		</div>
	  ) : (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
		  {tickets.map(ticket => (
			<TicketCard key={ticket._id || ticket.id} ticket={ticket} />
		  ))}
		</div>
	  )}
	</div>
  )
}
