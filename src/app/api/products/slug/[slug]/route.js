import { NextResponse } from "next/server";
import { getProductById } from "@/services/productService";

/**
 * GET /api/products/slug/[slug]
 * Get a product by its slug (SEO-friendly URL)
 */
export async function GET(request, { params }) {
  try {
    const { slug } = await params;
    
    if (!slug) {
      return NextResponse.json(
        { error: "Product slug is required" },
        { status: 400 }
      );
    }

    const product = await getProductById(slug);

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(product, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (err) {
    console.error("Product by slug API error:", err);
    return NextResponse.json(
      { error: "Failed to load product", details: err.message },
      { status: 500 }
    );
  }
}
