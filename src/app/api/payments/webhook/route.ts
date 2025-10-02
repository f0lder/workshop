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
        // Find the payment record
        const payment = await Payment.findOne({
          stripeSessionId: session.id
        });

        if (!payment) {
          console.error('Payment not found for session:', session.id);
          return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
        }

        // Update payment status
        payment.status = 'completed';
        payment.stripePaymentIntentId = session.payment_intent as string;
        await payment.save();

        // Update user's access level
        const user = await User.findOne({ clerkId: payment.clerkId });
        if (user) {
          user.accessLevel = payment.accessLevel as AccessLevel;
          await user.save();
        }

        console.log('Payment completed successfully:', {
          sessionId: session.id,
          clerkId: payment.clerkId,
          accessLevel: payment.accessLevel
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
        // Find the payment record by PaymentIntent ID
        const payment = await Payment.findOne({
          stripePaymentIntentId: paymentIntent.id
        });

        if (!payment) {
          console.error('Payment not found for PaymentIntent:', paymentIntent.id);
          return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
        }

        // Update payment status
        payment.status = 'completed';
        await payment.save();

        // Update user's access level
        const user = await User.findOne({ clerkId: payment.clerkId });
        if (user) {
          user.accessLevel = payment.accessLevel as AccessLevel;
          await user.save();
        }

        console.log('PaymentIntent completed successfully:', {
          paymentIntentId: paymentIntent.id,
          clerkId: payment.clerkId,
          accessLevel: payment.accessLevel
        });

      } catch (error) {
        console.error('Error processing completed PaymentIntent:', error);
        return NextResponse.json({ error: 'Processing failed' }, { status: 500 });
      }
      break;
    }

    case 'checkout.session.expired': {
      const session = event.data.object;
      
      try {
        // Mark payment as failed
        await Payment.findOneAndUpdate(
          { stripeSessionId: session.id },
          { status: 'failed' }
        );
      } catch (error) {
        console.error('Error processing expired session:', error);
      }
      break;
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object;
      
      try {
        // Mark payment as failed
        await Payment.findOneAndUpdate(
          { stripePaymentIntentId: paymentIntent.id },
          { status: 'failed' }
        );
      } catch (error) {
        console.error('Error processing failed payment:', error);
      }
      break;
    }

    default:
      console.log('Unhandled event type:', event.type);
  }

  return NextResponse.json({ received: true });
}

// Disable body parsing to get raw body for webhook verification
export const runtime = 'nodejs';