
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
  // Log the incoming request method
  console.log("Request method:", req.method);
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse the request body
    const requestText = await req.text();
    console.log("Request body text:", requestText);
    
    const formData: ContactFormData = JSON.parse(requestText);
    console.log("Parsed form data:", formData);
    
    const { name, email, company, message } = formData;
    
    if (!name || !email || !message) {
      console.log("Missing required fields:", { name, email, message });
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Send confirmation email to the user - this should work in free tier
    console.log("Sending confirmation email to user:", email);
    let userEmailSent = false;
    let userEmailResponse;
    
    try {
      userEmailResponse = await resend.emails.send({
        from: "Cesium Cyber <no-reply@cesiumcyber.com>", // Using verified domain
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
      console.log("User email response:", userEmailResponse);
      userEmailSent = true;
    } catch (userEmailError) {
      console.error("Error sending user confirmation email:", userEmailError);
      userEmailResponse = { error: userEmailError.message };
    }
    
    // Send notification email to company with verified domain
    console.log("Sending notification email to information@cesiumcyber.com");
    let companyEmailSent = false;
    let companyEmailResponse;
    
    try {
      // Make sure we're using the correct recipient email
      const companyEmail = "information@cesiumcyber.com";
      console.log(`Attempting to send notification to company email: ${companyEmail}`);
      
      companyEmailResponse = await resend.emails.send({
        from: "Contact Form <no-reply@cesiumcyber.com>", // Using verified domain
        to: [companyEmail],
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
      console.log("Company email response:", companyEmailResponse);
      companyEmailSent = true;
    } catch (companyEmailError) {
      console.error("Error sending company notification email:", companyEmailError);
      console.error("Error details:", companyEmailError);
      companyEmailResponse = { error: companyEmailError.message };
    }

    // Return appropriate response based on what succeeded
    const responseData = {
      userEmail: { 
        sent: userEmailSent, 
        details: userEmailResponse 
      },
      companyEmail: { 
        sent: companyEmailSent, 
        details: companyEmailResponse,
        sentTo: "information@cesiumcyber.com"
      },
      message: userEmailSent && companyEmailSent ? 
        "Your message was received and our team has been notified." : 
        (userEmailSent ? "Your message was received but there was an issue notifying our team." : "Failed to send emails")
    };
    
    // If at least the user email was sent, consider it partial success
    const statusCode = userEmailSent ? (companyEmailSent ? 200 : 207) : 500; // 207 = Partial success
    
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
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
