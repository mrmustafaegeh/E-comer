import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { verifySession } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // 1. Authorize - Must be Admin
    const session = await verifySession();
    if (!session || !session.roles?.includes("admin")) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    
    const results = {};

    // --- Products Indexes ---
    const products = db.collection("products");
    
    // Unique Slug
    results.products_slug = await products.createIndex(
      { slug: 1 },
      { unique: true, background: true }
    );

    // Text Search
    results.products_text = await products.createIndex(
      { 
        name: "text", 
        title: "text", 
        description: "text", 
        category: "text",
        tags: "text" 
      },
      { 
        weights: { title: 10, name: 10, category: 5, tags: 5, description: 1 },
        name: "ProductTextIndex",
        background: true
      }
    );

    // Filtering & Sorting
    results.products_category = await products.createIndex({ category: 1 }, { background: true });
    results.products_price = await products.createIndex({ price: 1 }, { background: true });
    results.products_created = await products.createIndex({ createdAt: -1 }, { background: true });
    results.products_featured = await products.createIndex({ featured: 1 }, { background: true });

    // --- Orders Indexes ---
    const orders = db.collection("orders");
    results.orders_user = await orders.createIndex({ userId: 1 }, { background: true });
    results.orders_created = await orders.createIndex({ createdAt: -1 }, { background: true });

    // --- Users Indexes ---
    const users = db.collection("users");
    results.users_email = await users.createIndex({ email: 1 }, { unique: true, background: true });

    return NextResponse.json({
      success: true,
      message: "Indexes created successfully",
      results
    });

  } catch (err) {
    console.error("INDEX SETUP ERROR:", err);
    return NextResponse.json(
      { error: "Failed to setup indexes", details: err.message },
      { status: 500 }
    );
  }
}
