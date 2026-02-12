import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

/**
 * GET /api/category/[slug]
 * Get a specific category by slug
 */
export async function GET(request, { params }) {
  try {
    const { slug } = await params;
    
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

    // Transform _id to string
    const transformedCategory = {
      ...category,
      _id: category._id.toString(),
      id: category._id.toString(),
    };

    return NextResponse.json(transformedCategory, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
      },
    });
  } catch (error) {
    console.error("Category API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch category" },
      { status: 500 }
    );
  }
}
