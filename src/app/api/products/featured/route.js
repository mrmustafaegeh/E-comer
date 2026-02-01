import { NextResponse } from "next/server";
import { getFeaturedProductsData } from "@/services/productService";

export const runtime = "nodejs";

export async function GET() {
  try {
    const products = await getFeaturedProductsData();
    
    const response = NextResponse.json({
      success: true,
      products,
    });

    response.headers.set(
      "Cache-Control",
      process.env.NODE_ENV === "production"
        ? "public, s-maxage=300, stale-while-revalidate=600"
        : "private, max-age=60"
    );

    return response;
  } catch (err) {
    console.error("FEATURED PRODUCTS API ERROR:", err);
    return NextResponse.json(
      { error: "Failed to load featured products" },
      { status: 500 }
    );
  }
}
