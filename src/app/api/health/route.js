import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();

    // Test database connection
    await db.admin().ping();

    // Get collection stats
    const products = db.collection("products");
    const productCount = await products.countDocuments();
    const featuredCount = await products.countDocuments({ featured: true });

    // Test featured query performance
    const start = Date.now();
    await products
      .find({ $or: [{ featured: true }, { rating: { $gte: 4.5 } }] })
      .sort({ rating: -1 })
      .limit(4)
      .toArray();
    const queryTime = Date.now() - start;

    return NextResponse.json({
      status: "ok",
      database: "connected",
      products: {
        total: productCount,
        featured: featuredCount,
      },
      performance: {
        queryTime: `${queryTime}ms`,
        status:
          queryTime < 100 ? "excellent" : queryTime < 200 ? "good" : "slow",
      },
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return NextResponse.json(
      {
        status: "error",
        database: "disconnected",
        error: err.message,
      },
      { status: 500 }
    );
  }
}
