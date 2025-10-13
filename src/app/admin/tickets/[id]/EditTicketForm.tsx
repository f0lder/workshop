'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { updateTicket } from '../actions'
import { Ticket } from '@/types/models'

interface EditTicketFormProps {
	ticket: Ticket
}

export default function EditTicketForm({ ticket }: EditTicketFormProps) {
	const [error, setError] = useState<string | null>(null)
	const [isPending, startTransition] = useTransition()
	const router = useRouter()

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault()
		setError(null)

		const formData = new FormData(event.currentTarget)
		
		// Extract and parse form data
		const title = formData.get('title') as string
		const description = formData.get('description') as string
		const price = parseFloat(formData.get('price') as string)
		const featuresString = formData.get('features') as string
		const features = featuresString.split(',').map(f => f.trim()).filter(f => f.length > 0)
		const type = formData.get('type') as string

		startTransition(async () => {
			try {
				await updateTicket(ticket._id ?? '', {
					title,
					description,
					price,
					features,
					type
				})
				router.push('/admin/tickets')
				router.refresh()
			} catch (err) {
				setError(err instanceof Error ? err.message : 'A apărut o eroare')
			}
		})
	}

	return (
		<div className="max-w-4xl mx-auto px-4 py-8">
			<form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
				<div>
					<h1 className="text-3xl font-bold text-foreground mb-2">Editează bilet</h1>
					<p className="text-muted-foreground">Modifică detaliile biletului</p>
				</div>

				{error && (
					<div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-md">
						{error}
					</div>
				)}

				<div className="mimesiss-section-card p-6 space-y-6">
					<div>
						<label htmlFor="title" className="block text-sm font-medium text-foreground mb-2">
							Titlu Bilet <span className="text-destructive">*</span>
						</label>
						<input
							type="text"
							name="title"
							id="title"
							required
							disabled={isPending}
							defaultValue={ticket.title}
							className="w-full rounded-md border border-input bg-background px-3 py-2 text-foreground shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 sm:text-sm disabled:opacity-50"
						/>
					</div>

					<div>
						<label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">
							Descriere <span className="text-destructive">*</span>
						</label>
						<textarea
							name="description"
							id="description"
							required
							disabled={isPending}
							rows={4}
							defaultValue={ticket.description}
							className="w-full rounded-md border border-input bg-background px-3 py-2 text-foreground shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 sm:text-sm disabled:opacity-50"
						/>
					</div>

					<div>
						<label htmlFor="type" className="block text-sm font-medium text-foreground mb-2">
							Tip Bilet <span className="text-destructive">*</span>
						</label>
						<input
							type="text"
							name="type"
							id="type"
							required
							disabled={isPending}
							defaultValue={ticket.type}
							className="w-full rounded-md border border-input bg-background px-3 py-2 text-foreground shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 sm:text-sm disabled:opacity-50"
						/>
					</div>

					<div>
						<label htmlFor="price" className="block text-sm font-medium text-foreground mb-2">
							Preț (RON) <span className="text-destructive">*</span>
						</label>
						<input
							type="number"
							name="price"
							id="price"
							required
							disabled={isPending}
							min="0"
							step="0.01"
							defaultValue={ticket.price}
							className="w-full rounded-md border border-input bg-background px-3 py-2 text-foreground shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 sm:text-sm disabled:opacity-50"
						/>
					</div>

					<div>
						<label htmlFor="features" className="block text-sm font-medium text-foreground mb-2">
							Caracteristici <span className="text-destructive">*</span>
						</label>
						<input
							type="text"
							name="features"
							id="features"
							required
							disabled={isPending}
							defaultValue={ticket.features.join(', ')}
							className="w-full rounded-md border border-input bg-background px-3 py-2 text-foreground shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 sm:text-sm disabled:opacity-50"
						/>
						<p className="mt-1 text-sm text-muted-foreground">
							Separate caracteristicile prin virgulă
						</p>
					</div>
				</div>

				<div className="flex gap-3">
					<button
						type="submit"
						disabled={isPending}
						className="mimesiss-button-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{isPending ? 'Se salvează...' : 'Salvează modificările'}
					</button>
					<button
						type="button"
						disabled={isPending}
						onClick={() => router.back()}
						className="mimesiss-button-secondary px-6 disabled:opacity-50"
					>
						Anulează
					</button>
				</div>
			</form>
		</div>
	)
}
