import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(req) {
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) {
    console.error("❌ Stripe or Webhook Secret is missing");
    return new NextResponse("Service Unavailable", {
      status: 503,
      headers: { "Cache-Control": "no-store" },
    });
  }

  const body = await req.text();
  const headerList = await headers();
  const signature = headerList.get("Stripe-Signature");

  if (!signature) {
    return new NextResponse("No signature provided", {
      status: 400,
      headers: { "Cache-Control": "no-store" },
    });
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
    return new NextResponse(`Webhook Error: ${error.message}`, {
      status: 400,
      headers: { "Cache-Control": "no-store" },
    });
  }

  const session = event.data.object;

  if (event.type === "checkout.session.completed") {
    try {
      const client = await clientPromise;
      const db = client.db(process.env.MONGODB_DB);

      const pendingCheckout = await db
        .collection("pending_checkouts")
        .findOne({ sessionId: session.id });

      const userId =
        pendingCheckout?.userId ||
        session.client_reference_id ||
        "guest";

      await db.collection("orders").insertOne({
        userId,
        externalId: session.id,
        totalPrice: session.amount_total / 100,
        status: "paid",
        paymentMethod: "stripe",
        customerDetails: session.customer_details,
        email:
          session.customer_details?.email ||
          session.customer_email ||
          pendingCheckout?.userEmail,
        createdAt: new Date(),
        updatedAt: new Date(),
        products: [],
      });

      if (pendingCheckout) {
        await db
          .collection("pending_checkouts")
          .deleteOne({ _id: pendingCheckout._id });
      }

      console.log(`✅ Order created for session ${session.id}`);
    } catch (dbError) {
      console.error("❌ Database error during order creation:", dbError);
      return new NextResponse("Database Error", {
        status: 500,
        headers: { "Cache-Control": "no-store" },
      });
    }
  }

  return new NextResponse(
    JSON.stringify({ received: true }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
    }
  );
}
