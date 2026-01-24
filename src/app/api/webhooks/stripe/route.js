import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(req) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature");

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  const session = event.data.object;

  if (event.type === "checkout.session.completed") {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const orders = db.collection("orders");

    // Optional: Retrieve full line items if needed to store details
    // const lineItems = await stripe.checkout.sessions.listLineItems(session.id);

    // Create Order
    await orders.insertOne({
      userId: session.metadata.userId,
      externalId: session.id, // Stripe Session ID
      totalPrice: session.amount_total / 100,
      status: "paid", // Paid via Stripe
      paymentMethod: "stripe",
      customerDetails: session.customer_details,
      createdAt: new Date(),
      updatedAt: new Date(),
      // We could store product details here if we parse metadata or expand line_items
      products: [], // Needs expansion - see note below
    });
  }

  return new NextResponse(null, { status: 200 });
}
