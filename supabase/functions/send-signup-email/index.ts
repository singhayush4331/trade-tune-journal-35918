
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

interface SignupEmailRequest {
  email: string;
  redirectUrl: string;
  fullName?: string;
  signupType?: 'wiggly' | 'haven_ark' | 'academy';
}

const createWigglySignupEmailTemplate = (confirmationUrl: string, email: string, fullName?: string) => {
  const displayName = fullName || email.split('@')[0];
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Wiggly - Confirm Your Email</title>
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
    
    .welcome-message {
      font-size: 16px;
      margin-bottom: 30px;
      color: #4b5563;
      line-height: 1.7;
    }
    
    .confirm-button {
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
    
    .confirm-button:hover {
      transform: translateY(-1px);
    }
    
    .features-section {
      background-color: #f9fafb;
      padding: 20px;
      border-radius: 8px;
      margin: 30px 0;
    }
    
    .features-title {
      color: #1f2937;
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 15px;
      text-align: center;
    }
    
    .feature-list {
      list-style: none;
      padding: 0;
    }
    
    .feature-item {
      display: flex;
      align-items: center;
      padding: 8px 0;
      color: #4b5563;
      font-size: 14px;
    }
    
    .feature-icon {
      color: #10b981;
      margin-right: 10px;
      font-weight: bold;
    }
    
    .security-notice {
      background-color: #fef3c7;
      color: #92400e;
      padding: 15px;
      border-radius: 6px;
      font-size: 14px;
      margin: 20px 0;
      border: 1px solid #fcd34d;
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
    
    @media (max-width: 600px) {
      .email-container {
        margin: 0;
        border-radius: 0;
      }
      
      .content, .header, .footer {
        padding: 20px;
      }
      
      .confirm-button {
        display: block;
        text-align: center;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <div class="logo">Wiggly</div>
      <div class="header-subtitle">Trading Journal Platform</div>
    </div>
    
    <div class="content">
      <div class="greeting">Welcome to Wiggly, ${displayName}! 👋</div>
      
      <div class="welcome-message">
        Thank you for signing up for <strong>Wiggly</strong>, the comprehensive trading journal platform designed to help you track, analyze, and improve your trading performance.
        <br><br>
        To get started and secure your account, please confirm your email address by clicking the button below:
      </div>
      
      <div style="text-align: center;">
        <a href="${confirmationUrl}" class="confirm-button">Confirm Your Email Address</a>
      </div>
      
      <div class="features-section">
        <div class="features-title">🚀 What's waiting for you:</div>
        <ul class="feature-list">
          <li class="feature-item">
            <span class="feature-icon">✓</span>
            Advanced trade journaling and analytics
          </li>
          <li class="feature-item">
            <span class="feature-icon">✓</span>
            Performance tracking and insights
          </li>
          <li class="feature-item">
            <span class="feature-icon">✓</span>
            Risk management tools
          </li>
          <li class="feature-item">
            <span class="feature-icon">✓</span>
            Trading calendar and screenshots
          </li>
          <li class="feature-item">
            <span class="feature-icon">✓</span>
            Playbook strategies and automation
          </li>
        </ul>
      </div>
      
      <div class="security-notice">
        ⏰ <strong>Important:</strong> This confirmation link will expire in 24 hours for security reasons. Please confirm your email soon to start using your account.
      </div>
      
      <div class="welcome-message">
        If the button above doesn't work, you can copy and paste this link into your browser:
        <br>
        <div style="background-color: #f3f4f6; padding: 10px; border-radius: 4px; margin: 10px 0; word-break: break-all; font-family: monospace; font-size: 12px;">
          ${confirmationUrl}
        </div>
      </div>
      
      <div class="welcome-message">
        <strong>Need help getting started?</strong> Once your email is confirmed, you'll be guided through a quick onboarding process to set up your trading profile and preferences.
      </div>
    </div>
    
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

const createHavenArkSignupEmailTemplate = (confirmationUrl: string, email: string, fullName?: string) => {
  const displayName = fullName || email.split('@')[0];
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Haven Ark Masterclass - Confirm Your Email</title>
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
      background-color: #0A0B0D;
    }
    
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #1a1a1a;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 255, 136, 0.1);
    }
    
    .header {
      background: linear-gradient(135deg, #00FF88 0%, #00E87A 100%);
      color: black;
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
      color: #ffffff;
    }
    
    .greeting {
      font-size: 18px;
      margin-bottom: 20px;
      color: #ffffff;
    }
    
    .welcome-message {
      font-size: 16px;
      margin-bottom: 30px;
      color: #e5e7eb;
      line-height: 1.7;
    }
    
    .confirm-button {
      display: inline-block;
      background: linear-gradient(135deg, #00FF88 0%, #00E87A 100%);
      color: black;
      text-decoration: none;
      padding: 16px 32px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 16px;
      text-align: center;
      margin: 20px 0;
      transition: transform 0.2s ease;
    }
    
    .confirm-button:hover {
      transform: translateY(-1px);
    }
    
    .features-section {
      background-color: rgba(0, 255, 136, 0.1);
      padding: 20px;
      border-radius: 8px;
      margin: 30px 0;
      border: 1px solid rgba(0, 255, 136, 0.2);
    }
    
    .features-title {
      color: #00FF88;
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 15px;
      text-align: center;
    }
    
    .feature-list {
      list-style: none;
      padding: 0;
    }
    
    .feature-item {
      display: flex;
      align-items: center;
      padding: 8px 0;
      color: #e5e7eb;
      font-size: 14px;
    }
    
    .feature-icon {
      color: #00FF88;
      margin-right: 10px;
      font-weight: bold;
    }
    
    .security-notice {
      background-color: rgba(0, 255, 136, 0.1);
      color: #00FF88;
      padding: 15px;
      border-radius: 6px;
      font-size: 14px;
      margin: 20px 0;
      border: 1px solid rgba(0, 255, 136, 0.3);
    }
    
    .footer {
      background-color: rgba(0, 255, 136, 0.05);
      padding: 30px;
      text-align: center;
      border-top: 1px solid rgba(0, 255, 136, 0.2);
    }
    
    .footer-text {
      font-size: 14px;
      color: #9ca3af;
      margin-bottom: 10px;
    }
    
    .footer-links {
      font-size: 12px;
      color: #6b7280;
    }
    
    .footer-links a {
      color: #00FF88;
      text-decoration: none;
      margin: 0 10px;
    }
    
    @media (max-width: 600px) {
      .email-container {
        margin: 0;
        border-radius: 0;
      }
      
      .content, .header, .footer {
        padding: 20px;
      }
      
      .confirm-button {
        display: block;
        text-align: center;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <div class="logo">Haven Ark</div>
      <div class="header-subtitle">Elite Trading Masterclass</div>
    </div>
    
    <div class="content">
      <div class="greeting">Welcome to Haven Ark, ${displayName}! 🚀</div>
      
      <div class="welcome-message">
        Thank you for joining <strong>Haven Ark Masterclass</strong>, India's premier elite trading education platform. You're now part of an exclusive community of 2,500+ successful traders learning institutional-grade strategies.
        <br><br>
        To access your masterclass and secure your account, please confirm your email address by clicking the button below:
      </div>
      
      <div style="text-align: center;">
        <a href="${confirmationUrl}" class="confirm-button">Confirm Your Email & Access Masterclass</a>
      </div>
      
      <div class="features-section">
        <div class="features-title">🎯 Your Elite Masterclass Includes:</div>
        <ul class="feature-list">
          <li class="feature-item">
            <span class="feature-icon">✓</span>
            Institutional-grade trading strategies
          </li>
          <li class="feature-item">
            <span class="feature-icon">✓</span>
            Live mentorship from SEBI registered experts
          </li>
          <li class="feature-item">
            <span class="feature-icon">✓</span>
            Real-time market analysis sessions
          </li>
          <li class="feature-item">
            <span class="feature-icon">✓</span>
            Advanced risk management techniques
          </li>
          <li class="feature-item">
            <span class="feature-icon">✓</span>
            Access to exclusive trading community
          </li>
        </ul>
      </div>
      
      <div class="security-notice">
        ⏰ <strong>Important:</strong> This confirmation link will expire in 24 hours for security reasons. Please confirm your email soon to start your masterclass journey.
      </div>
      
      <div class="welcome-message">
        If the button above doesn't work, you can copy and paste this link into your browser:
        <br>
        <div style="background-color: rgba(0, 255, 136, 0.1); padding: 10px; border-radius: 4px; margin: 10px 0; word-break: break-all; font-family: monospace; font-size: 12px; color: #00FF88;">
          ${confirmationUrl}
        </div>
      </div>
      
      <div class="welcome-message">
        <strong>Ready to master institutional trading?</strong> Once your email is confirmed, you'll get immediate access to your masterclass dashboard and can start your journey with the elite trading community.
      </div>
    </div>
    
    <div class="footer">
      <div class="footer-text">
        <strong>Haven Ark Masterclass</strong><br>
        India's Premier Elite Trading Education Platform
      </div>
      <div class="footer-links">
        <a href="https://wiggly.co.in/haven-ark">Visit Haven Ark</a> |
        <a href="https://wiggly.co.in/support">Support</a> |
        <a href="https://wiggly.co.in/privacy">Privacy Policy</a>
      </div>
      <div style="margin-top: 15px; font-size: 12px; color: #6b7280;">
        © 2024 Haven Ark. All rights reserved.
      </div>
    </div>
  </div>
</body>
</html>
  `;
};

const createAcademySignupEmailTemplate = (confirmationUrl: string, email: string, fullName?: string) => {
  const displayName = fullName || email.split('@')[0];
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Wiggly Academy - Confirm Your Email</title>
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
      background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
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
    
    .welcome-message {
      font-size: 16px;
      margin-bottom: 30px;
      color: #4b5563;
      line-height: 1.7;
    }
    
    .confirm-button {
      display: inline-block;
      background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
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
    
    .confirm-button:hover {
      transform: translateY(-1px);
    }
    
    .features-section {
      background-color: #f0f9ff;
      padding: 20px;
      border-radius: 8px;
      margin: 30px 0;
      border: 1px solid #e0f2fe;
    }
    
    .features-title {
      color: #1f2937;
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 15px;
      text-align: center;
    }
    
    .feature-list {
      list-style: none;
      padding: 0;
    }
    
    .feature-item {
      display: flex;
      align-items: center;
      padding: 8px 0;
      color: #4b5563;
      font-size: 14px;
    }
    
    .feature-icon {
      color: #3b82f6;
      margin-right: 10px;
      font-weight: bold;
    }
    
    .security-notice {
      background-color: #fef3c7;
      color: #92400e;
      padding: 15px;
      border-radius: 6px;
      font-size: 14px;
      margin: 20px 0;
      border: 1px solid #fcd34d;
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
      color: #3b82f6;
      text-decoration: none;
      margin: 0 10px;
    }
    
    @media (max-width: 600px) {
      .email-container {
        margin: 0;
        border-radius: 0;
      }
      
      .content, .header, .footer {
        padding: 20px;
      }
      
      .confirm-button {
        display: block;
        text-align: center;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <div class="logo">Wiggly Academy</div>
      <div class="header-subtitle">Learn. Trade. Excel.</div>
    </div>
    
    <div class="content">
      <div class="greeting">Welcome to Wiggly Academy, ${displayName}! 📚</div>
      
      <div class="welcome-message">
        Thank you for joining <strong>Wiggly Academy</strong>, your comprehensive trading education platform. You're now part of a community dedicated to mastering the art and science of trading through structured learning.
        <br><br>
        To access your courses and secure your account, please confirm your email address by clicking the button below:
      </div>
      
      <div style="text-align: center;">
        <a href="${confirmationUrl}" class="confirm-button">Confirm Your Email & Start Learning</a>
      </div>
      
      <div class="features-section">
        <div class="features-title">📖 Your Academy Experience Includes:</div>
        <ul class="feature-list">
          <li class="feature-item">
            <span class="feature-icon">✓</span>
            Comprehensive trading courses and modules
          </li>
          <li class="feature-item">
            <span class="feature-icon">✓</span>
            Interactive quizzes and assessments
          </li>
          <li class="feature-item">
            <span class="feature-icon">✓</span>
            Progress tracking and certifications
          </li>
          <li class="feature-item">
            <span class="feature-icon">✓</span>
            Expert-curated learning materials
          </li>
          <li class="feature-item">
            <span class="feature-icon">✓</span>
            Community discussions and support
          </li>
        </ul>
      </div>
      
      <div class="security-notice">
        ⏰ <strong>Important:</strong> This confirmation link will expire in 24 hours for security reasons. Please confirm your email soon to start your learning journey.
      </div>
      
      <div class="welcome-message">
        If the button above doesn't work, you can copy and paste this link into your browser:
        <br>
        <div style="background-color: #f3f4f6; padding: 10px; border-radius: 4px; margin: 10px 0; word-break: break-all; font-family: monospace; font-size: 12px;">
          ${confirmationUrl}
        </div>
      </div>
      
      <div class="welcome-message">
        <strong>Ready to start your trading education?</strong> Once your email is confirmed, you'll have access to your personalized learning dashboard and can begin your first course.
      </div>
    </div>
    
    <div class="footer">
      <div class="footer-text">
        <strong>Wiggly Academy</strong><br>
        Your Gateway to Trading Excellence
      </div>
      <div class="footer-links">
        <a href="https://wiggly.co.in/academy">Visit Academy</a> |
        <a href="https://wiggly.co.in/support">Support</a> |
        <a href="https://wiggly.co.in/privacy">Privacy Policy</a>
      </div>
      <div style="margin-top: 15px; font-size: 12px; color: #9ca3af;">
        © 2024 Wiggly Academy. All rights reserved.
      </div>
    </div>
  </div>
</body>
</html>
  `;
};

const handler = async (req: Request): Promise<Response> => {
  console.log('Signup email function called');
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const { email, redirectUrl, fullName, signupType = 'wiggly' }: SignupEmailRequest = await req.json();
    console.log('Processing signup email for:', email, 'with signup type:', signupType);

    if (!email || !redirectUrl) {
      throw new Error("Email and redirect URL are required");
    }

    // Generate email confirmation token using Supabase Auth Admin API
    const { data, error } = await supabase.auth.admin.generateLink({
      type: 'signup',
      email: email,
      options: {
        redirectTo: redirectUrl
      }
    });

    if (error) {
      console.error('Error generating confirmation link:', error);
      throw error;
    }

    if (!data.properties?.action_link) {
      throw new Error('Failed to generate confirmation link');
    }

    const confirmationUrl = data.properties.action_link;
    console.log('Generated confirmation URL successfully');

    // Select appropriate email template based on signup type
    let emailHtml: string;
    let emailSubject: string;
    let fromAddress: string;

    switch (signupType) {
      case 'haven_ark':
        emailHtml = createHavenArkSignupEmailTemplate(confirmationUrl, email, fullName);
        emailSubject = "Welcome to Haven Ark Masterclass - Confirm Your Email";
        fromAddress = "Haven Ark Team <noreply@wiggly.co.in>";
        break;
      case 'academy':
        emailHtml = createAcademySignupEmailTemplate(confirmationUrl, email, fullName);
        emailSubject = "Welcome to Wiggly Academy - Confirm Your Email";
        fromAddress = "Wiggly Academy Team <noreply@wiggly.co.in>";
        break;
      case 'wiggly':
      default:
        emailHtml = createWigglySignupEmailTemplate(confirmationUrl, email, fullName);
        emailSubject = "Welcome to Wiggly - Confirm Your Email Address";
        fromAddress = "Wiggly Team <noreply@wiggly.co.in>";
        break;
    }

    // Send branded email using Resend
    const emailResponse = await resend.emails.send({
      from: fromAddress,
      to: [email],
      subject: emailSubject,
      html: emailHtml,
      headers: {
        'X-Entity-Ref-ID': `signup-confirmation-${signupType}-${Date.now()}`,
      },
    });

    if (emailResponse.error) {
      console.error('Resend error:', emailResponse.error);
      throw new Error(`Email sending failed: ${emailResponse.error.message}`);
    }

    console.log(`${signupType} signup confirmation email sent successfully:`, emailResponse.data?.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `${signupType} signup confirmation email sent successfully`,
        emailId: emailResponse.data?.id,
        signupType: signupType
      }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error: any) {
    console.error("Error in signup email function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message || "Failed to send signup confirmation email",
        details: error.toString()
      }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
};

serve(handler);
