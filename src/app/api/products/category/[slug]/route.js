import { NextResponse } from "next/server";
import { getProducts } from "@/services/productService";
import clientPromise from "@/lib/mongodb";

/**
 * GET /api/products/category/[slug]
 * Get all products for a specific category
 */
export async function GET(request, { params }) {
  try {
    const { slug } = await params;
    
    // Get URL search params for pagination and sorting
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 12;
    const sort = searchParams.get("sort") || "newest";
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const search = searchParams.get("search");

    // Verify category exists
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const category = await db.collection("categories").findOne({ 
      slug,
      isActive: true 
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // Get products for this category
    const result = await getProducts({
      category: slug,
      page,
      limit,
      sort,
      minPrice,
      maxPrice,
      search
    });

    return NextResponse.json({
      ...result,
      category: {
        name: category.name,
        slug: category.slug,
        description: category.description,
        icon: category.icon,
        gradient: category.gradient
      }
    }, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
      },
    });
  } catch (err) {
    console.error("Category products API error:", err);
    return NextResponse.json(
      { error: "Failed to load category products", details: err.message },
      { status: 500 }
    );
  }
}
