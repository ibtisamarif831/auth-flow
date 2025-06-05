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
    const { email, password } = await req.json();
    if (email.length ===0 || password.length ===0) {
      console.log('Missing email or password in request body.');
      throw new Error('Missing email or password in request body.');
    }
  
    // Create Supabase client
    const supabaseAdmin = await createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Fetch the promo code details from the database
    const { data, error } = await supabaseAdmin
      .from('pre_invites')
      .select('*')
    const emailList=data.map(item=>item.email)
    if(error){
        console.log(error)
        throw new Error('Error in signup-free-users function');
    }
    if (!emailList.includes(email)) {
      console.log('email not acceptable');
      throw new Error('email not acceptable');
    }
    const { data:user, error:userError } = await supabaseAdmin.auth.signUp(
      {
        email,
        password,
        options: {
          data: {
            is_pre_signed: true,
          }
        }
      }
    )

    

  
    // Return promo code details
    return new Response(
      JSON.stringify({
        success: true,
        data: {
          id: user.user.id,
          email: user.user.email,
          is_pre_signed: user.user.is_pre_signed,
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
