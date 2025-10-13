import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import connectDB from '@/lib/mongodb'
import { Payment, User } from '@/models'

export async function DELETE(req: NextRequest) {
  try {
    const clerkUser = await currentUser()

    if (!clerkUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    // Check if user is admin
    const user = await User.findOne({ clerkId: clerkUser.id })
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 })
    }

    const { paymentId } = await req.json()

    if (!paymentId) {
      return NextResponse.json({ error: 'Payment ID is required' }, { status: 400 })
    }

    // Find and delete the payment
    const payment = await Payment.findById(paymentId)

    if (!payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 })
    }

    // Optionally, update the user's access level if this was their only completed payment
    if (payment.status === 'completed') {
      const userPayments = await Payment.find({
        clerkId: payment.clerkId,
        status: 'completed',
        _id: { $ne: paymentId } // Exclude the current payment
      })

      // If user has no other completed payments, reset their access level
      if (userPayments.length === 0) {
        const paymentUser = await User.findOne({ clerkId: payment.clerkId })
        if (paymentUser) {
          paymentUser.accessLevel = 'unpaid'
          await paymentUser.save()
        }
      }
    }

    // Delete the payment
    await Payment.findByIdAndDelete(paymentId)

    return NextResponse.json({ 
      success: true, 
      message: 'Payment deleted successfully' 
    })

  } catch (error) {
    console.error('Error deleting payment:', error)
    return NextResponse.json(
      { error: 'Failed to delete payment' },
      { status: 500 }
    )
  }
}
