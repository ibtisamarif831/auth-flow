import { serve } from 'https://deno.land/std@0.182.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.14.0';

console.log(`Function "verify-promo" is up and running!`);

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
    const { promo_code } = await req.json();
    if (!promo_code) {
      console.log('Missing promo_code in request body.');
      throw new Error('Missing promo_code in request body.');
    }

    // Create Supabase client
    const supabaseAdmin = await createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Fetch the promo code details from the database
    const { data: promo, error } = await supabaseAdmin
      .from('promo_codes')
      .select('id, code, discount, subscription_id,subscription_android_id, expiry_date')
      .eq('code', promo_code)
      .single();

    if (!promo) {
      console.log('Invalid or expired promo code.');
      throw new Error('Invalid or expired promo code.');
    }

    // Check if the promo code is active and not expired
    // const now = new Date();
    // if (promo.expires_at && new Date(promo.expires_at) < now) {
    //   throw new Error('Promo code is either inactive or expired.');
    // }

    // Return promo code details
    return new Response(
      JSON.stringify({
        success: true,
        data: {
          id: promo.id,
          code: promo.code,
          discount_percentage: promo.discount,
          subscription_id: promo.subscription_id,
          subscription_android_id: promo.subscription_android_id,
        },
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.log('Error in get-promo-code function:', error.message);
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
