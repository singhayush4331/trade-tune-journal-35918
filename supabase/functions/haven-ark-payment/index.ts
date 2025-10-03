import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PaymentRequest {
  paymentType: 'haven_ark_masterclass' | 'wiggly_monthly' | 'wiggly_yearly';
  customerInfo: {
    name: string;
    email: string;
    phone?: string;
  };
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { paymentType, customerInfo }: PaymentRequest = await req.json();

    // Validate required fields
    if (!paymentType || !customerInfo?.name || !customerInfo?.email) {
      throw new Error("Missing required payment information");
    }

    // Define payment amounts
    const paymentAmounts = {
      haven_ark_masterclass: 3500000, // ₹35,000 in paise
      wiggly_monthly: 99900,          // ₹999 in paise (example)
      wiggly_yearly: 999900           // ₹9,999 in paise (example)
    };

    const amount = paymentAmounts[paymentType];
    if (!amount) {
      throw new Error("Invalid payment type");
    }

    // Create Supabase client
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Create Razorpay order
    const razorpayKeyId = Deno.env.get("RAZORPAY_KEY_ID");
    const razorpayKeySecret = Deno.env.get("RAZORPAY_KEY_SECRET");

    if (!razorpayKeyId || !razorpayKeySecret) {
      throw new Error("Razorpay credentials not configured");
    }

    const razorpayAuth = btoa(`${razorpayKeyId}:${razorpayKeySecret}`);
    
    const orderData = {
      amount: amount,
      currency: "INR",
      notes: {
        payment_type: paymentType,
        customer_name: customerInfo.name,
        customer_email: customerInfo.email,
      }
    };

    const razorpayResponse = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${razorpayAuth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });

    if (!razorpayResponse.ok) {
      const errorData = await razorpayResponse.text();
      throw new Error(`Razorpay API error: ${errorData}`);
    }

    const razorpayOrder = await razorpayResponse.json();

    // Store payment record in database
    const { data: paymentRecord, error: dbError } = await supabase
      .from('payments')
      .insert([{
        amount: amount / 100, // Convert paise to rupees for storage
        currency: 'INR',
        payment_type: paymentType,
        status: 'pending',
        razorpay_order_id: razorpayOrder.id,
      }])
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      throw new Error(`Failed to store payment record: ${dbError.message}`);
    }

    // Return Razorpay order details for frontend
    return new Response(JSON.stringify({
      success: true,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: razorpayKeyId,
      paymentRecordId: paymentRecord.id,
      customerInfo: {
        name: customerInfo.name,
        email: customerInfo.email,
        phone: customerInfo.phone || ""
      }
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error("Error in haven-ark-payment function:", error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || "Failed to create payment order"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);