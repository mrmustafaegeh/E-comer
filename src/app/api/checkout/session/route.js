import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import {
  validateRequest,
  rateLimit,
  forbiddenResponse,
  rateLimitResponse,
  isValidObjectId,
} from "../../../../lib/security";
import { headers } from "next/headers";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(request) {
  if (!stripe) {
    return new NextResponse(
      JSON.stringify({ error: "Stripe is not configured" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    // 1. Security Checks
    const isValidRequest = await validateRequest(request);
    if (!isValidRequest) return forbiddenResponse();

    const headerList = await headers();
    const ip = headerList.get("x-forwarded-for") || "127.0.0.1";
    const { success } = await rateLimit(ip, 3, "1 m");
    if (!success) return rateLimitResponse();

    const user = await getCurrentUser();
    const body = await request.json();
    const { items, email } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return new NextResponse("No items in checkout", { status: 400 });
    }

    // 2. Validate IDs and fetch products from DB
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    const validItems = items.filter((i) => isValidObjectId(i.id || i._id));
    if (validItems.length !== items.length) {
      return new NextResponse("Invalid product IDs in request", {
        status: 400,
      });
    }

    const productIds = validItems.map(
      (item) => new ObjectId(item.id || item._id)
    );
    const dbProducts = await db
      .collection("products")
      .find({ _id: { $in: productIds } })
      .toArray();

    if (dbProducts.length === 0) {
      return new NextResponse("No products found for the given IDs", {
        status: 404,
      });
    }

    const productMap = new Map(dbProducts.map((p) => [p._id.toString(), p]));

    // 3. Format line items using DB prices
    const line_items = validItems.map((item) => {
      const idStr = (item.id || item._id).toString();
      const dbProduct = productMap.get(idStr);

      if (!dbProduct) {
        throw new Error(`Product mapping failed for ID: ${idStr}`);
      }

      const price = dbProduct.salePrice || dbProduct.price;
      const imageUrl = dbProduct.image || dbProduct.thumbnail;
      let validImage = null;

      if (imageUrl && imageUrl.startsWith("http")) {
        validImage = imageUrl;
      } else if (
        imageUrl &&
        imageUrl.startsWith("/") &&
        process.env.NEXT_PUBLIC_APP_URL
      ) {
        validImage = `${process.env.NEXT_PUBLIC_APP_URL}${imageUrl}`;
      }

      if (
        validImage &&
        (validImage.includes("localhost") || validImage.includes("127.0.0.1"))
      ) {
        validImage = null;
      }

      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: dbProduct.name,
            images: validImage ? [validImage] : [],
            metadata: {
              productId: dbProduct._id.toString(),
            },
          },
          unit_amount: Math.round(price * 100),
        },
        quantity: Math.min(Math.max(1, item.qty || 1), 99),
      };
    });

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000");

    // 4. Create Stripe Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${baseUrl}/orders/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/cart`,
      customer_email: user?.email || email || undefined,
      // client_reference_id is server-side and relatively safe, but session.id is the key
      client_reference_id: user?.userId || undefined,
    });

    // 5. Pre-create pending checkout for secure webhook resolution
    await db.collection("pending_checkouts").insertOne({
      sessionId: session.id,
      userId: user?.userId || "guest",
      userEmail: user?.email || email || null,
      status: "pending",
      createdAt: new Date(),
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[STRIPE_CHECKOUT_ERROR] Full error:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
