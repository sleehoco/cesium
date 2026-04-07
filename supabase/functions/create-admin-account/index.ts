import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CreateAdminRequest {
  email: string;
  firstName?: string;
  lastName?: string;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase admin client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Verify authentication
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized - Authentication required' }), 
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authentication token' }), 
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify caller is admin
    const { data: isAdmin, error: roleError } = await supabaseAdmin.rpc('has_role', {
      _user_id: user.id,
      _role: 'admin'
    });

    if (roleError || !isAdmin) {
      console.error('Admin role check failed:', roleError);
      return new Response(
        JSON.stringify({ error: 'Forbidden - Admin access required' }), 
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Admin ${user.email} is creating admin account`);

    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
    const { email, firstName = "Admin", lastName = "User" }: CreateAdminRequest = await req.json();
    const appUrl =
      Deno.env.get("PUBLIC_SITE_URL") ??
      req.headers.get("origin") ??
      "https://cesiumcyber.com";

    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: 'A valid email address is required', success: false }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log(`Creating admin account for: ${email}`);
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'invite',
      email,
      options: {
        redirectTo: `${appUrl}/auth`,
        data: {
          first_name: firstName,
          last_name: lastName,
        },
      },
    });

    if (authError) {
      console.error("Error creating user:", authError);
      
      // If user already exists, check if they have admin role
      if (authError.message.includes('already been registered')) {
        console.log(`User ${email} already exists, checking admin role...`);
        
        // Get all users to find the existing one
        const { data: users, error: listError } = await supabaseAdmin.auth.admin.listUsers();
        
        if (listError) {
          throw new Error(`Failed to check existing users: ${listError.message}`);
        }
        
        const existingUser = users.users.find(user => user.email === email);
        
        if (!existingUser) {
          throw new Error(`User ${email} should exist but was not found`);
        }
        
        // Check if user already has admin role
        const { data: existingRole } = await supabaseAdmin
          .from('user_roles')
          .select('*')
          .eq('user_id', existingUser.id)
          .eq('role', 'admin')
          .maybeSingle();

        if (existingRole) {
          return new Response(
            JSON.stringify({
              success: true,
              message: `User ${email} already has admin access.`,
              userExists: true,
              alreadyAdmin: true
            }),
            {
              status: 200,
              headers: { "Content-Type": "application/json", ...corsHeaders },
            }
          );
        }
        
        // User exists but doesn't have admin role, grant it
        const { error: roleError } = await supabaseAdmin
          .from('user_roles')
          .insert({
            user_id: existingUser.id,
            role: 'admin'
          });

        if (roleError) {
          console.error("Error assigning admin role to existing user:", roleError);
          throw new Error(`Failed to assign admin role: ${roleError.message}`);
        }

        console.log("Admin role assigned to existing user successfully");

        const { data: recoveryLinkData, error: recoveryLinkError } = await supabaseAdmin.auth.admin.generateLink({
          type: 'recovery',
          email,
          options: {
            redirectTo: `${appUrl}/auth`,
          },
        });

        if (recoveryLinkError || !recoveryLinkData.properties?.action_link) {
          await supabaseAdmin
            .from('user_roles')
            .delete()
            .eq('user_id', existingUser.id)
            .eq('role', 'admin');

          throw new Error(`Failed to create secure setup link: ${recoveryLinkError?.message ?? 'missing recovery link'}`);
        }

        // Send notification email to existing user
        const emailResponse = await resend.emails.send({
          from: "CesiumCyber Admin <no-reply@cesiumcyber.com>",
          to: [email],
          subject: "Admin Access Granted - CesiumCyber",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h1 style="color: #333; text-align: center;">Admin Access Granted</h1>
              
              <div style="background: #d4edda; border: 1px solid #c3e6cb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h2 style="color: #155724; margin-top: 0;">Congratulations!</h2>
                <p style="margin: 0; color: #155724;">Your account <strong>${email}</strong> has been granted administrator privileges for CesiumCyber.</p>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${recoveryLinkData.properties.action_link}" 
                   style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                  Set Your Password
                </a>
              </div>
              
              <p style="color: #666; font-size: 14px; text-align: center;">
                You can now access all administrative features after setting a password. If you have any questions, please contact the system administrator.
              </p>
            </div>
          `,
        });

        if (emailResponse.error) {
          await supabaseAdmin
            .from('user_roles')
            .delete()
            .eq('user_id', existingUser.id)
            .eq('role', 'admin');

          throw new Error(`Failed to send setup email: ${emailResponse.error.message}`);
        }

        console.log("Notification email sent successfully:", emailResponse.data);

        return new Response(
          JSON.stringify({
            success: true,
            message: `Existing user ${email} has been granted admin access and sent a secure setup link.`,
            userId: existingUser.id,
            email: email,
            grantedAccess: true
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          }
        );
      }
      
      throw new Error(`Failed to create user: ${authError.message}`);
    }

    if (!authUser.user || !authUser.properties?.action_link) {
      throw new Error("User creation failed - no user returned");
    }

    console.log(`User created successfully: ${authUser.user.id}`);

    // Assign admin role
    const { error: roleError } = await supabaseAdmin
      .from('user_roles')
      .insert({
        user_id: authUser.user.id,
        role: 'admin'
      });

    if (roleError) {
      console.error("Error assigning admin role:", roleError);
      // Clean up the user if role assignment fails
      await supabaseAdmin.auth.admin.deleteUser(authUser.user.id);
      throw new Error(`Failed to assign admin role: ${roleError.message}`);
    }

    console.log("Admin role assigned successfully");

    // Send email with credentials
    const emailResponse = await resend.emails.send({
      from: "CesiumCyber Admin <no-reply@cesiumcyber.com>",
      to: [email],
      subject: "Your CesiumCyber Admin Invite",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #333; text-align: center;">Welcome to CesiumCyber</h1>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #333; margin-top: 0;">Your Admin Invite</h2>
            <p><strong>Email:</strong> ${email}</p>
            <p>Use the secure link below to activate your admin access and set your password.</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${authUser.properties.action_link}" 
               style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Set Up Your Account
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px; text-align: center;">
            If you have any questions, please contact the system administrator.
          </p>
        </div>
      `,
    });

    if (emailResponse.error) {
      console.error("Error sending email:", emailResponse.error);
      await supabaseAdmin
        .from('user_roles')
        .delete()
        .eq('user_id', authUser.user.id)
        .eq('role', 'admin');
      await supabaseAdmin.auth.admin.deleteUser(authUser.user.id);
      throw new Error(`Failed to send email: ${emailResponse.error.message}`);
    }

    console.log("Email sent successfully:", emailResponse.data);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Admin account created and secure setup link sent via email",
        userId: authUser.user.id,
        email: email
      }), 
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Error in create-admin-account function:", error);
    return new Response(
      JSON.stringify({ 
        error: message,
        success: false 
      }),
      {
        status: 500,
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);
