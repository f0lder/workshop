'use client'

import { FaCreditCard, FaEuroSign, FaTicketAlt } from 'react-icons/fa'
import PaymentsList from '@/components/PaymentsList'

// Define the types again here or import them from a shared types file
interface PaymentStats {
	totalRevenue: number
	totalPayments: number
	ticketTypeCounts: Record<string, number>
}

interface PaymentWithUser {
	_id: string
	clerkId: string
	stripeSessionId: string
	stripePaymentIntentId?: string
	amount: number
	currency: string
	accessLevel: string
	ticketId: string
	ticketType: string
	status: 'pending' | 'completed' | 'failed' | 'refunded'
	createdAt: Date
	updatedAt: Date
	user?: {
		firstName: string
		lastName: string
		email: string
	}
}

interface PaymentsClientProps {
	stats: PaymentStats
	payments: PaymentWithUser[]
}

export default function PaymentsClient({ stats, payments }: PaymentsClientProps) {

	// 1. Move the currency formatter
	function formatCurrency(amount: number) {
		return new Intl.NumberFormat('ro-RO', {
			style: 'currency',
			currency: 'RON'
		}).format(amount / 100) // Convert from cents
	}

	// 2. Implement the downloadCSV function
	function downloadCSV() {
		const headers = [
			"ID Plata", "Data Creare", "Status", "Nume", "Prenume", "Email",
			"Tip Bilet", "Suma (RON)", "Moneda", "ID Sesiune Stripe", "ID Plata Stripe"
		];

		// Helper to safely wrap values in quotes if they contain commas
		const escapeCSV = (str: string | undefined | null) => {
			if (str == null) return '';
			const s = String(str);
			if (s.includes(',') || s.includes('"') || s.includes('\n')) {
				return `"${s.replace(/"/g, '""')}"`;
			}
			return s;
		};

		const rows = payments.map(p => {
			const row = [
				escapeCSV(p._id),
				escapeCSV(new Date(p.createdAt).toLocaleString('ro-RO')),
				escapeCSV(p.status),
				escapeCSV(p.user?.lastName),
				escapeCSV(p.user?.firstName),
				escapeCSV(p.user?.email),
				escapeCSV(p.ticketType || p.accessLevel), // Use combined logic
				String(p.amount / 100), // Raw number for CSV
				escapeCSV(p.currency),
				escapeCSV(p.stripeSessionId),
				escapeCSV(p.stripePaymentIntentId)
			];
			return row.join(',');
		});

		const csvContent = [headers.join(','), ...rows].join('\n');

		// Add BOM for proper UTF-8 handling in Excel
		const bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
		const blob = new Blob([bom, csvContent], { type: 'text/csv;charset=utf-8;' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');

		link.setAttribute('href', url);
		link.setAttribute('download', 'raport-plati-mimesiss-2025.csv');
		document.body.appendChild(link);
		link.click();

		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	}

	// 3. Move all JSX here
	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-2xl font-bold text-foreground">Gestionare Plăți</h1>
					<p className="mt-1 text-sm text-muted-foreground">
						Monitorizați și gestionați toate plățile pentru biletele MIMESISS 2025.
					</p>
					{/* 4. Add onClick handler to the button */}
					<button
						type='button'
						onClick={downloadCSV}
						className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
					>
						Descarca Raport Plăți
					</button>
				</div>
			</div>

			{/* Statistics Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				<div className="bg-card p-6 rounded-lg border border-border">
					<div className="flex items-center">
						<div className="flex-shrink-0">
							<FaEuroSign className="h-6 w-6 text-primary" />
						</div>
						<div className="ml-4">
							<p className="text-sm font-medium text-muted-foreground">Venituri Totale</p>
							<p className="text-2xl font-bold text-foreground">{formatCurrency(stats.totalRevenue)}</p>
						</div>
					</div>
				</div>

				<div className="bg-card p-6 rounded-lg border border-border">
					<div className="flex items-center">
						<div className="flex-shrink-0">
							<FaCreditCard className="h-6 w-6 text-primary" />
						</div>
						<div className="ml-4">
							<p className="text-sm font-medium text-muted-foreground">Total Plăți</p>
							<p className="text-2xl font-bold text-foreground">{stats.totalPayments}</p>
						</div>
					</div>
				</div>

				{/* Dynamic Ticket Type Cards */}
				{Object.entries(stats.ticketTypeCounts)
					.sort(([a], [b]) => a.localeCompare(b))
					.map(([ticketType, count]) => (
						<div key={ticketType} className="bg-card p-6 rounded-lg border border-border">
							<div className="flex items-center">
								<div className="flex-shrink-0">
									<FaTicketAlt className="h-6 w-6 text-primary" />
								</div>
								<div className="ml-4">
									<p className="text-sm font-medium text-muted-foreground capitalize">
										Bilete {ticketType}
									</p>
									<p className="text-2xl font-bold text-foreground">{count}</p>
								</div>
							</div>
						</div>
					))}
			</div>


			{/* Recent Payments Table */}
			<div className="bg-card shadow border border-border overflow-hidden sm:rounded-lg">
				<div className="px-4 py-5 sm:px-6">
					<h3 className="text-lg leading-6 font-medium text-foreground">Plăți Recente</h3>
					<p className="mt-1 max-w-2xl text-sm text-muted-foreground">
						Lista tuturor plăților efectuate pentru biletele MIMESISS 2025.
					</p>
				</div>

				<PaymentsList payments={payments} />

				{payments.length === 0 && (
					<div className="text-center py-12">
						<FaCreditCard className="mx-auto h-12 w-12 text-muted-foreground" />
						<h3 className="mt-2 text-sm font-medium text-foreground">Nicio plată</h3>
						<p className="mt-1 text-sm text-muted-foreground">
							Nu există încă plăți înregistrate în sistem.
						</p>
					</div>
				)}
			</div>
		</div>
	)
}