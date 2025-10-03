
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

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
  token: string;
  newPassword: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log('🔄 Reset user password function called');
  
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
    const { token, newPassword }: ResetPasswordRequest = await req.json();
    console.log('🔍 Processing password reset with token:', token.substring(0, 8) + '...');

    if (!token || !newPassword) {
      console.log('❌ Missing required fields');
      throw new Error("Token and new password are required");
    }

    // Verify the token and get user details
    console.log('🔍 Verifying reset token...');
    const { data: tokenData, error: tokenError } = await supabase
      .from('password_reset_tokens')
      .select('user_id, email, expires_at, used_at')
      .eq('token', token)
      .single();

    if (tokenError || !tokenData) {
      console.error('❌ Token verification failed:', tokenError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Invalid or expired reset token" 
        }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check if token is expired
    if (new Date(tokenData.expires_at) < new Date()) {
      console.log('❌ Token has expired');
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Reset token has expired" 
        }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check if token has already been used
    if (tokenData.used_at) {
      console.log('❌ Token has already been used');
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Reset token has already been used" 
        }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log('✅ Token is valid, updating password for user:', tokenData.user_id);

    // Update the user's password using admin function
    const { data: updateData, error: updateError } = await supabase.auth.admin.updateUserById(
      tokenData.user_id,
      { password: newPassword }
    );

    if (updateError) {
      console.error('❌ Password update failed:', updateError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Failed to update password" 
        }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log('✅ Password updated successfully');

    // Mark token as used
    const { error: markUsedError } = await supabase
      .from('password_reset_tokens')
      .update({ used_at: new Date().toISOString() })
      .eq('token', token);

    if (markUsedError) {
      console.error('⚠️ Failed to mark token as used:', markUsedError);
      // Don't fail the request for this, password was already updated
    } else {
      console.log('✅ Token marked as used');
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Password updated successfully" 
      }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error: any) {
    console.error("💥 Error in reset user password function:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || "Failed to reset password",
        details: error.toString()
      }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
};

serve(handler);
