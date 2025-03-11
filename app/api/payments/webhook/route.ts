import { createServerClient } from '@/lib/drizzle';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { SupabaseClient } from '@supabase/supabase-js';

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : undefined;

export async function POST(req: NextRequest) {
  console.log(`[STRIPE WEBHOOK] Received webhook request at ${new Date().toISOString()}`);
  
  if (!stripe) {
    console.error('[STRIPE WEBHOOK] Missing STRIPE_SECRET_KEY environment variable');
    return NextResponse.json({ error: 'Stripe configuration error' }, { status: 500 });
  }

  try {
    const supabase = await createServerClient();
    const reqText = await req.text();
    console.log(`[STRIPE WEBHOOK] Processing webhook request with payload size: ${reqText.length} bytes`);
    return webhooksHandler(reqText, req, supabase);
  } catch (error) {
    console.error('[STRIPE WEBHOOK] Error in webhook handler:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function getCustomerEmail(customerId: string, stripeClient: Stripe): Promise<string | null> {
  try {
    console.log(`[STRIPE WEBHOOK] Fetching customer email for customer ID: ${customerId}`);
    const customer = await stripeClient.customers.retrieve(customerId);
    const email = (customer as Stripe.Customer).email;
    console.log(`[STRIPE WEBHOOK] Customer email fetched: ${email || 'null'}`);
    return email;
  } catch (error) {
    console.error(`[STRIPE WEBHOOK] Error fetching customer with ID ${customerId}:`, error);
    return null;
  }
}

async function handleSubscriptionEvent(
  event: Stripe.Event,
  type: 'created' | 'updated' | 'deleted',
  supabase: SupabaseClient
) {
  console.log(`[STRIPE WEBHOOK] Processing subscription ${type} event: ${event.id}`);
  
  if (!stripe) {
    console.error('[STRIPE WEBHOOK] Missing STRIPE_SECRET_KEY environment variable');
    return NextResponse.json({ error: 'Stripe configuration error' }, { status: 500 });
  }

  const subscription = event.data.object as Stripe.Subscription;
  console.log(`[STRIPE WEBHOOK] Subscription ID: ${subscription.id}, Status: ${subscription.status}`);
  
  const customerEmail = await getCustomerEmail(subscription.customer as string, stripe);

  if (!customerEmail) {
    console.error(`[STRIPE WEBHOOK] Customer email could not be fetched for subscription ${subscription.id}`);
    return NextResponse.json({
      status: 500,
      error: 'Customer email could not be fetched',
    });
  }

  const subscriptionData: any = {
    subscription_id: subscription.id,
    stripe_user_id: subscription.customer,
    status: subscription.status,
    start_date: new Date(subscription.created * 1000).toISOString(),
    plan_id: subscription.items.data[0]?.price.id,
    user_id: subscription.metadata?.userId || '',
    email: customerEmail,
  };

  console.log(`[STRIPE WEBHOOK] Processing subscription with data:`, subscriptionData);

  let data, error;
  if (type === 'deleted') {
    console.log(`[STRIPE WEBHOOK] Updating subscription to cancelled: ${subscription.id}`);
    ({ data, error } = await supabase
      .from('subscriptions')
      .update({ status: 'cancelled', email: customerEmail })
      .match({ subscription_id: subscription.id })
      .select());
    
    if (!error) {
      console.log(`[STRIPE WEBHOOK] Updating user subscription to null for email: ${customerEmail}`);
      const { error: userError } = await supabase
        .from('user')
        .update({ subscription: null })
        .eq('email', customerEmail);
      
      if (userError) {
        console.error(`[STRIPE WEBHOOK] Error updating user subscription status:`, userError);
        return NextResponse.json({
          status: 500,
          error: 'Error updating user subscription status',
        });
      }
      console.log(`[STRIPE WEBHOOK] User subscription status updated to null for email: ${customerEmail}`);
    }
  } else {
    console.log(`[STRIPE WEBHOOK] ${type === 'created' ? 'Inserting' : 'Updating'} subscription: ${subscription.id}`);
    ({ data, error } = await supabase
      .from('subscriptions')
      [type === 'created' ? 'insert' : 'update'](
        type === 'created' ? [subscriptionData] : subscriptionData
      )
      .match({ subscription_id: subscription.id })
      .select());
  }

  if (error) {
    console.error(`[STRIPE WEBHOOK] Error during subscription ${type}:`, error);
    return NextResponse.json({
      status: 500,
      error: `Error during subscription ${type}`,
    });
  }

  console.log(`[STRIPE WEBHOOK] Subscription ${type} processed successfully for ID: ${subscription.id}`);
  return NextResponse.json({
    status: 200,
    message: `Subscription ${type} success`,
    data,
  });
}

async function handleInvoiceEvent(
  event: Stripe.Event,
  status: 'succeeded' | 'failed',
  supabase: SupabaseClient
) {
  console.log(`[STRIPE WEBHOOK] Processing invoice ${status} event: ${event.id}`);
  
  if (!stripe) {
    console.error('[STRIPE WEBHOOK] Missing STRIPE_SECRET_KEY environment variable');
    return NextResponse.json({ error: 'Stripe configuration error' }, { status: 500 });
  }

  const invoice = event.data.object as Stripe.Invoice;
  console.log(`[STRIPE WEBHOOK] Invoice ID: ${invoice.id}, Status: ${invoice.status}`);
  
  const customerEmail = await getCustomerEmail(invoice.customer as string, stripe);

  if (!customerEmail) {
    console.error(`[STRIPE WEBHOOK] Customer email could not be fetched for invoice ${invoice.id}`);
    return NextResponse.json({
      status: 500,
      error: 'Customer email could not be fetched',
    });
  }

  const invoiceData = {
    invoice_id: invoice.id,
    subscription_id: invoice.subscription as string,
    amount_paid: status === 'succeeded' ? invoice.amount_paid / 100 : undefined,
    amount_due: status === 'failed' ? invoice.amount_due / 100 : undefined,
    currency: invoice.currency,
    status,
    user_id: invoice.metadata?.userId,
    email: customerEmail,
  };

  console.log(`[STRIPE WEBHOOK] Inserting invoice data:`, invoiceData);

  const { data, error } = await supabase.from('invoices').insert([invoiceData]);

  if (error) {
    console.error(`[STRIPE WEBHOOK] Error inserting invoice (payment ${status}):`, error);
    return NextResponse.json({
      status: 500,
      error: `Error inserting invoice (payment ${status})`,
    });
  }

  console.log(`[STRIPE WEBHOOK] Invoice payment ${status} recorded successfully for ID: ${invoice.id}`);
  return NextResponse.json({
    status: 200,
    message: `Invoice payment ${status}`,
    data,
  });
}

async function handleCheckoutSessionCompleted(event: Stripe.Event, supabase: SupabaseClient) {
  console.log(`[STRIPE WEBHOOK] Processing checkout.session.completed event: ${event.id}`);
  
  if (!stripe) {
    console.error('[STRIPE WEBHOOK] Missing STRIPE_SECRET_KEY environment variable');
    return NextResponse.json({ error: 'Stripe configuration error' }, { status: 500 });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const metadata: any = session?.metadata;
  
  console.log(`[STRIPE WEBHOOK] Checkout session ID: ${session.id}, Customer: ${session.customer}`);
  console.log(`[STRIPE WEBHOOK] Session metadata:`, metadata);

  if (metadata?.subscription === 'true') {
    // This is for subscription payments
    const subscriptionId = session.subscription;
    console.log(`[STRIPE WEBHOOK] Processing subscription payment. Subscription ID: ${subscriptionId}`);
    
    try {
      console.log(`[STRIPE WEBHOOK] Updating subscription metadata for ID: ${subscriptionId}`);
      await stripe.subscriptions.update(subscriptionId as string, { metadata });

      console.log(`[STRIPE WEBHOOK] Updating invoice user_id to ${metadata?.userId} for email: ${metadata?.email}`);
      const { error: invoiceError } = await supabase
        .from('invoices')
        .update({ user_id: metadata?.userId })
        .eq('email', metadata?.email);
      if (invoiceError) {
        console.error(`[STRIPE WEBHOOK] Error updating invoice:`, invoiceError);
        throw new Error('Error updating invoice');
      }

      console.log(`[STRIPE WEBHOOK] Updating user subscription to ${session.id} for user ID: ${metadata?.userId}`);
      const { error: userError } = await supabase
        .from('user')
        .update({ subscription: session.id })
        .eq('user_id', metadata?.userId);
      if (userError) {
        console.error(`[STRIPE WEBHOOK] Error updating user subscription:`, userError);
        throw new Error('Error updating user subscription');
      }

      console.log(`[STRIPE WEBHOOK] Subscription metadata updated successfully for session: ${session.id}`);
      return NextResponse.json({
        status: 200,
        message: 'Subscription metadata updated successfully',
      });
    } catch (error) {
      console.error('[STRIPE WEBHOOK] Error updating subscription metadata:', error);
      return NextResponse.json({
        status: 500,
        error: 'Error updating subscription metadata',
      });
    }
  } else {
    // This is for one-time payments
    const dateTime = new Date(session.created * 1000).toISOString();
    console.log(`[STRIPE WEBHOOK] Processing one-time payment for session: ${session.id}`);
    
    try {
      console.log(`[STRIPE WEBHOOK] Fetching user data for user ID: ${metadata?.userId}`);
      const { data: user, error: userError } = await supabase
        .from('user')
        .select('*')
        .eq('user_id', metadata?.userId);
      if (userError) {
        console.error(`[STRIPE WEBHOOK] Error fetching user:`, userError);
        throw new Error('Error fetching user');
      }

      const paymentData = {
        user_id: metadata?.userId,
        stripe_id: session.id,
        email: metadata?.email,
        amount: session.amount_total! / 100,
        customer_details: JSON.stringify(session.customer_details),
        payment_intent: session.payment_intent,
        payment_time: dateTime,
        currency: session.currency,
      };

      console.log(`[STRIPE WEBHOOK] Inserting payment data:`, paymentData);
      const { data: paymentsData, error: paymentsError } = await supabase
        .from('payments')
        .insert([paymentData]);
      if (paymentsError) {
        console.error(`[STRIPE WEBHOOK] Error inserting payment:`, paymentsError);
        throw new Error('Error inserting payment');
      }
      
      const updatedCredits = Number(user?.[0]?.credits || 0) + (session.amount_total || 0) / 100;
      console.log(`[STRIPE WEBHOOK] Updating user credits to ${updatedCredits} for user ID: ${metadata?.userId}`);
      
      const { data: updatedUser, error: userUpdateError } = await supabase
        .from('user')
        .update({ credits: updatedCredits })
        .eq('user_id', metadata?.userId);
      if (userUpdateError) {
        console.error(`[STRIPE WEBHOOK] Error updating user credits:`, userUpdateError);
        throw new Error('Error updating user credits');
      }

      console.log(`[STRIPE WEBHOOK] Payment and credits updated successfully for session: ${session.id}`);
      return NextResponse.json({
        status: 200,
        message: 'Payment and credits updated successfully',
        updatedUser,
      });
    } catch (error) {
      console.error('[STRIPE WEBHOOK] Error handling checkout session:', error);
      return NextResponse.json({
        status: 500,
        error,
      });
    }
  }
}

async function webhooksHandler(
  reqText: string,
  request: NextRequest,
  supabase: SupabaseClient
): Promise<NextResponse> {
  if (!stripe) {
    console.error('[STRIPE WEBHOOK] Missing STRIPE_SECRET_KEY environment variable');
    return NextResponse.json({ error: 'Stripe configuration error' }, { status: 500 });
  }

  // Get the webhook secret
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!secret) {
    console.error('[STRIPE WEBHOOK] Missing STRIPE_WEBHOOK_SECRET environment variable');
    return NextResponse.json(
      { error: 'Webhook secret not configured properly' },
      { status: 500 }
    );
  }

  // Get the signature from the header
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    console.error('[STRIPE WEBHOOK] Missing stripe-signature header');
    return NextResponse.json({ error: 'Missing signature header' }, { status: 400 });
  }

  // Construct the event
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(reqText, signature, secret);
    console.log(`[STRIPE WEBHOOK] Successfully constructed event: ${event.id}, Type: ${event.type}`);
  } catch (error: any) {
    console.error('[STRIPE WEBHOOK] Error constructing webhook event:', error.message);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  console.log(`[STRIPE WEBHOOK] Received event type: ${event.type}`);

  // Handle the events
  try {
    switch (event.type) {
      case 'customer.subscription.created':
        console.log(`[STRIPE WEBHOOK] Processing customer.subscription.created event: ${event.id}`);
        return await handleSubscriptionEvent(event, 'created', supabase);
      case 'customer.subscription.updated':
        console.log(`[STRIPE WEBHOOK] Processing customer.subscription.updated event: ${event.id}`);
        return await handleSubscriptionEvent(event, 'updated', supabase);
      case 'customer.subscription.deleted':
        console.log(`[STRIPE WEBHOOK] Processing customer.subscription.deleted event: ${event.id}`);
        return await handleSubscriptionEvent(event, 'deleted', supabase);
      case 'invoice.payment_succeeded':
        console.log(`[STRIPE WEBHOOK] Processing invoice.payment_succeeded event: ${event.id}`);
        return await handleInvoiceEvent(event, 'succeeded', supabase);
      case 'invoice.payment_failed':
        console.log(`[STRIPE WEBHOOK] Processing invoice.payment_failed event: ${event.id}`);
        return await handleInvoiceEvent(event, 'failed', supabase);
      case 'checkout.session.completed':
        console.log(`[STRIPE WEBHOOK] Processing checkout.session.completed event: ${event.id}`);
        return await handleCheckoutSessionCompleted(event, supabase);
      default:
        console.log(`[STRIPE WEBHOOK] Unhandled event type: ${event.type}`);
        return NextResponse.json(
          { received: true, event: event.type },
          { status: 200 }
        );
    }
  } catch (error) {
    console.error(`[STRIPE WEBHOOK] Error processing event ${event.type}:`, error);
    return NextResponse.json(
      { error: 'Error processing event' },
      { status: 500 }
    );
  }
}
