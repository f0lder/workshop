import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { syncUserWithDatabase } from '@/lib/auth'
import { getAllTickets } from '@/app/admin/tickets/actions'
import Link from 'next/link'

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
	<div className="space-y-6">
	  {/* Header */}
	  <div>
		<h1 className="text-2xl font-bold text-foreground">Setari bilete</h1>
		<p className="mt-1 text-sm text-muted-foreground">
		  Gestionati biletele.
		</p>
	  </div>

	  {/* Add Ticket Button */}
	  <div className="flex justify-end">
		<Link href="/admin/tickets/new" className="btn">Adauga bilet</Link>
	  </div>

	  {/* Ticket List */}
	  <div className="bg-card shadow border border-border rounded-lg">
		<ul>
		  {tickets.map(ticket => (
			<li key={ticket.id} className="border-b border-border p-4">
			  <h3 className="font-bold">{ticket.title}</h3>
			  <p className="text-sm text-muted-foreground">{ticket.description}</p>
			  <Link href={`/admin/tickets/${ticket.id}`} className="text-primary hover:underline text-sm">Editeaza</Link>
			</li>
		  ))}
		</ul>
	  </div>

	  {/* Settings Form */}
	  <div className="bg-card shadow border border-border rounded-lg">
		
	  </div>
	</div>
  )
}
