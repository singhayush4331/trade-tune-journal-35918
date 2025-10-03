import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CreateAccountRequest {
  email: string;
  fullName: string;
  password: string;
  roleType: 'haven_ark_masterclass' | 'wiggly_only';
  notes?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, fullName, password, roleType, notes }: CreateAccountRequest = await req.json();

    // Validate required fields
    if (!email || !fullName || !password || !roleType) {
      throw new Error("Missing required fields");
    }

    // Create Supabase client with service role key for admin operations
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Create the user account
    const { data: userData, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      user_metadata: {
        full_name: fullName,
        signup_type: roleType
      },
      email_confirm: true // Auto-confirm email
    });

    if (createError) {
      throw new Error(`Failed to create user: ${createError.message}`);
    }

    console.log('User created successfully:', userData.user.id);

    // The user signup trigger will automatically assign the correct role based on signup_type

    // Send welcome email with login credentials
    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
    
    const templateData = {
      userName: fullName,
      email: email,
      password: password,
      loginUrl: `${req.headers.get("origin")}/login`,
      roleType: roleType === 'haven_ark_masterclass' ? 'Haven ARK Masterclass' : 'Wiggly Trading Platform'
    };

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Welcome to ${templateData.roleType}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10B981, #059669); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .credentials { background: white; padding: 20px; border-left: 4px solid #10B981; margin: 20px 0; border-radius: 4px; }
          .button { display: inline-block; background: #10B981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
          .footer { text-align: center; margin-top: 30px; color: #666; }
          .important { background: #FEF3CD; border: 1px solid #F59E0B; padding: 15px; border-radius: 6px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to ${templateData.roleType}!</h1>
            <p>Your account has been created successfully</p>
          </div>
          
          <div class="content">
            <h2>Hello ${templateData.userName}!</h2>
            
            <p>Congratulations! Your ${templateData.roleType} account has been created. You now have access to our comprehensive trading platform and educational resources.</p>
            
            <div class="credentials">
              <h3>🔐 Your Login Credentials</h3>
              <p><strong>Email:</strong> ${templateData.email}</p>
              <p><strong>Password:</strong> <code style="background: #f3f4f6; padding: 2px 6px; border-radius: 3px; font-family: monospace;">${templateData.password}</code></p>
            </div>
            
            <div class="important">
              <p><strong>🔒 Security Notice:</strong> Please change your password after your first login for security purposes.</p>
            </div>
            
            ${roleType === 'haven_ark_masterclass' ? `
            <h3>🎓 What's Included in Your Masterclass:</h3>
            <ul>
              <li>Complete A-to-Z Stock Trading Course</li>
              <li>48+ Video Lessons & Modules</li>
              <li>Bi-weekly Live Webinars</li>
              <li>24/7 Mentor Support</li>
              <li>Trading Certification</li>
              <li>Full Access to Wiggly Trading Journal</li>
              <li>Advanced Analytics & Insights</li>
            </ul>
            ` : `
            <h3>📊 Your Wiggly Access Includes:</h3>
            <ul>
              <li>Complete Trading Journal</li>
              <li>Advanced Analytics Dashboard</li>
              <li>Performance Tracking</li>
              <li>Risk Management Tools</li>
              <li>AI-Powered Insights</li>
            </ul>
            `}
            
            <div style="text-align: center;">
              <a href="${templateData.loginUrl}" class="button">Login to Your Account</a>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <h3>📞 Need Help?</h3>
              <p>If you have any questions or need assistance, our support team is here to help:</p>
              <ul>
                <li>📧 Email: support@havenark.com</li>
                <li>📱 WhatsApp: +91-XXXXX-XXXXX</li>
                <li>🕒 Support Hours: 9 AM - 9 PM IST</li>
              </ul>
            </div>
          </div>
          
          <div class="footer">
            <p>Thank you for choosing Haven ARK for your trading journey!</p>
            <p style="font-size: 12px; color: #888;">This email was sent from an automated system. Please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const emailResponse = await resend.emails.send({
      from: "Haven ARK <noreply@havenark.com>",
      to: [email],
      subject: `Welcome to ${templateData.roleType} - Your Login Credentials`,
      html: emailHtml,
    });

    console.log("Welcome email sent:", emailResponse);

    return new Response(JSON.stringify({
      success: true,
      userId: userData.user.id,
      message: "Account created and welcome email sent successfully"
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error("Error in create-haven-ark-account function:", error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || "Failed to create account"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);