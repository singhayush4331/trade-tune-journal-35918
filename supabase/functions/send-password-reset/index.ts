
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@4.0.0";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ResetPasswordRequest {
  email: string;
  redirectUrl: string;
}

const createBrandedEmailTemplate = (resetUrl: string, email: string) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Wiggly Password</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #333333;
      background-color: #f8fafc;
    }
    
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 40px 30px;
      text-align: center;
    }
    
    .logo {
      font-size: 32px;
      font-weight: bold;
      margin-bottom: 10px;
      letter-spacing: -1px;
    }
    
    .header-subtitle {
      font-size: 16px;
      opacity: 0.9;
    }
    
    .content {
      padding: 40px 30px;
    }
    
    .greeting {
      font-size: 18px;
      margin-bottom: 20px;
      color: #1f2937;
    }
    
    .message {
      font-size: 16px;
      margin-bottom: 30px;
      color: #4b5563;
      line-height: 1.7;
    }
    
    .reset-button {
      display: inline-block;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      text-decoration: none;
      padding: 16px 32px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 16px;
      text-align: center;
      margin: 20px 0;
      transition: transform 0.2s ease;
    }
    
    .reset-button:hover {
      transform: translateY(-1px);
    }
    
    .security-notice {
      background-color: #f3f4f6;
      padding: 20px;
      border-radius: 8px;
      margin: 30px 0;
      border-left: 4px solid #10b981;
    }
    
    .security-notice h3 {
      color: #065f46;
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 8px;
    }
    
    .security-notice p {
      color: #064e3b;
      font-size: 14px;
      margin: 0;
    }
    
    .footer {
      background-color: #f9fafb;
      padding: 30px;
      text-align: center;
      border-top: 1px solid #e5e7eb;
    }
    
    .footer-text {
      font-size: 14px;
      color: #6b7280;
      margin-bottom: 10px;
    }
    
    .footer-links {
      font-size: 12px;
      color: #9ca3af;
    }
    
    .footer-links a {
      color: #667eea;
      text-decoration: none;
      margin: 0 10px;
    }
    
    .expiry-notice {
      background-color: #fef3c7;
      color: #92400e;
      padding: 15px;
      border-radius: 6px;
      font-size: 14px;
      margin: 20px 0;
      border: 1px solid #fcd34d;
    }
    
    @media (max-width: 600px) {
      .email-container {
        margin: 0;
        border-radius: 0;
      }
      
      .content, .header, .footer {
        padding: 20px;
      }
      
      .reset-button {
        display: block;
        text-align: center;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <!-- Header -->
    <div class="header">
      <div class="logo">Wiggly</div>
      <div class="header-subtitle">Trading Journal Platform</div>
    </div>
    
    <!-- Content -->
    <div class="content">
      <div class="greeting">Hello there!</div>
      
      <div class="message">
        We received a request to reset the password for your Wiggly account associated with <strong>${email}</strong>.
        <br><br>
        If you requested this password reset, click the button below to create a new password. If you didn't request this, you can safely ignore this email.
      </div>
      
      <div style="text-align: center;">
        <a href="${resetUrl}" class="reset-button">Reset Your Password</a>
      </div>
      
      <div class="expiry-notice">
        ⏰ <strong>Important:</strong> This password reset link will expire in 24 hours for security reasons.
      </div>
      
      <div class="security-notice">
        <h3>🔒 Security Notice</h3>
        <p>This email was sent from an official Wiggly system. Always verify that password reset emails come from our official domain. Never share your login credentials with anyone.</p>
      </div>
      
      <div class="message">
        If the button above doesn't work, you can copy and paste this link into your browser:
        <br>
        <div style="background-color: #f3f4f6; padding: 10px; border-radius: 4px; margin: 10px 0; word-break: break-all; font-family: monospace; font-size: 12px;">
          ${resetUrl}
        </div>
      </div>
    </div>
    
    <!-- Footer -->
    <div class="footer">
      <div class="footer-text">
        <strong>Wiggly Trading Journal</strong><br>
        Helping traders track, analyze, and improve their performance
      </div>
      <div class="footer-links">
        <a href="https://wiggly.co.in">Visit Website</a> |
        <a href="https://wiggly.co.in/support">Support</a> |
        <a href="https://wiggly.co.in/privacy">Privacy Policy</a>
      </div>
      <div style="margin-top: 15px; font-size: 12px; color: #9ca3af;">
        © 2024 Wiggly. All rights reserved.
      </div>
    </div>
  </div>
</body>
</html>
  `;
};

const handler = async (req: Request): Promise<Response> => {
  console.log('🚀 Password reset email function called');
  console.log('📧 Resend API Key present:', !!Deno.env.get("RESEND_API_KEY"));
  console.log('🔑 Supabase URL:', supabaseUrl ? 'Present' : 'Missing');
  console.log('🔑 Service Role Key present:', !!supabaseServiceKey);
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    console.log('❌ Invalid method:', req.method);
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const { email, redirectUrl }: ResetPasswordRequest = await req.json();
    console.log('📝 Processing password reset for email:', email);
    console.log('🔗 Redirect URL:', redirectUrl);

    if (!email || !redirectUrl) {
      console.log('❌ Missing required fields');
      throw new Error("Email and redirect URL are required");
    }

    // Clean up expired tokens first
    console.log('🧹 Cleaning up expired tokens...');
    try {
      await supabase.rpc('cleanup_expired_reset_tokens');
      console.log('✅ Token cleanup completed');
    } catch (cleanupError) {
      console.log('⚠️ Token cleanup failed (non-critical):', cleanupError);
    }

    // IMPROVED USER LOOKUP - More robust approach
    console.log('👤 Looking up user with email:', email);
    let user = null;
    
    // Method 1: Direct admin getUserById if we can find the user ID first
    try {
      console.log('🔍 Method 1: Checking profiles table for user...');
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, email')
        .ilike('email', email)
        .maybeSingle();
        
      if (profileError) {
        console.error('❌ Profile lookup error:', profileError);
      } else if (profileData) {
        console.log('✅ Found user in profiles table:', profileData);
        
        // Get the full user data using the found ID
        const { data: fullUserData, error: fullUserError } = await supabase.auth.admin.getUserById(profileData.id);
        if (!fullUserError && fullUserData?.user) {
          user = fullUserData.user;
          console.log('✅ Got full user data from auth.users via profiles table');
        } else {
          console.error('❌ Failed to get full user data:', fullUserError);
        }
      } else {
        console.log('❌ No profile found for email in profiles table');
      }
    } catch (profileError) {
      console.error('❌ Profile table lookup failed:', profileError);
    }

    // Method 2: Fallback to listUsers if Method 1 failed
    if (!user) {
      try {
        console.log('🔍 Method 2: Using admin.listUsers() as fallback...');
        const { data: userListData, error: userListError } = await supabase.auth.admin.listUsers();
        
        if (userListError) {
          console.error('❌ Error with listUsers:', userListError);
        } else if (userListData?.users) {
          console.log('📊 Total users found in listUsers:', userListData.users.length);
          
          // Case-insensitive email lookup
          user = userListData.users.find(u => 
            u.email?.toLowerCase() === email.toLowerCase()
          );
          
          if (user) {
            console.log('✅ User found via listUsers:', {
              id: user.id,
              email: user.email,
              created_at: user.created_at
            });
          } else {
            console.log('❌ User not found in listUsers result');
            console.log('📋 Available emails:', userListData.users.slice(0, 5).map(u => u.email));
          }
        }
      } catch (listError) {
        console.error('❌ listUsers method failed:', listError);
      }
    }

    // Method 3: Last resort - try to get user by email using auth admin
    if (!user) {
      try {
        console.log('🔍 Method 3: Direct auth admin lookup...');
        const { data: directUserData, error: directUserError } = await supabase.auth.admin.getUserById(email);
        
        if (!directUserError && directUserData?.user) {
          user = directUserData.user;
          console.log('✅ Got user via direct lookup');
        } else {
          console.log('❌ Direct lookup failed:', directUserError?.message);
        }
      } catch (directError) {
        console.error('❌ Direct auth lookup failed:', directError);
      }
    }

    if (!user) {
      console.log('❌ User not found after all lookup methods for email:', email);
      // Return success anyway for security (don't reveal if email exists)
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "If the email exists, a reset link has been sent",
          debug: {
            userFound: false,
            email: email,
            methods_tried: ['profiles_table', 'list_users', 'direct_lookup']
          }
        }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log('✅ User found, proceeding with token generation for user ID:', user.id);

    // Generate a custom secure token
    console.log('🎫 Creating reset token in database...');
    const { data: tokenData, error: tokenError } = await supabase
      .from('password_reset_tokens')
      .insert({
        user_id: user.id,
        email: email.toLowerCase() // Store in lowercase for consistency
      })
      .select('token')
      .single();

    if (tokenError || !tokenData) {
      console.error('❌ Error creating reset token:', tokenError);
      console.log('🔍 Token error details:', {
        code: tokenError?.code,
        message: tokenError?.message,
        details: tokenError?.details,
        hint: tokenError?.hint
      });
      throw new Error('Failed to create reset token: ' + (tokenError?.message || 'Unknown error'));
    }

    console.log('✅ Reset token created successfully:', tokenData.token.substring(0, 8) + '...');

    // Create reset URL with custom token
    const resetUrl = `${redirectUrl}?token=${tokenData.token}`;
    console.log('🔗 Generated reset URL successfully');

    // Send branded email using Resend
    console.log('📧 Attempting to send email via Resend...');
    
    if (!Deno.env.get("RESEND_API_KEY")) {
      console.error('❌ RESEND_API_KEY is not configured');
      throw new Error('Email service not configured - missing RESEND_API_KEY');
    }

    const emailResponse = await resend.emails.send({
      from: "Wiggly Support <noreply@wiggly.co.in>",
      to: [email],
      subject: "Reset Your Wiggly Password - Secure Link Inside",
      html: createBrandedEmailTemplate(resetUrl, email),
      headers: {
        'X-Entity-Ref-ID': `password-reset-${Date.now()}`,
      },
    });

    if (emailResponse.error) {
      console.error('❌ Resend error details:', {
        error: emailResponse.error,
        message: emailResponse.error.message,
        name: emailResponse.error.name
      });
      throw new Error(`Email sending failed: ${emailResponse.error.message}`);
    }

    console.log('✅ Password reset email sent successfully!');
    console.log('📧 Resend response:', {
      id: emailResponse.data?.id,
      from: "noreply@wiggly.co.in",
      to: email
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Password reset email sent successfully",
        emailId: emailResponse.data?.id,
        debug: {
          userFound: true,
          userId: user.id,
          tokenCreated: true,
          emailSent: true,
          resendId: emailResponse.data?.id
        }
      }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error: any) {
    console.error("💥 Error in password reset function:", error);
    console.error("📊 Error details:", {
      name: error.name,
      message: error.message,
      stack: error.stack?.split('\n').slice(0, 5) // Limit stack trace
    });
    
    return new Response(
      JSON.stringify({ 
        error: error.message || "Failed to send password reset email",
        details: error.toString(),
        debug: {
          timestamp: new Date().toISOString(),
          hasResendKey: !!Deno.env.get("RESEND_API_KEY"),
          hasSupabaseUrl: !!supabaseUrl,
          hasServiceKey: !!supabaseServiceKey
        }
      }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
};

serve(handler);
