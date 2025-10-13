import { NextRequest, NextResponse } from 'next/server';
import { constructEvent } from '@/lib/stripe';
import connectDB from '@/lib/mongodb';
import { Payment, User } from '@/models';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event;

  try {
    event = constructEvent(body, signature);
  } catch (err) {
    console.error('Webhook signature verification failed:', {
      error: err instanceof Error ? err.message : 'Unknown error',
      hasWebhookSecret: !!process.env.STRIPE_WEBHOOK_SECRET,
      webhookSecretLength: process.env.STRIPE_WEBHOOK_SECRET?.length || 0,
      signatureHeader: signature.substring(0, 20) + '...',
      bodyLength: body.length
    });
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  await connectDB();

  switch (event.type) {

    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object;
      
      try {
        // Extract metadata from the payment intent
        const clerkId = paymentIntent.metadata?.clerkId;
        const ticketId = paymentIntent.metadata?.ticketId;
        const ticketType = paymentIntent.metadata?.ticketType;
        const ticketTitle = paymentIntent.metadata?.ticketTitle;
        const userName = paymentIntent.metadata?.userName;
        const userEmail = paymentIntent.metadata?.userEmail;
        const userType = paymentIntent.metadata?.userType;
        const eventName = paymentIntent.metadata?.eventName;
        const eventLocation = paymentIntent.metadata?.eventLocation;

        if (!clerkId || !ticketId || !ticketType) {
          console.error('Missing required metadata in PaymentIntent:', paymentIntent.id);
          return NextResponse.json({ error: 'Missing metadata' }, { status: 400 });
        }

        // Check if payment record already exists (avoid duplicates)
        let payment = await Payment.findOne({
          stripePaymentIntentId: paymentIntent.id
        });

        if (!payment) {
          // Create new payment record with correct schema fields
          payment = new Payment({
            clerkId,
            stripeSessionId: paymentIntent.id, // Required field - use PaymentIntent ID
            stripePaymentIntentId: paymentIntent.id,
            ticketId,
            ticketType,
            accessLevel: ticketType, // Keep for backward compatibility
            amount: paymentIntent.amount,
            currency: paymentIntent.currency.toUpperCase(),
            status: 'completed',
            metadata: {
              ticketTitle: ticketTitle || '',
              userName: userName || '',
              userEmail: userEmail || '',
              userType: userType || 'student',
              eventName: eventName || 'MIMESISS 2025',
              eventLocation: eventLocation || 'București, România',
            },
          });
          await payment.save();
        } else {
          // Update existing payment record
          payment.status = 'completed';
          payment.ticketId = ticketId;
          payment.ticketType = ticketType;
          await payment.save();
        }

        // Update user's access level with ticket type
        const user = await User.findOne({ clerkId });
        if (user) {
          user.accessLevel = ticketType;
          await user.save();
        }

      } catch (error) {
        console.error('Error processing completed PaymentIntent:', error);
        return NextResponse.json({ error: 'Processing failed' }, { status: 500 });
      }
      break;
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object;
      console.log('PaymentIntent failed:', {
        paymentIntentId: paymentIntent.id,
        clerkId: paymentIntent.metadata?.clerkId,
        amount: paymentIntent.amount,
        lastPaymentError: paymentIntent.last_payment_error?.message
      });
      // No payment record to update since we only create them on success
      break;
    }

    default:
      console.log('Unhandled event type:', event.type);
  }

  return NextResponse.json({ received: true }, { 
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    }
  });
}

// Disable body parsing to get raw body for webhook verification
export const runtime = 'nodejs';

// Explicitly handle OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Allow': 'POST',
      'Content-Type': 'application/json',
    },
  });
}