import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { syncUserWithDatabase } from '@/lib/auth'
import { User as UserType } from '@/types/models'
import connectDB from '@/lib/mongodb'
import { Payment, User } from '@/models'
import { FaCreditCard, FaEuroSign, FaUsers, FaCheckCircle, FaClock, FaTimes } from 'react-icons/fa'

// Payment statistics interface
interface PaymentStats {
  totalRevenue: number
  totalPayments: number
  activeTickets: number
  passiveTickets: number
  completedPayments: number
  pendingPayments: number
  failedPayments: number
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
  accessLevel: 'active' | 'passive'
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
  
  const stats: PaymentStats = {
    totalRevenue: payments
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0),
    totalPayments: payments.length,
    activeTickets: payments.filter(p => p.accessLevel === 'active' && p.status === 'completed').length,
    passiveTickets: payments.filter(p => p.accessLevel === 'passive' && p.status === 'completed').length,
    completedPayments: payments.filter(p => p.status === 'completed').length,
    pendingPayments: payments.filter(p => p.status === 'pending').length,
    failedPayments: payments.filter(p => p.status === 'failed').length,
  }

  // Fetch recent payments with user details
  const recentPayments: PaymentWithUser[] = []
  
  for (const payment of payments.slice(0, 50)) { // Get last 50 payments
    const paymentUser = await User.findOne({ clerkId: payment.clerkId }).lean()
    
    recentPayments.push({
      _id: payment._id?.toString() || '',
      clerkId: payment.clerkId || '',
      stripeSessionId: payment.stripeSessionId || '',
      stripePaymentIntentId: payment.stripePaymentIntentId,
      amount: payment.amount || 0,
      currency: payment.currency || 'RON',
      accessLevel: payment.accessLevel || 'passive',
      status: payment.status || 'pending',
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
      user: paymentUser ? {
        firstName: (paymentUser as unknown as MongoUser).firstName || '',
        lastName: (paymentUser as unknown as MongoUser).lastName || '',
        email: (paymentUser as unknown as MongoUser).email || ''
      } : undefined
    })
  }

  function formatCurrency(amount: number) {
    return new Intl.NumberFormat('ro-RO', {
      style: 'currency',
      currency: 'RON'
    }).format(amount / 100) // Convert from cents
  }

  function formatDate(date: Date) {
    return new Intl.DateTimeFormat('ro-RO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date))
  }

  function getStatusIcon(status: string) {
    switch (status) {
      case 'completed':
        return <FaCheckCircle className="h-4 w-4 text-green-500" />
      case 'pending':
        return <FaClock className="h-4 w-4 text-yellow-500" />
      case 'failed':
        return <FaTimes className="h-4 w-4 text-red-500" />
      default:
        return <FaClock className="h-4 w-4 text-muted-foreground" />
    }
  }

  function getStatusColor(status: string) {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50 border-green-200'
      case 'pending':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'failed':
        return 'text-red-600 bg-red-50 border-red-200'
      default:
        return 'text-muted-foreground bg-muted border-border'
    }
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

        <div className="bg-card p-6 rounded-lg border border-border">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FaUsers className="h-6 w-6 text-primary" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Bilete Active</p>
              <p className="text-2xl font-bold text-foreground">{stats.activeTickets}</p>
            </div>
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg border border-border">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FaUsers className="h-6 w-6 text-secondary" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Bilete Pasive</p>
              <p className="text-2xl font-bold text-foreground">{stats.passiveTickets}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Finalizate</p>
              <p className="text-xl font-bold text-green-600">{stats.completedPayments}</p>
            </div>
            <FaCheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">În așteptare</p>
              <p className="text-xl font-bold text-yellow-600">{stats.pendingPayments}</p>
            </div>
            <FaClock className="h-8 w-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Eșuate</p>
              <p className="text-xl font-bold text-red-600">{stats.failedPayments}</p>
            </div>
            <FaTimes className="h-8 w-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Recent Payments Table */}
      <div className="bg-card shadow border border-border overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-foreground">Plăți Recente</h3>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Lista tuturor plăților efectuate pentru biletele MIMESISS 2025.
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Utilizator
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Tip Bilet
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Sumă
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  ID Stripe
                </th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-border">
              {recentPayments.map((payment) => (
                <tr key={payment._id} className="hover:bg-muted/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-foreground">
                        {payment.user ? 
                          `${payment.user.firstName} ${payment.user.lastName}`.trim() || 'N/A' :
                          'N/A'
                        }
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {payment.user?.email || payment.clerkId}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      payment.accessLevel === 'active' 
                        ? 'bg-primary/10 text-primary' 
                        : 'bg-secondary/10 text-secondary'
                    }`}>
                      {payment.accessLevel === 'active' ? 'Activ' : 'Pasiv'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                    {formatCurrency(payment.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(payment.status)}`}>
                      {getStatusIcon(payment.status)}
                      <span className="ml-1 capitalize">{payment.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    {formatDate(payment.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-muted-foreground">
                    {payment.stripePaymentIntentId ? 
                      payment.stripePaymentIntentId.substring(0, 15) + '...' :
                      payment.stripeSessionId.substring(0, 15) + '...'
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

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
