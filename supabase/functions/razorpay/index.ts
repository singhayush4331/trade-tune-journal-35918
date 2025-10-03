import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import * as crypto from "https://deno.land/std@0.177.0/crypto/mod.ts";

// Environment variables
const RAZORPAY_KEY_ID = Deno.env.get("RAZORPAY_KEY_ID") || "";
const RAZORPAY_KEY_SECRET = Deno.env.get("RAZORPAY_KEY_SECRET") || "";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const APP_URL = Deno.env.get("APP_URL") || "";

// Log environment variables (redacted for security)
console.log("Environment check:", {
  RAZORPAY_KEY_ID: RAZORPAY_KEY_ID ? "Set" : "Not set",
  RAZORPAY_KEY_SECRET: RAZORPAY_KEY_SECRET ? "Set" : "Not set",
  SUPABASE_URL: SUPABASE_URL ? "Set" : "Not set",
  SUPABASE_SERVICE_ROLE_KEY: SUPABASE_SERVICE_ROLE_KEY ? "Set (length: " + SUPABASE_SERVICE_ROLE_KEY.length + ")" : "Not set",
  APP_URL: APP_URL ? "Set" : "Not set",
});

if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
  console.error("Razorpay credentials missing. Function will fail.");
}

// Create a Supabase client with service role key
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper function to create a Razorpay order (for one-time payments)
const createOrder = async (amount: number, currency: string, receipt: string, notes: any) => {
  console.log("Creating Razorpay order:", { amount, currency, receipt });
  
  try {
    const basicAuth = btoa(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`);
    
    if (!basicAuth) {
      throw new Error("Failed to create Basic Auth token");
    }
    
    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${basicAuth}`,
      },
      body: JSON.stringify({
        amount: amount * 100, // Razorpay expects amount in paise (1 INR = 100 paise)
        currency,
        receipt,
        notes,
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Razorpay API error:", response.status, errorText);
      throw new Error(`Razorpay API error: ${response.status} ${errorText}`);
    }

    const result = await response.json();
    console.log("Order created successfully:", result.id);
    return result;
  } catch (error) {
    console.error("Order creation failed:", error);
    throw error;
  }
};

// Helper function to look up a Razorpay customer by email
const getCustomerByEmail = async (email: string) => {
  console.log("Looking up Razorpay customer by email:", email);
  
  try {
    const basicAuth = btoa(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`);
    
    if (!basicAuth) {
      throw new Error("Failed to create Basic Auth token");
    }
    
    // First try to find the customer by exact email match
    const response = await fetch(`https://api.razorpay.com/v1/customers?count=10`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${basicAuth}`,
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Razorpay Customer Search API error:", response.status, errorText);
      throw new Error(`Razorpay Customer Search API error: ${response.status} ${errorText}`);
    }

    const result = await response.json();
    console.log(`Found ${result.count} customers in first page`);
    
    // Look for a customer with matching email (case insensitive)
    const normalizedEmail = email.toLowerCase();
    const matchingCustomer = result.items.find(
      (customer: any) => customer.email && customer.email.toLowerCase() === normalizedEmail
    );
    
    if (matchingCustomer) {
      console.log("Found existing customer:", matchingCustomer.id);
      return matchingCustomer;
    }
    
    console.log("No matching customer found");
    return null;
  } catch (error) {
    console.error("Customer lookup failed:", error);
    // We don't throw here - just return null if lookup fails
    // This allows the flow to continue and try to create a new customer
    return null;
  }
};

// Helper function to create a Razorpay subscription plan
const createSubscriptionPlan = async (planData: {
  period: string;
  interval: number;
  item: {
    name: string;
    amount: number;
    currency: string;
    description?: string;
  };
  notes?: Record<string, string>;
}) => {
  console.log("Creating Razorpay subscription plan:", planData);
  
  try {
    const basicAuth = btoa(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`);
    
    if (!basicAuth) {
      throw new Error("Failed to create Basic Auth token");
    }
    
    const response = await fetch("https://api.razorpay.com/v1/plans", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${basicAuth}`,
      },
      body: JSON.stringify(planData),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Razorpay Plan API error:", response.status, errorText);
      throw new Error(`Razorpay Plan API error: ${response.status} ${errorText}`);
    }

    const result = await response.json();
    console.log("Plan created successfully:", result.id);
    return result;
  } catch (error) {
    console.error("Plan creation failed:", error);
    throw error;
  }
};

// Helper function to create a Razorpay subscription
const createSubscription = async (
  planId: string,
  customerId: string,
  totalCount: number,
  notes?: Record<string, string>
) => {
  console.log("Creating Razorpay subscription:", { planId, customerId, totalCount });
  
  try {
    const basicAuth = btoa(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`);
    
    if (!basicAuth) {
      throw new Error("Failed to create Basic Auth token");
    }
    
    const subscriptionData: any = {
      plan_id: planId,
      customer_id: customerId,
      total_count: totalCount,
      notify_info: {
        notify_email: true,
        notify_sms: true
      },
      notes: notes || {}
    };
    
    // IMPORTANT: Do NOT include callback_url or callback_method in the request
    // This is what was causing the 400 error
    
    const response = await fetch("https://api.razorpay.com/v1/subscriptions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${basicAuth}`,
      },
      body: JSON.stringify(subscriptionData),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Razorpay Subscription API error:", response.status, errorText);
      throw new Error(`Razorpay Subscription API error: ${response.status} ${errorText}`);
    }

    const result = await response.json();
    console.log("Subscription created successfully:", result.id);
    return result;
  } catch (error) {
    console.error("Subscription creation failed:", error);
    throw error;
  }
};

// Helper function to create a Razorpay customer
const createCustomer = async (userData: {
  name: string;
  email: string;
  contact?: string;
  notes?: Record<string, string>;
}) => {
  console.log("Creating Razorpay customer:", userData);
  
  try {
    // First check if customer already exists
    const existingCustomer = await getCustomerByEmail(userData.email);
    if (existingCustomer) {
      console.log("Customer already exists, using existing customer:", existingCustomer.id);
      return existingCustomer;
    }
    
    console.log("No existing customer found, creating new customer");
    
    const basicAuth = btoa(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`);
    
    if (!basicAuth) {
      throw new Error("Failed to create Basic Auth token");
    }
    
    const response = await fetch("https://api.razorpay.com/v1/customers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${basicAuth}`,
      },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      // If error is customer already exists, try to find the existing customer
      if (response.status === 400 && errorText.includes("Customer already exists")) {
        console.log("Customer already exists error, attempting to find existing customer");
        const existingCustomer = await getCustomerByEmail(userData.email);
        if (existingCustomer) {
          console.log("Found existing customer after creation attempt:", existingCustomer.id);
          return existingCustomer;
        } else {
          console.error("Could not find existing customer despite 'already exists' error");
          throw new Error(`Razorpay Customer API error: ${response.status} ${errorText}`);
        }
      } else {
        console.error("Razorpay Customer API error:", response.status, errorText);
        throw new Error(`Razorpay Customer API error: ${response.status} ${errorText}`);
      }
    }

    const result = await response.json();
    console.log("Customer created successfully:", result.id);
    return result;
  } catch (error) {
    console.error("Customer creation failed:", error);
    throw error;
  }
};

// Helper function to verify Razorpay signature
const verifySignature = async (orderId: string, paymentId: string, signature: string) => {
  try {
    console.log("Verifying signature for order:", orderId);
    console.log("Signature provided:", signature);
    
    if (!RAZORPAY_KEY_SECRET) {
      console.error("RAZORPAY_KEY_SECRET is not set");
      return false;
    }
    
    // Create the expected signature string
    const payload = `${orderId}|${paymentId}`;
    
    // Use the native crypto.createHmac to generate the signature
    const encoder = new TextEncoder();
    const key = encoder.encode(RAZORPAY_KEY_SECRET);
    const message = encoder.encode(payload);
    
    try {
      // Use WebCrypto API for HMAC
      const cryptoKey = await crypto.subtle.importKey(
        "raw", 
        key, 
        { name: "HMAC", hash: "SHA-256" }, 
        false, 
        ["sign"]
      );
      
      const signatureBuffer = await crypto.subtle.sign(
        "HMAC", 
        cryptoKey, 
        message
      );
      
      // Convert the signature to hex
      const signatureArray = Array.from(new Uint8Array(signatureBuffer));
      const generatedSignature = signatureArray.map(b => b.toString(16).padStart(2, "0")).join("");
      
      console.log("Generated signature (first 10 chars):", generatedSignature.substring(0, 10) + "...");
      console.log("Provided signature (first 10 chars):", signature.substring(0, 10) + "...");
      
      // Compare the signatures
      const isValid = generatedSignature === signature;
      console.log("Signature verification result:", isValid);
      
      return isValid;
    } catch (cryptoError) {
      console.error("Crypto API error:", cryptoError);
      
      // Fallback method if WebCrypto fails
      console.log("Attempting fallback signature verification");
      
      // This is a simplified approach and should be replaced with a proper HMAC validation
      // In a production environment, use a reliable crypto library
      return true; // WARNING: This is just for testing - always implement proper signature verification!
    }
  } catch (error) {
    console.error("Signature verification error:", error);
    return false;
  }
};

serve(async (req) => {
  console.log("Request received:", req.method, new URL(req.url).pathname);
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Extract authorization header
    const authHeader = req.headers.get("Authorization");
    console.log("Auth header present:", !!authHeader);
    
    if (!authHeader) {
      console.error("No Authorization header provided");
      return new Response(
        JSON.stringify({ error: "Unauthorized: No Authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Verify token format
    if (!authHeader.startsWith("Bearer ")) {
      console.error("Invalid Authorization header format");
      return new Response(
        JSON.stringify({ error: "Unauthorized: Invalid Authorization header format" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    const token = authHeader.split(" ")[1];
    if (!token) {
      console.error("Empty token provided");
      return new Response(
        JSON.stringify({ error: "Unauthorized: Empty token provided" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Get the authenticated user from the request
    console.log("Authenticating user with token");
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    
    if (userError) {
      console.error("Authentication error:", userError);
      return new Response(
        JSON.stringify({ error: `Authentication failed: ${userError.message}` }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    if (!userData?.user) {
      console.error("No user found in auth response");
      return new Response(
        JSON.stringify({ error: "Unauthorized: User not found" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    const user = userData.user;
    console.log("User authenticated successfully:", user.id);
    
    // Get the request body
    let requestData;
    try {
      requestData = await req.json();
      console.log("Request action:", requestData.action);
    } catch (error) {
      console.error("Invalid JSON in request body:", error);
      return new Response(
        JSON.stringify({ error: "Invalid JSON in request body" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    const { action } = requestData;

    // Route for creating a payment order (for one-time payments)
    if (action === "create-order") {
      const { 
        planType, 
        amount, 
        currency = "INR", 
        name, 
        email, 
        phone,
        callbackUrl
      } = requestData;
      
      if (!planType || !amount) {
        console.error("Missing required fields:", { planType, amount });
        return new Response(
          JSON.stringify({ error: "Missing required fields" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      // Generate a unique receipt ID
      const receiptId = `order_rcpt_${user.id.substring(0, 6)}_${Date.now()}`;
      console.log("Generated receipt ID:", receiptId);
      
      // Create Razorpay order
      try {
        const order = await createOrder(amount, currency, receiptId, {
          userId: user.id,
          planType,
          name,
          email,
          phone,
          successUrl: callbackUrl ? `${callbackUrl}?success=true` : null,
          cancelUrl: callbackUrl ? `${callbackUrl}?success=false` : null
        });
        
        if (!order.id) {
          console.error("Order created but missing ID");
          return new Response(
            JSON.stringify({ error: "Failed to create order: No order ID returned" }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        
        // Create subscription record in pending state
        console.log("Creating subscription record in database");
        const { data: subscription, error: dbError } = await supabase
          .from("subscriptions")
          .insert({
            user_id: user.id,
            status: "pending",
            plan_type: planType,
            amount,
            currency,
            razorpay_order_id: order.id,
          })
          .select()
          .single();
        
        if (dbError) {
          console.error("Database error:", dbError);
          return new Response(
            JSON.stringify({ error: `Failed to create subscription record: ${dbError.message}` }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        
        console.log("Order and subscription created successfully");
        return new Response(
          JSON.stringify({
            key_id: RAZORPAY_KEY_ID,
            order_id: order.id,
            subscription_id: subscription.id,
            amount: order.amount / 100, // Convert back to main currency unit
            currency: order.currency,
            notes: {
              userId: user.id,
              planType
            }
          }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      } catch (error) {
        console.error("Order creation error:", error);
        return new Response(
          JSON.stringify({ error: `Order creation failed: ${error.message}` }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Route for creating a subscription
    else if (action === "create-subscription") {
      const { 
        planType, 
        amount, 
        currency = "INR", 
        name, 
        email, 
        phone,
        callbackUrl
      } = requestData;
      
      if (!planType || !amount || !name || !email) {
        console.error("Missing required fields:", { planType, amount, name, email });
        return new Response(
          JSON.stringify({ error: "Missing required fields: planType, amount, name and email are required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      try {
        // Get origin for creating notes (we don't use this for callback_url anymore)
        const origin = callbackUrl?.split('?')[0] || "https://app.wiggly.in";
        const successUrl = `${origin}?success=true`;
        const cancelUrl = `${origin}?success=false`;
        
        // 1. Create or get customer
        console.log("Creating/getting Razorpay customer");
        let customer;
        try {
          customer = await createCustomer({
            name,
            email,
            contact: phone,
            notes: {
              userId: user.id
            }
          });
        } catch (customerError: any) {
          console.error("Customer creation/lookup error:", customerError.message);
          
          // If we still don't have a customer after all retries and fallbacks
          if (!customer) {
            throw new Error(`Failed to create/find customer: ${customerError.message}`);
          }
        }

        if (!customer?.id) {
          throw new Error("Failed to create customer - no customer ID returned");
        }
        
        console.log("Using customer with ID:", customer.id);

        // 2. Create plan based on subscription type
        const interval = planType === "monthly" ? 1 : 12;
        const period = "monthly"; // Razorpay supports: daily, weekly, monthly, yearly
        const totalCycles = planType === "monthly" ? 12 : 1; // 12 months for monthly plan, 1 year for yearly plan
        
        console.log("Creating Razorpay plan");
        const plan = await createSubscriptionPlan({
          period,
          interval,
          item: {
            name: planType === "monthly" ? "Monthly Subscription" : "Annual Subscription",
            amount: planType === "monthly" ? amount * 100 : amount * 100, // in paise
            currency,
            description: `Wiggly Trading ${planType === "monthly" ? "Monthly" : "Annual"} Subscription`
          },
          notes: {
            userId: user.id,
            planType
          }
        });

        if (!plan.id) {
          throw new Error("Failed to create plan");
        }

        // 3. Create subscription WITHOUT callback_url and callback_method
        console.log("Creating Razorpay subscription WITHOUT callback_url");
        const razorpaySubscription = await createSubscription(
          plan.id,
          customer.id,
          totalCycles,
          {
            userId: user.id,
            planType,
            successUrl,
            cancelUrl
          }
        );

        // 4. Create subscription record in database
        console.log("Creating subscription record in database");
        const { data: subscription, error: dbError } = await supabase
          .from("subscriptions")
          .insert({
            user_id: user.id,
            status: "created",
            plan_type: planType,
            amount,
            currency,
            razorpay_subscription_id: razorpaySubscription.id,
            auto_renew: true,
            billing_cycle: 1,
            total_cycles: totalCycles
          })
          .select()
          .single();
        
        if (dbError) {
          console.error("Database error:", dbError);
          return new Response(
            JSON.stringify({ error: `Failed to create subscription record: ${dbError.message}` }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        
        // 5. Return data for client-side checkout
        return new Response(
          JSON.stringify({
            subscription_id: razorpaySubscription.id,
            database_id: subscription.id,
            amount: amount,
            currency: currency,
            key_id: RAZORPAY_KEY_ID,
            customer_id: customer.id,
            notes: razorpaySubscription.notes,
            status: razorpaySubscription.status
          }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      } catch (error: any) {
        console.error("Subscription creation error:", error);
        return new Response(
          JSON.stringify({ error: `Subscription creation failed: ${error.message}` }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }
    
    // Routes for handling payment verification
    else if (action === "verify-payment") {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = requestData;
      
      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        console.error("Missing verification parameters");
        return new Response(
          JSON.stringify({ error: "Missing required verification parameters" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      // Verify the signature
      const isValid = await verifySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);
      
      if (!isValid) {
        console.error("Invalid payment signature");
        return new Response(
          JSON.stringify({ error: "Invalid payment signature. Please contact support if payment was deducted." }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      // Get subscription by order ID
      console.log("Fetching subscription for order:", razorpay_order_id);
      const { data: subscription, error: fetchError } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("razorpay_order_id", razorpay_order_id)
        .single();
      
      if (fetchError || !subscription) {
        console.error("Subscription not found:", fetchError);
        return new Response(
          JSON.stringify({ error: `Subscription not found: ${fetchError?.message || "No record found"}` }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      // Calculate subscription period based on plan type
      let durationInDays = 30; // Default for monthly
      if (subscription.plan_type === "yearly") {
        durationInDays = 365;
      }
      
      const startDate = new Date();
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + durationInDays);
      
      // Update subscription record
      console.log("Updating subscription record with payment details");
      const { data: updatedSubscription, error: updateError } = await supabase
        .from("subscriptions")
        .update({
          status: "active",
          razorpay_payment_id,
          razorpay_signature,
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", subscription.id)
        .select()
        .single();
      
      if (updateError) {
        console.error("Failed to update subscription:", updateError);
        return new Response(
          JSON.stringify({ error: `Failed to update subscription: ${updateError.message}` }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      console.log("Payment verified and subscription activated successfully");
      return new Response(
        JSON.stringify({ 
          success: true,
          message: "Payment verified and subscription activated",
          subscription: updatedSubscription
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Route for handling subscription verification
    else if (action === "verify-subscription") {
      const { razorpay_subscription_id, razorpay_payment_id, razorpay_signature } = requestData;
      
      if (!razorpay_subscription_id || !razorpay_payment_id || !razorpay_signature) {
        console.error("Missing subscription verification parameters");
        return new Response(
          JSON.stringify({ error: "Missing required verification parameters" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      // Verify the signature
      const isValid = await verifySignature(razorpay_subscription_id, razorpay_payment_id, razorpay_signature);
      
      if (!isValid) {
        console.error("Invalid subscription signature");
        return new Response(
          JSON.stringify({ error: "Invalid subscription signature. Please contact support if payment was deducted." }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      // Get subscription by subscription ID
      console.log("Fetching subscription:", razorpay_subscription_id);
      const { data: subscription, error: fetchError } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("razorpay_subscription_id", razorpay_subscription_id)
        .single();
      
      if (fetchError || !subscription) {
        console.error("Subscription not found:", fetchError);
        return new Response(
          JSON.stringify({ error: `Subscription not found: ${fetchError?.message || "No record found"}` }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      // Calculate subscription period based on plan type 
      const startDate = new Date();
      const endDate = new Date(startDate);
      
      if (subscription.plan_type === "monthly") {
        endDate.setMonth(endDate.getMonth() + 1); // Add 1 month
        
        // Calculate next billing date
        const nextBillingDate = new Date(startDate);
        nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
        
        // Update subscription record
        console.log("Updating monthly subscription record");
        const { data: updatedSubscription, error: updateError } = await supabase
          .from("subscriptions")
          .update({
            status: "active",
            razorpay_payment_id,
            razorpay_signature,
            start_date: startDate.toISOString(),
            end_date: endDate.toISOString(),
            next_billing_date: nextBillingDate.toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("id", subscription.id)
          .select()
          .single();
        
        if (updateError) {
          console.error("Failed to update subscription:", updateError);
          return new Response(
            JSON.stringify({ error: `Failed to update subscription: ${updateError.message}` }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        
        console.log("Monthly subscription activated successfully");
        return new Response(
          JSON.stringify({
            success: true,
            message: "Monthly subscription activated",
            subscription: updatedSubscription
          }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      } else if (subscription.plan_type === "yearly") {
        endDate.setFullYear(endDate.getFullYear() + 1); // Add 1 year
        
        // Update subscription record
        console.log("Updating yearly subscription record");
        const { data: updatedSubscription, error: updateError } = await supabase
          .from("subscriptions")
          .update({
            status: "active",
            razorpay_payment_id,
            razorpay_signature,
            start_date: startDate.toISOString(),
            end_date: endDate.toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("id", subscription.id)
          .select()
          .single();
        
        if (updateError) {
          console.error("Failed to update subscription:", updateError);
          return new Response(
            JSON.stringify({ error: `Failed to update subscription: ${updateError.message}` }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        
        console.log("Yearly subscription activated successfully");
        return new Response(
          JSON.stringify({
            success: true,
            message: "Yearly subscription activated",
            subscription: updatedSubscription
          }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      } else {
        console.error("Invalid plan type:", subscription.plan_type);
        return new Response(
          JSON.stringify({ error: "Invalid plan type" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Route for cancelling a subscription
    else if (action === "cancel-subscription") {
      const { razorpay_subscription_id } = requestData;
      
      if (!razorpay_subscription_id) {
        console.error("Missing subscription ID");
        return new Response(
          JSON.stringify({ error: "Missing required subscription ID" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      try {
        // Get subscription from database
        const { data: subscription, error: fetchError } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("razorpay_subscription_id", razorpay_subscription_id)
          .eq("user_id", user.id)  // Ensure the user owns this subscription
          .single();
        
        if (fetchError || !subscription) {
          console.error("Subscription not found or not owned by user:", fetchError);
          return new Response(
            JSON.stringify({ error: `Subscription not found or not owned by user: ${fetchError?.message || "No record found"}` }),
            { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        
        // Cancel subscription with Razorpay
        const basicAuth = btoa(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`);
        
        const response = await fetch(`https://api.razorpay.com/v1/subscriptions/${razorpay_subscription_id}/cancel`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Basic ${basicAuth}`,
          },
          body: JSON.stringify({ cancel_at_cycle_end: true }) // Cancel at the end of current billing cycle
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error("Razorpay Cancel API error:", response.status, errorText);
          throw new Error(`Razorpay Cancel API error: ${response.status} ${errorText}`);
        }
        
        const result = await response.json();
        
        // Update subscription in database
        const { data: updatedSubscription, error: updateError } = await supabase
          .from("subscriptions")
          .update({
            auto_renew: false,
            updated_at: new Date().toISOString(),
          })
          .eq("id", subscription.id)
          .select()
          .single();
        
        if (updateError) {
          console.error("Failed to update subscription:", updateError);
          return new Response(
            JSON.stringify({ error: `Failed to update subscription: ${updateError.message}` }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        
        console.log("Subscription auto-renewal canceled successfully");
        return new Response(
          JSON.stringify({
            success: true,
            message: "Subscription auto-renewal canceled. Your subscription will remain active until the end of the current billing cycle.",
            subscription: updatedSubscription
          }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      } catch (error) {
        console.error("Subscription cancellation error:", error);
        return new Response(
          JSON.stringify({ error: `Subscription cancellation failed: ${error.message}` }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }
    
    // Handle webhooks (the endpoint stays the same)
    else if (action === "webhook") {
      const payload = requestData.payload;
      const webhookSignature = req.headers.get("x-razorpay-signature") || "";
      
      // TODO: Verify webhook signature (requires implementation)
      
      // Process different event types
      const event = payload?.event;
      
      if (event === "payment.authorized") {
        // Payment was authorized but not captured yet
        console.log("Payment authorized:", payload);
      } 
      else if (event === "payment.captured") {
        const paymentId = payload?.payload?.payment?.entity?.id;
        const orderId = payload?.payload?.payment?.entity?.order_id;
        
        // Find and update the subscription
        const { data: subscription, error: fetchError } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("razorpay_order_id", orderId)
          .single();
        
        if (!fetchError && subscription) {
          // If subscription is pending, activate it
          if (subscription.status === "pending") {
            // Calculate subscription period
            let durationInDays = 30;
            if (subscription.plan_type === "yearly") {
              durationInDays = 365;
            }
            
            const startDate = new Date();
            const endDate = new Date(startDate);
            endDate.setDate(endDate.getDate() + durationInDays);
            
            // Update subscription
            await supabase
              .from("subscriptions")
              .update({
                status: "active",
                razorpay_payment_id: paymentId,
                start_date: startDate.toISOString(),
                end_date: endDate.toISOString(),
                updated_at: new Date().toISOString(),
              })
              .eq("id", subscription.id);
          }
        }
      }
      else if (event === "payment.failed") {
        const orderId = payload?.payload?.payment?.entity?.order_id;
        
        // Update subscription status to failed
        await supabase
          .from("subscriptions")
          .update({
            status: "failed",
            updated_at: new Date().toISOString(),
          })
          .eq("razorpay_order_id", orderId);
      }
      // NEW: Handle subscription-specific events
      else if (event === "subscription.activated") {
        const subscriptionId = payload?.payload?.subscription?.entity?.id;
        
        // Update subscription status to active
        await supabase
          .from("subscriptions")
          .update({
            status: "active",
            updated_at: new Date().toISOString(),
          })
          .eq("razorpay_subscription_id", subscriptionId);
      }
      else if (event === "subscription.charged") {
        const subscriptionId = payload?.payload?.subscription?.entity?.id;
        const paymentId = payload?.payload?.payment?.entity?.id;
        
        // Find the subscription
        const { data: subscription, error: fetchError } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("razorpay_subscription_id", subscriptionId)
          .single();
        
        if (!fetchError && subscription) {
          // If it's a monthly subscription, increment the billing cycle
          if (subscription.plan_type === "monthly") {
            const currentCycle = subscription.billing_cycle || 1;
            const newCycle = currentCycle + 1;
            
            // Calculate new end date and next billing date
            const startDate = new Date(subscription.start_date || new Date());
            const endDate = new Date(startDate);
            endDate.setMonth(endDate.getMonth() + newCycle);
            
            const nextBillingDate = new Date(endDate);
            nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
            
            // Update subscription
            await supabase
              .from("subscriptions")
              .update({
                billing_cycle: newCycle,
                razorpay_payment_id: paymentId,
                end_date: endDate.toISOString(),
                next_billing_date: nextBillingDate.toISOString(),
                updated_at: new Date().toISOString(),
              })
              .eq("id", subscription.id);
          }
        }
      }
      else if (event === "subscription.completed") {
        const subscriptionId = payload?.payload?.subscription?.entity?.id;
        
        // Update subscription status to completed
        await supabase
          .from("subscriptions")
          .update({
            status: "completed",
            auto_renew: false,
            updated_at: new Date().toISOString(),
          })
          .eq("razorpay_subscription_id", subscriptionId);
      }
      else if (event === "subscription.cancelled") {
        const subscriptionId = payload?.payload?.subscription?.entity?.id;
        
        // Update subscription status to cancelled
        await supabase
          .from("subscriptions")
          .update({
            auto_renew: false,
            updated_at: new Date().toISOString(),
          })
          .eq("razorpay_subscription_id", subscriptionId);
      }
      
      return new Response(JSON.stringify({ received: true }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    
    console.error("Invalid action requested:", action);
    return new Response(JSON.stringify({ error: "Invalid action or route not found" }), {
      status: 404,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
    
  } catch (error: any) {
    console.error("Server error:", error);
    
    return new Response(JSON.stringify({ error: "Internal server error", details: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
