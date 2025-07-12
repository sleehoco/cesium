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

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
    
    // Initialize Supabase admin client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    const { email, firstName = "Admin", lastName = "User" }: CreateAdminRequest = await req.json();

    // Generate a secure temporary password
    const tempPassword = generateSecurePassword();

    console.log(`Creating admin account for: ${email}`);

    // Try to create the user first, handle existing user error
    let userId: string;
    let isNewUser = false;
    let userPassword = "";

    try {
      // Attempt to create new user
      userPassword = tempPassword;
      const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password: tempPassword,
        email_confirm: true,
        user_metadata: {
          first_name: firstName,
          last_name: lastName
        }
      });

      if (authError) {
        // Check if it's a "user already exists" error
        if (authError.message.includes('already been registered') || authError.message.includes('User already registered')) {
          console.log('User already exists, will check for existing admin role');
          
          // Get the existing user by listing users and filtering by email
          const { data: users, error: listError } = await supabaseAdmin.auth.admin.listUsers();
          
          if (listError) {
            throw new Error(`Failed to check existing users: ${listError.message}`);
          }
          
          const existingUser = users.users.find(user => user.email === email);
          
          if (!existingUser) {
            throw new Error(`User ${email} should exist but was not found`);
          }
          
          userId = existingUser.id;
          
          // Check if user already has admin role
          const { data: existingRole } = await supabaseAdmin
            .from('user_roles')
            .select('*')
            .eq('user_id', userId)
            .eq('role', 'admin')
            .maybeSingle();

          if (existingRole) {
            return new Response(
              JSON.stringify({ 
                success: false, 
                error: `User ${email} already has admin access. No changes made.`,
                existingUser: true
              }),
              {
                status: 200,
                headers: { "Content-Type": "application/json", ...corsHeaders },
              }
            );
          }
        } else {
          console.error("Error creating user:", authError);
          throw new Error(`Failed to create user: ${authError.message}`);
        }
      } else {
        if (!authUser.user) {
          throw new Error("User creation failed - no user returned");
        }
        console.log(`User created successfully: ${authUser.user.id}`);
        userId = authUser.user.id;
        isNewUser = true;
      }
    } catch (error: any) {
      console.error("Error in user creation process:", error);
      throw error;
    }

    // Assign admin role
    const { error: roleError } = await supabaseAdmin
      .from('user_roles')
      .insert({
        user_id: userId,
        role: 'admin'
      });

    if (roleError) {
      console.error("Error assigning admin role:", roleError);
      // Try to clean up the user if role assignment fails and it's a new user
      if (isNewUser) {
        await supabaseAdmin.auth.admin.deleteUser(userId);
      }
      throw new Error(`Failed to assign admin role: ${roleError.message}`);
    }

    console.log("Admin role assigned successfully");

    // Send email with credentials (only for new users)
    let emailResponse = null;
    if (isNewUser) {
      emailResponse = await resend.emails.send({
        from: "CesiumCyber Admin <onboarding@resend.dev>",
        to: [email],
        subject: "Your CesiumCyber Admin Account",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #333; text-align: center;">Welcome to CesiumCyber</h1>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h2 style="color: #333; margin-top: 0;">Your Admin Account Details</h2>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Temporary Password:</strong> <code style="background: #e9ecef; padding: 4px 8px; border-radius: 4px;">${userPassword}</code></p>
            </div>
            
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #856404;"><strong>Important:</strong> Please change your password immediately after logging in for security purposes.</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${supabaseUrl.replace('.supabase.co', '.lovableproject.com')}/auth" 
                 style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Login to Your Account
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
        throw new Error(`Failed to send email: ${emailResponse.error.message}`);
      }

      console.log("Email sent successfully:", emailResponse.data);
    } else {
      console.log("Existing user granted admin access, no email sent with credentials");
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: isNewUser 
          ? "Admin account created and credentials sent via email"
          : `Existing user ${email} granted admin access`,
        userId: userId,
        email: email,
        isNewUser
      }), 
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );

  } catch (error: any) {
    console.error("Error in create-admin-account function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
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

function generateSecurePassword(): string {
  const length = 16;
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  let password = "";
  
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  
  return password;
}

serve(handler);