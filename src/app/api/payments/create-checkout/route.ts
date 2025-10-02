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

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'ron',
            product_data: {
              name: ticketDetails.name,
              description: ticketDetails.description,
              images: [`${process.env.NEXT_PUBLIC_BASE_URL}/icons/logo.png`],
            },
            unit_amount: ticketDetails.price,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/cancel`,
      customer_email: user.emailAddresses[0]?.emailAddress,
      metadata: {
        clerkId: user.id,
        accessLevel,
        userName: `${user.firstName} ${user.lastName}`.trim(),
      },
    });

    // Payment record will be created only when payment succeeds via webhook

    return NextResponse.json({ 
      sessionId: session.id,
      url: session.url 
    });

  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}