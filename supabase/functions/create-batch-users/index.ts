
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface BatchUser {
  name?: string;
  email: string;
  phone?: string;
}

interface CreateBatchUsersRequest {
  users: BatchUser[];
  courseId: string;
  courseName: string;
}

interface BatchResult {
  email: string;
  status: 'created' | 'already_exists_enrolled' | 'already_exists_now_enrolled' | 'failed';
  message: string;
  userId?: string;
}

// Generate secure random password
function generateRandomPassword(): string {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*';
  const allChars = uppercase + lowercase + numbers + symbols;
  
  let password = '';
  
  // Ensure at least one character from each category
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];
  
  // Fill remaining 8 characters randomly
  for (let i = 4; i < 12; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    const resend = new Resend(Deno.env.get('RESEND_API_KEY'));
    
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    
    // Verify admin access
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Check if user is admin
    const { data: adminCheck } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single();

    if (!adminCheck) {
      return new Response(JSON.stringify({ error: 'Admin access required' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const { users, courseId, courseName }: CreateBatchUsersRequest = await req.json();

    console.log(`Smart batch processing for course: ${courseName} (${courseId})`);
    console.log(`Users to process: ${users.length}`);

    const results: BatchResult[] = [];

    for (const userData of users) {
      try {
        console.log(`Processing user: ${userData.email}`);

        // First, check if user already exists by email
        const { data: existingUser, error: userCheckError } = await supabaseAdmin.auth.admin.listUsers();
        
        if (userCheckError) {
          console.error(`Error checking existing users:`, userCheckError);
          results.push({
            email: userData.email,
            status: 'failed',
            message: 'Failed to check if user exists'
          });
          continue;
        }

        const userExists = existingUser.users.find(u => u.email === userData.email);

        if (userExists) {
          console.log(`User ${userData.email} already exists with ID: ${userExists.id}`);
          
          // Check if user is already enrolled in this course
          const { data: enrollment, error: enrollmentCheckError } = await supabaseAdmin
            .from('user_enrollments')
            .select('id, status')
            .eq('user_id', userExists.id)
            .eq('course_id', courseId)
            .single();

          if (enrollmentCheckError && enrollmentCheckError.code !== 'PGRST116') {
            console.error(`Error checking enrollment for ${userData.email}:`, enrollmentCheckError);
            results.push({
              email: userData.email,
              status: 'failed',
              message: 'Failed to check enrollment status'
            });
            continue;
          }

          if (enrollment) {
            // User is already enrolled
            console.log(`User ${userData.email} is already enrolled in the course`);
            results.push({
              email: userData.email,
              status: 'already_exists_enrolled',
              message: 'User already enrolled in course',
              userId: userExists.id
            });
            continue;
          }

          // User exists but not enrolled - enroll them
          console.log(`Enrolling existing user ${userData.email} in course`);
          const { error: enrollError } = await supabaseAdmin
            .from('user_enrollments')
            .insert({
              user_id: userExists.id,
              course_id: courseId,
              status: 'active'
            });

          if (enrollError) {
            console.error(`Failed to enroll existing user ${userData.email}:`, enrollError);
            results.push({
              email: userData.email,
              status: 'failed',
              message: 'Failed to enroll existing user'
            });
            continue;
          }

          // Create batch_users record for tracking
          const { error: batchError } = await supabaseAdmin
            .from('batch_users')
            .insert({
              user_id: userExists.id,
              batch_id: courseId,
              default_password: null, // No new password since user exists
              created_by: user.id
            });

          if (batchError) {
            console.error(`Failed to create batch_users record for ${userData.email}:`, batchError);
          }

          results.push({
            email: userData.email,
            status: 'already_exists_now_enrolled',
            message: 'Existing user enrolled in course',
            userId: userExists.id
          });

          console.log(`Successfully enrolled existing user: ${userData.email}`);
          continue;
        }

        // User doesn't exist - create new account
        console.log(`Creating new user account for: ${userData.email}`);
        const password = generateRandomPassword();

        const { data: authUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
          email: userData.email,
          password: password,
          email_confirm: true,
          user_metadata: {
            full_name: userData.name || 'Batch User'
          }
        });

        if (createError) {
          console.error(`Failed to create auth user for ${userData.email}:`, createError);
          results.push({
            email: userData.email,
            status: 'failed',
            message: createError.message
          });
          continue;
        }

        console.log(`Auth user created for ${userData.email}: ${authUser.user.id}`);

        // Create profile
        const { error: profileError } = await supabaseAdmin
          .from('profiles')
          .insert({
            id: authUser.user.id,
            email: userData.email,
            full_name: userData.name || 'Batch User',
            phone: userData.phone
          });

        if (profileError) {
          console.error(`Failed to create profile for ${userData.email}:`, profileError);
          // Continue anyway, profile might already exist
        }

        // Create batch_users record
        const { error: batchError } = await supabaseAdmin
          .from('batch_users')
          .insert({
            user_id: authUser.user.id,
            batch_id: courseId,
            default_password: password,
            created_by: user.id
          });

        if (batchError) {
          console.error(`Failed to create batch_users record for ${userData.email}:`, batchError);
        }

        // Enroll user in course
        const { error: enrollError } = await supabaseAdmin
          .from('user_enrollments')
          .insert({
            user_id: authUser.user.id,
            course_id: courseId,
            status: 'active'
          });

        if (enrollError) {
          console.error(`Failed to enroll user ${userData.email} in course:`, enrollError);
        }

        // Send welcome email for new users only
        try {
          const emailResult = await resend.emails.send({
            from: 'Wiggly Platform <noreply@wiggly.co.in>',
            to: [userData.email],
            subject: 'Welcome to Wiggly Platform - Your Account is Ready!',
            html: `
              <!DOCTYPE html>
              <html>
                <head>
                  <meta charset="utf-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>Welcome to Wiggly Platform</title>
                </head>
                <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                    <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to Wiggly Platform!</h1>
                    <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Your trading academy account is ready</p>
                  </div>
                  
                  <div style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
                    <h2 style="color: #333; margin-top: 0;">Hello ${userData.name || 'Trader'}!</h2>
                    
                    <p>Welcome to the Wiggly Platform! Your account has been created and you're now enrolled in <strong>${courseName}</strong>.</p>
                    
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0;">
                      <h3 style="margin-top: 0; color: #495057;">Your Login Credentials</h3>
                      <p style="margin: 10px 0;"><strong>Email:</strong> ${userData.email}</p>
                      <p style="margin: 10px 0;"><strong>Password:</strong> <code style="background: #e9ecef; padding: 4px 8px; border-radius: 4px; font-family: monospace;">${password}</code></p>
                      
                      <a href="https://wiggly.co.in/login" 
                         style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; margin-top: 15px; font-weight: bold;">
                        Login to Your Account
                      </a>
                    </div>
                    
                    <div style="background: #d1ecf1; padding: 15px; border-radius: 6px; margin: 20px 0;">
                      <h4 style="margin-top: 0; color: #0c5460;">Course Enrollment Confirmed</h4>
                      <p style="margin-bottom: 0; color: #0c5460;">✅ You're now enrolled in: <strong>${courseName}</strong></p>
                    </div>
                    
                    <h3 style="color: #333;">What's Next?</h3>
                    <ul>
                      <li>Login to your account using the credentials above</li>
                      <li>Complete your profile setup</li>
                      <li>Start your trading education journey</li>
                      <li>Access all platform features including trade journaling, analytics, and more</li>
                    </ul>
                    
                    <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
                    
                    <p style="color: #666; font-size: 14px;">
                      If you have any questions or need assistance, please don't hesitate to contact our support team.
                    </p>
                    
                    <p style="color: #666; font-size: 14px; margin-bottom: 0;">
                      Best regards,<br>
                      <strong>The Wiggly Team</strong>
                    </p>
                  </div>
                </body>
              </html>
            `
          });

          console.log(`Welcome email sent to ${userData.email}:`, emailResult);
        } catch (emailError) {
          console.error(`Failed to send welcome email to ${userData.email}:`, emailError);
          // Continue anyway, user account is created
        }

        results.push({
          email: userData.email,
          status: 'created',
          message: 'New account created and enrolled',
          userId: authUser.user.id
        });

        console.log(`Successfully created new user: ${userData.email}`);

      } catch (error) {
        console.error(`Error processing user ${userData.email}:`, error);
        results.push({
          email: userData.email,
          status: 'failed',
          message: error.message || 'Unknown error occurred'
        });
      }
    }

    const summary = {
      created: results.filter(r => r.status === 'created').length,
      enrolled: results.filter(r => r.status === 'already_exists_now_enrolled').length,
      alreadyEnrolled: results.filter(r => r.status === 'already_exists_enrolled').length,
      failed: results.filter(r => r.status === 'failed').length
    };

    console.log(`Smart batch processing complete:`, summary);

    return new Response(JSON.stringify({
      success: true,
      ...summary,
      results
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in smart batch processing function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
};

serve(handler);
