import { NextRequest, NextResponse } from 'next/server';
import { constructEvent } from '@/lib/stripe';
import connectDB from '@/lib/mongodb';
import { Payment, User } from '@/models';
import { AccessLevel } from '@/types/models';

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
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  await connectDB();

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      
      try {
        // Extract metadata from the session
        const clerkId = session.metadata?.clerkId;
        const accessLevel = session.metadata?.accessLevel as AccessLevel;
        const userName = session.metadata?.userName;

        if (!clerkId || !accessLevel) {
          console.error('Missing required metadata in session:', session.id);
          return NextResponse.json({ error: 'Missing metadata' }, { status: 400 });
        }

        // Check if payment record already exists (avoid duplicates)
        let payment = await Payment.findOne({
          stripeSessionId: session.id
        });

        if (!payment) {
          // Create new payment record only on successful payment
          payment = new Payment({
            clerkId,
            stripeSessionId: session.id,
            stripePaymentIntentId: session.payment_intent as string,
            amount: session.amount_total || 0,
            currency: session.currency || 'ron',
            accessLevel,
            status: 'completed',
            metadata: {
              sessionUrl: session.url || '',
              userName: userName || '',
            }
          });
          await payment.save();
        } else {
          // Update existing payment record
          payment.status = 'completed';
          payment.stripePaymentIntentId = session.payment_intent as string;
          await payment.save();
        }

        // Update user's access level
        const user = await User.findOne({ clerkId });
        if (user) {
          user.accessLevel = accessLevel;
          await user.save();
        }

        console.log('Payment completed successfully:', {
          sessionId: session.id,
          clerkId,
          accessLevel,
          amount: session.amount_total
        });

      } catch (error) {
        console.error('Error processing completed payment:', error);
        return NextResponse.json({ error: 'Processing failed' }, { status: 500 });
      }
      break;
    }

    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object;
      
      try {
        // Extract metadata from the payment intent
        const clerkId = paymentIntent.metadata?.clerkId;
        const accessLevel = paymentIntent.metadata?.accessLevel as AccessLevel;
        const userName = paymentIntent.metadata?.userName;

        if (!clerkId || !accessLevel) {
          console.error('Missing required metadata in PaymentIntent:', paymentIntent.id);
          return NextResponse.json({ error: 'Missing metadata' }, { status: 400 });
        }

        // Check if payment record already exists (avoid duplicates)
        let payment = await Payment.findOne({
          stripePaymentIntentId: paymentIntent.id
        });

        if (!payment) {
          // Create new payment record only on successful payment
          payment = new Payment({
            clerkId,
            stripeSessionId: paymentIntent.id, // Using PaymentIntent ID as session reference
            stripePaymentIntentId: paymentIntent.id,
            amount: paymentIntent.amount,
            currency: paymentIntent.currency,
            accessLevel,
            status: 'completed',
            metadata: {
              paymentIntentId: paymentIntent.id,
              userName: userName || '',
            }
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

    case 'checkout.session.expired': {
      const session = event.data.object;
      console.log('Checkout session expired:', session.id);
      // No payment record to update since we only create them on success
      break;
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object;
      console.log('Payment intent failed:', paymentIntent.id);
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