import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { stripe } from '@/lib/stripe';
import { TICKET_PRICES, TicketType } from '@/lib/pricing';
import connectDB from '@/lib/mongodb';
import { Payment } from '@/models';
import { getUser } from '@/app/dashboard/profile/actions';

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userData = await getUser(user.id);
    const { accessLevel } = await req.json() as { accessLevel: TicketType };

    if (!accessLevel || !TICKET_PRICES[accessLevel]) {
      return NextResponse.json({ error: 'Invalid ticket type' }, { status: 400 });
    }

    const ticketDetails = TICKET_PRICES[accessLevel];

    // Connect to database
    await connectDB();

    // Check if user already has a completed payment for this access level
    const existingPayment = await Payment.findOne({
      clerkId: user.id,
      accessLevel,
      status: 'completed'
    });

    if (existingPayment) {
      return NextResponse.json({ 
        error: 'Aveți deja un bilet de acest tip' 
      }, { status: 400 });
    }

    // Create PaymentIntent with customer data
    const paymentIntent = await stripe.paymentIntents.create({
      amount: ticketDetails.price,
      currency: 'ron',
      description: `${ticketDetails.name} - MIMESISS 2025`,
      receipt_email: userData?.email || '',
      metadata: {
        clerkId: user.id,
        accessLevel,
        userName: `${user.firstName} ${user.lastName}`.trim(),
        userEmail: userData?.email || '',
        userType: userData?.userType || 'student',
        eventName: 'MIMESISS 2025',
        eventLocation: 'București, România',
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // Payment record will be created only when payment succeeds via webhook
    return NextResponse.json({ 
      clientSecret: paymentIntent.client_secret 
    });

  } catch (error) {
    console.error('Error creating PaymentIntent:', error);
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}
