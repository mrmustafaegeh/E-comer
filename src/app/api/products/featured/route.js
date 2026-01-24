import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  const startTime = Date.now();

  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    const products = await db
      .collection("products")
      .find(
        {
          $or: [
            { featured: true },
            { isFeatured: true },
            { rating: { $gte: 4.5 } },
          ],
        },
        {
          projection: {
            title: 1,
            name: 1,
            price: 1,
            salePrice: 1,
            offerPrice: 1,
            oldPrice: 1,
            image: 1,
            thumbnail: 1,
            category: 1,
            rating: 1,
            numReviews: 1,
            stock: 1,
            createdAt: 1,
          },
        }
      )
      .sort({ rating: -1 })
      .limit(8) // Increase to 8 for better display
      .toArray();

    const fixedProducts = products.map((p) => ({
      ...p,
      _id: p._id.toString(),
      id: p._id.toString(),
      title: p.title ?? p.name,
      name: p.name ?? p.title,
      price: p.price || 0,
      offerPrice: p.salePrice || p.offerPrice || null,
      image: (p.image || p.thumbnail || "/images/default-product.png").replace(
        /\/\//g,
        "/"
      ),
      category: p.category || "Uncategorized",
      rating: p.rating || 4.5,
      numReviews: p.numReviews || 0,
      stock: p.stock || 0,
    }));

    const ms = Date.now() - startTime;
    if (process.env.NODE_ENV === "development") {
      console.log(`✅ Featured products: ${fixedProducts.length} in ${ms}ms`);
    }

    const response = NextResponse.json({
      success: true,
      products: fixedProducts,
    });

    // ✅ Featured products cache for 10 minutes
    response.headers.set(
      "Cache-Control",
      process.env.NODE_ENV === "production"
        ? "public, s-maxage=600, stale-while-revalidate=1200"
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
