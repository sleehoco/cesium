import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { 
      name, 
      email, 
      company, 
      phone, 
      source, 
      service_interest, 
      initial_message,
      estimated_value,
      expected_close_date 
    } = await req.json();

    console.log('Creating lead:', { name, email, source });

    // Insert lead into database
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .insert({
        name,
        email,
        company,
        phone,
        source,
        service_interest,
        initial_message,
        estimated_value,
        expected_close_date,
        status: 'new',
        priority: 'medium'
      })
      .select()
      .single();

    if (leadError) {
      console.error('Error creating lead:', leadError);
      throw leadError;
    }

    // Create initial activity
    const { error: activityError } = await supabase
      .from('lead_activities')
      .insert({
        lead_id: lead.id,
        activity_type: 'note',
        title: 'Lead Created',
        description: `New lead from ${source}`,
        metadata: { source }
      });

    if (activityError) {
      console.error('Error creating activity:', activityError);
    }

    return new Response(
      JSON.stringify({ success: true, lead }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('Error in create-lead function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});