import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@1.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Hardcoded recipient - NEVER accept from request body
const COMPANY_EMAIL = "information@cesiumcyber.com";

// Rate limiting constants
const MAX_ATTEMPTS_PER_HOUR = 3;
const BLOCK_DURATION_MS = 3600000; // 1 hour

interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  message: string;
}

serve(async (req) => {
  // Log the incoming request method
  console.log("Request method:", req.method);
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get client IP for rate limiting
    const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                     req.headers.get('x-real-ip') || 
                     'unknown';
    console.log("Client IP:", clientIP);

    // Initialize Supabase admin client for rate limit checks
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Check rate limit
    const hourAgo = new Date(Date.now() - BLOCK_DURATION_MS).toISOString();
    
    const { data: rateData, error: rateError } = await supabaseAdmin
      .from('newsletter_rate_limits')
      .select('attempts, last_attempt, blocked_until')
      .eq('ip_address', clientIP)
      .order('last_attempt', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (rateError) {
      console.error("Rate limit check error:", rateError);
    }

    // Check if blocked
    if (rateData?.blocked_until && new Date(rateData.blocked_until) > new Date()) {
      console.log("IP is blocked until:", rateData.blocked_until);
      return new Response(
        JSON.stringify({ error: "Too many requests. Please try again later." }),
        {
          status: 429,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Check attempts within the last hour
    if (rateData && rateData.attempts >= MAX_ATTEMPTS_PER_HOUR && 
        new Date(rateData.last_attempt) > new Date(hourAgo)) {
      // Block for 1 hour
      await supabaseAdmin
        .from('newsletter_rate_limits')
        .update({ 
          blocked_until: new Date(Date.now() + BLOCK_DURATION_MS).toISOString() 
        })
        .eq('ip_address', clientIP);
      
      console.log("Rate limit exceeded, blocking IP");
      return new Response(
        JSON.stringify({ error: "Too many requests. Please try again later." }),
        {
          status: 429,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Parse the request body
    const requestText = await req.text();
    console.log("Request body received");
    
    const formData: ContactFormData = JSON.parse(requestText);
    
    // Extract only allowed fields (ignore any recipient field from request)
    const { name, email, company, message } = formData;
    
    // Validate required fields
    if (!name || !email || !message) {
      console.log("Missing required fields");
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Basic input validation
    if (name.length > 100 || email.length > 254 || message.length > 5000) {
      return new Response(
        JSON.stringify({ error: "Input exceeds maximum length" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: "Invalid email format" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Update rate limit counter
    if (rateData) {
      const shouldResetCount = new Date(rateData.last_attempt) < new Date(hourAgo);
      await supabaseAdmin
        .from('newsletter_rate_limits')
        .update({ 
          attempts: shouldResetCount ? 1 : rateData.attempts + 1,
          last_attempt: new Date().toISOString(),
          email: email,
          blocked_until: null
        })
        .eq('ip_address', clientIP);
    } else {
      await supabaseAdmin
        .from('newsletter_rate_limits')
        .insert({ 
          ip_address: clientIP,
          email: email,
          attempts: 1,
          last_attempt: new Date().toISOString()
        });
    }

    // Sanitize inputs for HTML email (prevent XSS in emails)
    const sanitizeForHtml = (str: string) => {
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    };

    const safeName = sanitizeForHtml(name);
    const safeEmail = sanitizeForHtml(email);
    const safeCompany = company ? sanitizeForHtml(company) : null;
    const safeMessage = sanitizeForHtml(message);

    // Send confirmation email to the user
    console.log("Sending confirmation email to user");
    let userEmailSent = false;
    let userEmailResponse;
    
    try {
      userEmailResponse = await resend.emails.send({
        from: "Cesium Cyber <no-reply@cesiumcyber.com>",
        to: [email],
        subject: "We've received your message - Cesium Cyber",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #00c896;">Thank you for contacting Cesium Cyber</h2>
            <p>Hello ${safeName},</p>
            <p>We have received your message and will get back to you as soon as possible.</p>
            <p><strong>Your message:</strong><br>${safeMessage}</p>
            <p>Best regards,<br>The Cesium Cyber Team</p>
          </div>
        `,
      });
      console.log("User email sent successfully");
      userEmailSent = true;
    } catch (userEmailError) {
      console.error("Error sending user confirmation email:", userEmailError);
      userEmailResponse = { error: userEmailError.message };
    }
    
    // Send notification email to company with HARDCODED recipient
    console.log("Sending notification email to company at:", COMPANY_EMAIL);
    let companyEmailSent = false;
    let companyEmailResponse;
    
    try {
      companyEmailResponse = await resend.emails.send({
        from: "Contact Form <no-reply@cesiumcyber.com>",
        to: [COMPANY_EMAIL], // Always use hardcoded recipient
        subject: "New Contact Form Submission",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #00c896;">New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${safeName}</p>
            <p><strong>Email:</strong> ${safeEmail}</p>
            ${safeCompany ? `<p><strong>Company:</strong> ${safeCompany}</p>` : ''}
            <p><strong>Message:</strong><br>${safeMessage}</p>
            <hr/>
            <p style="color: #666; font-size: 12px;">Submitted from IP: ${clientIP}</p>
          </div>
        `,
      });
      console.log("Company email sent successfully");
      companyEmailSent = true;
    } catch (companyEmailError) {
      console.error("Error sending company notification email:", companyEmailError);
      companyEmailResponse = { error: companyEmailError.message };
    }

    // Return appropriate response based on what succeeded
    const responseData = {
      userEmail: { 
        sent: userEmailSent
      },
      companyEmail: { 
        sent: companyEmailSent
      },
      message: userEmailSent && companyEmailSent ? 
        "Your message was received and our team has been notified." : 
        (userEmailSent ? "Your message was received but there was an issue notifying our team." : "Failed to send emails")
    };
    
    // If at least the user email was sent, consider it partial success
    const statusCode = userEmailSent ? (companyEmailSent ? 200 : 207) : 500;
    
    return new Response(
      JSON.stringify(responseData),
      {
        status: statusCode,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error) {
    console.error("Error in send-contact-email function:", error);
    return new Response(
      JSON.stringify({ error: "An error occurred processing your request" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
