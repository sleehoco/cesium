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
    const { email, name } = await req.json();
    
    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Initialize Resend
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    
    if (!resendApiKey) {
      throw new Error('Resend API key not found');
    }

    const resend = new Resend(resendApiKey);

    console.log(`Sending welcome email to: ${email}`);

    // Create welcome email HTML content
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to CesiumCyber Security Newsletter</title>
      <style>
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
          line-height: 1.6; 
          color: #333; 
          max-width: 600px; 
          margin: 0 auto; 
          padding: 20px; 
          background-color: #f9f9f9;
        }
        .container {
          background-color: white;
          border-radius: 8px;
          padding: 40px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .logo {
          font-size: 24px;
          font-weight: bold;
          color: #D4AF37;
          margin-bottom: 10px;
        }
        h1 { 
          color: #1a1a1a; 
          margin-bottom: 20px; 
          font-size: 28px;
          text-align: center;
        }
        h2 { 
          color: #D4AF37; 
          margin-top: 30px; 
          font-size: 20px;
        }
        p { 
          margin-bottom: 16px; 
          font-size: 16px;
        }
        .highlight {
          background-color: #f3f4f6;
          padding: 20px;
          border-radius: 6px;
          border-left: 4px solid #D4AF37;
          margin: 20px 0;
        }
        .benefits {
          background-color: #fafafa;
          padding: 20px;
          border-radius: 6px;
          margin: 20px 0;
        }
        .benefits ul {
          margin: 10px 0;
          padding-left: 20px;
        }
        .benefits li {
          margin-bottom: 8px;
        }
        a { 
          color: #D4AF37; 
          text-decoration: none;
        }
        a:hover {
          text-decoration: underline;
        }
        .footer { 
          margin-top: 40px; 
          padding-top: 20px; 
          border-top: 1px solid #e5e7eb; 
          font-size: 14px; 
          color: #6b7280; 
          text-align: center;
        }
        .cta-button {
          display: inline-block;
          background-color: #D4AF37;
          color: #1a1a1a;
          padding: 12px 24px;
          border-radius: 6px;
          text-decoration: none;
          font-weight: bold;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">CesiumCyber Security</div>
        </div>
        
        <h1>Welcome to Our Newsletter!</h1>
        
        ${name ? `<p>Hi ${name},</p>` : '<p>Hello!</p>'}
        
        <p>Thank you for subscribing to the CesiumCyber Security newsletter. We're excited to have you join our community of cybersecurity professionals and enthusiasts.</p>
        
        <div class="benefits">
          <h2>What You'll Receive:</h2>
          <ul>
            <li><strong>Latest Cybersecurity Insights</strong> - Stay ahead of emerging threats and security trends</li>
            <li><strong>Expert Analysis</strong> - In-depth coverage of vulnerability management and operational technology</li>
            <li><strong>AI & Security</strong> - Cutting-edge developments in AI-driven threat intelligence</li>
            <li><strong>Industry Best Practices</strong> - Proven strategies for enterprise security</li>
            <li><strong>Exclusive Content</strong> - Premium insights from our security experts</li>
          </ul>
        </div>
        
        <div class="highlight">
          <p><strong>Coming Soon:</strong> Our next newsletter will feature the latest trends in AI-powered cybersecurity and how operational technology is evolving to meet modern threats.</p>
        </div>
        
        <p>In the meantime, feel free to explore our website for more cybersecurity resources and insights.</p>
        
        <div style="text-align: center;">
          <a href="https://cesiumcyber.com/blog" class="cta-button">Read Our Latest Blog Posts</a>
        </div>
        
        <p>If you have any questions or need cybersecurity consultation, don't hesitate to reach out to our team.</p>
        
        <p>Stay secure,<br>
        <strong>The CesiumCyber Security Team</strong></p>
        
        <div class="footer">
          <p>This email was sent by CesiumCyber Security because you subscribed to our newsletter.</p>
          <p>If you no longer wish to receive these emails, you can <a href="{{unsubscribe_url}}">unsubscribe at any time</a>.</p>
        </div>
      </div>
    </body>
    </html>
    `;

    // Send welcome email
    const emailResponse = await resend.emails.send({
      from: 'CesiumCyber Security <welcome@cesiumcyber.com>',
      to: [email],
      subject: 'Welcome to CesiumCyber Security Newsletter!',
      html: htmlContent,
    });

    console.log(`Welcome email sent to ${email}:`, emailResponse);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Welcome email sent successfully",
        data: emailResponse
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in send-welcome-email function:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message,
        details: "Welcome email sending failed"
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});