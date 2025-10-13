import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { stripe } from '@/lib/stripe';
import connectDB from '@/lib/mongodb';
import { Payment, Ticket } from '@/models';
import { User } from '@/models';
import { User as UserInterface, Ticket as TicketInterface } from '@/types/models';

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    // Connect to database
    await connectDB();

    const userData = await User.findOne({ clerkId: user.id }).lean() as UserInterface | null;

    const data = await req.json();

    const { ticketId } = data;

    console.log('Request data:', { data });

    if (!ticketId) {
      return NextResponse.json({ error: 'Ticket ID is required' }, { status: 400 });
    }

    // Get ticket details from database
    const ticket = await Ticket.findById(ticketId).lean() as TicketInterface | null;

    if (!ticket) {
      return NextResponse.json({ error: 'Invalid ticket type' }, { status: 400 });
    }

    // Check if user already has a completed payment for this ticket type
    const existingPayment = await Payment.findOne({
      clerkId: user.id,
      ticketType: ticket.type,
      status: 'completed'
    });

    if (existingPayment) {
      return NextResponse.json({
        error: 'Aveți deja un bilet de acest tip'
      }, { status: 400 });
    }

    // Create PaymentIntent with customer data
    // Convert price from RON to bani (cents) - multiply by 100
    const amountInBani = Math.round(ticket.price * 100);
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInBani,
      currency: 'ron',
      description: `${ticket.title} - MIMESISS 2025`,
      receipt_email: userData?.email || '',
      metadata: {
        clerkId: user.id,
        ticketId: ticket._id?.toString() || ticketId,
        ticketType: ticket.type,
        ticketTitle: ticket.title,
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
