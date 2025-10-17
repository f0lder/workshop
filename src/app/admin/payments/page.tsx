import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { syncUserWithDatabase } from '@/lib/auth'
import { User as UserType } from '@/types/models'
import connectDB from '@/lib/mongodb'
import { Payment, User } from '@/models'
import { FaCreditCard, FaEuroSign, FaTicketAlt } from 'react-icons/fa'
import PaymentsList from '@/components/PaymentsList'

// Payment statistics interface
interface PaymentStats {
  totalRevenue: number
  totalPayments: number
  completedPayments: number
  pendingPayments: number
  failedPayments: number
  ticketTypeCounts: Record<string, number>
}

// User data interface from MongoDB
interface MongoUser {
  _id: unknown
  clerkId: string
  firstName?: string
  lastName?: string
  email: string
  role: string
  accessLevel: string
  __v: number
}

// Enhanced payment interface with user details
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

export default async function PaymentsPage() {
  const clerkUser = await currentUser()

  if (!clerkUser) {
    redirect('/auth/login')
  }

  // Sync user and check if admin
  const user: UserType = await syncUserWithDatabase(clerkUser)

  if (user.role !== 'admin') {
    redirect('/unauthorized')
  }

  await connectDB()

  // Fetch payment statistics
  const payments = await Payment.find({}).sort({ createdAt: -1 }).lean()

  // Group payments by ticket type for dynamic counting
  // Count both old payments (accessLevel) and new payments (ticketType)
  const ticketTypeCounts = payments
    .filter(p => p.status === 'completed')
    .reduce((acc, p) => {
      // For new ticket system: use ticketType
      // For old ticket system: use accessLevel (active/passive)
      // This ensures both are counted separately
      if (p.ticketType) {
        acc[p.ticketType] = (acc[p.ticketType] || 0) + 1
      } else if (p.accessLevel) {
        acc[p.accessLevel] = (acc[p.accessLevel] || 0) + 1
      } else {
        acc['unknown'] = (acc['unknown'] || 0) + 1
      }
      return acc
    }, {} as Record<string, number>)

  const stats: PaymentStats = {
    totalRevenue: payments
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0),
    totalPayments: payments.length,
    completedPayments: payments.filter(p => p.status === 'completed').length,
    pendingPayments: payments.filter(p => p.status === 'pending').length,
    failedPayments: payments.filter(p => p.status === 'failed').length,
    ticketTypeCounts,
  }


  // Fetch all payments with user details - OPTIMIZED to prevent N+1 query
  const allPaymentsData = payments // No slice, send all

  // Get all unique clerkIds from all payments
  const allClerkIds = [...new Set(allPaymentsData.map(p => p.clerkId))]

  // Fetch all users in one query instead of one per payment
  const users = await User.find({ clerkId: { $in: allClerkIds } }).lean()

  // Create a map for O(1) lookup
  const userMap = new Map(users.map(u => [u.clerkId, u]))

  const recentPayments: PaymentWithUser[] = allPaymentsData.map(payment => {
    const paymentUser = userMap.get(payment.clerkId)
    return {
      _id: payment._id?.toString() || '',
      clerkId: payment.clerkId || '',
      stripeSessionId: payment.stripeSessionId || '',
      stripePaymentIntentId: payment.stripePaymentIntentId,
      amount: payment.amount || 0,
      currency: payment.currency || 'RON',
      accessLevel: payment.accessLevel || 'passive',
      ticketId: payment.ticketId || '',
      ticketType: payment.ticketType || '',
      status: payment.status || 'pending',
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
      user: paymentUser ? {
        firstName: (paymentUser as unknown as MongoUser).firstName || '',
        lastName: (paymentUser as unknown as MongoUser).lastName || '',
        email: (paymentUser as unknown as MongoUser).email || ''
      } : undefined
    }
  })

  function formatCurrency(amount: number) {
    return new Intl.NumberFormat('ro-RO', {
      style: 'currency',
      currency: 'RON'
    }).format(amount / 100) // Convert from cents
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Gestionare Plăți</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Monitorizați și gestionați toate plățile pentru biletele MIMESISS 2025.
          </p>
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

        <PaymentsList payments={recentPayments} />

        {recentPayments.length === 0 && (
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
