import { NextResponse } from "next/server";
import { getProducts } from "@/services/productService";
import { rateLimit, rateLimitResponse, getClientIp } from "@/lib/security";

/**
 * GET /api/products/search
 * Search products across all fields
 */
export async function GET(request) {
  try {
    const ip = getClientIp(request);
    const { success } = await rateLimit(ip, 50, "1 m");
    if (!success) return rateLimitResponse();

    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q") || searchParams.get("query") || "";
    const category = searchParams.get("category");
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 12;
    const sort = searchParams.get("sort") || "relevance";
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");

    if (!query || query.length < 2) {
      return NextResponse.json(
        { error: "Search query must be at least 2 characters" },
        { status: 400 }
      );
    }

    const result = await getProducts({
      search: query,
      category: category || undefined,
      page,
      limit,
      sort: sort === "relevance" ? "newest" : sort,
      minPrice,
      maxPrice
    });

    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
      },
    });
  } catch (err) {
    console.error("Search API error:", err);
    return NextResponse.json(
      { error: "Search failed", details: err.message },
      { status: 500 }
    );
  }
}
