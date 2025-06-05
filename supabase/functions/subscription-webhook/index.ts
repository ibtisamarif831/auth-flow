// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Import via bare specifier thanks to the import_map.json file.
import Stripe from 'https://esm.sh/stripe@11.1.0?target=deno'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.14.0';

const stripe = new Stripe(Deno.env.get('STRIPE_API_KEY') as string, {
  // This is needed to use the Fetch API rather than relying on the Node http
  // package.
  apiVersion: '2024-06-20',
  httpClient: Stripe.createFetchHttpClient(),
})

// This is needed in order to use the Web Crypto API in Deno.
const cryptoProvider = Stripe.createSubtleCryptoProvider()


export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (request) => {
  const signature = request.headers.get('Stripe-Signature')

  // First step is to verify the event. The .text() method must be used as the
  // verification relies on the raw request body rather than the parsed JSON.

  const body = await request.text()
  let receivedEvent
  try {
    receivedEvent = await stripe.webhooks.constructEventAsync(
      body,
      signature!,
      Deno.env.get('STRIPE_WEBHOOK_SIGNING_SECRET') ?? '',
      undefined,
      cryptoProvider
    )
  } catch (err) {
    return new Response(err.message, { status: 400 })
  }


  const supabaseAdmin = await createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )
  switch (receivedEvent.type) {

    case 'checkout.session.async_payment_failed':
      const checkoutSessionAsyncPaymentFailed = receivedEvent.data.object;
      return new Response(JSON.stringify({ ok: true }), { status: 200 })
      // Then define and call a function to handle the receivedEvent checkout.session.async_payment_failed
      break;
    case 'checkout.session.async_payment_succeeded':
      const checkoutSessionAsyncPaymentSucceeded = receivedEvent.data.object;
      console.log(checkoutSessionAsyncPaymentSucceeded)
      await supabaseAdmin.from('users').update({
        transaction_id: checkoutSessionAsyncPaymentSucceeded.id,
        purchase_date: new Date(checkoutSessionAsyncPaymentSucceeded.created * 1000),
        external_active: 'active',
        subscription_plan: "theosis-yearly",
        customer_id: checkoutSessionAsyncPaymentSucceeded.customer,
      }).eq('id', checkoutSessionAsyncPaymentSucceeded.metadata.user_id)
      return new Response(JSON.stringify({ ok: true }), { status: 200 })


    case 'checkout.session.completed':
      const checkoutSessionCompleted = receivedEvent.data.object;
      console.log(checkoutSessionCompleted)
      await supabaseAdmin.from('users').update({
        transaction_id: checkoutSessionCompleted.id,
        purchase_date: new Date(checkoutSessionCompleted.created * 1000),
        external_active: 'active',
        subscription_plan: "theosis-yearly",
        customer_id: checkoutSessionCompleted.customer,

      }).eq('id', checkoutSessionCompleted.metadata.user_id)
      return new Response(JSON.stringify({ ok: true }), { status: 200 })

    case 'customer.subscription.deleted':
      const customerSubscriptionDeleted = receivedEvent.data.object;
      console.log(customerSubscriptionDeleted)
      await supabaseAdmin.from('users').update({
        external_active: 'inactive',
        subscription_plan: null,
      }).eq('customer_id', customerSubscriptionDeleted.customer)
      return new Response(JSON.stringify({ ok: true }), { status: 200 })



    case 'checkout.session.expired':
      const checkoutSessionExpired = receivedEvent.data.object;
      return new Response(JSON.stringify({ ok: true }), { status: 200 })

    // Then define and call a function to handle the receivedEvent checkout.session.expired
    // ... handle other receivedEvent types
    //  TODO: Handle other receivedEvent types

    default:
      console.log(`Unhandled receivedEvent type ${receivedEvent.type}`);

  }
})