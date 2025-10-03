
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the admin key
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Only allow POST requests
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), { 
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // Verify the user making the request is an admin
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'No authorization header' }), { 
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    const token = authHeader.replace('Bearer ', '');
    const {
      data: { user: callerUser },
      error: authError,
    } = await supabase.auth.getUser(token);
    
    if (authError || !callerUser) {
      return new Response(JSON.stringify({ error: 'Unauthorized request' }), { 
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // Check if the caller is an admin
    const { data: isAdmin, error: adminCheckError } = await supabase
      .rpc('is_admin_secure', { check_user_id: callerUser.id });
      
    if (adminCheckError || !isAdmin) {
      return new Response(JSON.stringify({ error: 'Unauthorized: Admin access required' }), { 
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // Parse the request to get the user ID to delete
    const { userId } = await req.json();
    
    if (!userId) {
      return new Response(JSON.stringify({ error: 'User ID is required' }), { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Check if the user is trying to delete themselves
    if (userId === callerUser.id) {
      return new Response(JSON.stringify({ error: 'Cannot delete your own admin account' }), { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    console.log(`Admin ${callerUser.email} is deleting user with ID: ${userId}`);
    
    // Step 1: Delete user roles first
    console.log('Deleting user roles...');
    const { error: rolesError } = await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', userId);
    
    if (rolesError) {
      console.error('Error deleting user roles:', rolesError);
      return new Response(JSON.stringify({ error: `Failed to delete user roles: ${rolesError.message}` }), { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // Step 2: Delete user trades
    console.log('Deleting user trades...');
    const { error: tradesError } = await supabase
      .from('trades')
      .delete()
      .eq('user_id', userId);
    
    if (tradesError) {
      console.error('Error deleting user trades:', tradesError);
      // Continue with deletion, don't fail here
    }
    
    // Step 3: Delete user notes
    console.log('Deleting user notes...');
    const { error: notesError } = await supabase
      .from('notes')
      .delete()
      .eq('user_id', userId);
    
    if (notesError) {
      console.error('Error deleting user notes:', notesError);
      // Continue with deletion, don't fail here
    }
    
    // Step 4: Delete user playbooks
    console.log('Deleting user playbooks...');
    const { error: playbooksError } = await supabase
      .from('playbooks')
      .delete()
      .eq('user_id', userId);
    
    if (playbooksError) {
      console.error('Error deleting user playbooks:', playbooksError);
      // Continue with deletion, don't fail here
    }
    
    // Step 5: Delete user funds
    console.log('Deleting user funds...');
    const { error: fundsError } = await supabase
      .from('funds')
      .delete()
      .eq('user_id', userId);
    
    if (fundsError) {
      console.error('Error deleting user funds:', fundsError);
      // Continue with deletion, don't fail here
    }
    
    // Step 6: Delete user subscriptions
    console.log('Deleting user subscriptions...');
    const { error: subscriptionsError } = await supabase
      .from('subscriptions')
      .delete()
      .eq('user_id', userId);
    
    if (subscriptionsError) {
      console.error('Error deleting user subscriptions:', subscriptionsError);
      // Continue with deletion, don't fail here
    }
    
    // Step 7: Delete user enrollments
    console.log('Deleting user enrollments...');
    const { error: enrollmentsError } = await supabase
      .from('user_enrollments')
      .delete()
      .eq('user_id', userId);
    
    if (enrollmentsError) {
      console.error('Error deleting user enrollments:', enrollmentsError);
      // Continue with deletion, don't fail here
    }
    
    // Step 8: Delete user progress
    console.log('Deleting user progress...');
    const { error: progressError } = await supabase
      .from('user_progress')
      .delete()
      .eq('user_id', userId);
    
    if (progressError) {
      console.error('Error deleting user progress:', progressError);
      // Continue with deletion, don't fail here
    }
    
    // Step 9: Delete broker connections
    console.log('Deleting broker connections...');
    const { error: brokersError } = await supabase
      .from('broker_connections')
      .delete()
      .eq('user_id', userId);
    
    if (brokersError) {
      console.error('Error deleting broker connections:', brokersError);
      // Continue with deletion, don't fail here
    }
    
    // Step 10: Delete user profile (this was the missing step!)
    console.log('Deleting user profile...');
    const { error: profileError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);
    
    if (profileError) {
      console.error('Error deleting user profile:', profileError);
      return new Response(JSON.stringify({ error: `Failed to delete user profile: ${profileError.message}` }), { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // Step 11: Finally, delete the user from auth.users
    console.log('Deleting user from auth...');
    const { error: deleteError } = await supabase.auth.admin.deleteUser(
      userId,
      true // Soft delete option, true to completely delete the user
    );
    
    if (deleteError) {
      console.error('Error deleting user from auth:', deleteError);
      return new Response(JSON.stringify({ error: `Failed to delete user from auth: ${deleteError.message}` }), { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    console.log(`User ${userId} deleted successfully`);
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: 'User deleted successfully',
      deletedData: {
        userId,
        profileDeleted: !profileError,
        rolesDeleted: !rolesError,
        tradesDeleted: !tradesError,
        notesDeleted: !notesError,
        playbooksDeleted: !playbooksError,
        fundsDeleted: !fundsError,
        subscriptionsDeleted: !subscriptionsError,
        enrollmentsDeleted: !enrollmentsError,
        progressDeleted: !progressError,
        brokersDeleted: !brokersError
      }
    }), { 
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(JSON.stringify({ error: `Unexpected error: ${error.message}` }), { 
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
