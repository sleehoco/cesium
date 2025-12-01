import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Email templates for each status
const emailTemplates = {
  new: {
    subject: "Thank you for your inquiry - CesiumCyber Security",
    getHtml: (name: string, serviceInterest: string) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Thank you for reaching out, ${name}!</h1>
        <p>We've received your inquiry about ${serviceInterest || 'our cybersecurity services'} and are excited to help secure your business.</p>
        <p>Our team is reviewing your request and will get back to you within 24 hours with next steps.</p>
        <p>In the meantime, feel free to explore:</p>
        <ul>
          <li><a href="https://cesiumcyber.com/services">Our Services</a></li>
          <li><a href="https://cesiumcyber.com/blog">Security Insights Blog</a></li>
          <li><a href="https://cesiumcyber.com/cyber-dashboard">Security Dashboard</a></li>
        </ul>
        <p>Best regards,<br><strong>CesiumCyber Security Team</strong></p>
        <p style="font-size: 12px; color: #666;">If you need immediate assistance, reply to this email or call us.</p>
      </div>
    `
  },
  contacted: {
    subject: "Following up on your cybersecurity needs - CesiumCyber",
    getHtml: (name: string, serviceInterest: string) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Hi ${name},</h1>
        <p>I wanted to follow up on our recent conversation about ${serviceInterest || 'your cybersecurity needs'}.</p>
        <p>Have you had a chance to review the information we discussed? I'd love to answer any questions you might have.</p>
        <p><strong>Next Steps:</strong></p>
        <ul>
          <li>Schedule a free 30-minute consultation</li>
          <li>Review a customized security assessment proposal</li>
          <li>Discuss your specific security challenges</li>
        </ul>
        <p>Reply to this email or book a time on my calendar that works for you.</p>
        <p>Looking forward to helping secure your business!</p>
        <p>Best regards,<br><strong>CesiumCyber Security Team</strong></p>
      </div>
    `
  },
  qualified: {
    subject: "Your custom security proposal - CesiumCyber",
    getHtml: (name: string, serviceInterest: string) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Excited to work with you, ${name}!</h1>
        <p>Based on our discussions about ${serviceInterest || 'your security requirements'}, I'm preparing a customized proposal for your organization.</p>
        <p><strong>What's included:</strong></p>
        <ul>
          <li>Comprehensive security assessment scope</li>
          <li>Detailed timeline and deliverables</li>
          <li>Transparent pricing breakdown</li>
          <li>Expected outcomes and ROI</li>
        </ul>
        <p>You'll receive your proposal within the next 48 hours.</p>
        <p>In the meantime, if you have any specific requirements or concerns, please let me know!</p>
        <p>Best regards,<br><strong>CesiumCyber Security Team</strong></p>
      </div>
    `
  },
  proposal_sent: {
    subject: "Checking in on your security proposal - CesiumCyber",
    getHtml: (name: string) => `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Hi ${name},</h1>
        <p>I wanted to check in regarding the proposal we sent over for your security assessment.</p>
        <p>Have you had a chance to review it? I'm here to:</p>
        <ul>
          <li>Answer any questions about the scope or pricing</li>
          <li>Adjust the proposal to better fit your needs</li>
          <li>Discuss next steps and timeline</li>
          <li>Schedule a call to walk through it together</li>
        </ul>
        <p>Your security is our priority, and I want to make sure we're providing exactly what you need.</p>
        <p>Let me know your thoughts!</p>
        <p>Best regards,<br><strong>CesiumCyber Security Team</strong></p>
      </div>
    `
  }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const resendKey = Deno.env.get('RESEND_API_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    const resend = new Resend(resendKey);

    console.log('Starting automated lead follow-up process...');

    // Get leads that need follow-up (haven't been contacted in last 48 hours or never contacted)
    const twoDaysAgo = new Date();
    twoDaysAgo.setHours(twoDaysAgo.getHours() - 48);

    const { data: leads, error: leadsError } = await supabase
      .from('leads')
      .select('*')
      .in('status', ['new', 'contacted', 'qualified', 'proposal_sent'])
      .or(`last_contacted_at.is.null,last_contacted_at.lt.${twoDaysAgo.toISOString()}`);

    if (leadsError) {
      console.error('Error fetching leads:', leadsError);
      throw leadsError;
    }

    console.log(`Found ${leads?.length || 0} leads needing follow-up`);

    const results = [];
    
    for (const lead of leads || []) {
      try {
        const template = emailTemplates[lead.status as keyof typeof emailTemplates];
        
        if (!template) {
          console.log(`No template for status: ${lead.status}, skipping lead ${lead.id}`);
          continue;
        }

        // Send email
        const emailResult = await resend.emails.send({
          from: 'CesiumCyber Security <onboarding@resend.dev>',
          to: [lead.email],
          subject: template.subject,
          html: template.getHtml(lead.name, lead.service_interest || 'our services')
        });

        console.log(`Email sent to ${lead.email}:`, emailResult);

        // Update lead last_contacted_at and increment contact count
        await supabase
          .from('leads')
          .update({
            last_contacted_at: new Date().toISOString(),
            contact_count: (lead.contact_count || 0) + 1
          })
          .eq('id', lead.id);

        // Log activity
        await supabase
          .from('lead_activities')
          .insert({
            lead_id: lead.id,
            activity_type: 'email',
            title: 'Automated Follow-up Email Sent',
            description: `Sent ${lead.status} follow-up email`,
            metadata: { email_id: emailResult.id, template: lead.status }
          });

        results.push({
          lead_id: lead.id,
          email: lead.email,
          status: lead.status,
          success: true,
          email_id: emailResult.id
        });

      } catch (emailError) {
        console.error(`Error sending email to lead ${lead.id}:`, emailError);
        results.push({
          lead_id: lead.id,
          email: lead.email,
          status: lead.status,
          success: false,
          error: emailError.message
        });
      }
    }

    console.log('Follow-up process complete:', results);

    return new Response(
      JSON.stringify({
        success: true,
        processed: results.length,
        results
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('Error in automated follow-up function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});