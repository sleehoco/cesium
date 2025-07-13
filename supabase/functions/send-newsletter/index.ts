import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { newsletter_id, subject, content } = await req.json();
    
    if (!newsletter_id || !subject || !content) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase configuration not found');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Initialize Resend
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    
    if (!resendApiKey) {
      throw new Error('Resend API key not found');
    }

    const resend = new Resend(resendApiKey);

    console.log("Fetching active subscribers...");

    // Get all active subscribers
    const { data: subscribers, error: subscribersError } = await supabase
      .from('newsletter_subscribers')
      .select('id, email, name')
      .eq('status', 'active');

    if (subscribersError) {
      console.error("Error fetching subscribers:", subscribersError);
      throw new Error(`Failed to fetch subscribers: ${subscribersError.message}`);
    }

    if (!subscribers || subscribers.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "No active subscribers found" 
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log(`Found ${subscribers.length} active subscribers`);

    // Create HTML content with basic styling
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
      <style>
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
          line-height: 1.6; 
          color: #333; 
          max-width: 600px; 
          margin: 0 auto; 
          padding: 20px; 
        }
        h1 { color: #2563eb; margin-bottom: 20px; }
        h2 { color: #1e40af; margin-top: 30px; }
        p { margin-bottom: 16px; }
        a { color: #2563eb; }
        .footer { 
          margin-top: 40px; 
          padding-top: 20px; 
          border-top: 1px solid #e5e7eb; 
          font-size: 14px; 
          color: #6b7280; 
        }
        .unsubscribe { text-align: center; margin-top: 20px; }
      </style>
    </head>
    <body>
      ${content}
      <div class="footer">
        <p>This email was sent by CesiumCyber Security.</p>
        <div class="unsubscribe">
          <p><a href="{{unsubscribe_url}}">Unsubscribe from this newsletter</a></p>
        </div>
      </div>
    </body>
    </html>
    `;

    // Send emails to all subscribers
    const emailPromises = subscribers.map(async (subscriber) => {
      try {
        const unsubscribeUrl = `${supabaseUrl}/functions/v1/unsubscribe?email=${encodeURIComponent(subscriber.email)}`;
        const personalizedContent = htmlContent.replace('{{unsubscribe_url}}', unsubscribeUrl);

        const emailResponse = await resend.emails.send({
          from: 'CesiumCyber Newsletter <newsletter@cesiumcyber.com>',
          to: [subscriber.email],
          subject: subject,
          html: personalizedContent,
        });

        console.log(`Email sent to ${subscriber.email}:`, emailResponse);

        // Record the send in the database
        await supabase
          .from('newsletter_sends')
          .insert({
            newsletter_id: newsletter_id,
            subscriber_id: subscriber.id,
            sent_at: new Date().toISOString()
          });

        return { success: true, email: subscriber.email };
      } catch (error) {
        console.error(`Failed to send email to ${subscriber.email}:`, error);
        return { success: false, email: subscriber.email, error: error.message };
      }
    });

    // Wait for all emails to be sent
    const results = await Promise.all(emailPromises);
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;

    console.log(`Newsletter sending completed: ${successful} successful, ${failed} failed`);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Newsletter sent successfully`,
        stats: {
          total: subscribers.length,
          successful,
          failed
        },
        results
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in send-newsletter function:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message,
        details: "Newsletter sending failed"
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});