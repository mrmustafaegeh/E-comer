import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(req) {
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) {
     console.error("❌ Stripe or Webhook Secret is missing");
     return new NextResponse("Service Unavailable", { status: 503 });
  }

  const body = await req.text();
  const headerList = await headers();
  const signature = headerList.get("Stripe-Signature");

  if (!signature) {
    return new NextResponse("No signature provided", { status: 400 });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error(`❌ Webhook Error: ${error.message}`);
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  const session = event.data.object;

  if (event.type === "checkout.session.completed") {
    try {
      const client = await clientPromise;
      const db = client.db(process.env.MONGODB_DB);
      
      // 1. Resolve robust User ID via internal pending record
      const pendingCheckout = await db.collection("pending_checkouts").findOne({ sessionId: session.id });
      
      if (!pendingCheckout) {
         console.warn(`🕒 No pending checkout found for session ${session.id}. Falling back to metadata.`);
      }

      const userId = pendingCheckout?.userId || session.client_reference_id || "guest";

      // 2. Create Final Order
      await db.collection("orders").insertOne({
        userId,
        externalId: session.id, // Stripe Session ID
        totalPrice: session.amount_total / 100,
        status: "paid",
        paymentMethod: "stripe",
        customerDetails: session.customer_details,
        email: session.customer_details?.email || session.customer_email || pendingCheckout?.userEmail,
        createdAt: new Date(),
        updatedAt: new Date(),
        products: [], // Future: expand line items
      });
      
      // 3. Cleanup pending record
      if (pendingCheckout) {
        await db.collection("pending_checkouts").deleteOne({ _id: pendingCheckout._id });
      }

      console.log(`✅ Order created for session ${session.id} (User: ${userId})`);
    } catch (dbError) {
      console.error("❌ Database error during order creation:", dbError);
      return new NextResponse("Database Error", { status: 500 });
    }
  }

  return new NextResponse(JSON.stringify({ received: true }), { 
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
}
