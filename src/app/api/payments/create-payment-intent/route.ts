import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { stripe } from '@/lib/stripe';
import { TICKET_PRICES, TicketType } from '@/lib/pricing';
import connectDB from '@/lib/mongodb';
import { Payment } from '@/models';

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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

    // Create PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: ticketDetails.price,
      currency: 'ron',
      description: `${ticketDetails.name} - MIMESISS 2025`,
      metadata: {
        clerkId: user.id,
        accessLevel,
        userName: `${user.firstName} ${user.lastName}`.trim(),
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // Save payment record to database
    const payment = new Payment({
      clerkId: user.id,
      stripeSessionId: paymentIntent.id, // Using PaymentIntent ID as session ID
      stripePaymentIntentId: paymentIntent.id,
      amount: ticketDetails.price,
      currency: 'ron',
      accessLevel,
      status: 'pending',
      metadata: {
        paymentIntentId: paymentIntent.id,
        userName: `${user.firstName} ${user.lastName}`.trim(),
      }
    });

    await payment.save();

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