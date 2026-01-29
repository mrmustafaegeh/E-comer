import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

// Shared data fetching logic
export async function getFeaturedProductsData() {
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
      .limit(8)
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

    return fixedProducts;
  } catch (err) {
    console.error("FEATURED PRODUCTS DATA ERROR:", err);
    return [];
  }
}

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
