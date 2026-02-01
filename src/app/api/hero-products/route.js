import { NextResponse } from "next/server";
import { getHeroProductsData } from "@/services/productService";

export const runtime = "nodejs";

export async function GET() {
  try {
    const products = await getHeroProductsData();

    const response = NextResponse.json({ success: true, products });

    response.headers.set(
      "Cache-Control",
      process.env.NODE_ENV === "production"
        ? "public, s-maxage=300, stale-while-revalidate=600"
        : "private, max-age=60"
    );

    return response;
  } catch (error) {
    console.error("Hero products API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch hero products" },
      { status: 500 }
    );
  }
}
