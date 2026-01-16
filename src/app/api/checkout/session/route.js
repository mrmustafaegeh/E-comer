import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";

export async function POST(request) {
  if (!stripe) {
    return new NextResponse(
      JSON.stringify({ error: "Stripe is not configured" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const user = await getCurrentUser();
    
    const body = await request.json();
    const { items, email } = body;

    if (!items || items.length === 0) {
      return new NextResponse("No items in checkout", { status: 400 });
    }

    // Get base URL - try multiple sources
    const baseUrl = 
      process.env.NEXT_PUBLIC_APP_URL || 
      process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null ||
      request.headers.get('origin') ||
      request.headers.get('referer')?.split('?')[0].replace(/\/$/, '') ||
      'http://localhost:3000';

    // Ensure baseUrl has protocol
    const normalizedBaseUrl = baseUrl.startsWith('http') 
      ? baseUrl 
      : `https://${baseUrl}`;

    // Format line items for Stripe
    const line_items = items.map((item) => {
      let imageUrl = item.imgSrc || item.image;
      let validImage = null;

      if (imageUrl) {
         if (imageUrl.startsWith("http")) {
            validImage = imageUrl;
         } else if (imageUrl.startsWith("/") && process.env.NEXT_PUBLIC_APP_URL) {
            validImage = `${process.env.NEXT_PUBLIC_APP_URL}${imageUrl}`;
         }
      }

      // STRICT CHECK: Stripe cannot download images from localhost
      if (validImage && (validImage.includes("localhost") || validImage.includes("127.0.0.1"))) {
         validImage = null;
      }

      // Final valid URL check
      if (validImage && !validImage.startsWith("http")) {
         validImage = null;
      }

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
            images: validImage ? [validImage] : [],
            metadata: {
              productId: item.id || item._id,
            },
          },
          unit_amount: Math.round((Number(item.price) || 0) * 100),
        },
        quantity: item.qty || 1,
      };
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${normalizedBaseUrl}/orders/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${normalizedBaseUrl}/cart`,
      customer_email: user?.email || email || undefined,
      metadata: {
        userId: user?.id || "guest",
        cartItems: JSON.stringify(items.map(i => ({ id: i.id, qty: i.qty }))).substring(0, 500),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[STRIPE_CHECKOUT_ERROR] Full error:", error);
    return new NextResponse(
      JSON.stringify({ error: error.message || "Internal Server Error" }), 
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}