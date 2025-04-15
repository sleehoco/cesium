
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@1.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  message: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData: ContactFormData = await req.json();
    const { name, email, company, message } = formData;
    
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Send confirmation email to the user
    const userEmailResponse = await resend.emails.send({
      from: "Cesium Cyber <no-reply@resend.dev>",
      to: [email],
      subject: "We've received your message - Cesium Cyber",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #00c896;">Thank you for contacting Cesium Cyber</h2>
          <p>Hello ${name},</p>
          <p>We have received your message and will get back to you as soon as possible.</p>
          <p><strong>Your message:</strong><br>${message}</p>
          <p>Best regards,<br>The Cesium Cyber Team</p>
        </div>
      `,
    });

    // Send notification email to the company
    const companyEmailResponse = await resend.emails.send({
      from: "Contact Form <no-reply@resend.dev>",
      to: ["information@cesiumcyber.com"],
      subject: "New Contact Form Submission",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #00c896;">New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          ${company ? `<p><strong>Company:</strong> ${company}</p>` : ''}
          <p><strong>Message:</strong><br>${message}</p>
        </div>
      `,
    });

    console.log("User email sent:", userEmailResponse);
    console.log("Company email sent:", companyEmailResponse);

    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Emails sent successfully" 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error) {
    console.error("Error in send-contact-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
