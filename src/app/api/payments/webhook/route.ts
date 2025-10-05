import { NextRequest, NextResponse } from 'next/server';
import { constructEvent } from '@/lib/stripe';
import connectDB from '@/lib/mongodb';
import { Payment, User } from '@/models';
import { AccessLevel } from '@/types/models';

export async function POST(req: NextRequest) {
  console.log('🔥 Webhook received!', new Date().toISOString());
  
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  console.log('Webhook details:', {
    hasBody: !!body,
    bodyLength: body.length,
    hasSignature: !!signature,
    headers: Object.fromEntries(req.headers.entries())
  });

  if (!signature) {
    console.error('❌ No Stripe signature found');
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event;

  try {
    event = constructEvent(body, signature);
    console.log('✅ Webhook signature verified, event type:', event.type);
  } catch (err) {
    console.error('❌ Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  await connectDB();

  switch (event.type) {

    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object;
      
      try {
        // Extract metadata from the payment intent
        const clerkId = paymentIntent.metadata?.clerkId;
        const accessLevel = paymentIntent.metadata?.accessLevel as AccessLevel;
        const userName = paymentIntent.metadata?.userName;
        const userEmail = paymentIntent.metadata?.userEmail;
        const userType = paymentIntent.metadata?.userType;
        const eventName = paymentIntent.metadata?.eventName;
        const eventLocation = paymentIntent.metadata?.eventLocation;

        if (!clerkId || !accessLevel) {
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
            accessLevel,
            amount: paymentIntent.amount,
            currency: paymentIntent.currency.toUpperCase(),
            status: 'completed',
            metadata: {
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
          await payment.save();
        }

        // Update user's access level
        const user = await User.findOne({ clerkId });
        if (user) {
          user.accessLevel = accessLevel;
          await user.save();
        }

        console.log('PaymentIntent completed successfully:', {
          paymentIntentId: paymentIntent.id,
          clerkId,
          accessLevel,
          amount: paymentIntent.amount
        });

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

  return NextResponse.json({ received: true });
}

// Disable body parsing to get raw body for webhook verification
export const runtime = 'nodejs';