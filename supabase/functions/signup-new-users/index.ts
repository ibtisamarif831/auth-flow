import { serve } from 'https://deno.land/std@0.182.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.14.0';
import Stripe from 'https://esm.sh/stripe@12.1.1?target=deno'



const stripe = new Stripe(Deno.env.get('STRIPE_API_KEY') as string, {
  // This is needed to use the Fetch API rather than relying on the Node http
  // package.
  apiVersion: '2024-12-18.acacia',
  httpClient: Stripe.createFetchHttpClient(),
})


export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    if (req.method !== 'POST') {
      console.log('Method not allowed. Use POST.');
      throw new Error('Method not allowed. Use POST.');
    }

    // Parse the request body to get the promo code
    const { email, password, referrer_promo } = await req.json();
    if (email.length === 0 || password.length === 0) {
      console.log('Missing email or password in request body.');
      throw new Error('Missing email or password in request body.');
    }




    // Create Supabase client
    const supabaseAdmin = await createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )





    let userId: string;
    const { data: existingUser, error: existingUserError } = await supabaseAdmin
      .from('users').select('*')
      .eq('email', email)
      .single();
    console.log(existingUser)

    if (existingUser) {
      // User already exists
      userId = existingUser.id;
      if (existingUser.subscription_status === 'active' || existingUser.external_active === 'active') {
        console.log('User already has an active subscription.');
        return new Response(
          JSON.stringify({
            success: false,
            error: "Du hast bereits ein aktives Abo",
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
          }
        );
      }
    } else {
      // User doesn't exist, sign them up
      const { data: signUpData, error: signUpError } = await supabaseAdmin.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        throw new Error(signUpError.message);
      }

      userId = signUpData?.user?.id;
    }
    // create stripe checkout page 
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'paypal', "sepa_debit"],
      line_items: [
        {
          price: Deno.env.get('STRIPE_PRICE_ID_YEARLY') ?? '',
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: "https://www.theosis-app.com/de/payment-success",
      cancel_url: "https://www.theosis-app.com/de",
      metadata: {
        user_id: userId,

      },
    });


    // Return promo code details
    return new Response(
      JSON.stringify({
        success: true,
        data: {
          url: session.url,
        },
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
