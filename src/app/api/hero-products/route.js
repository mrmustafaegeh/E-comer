import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { transformProducts } from "@/lib/transformers";

export const runtime = "nodejs";

// Shared data fetching logic
export async function getHeroProductsData() {
  const startTime = Date.now();

  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    const docs = await db
      .collection("products")
      .find({ $or: [{ isFeatured: true }, { featured: true }] })
      .sort({ featuredOrder: 1, createdAt: -1 })
      .limit(5)
      .project({
        name: 1,
        title: 1,
        price: 1,
        salePrice: 1,
        oldPrice: 1, // Legacy support
        discount: 1,
        rating: 1,
        image: 1,
        thumbnail: 1,
        emoji: 1,
        gradient: 1,
      })
      .toArray();

    // Use centralized transformer
    // AND adapt to specific frontend needs for Hero
    const products = transformProducts(docs).map((p) => {
      // Logic: If on sale, "price" is the sale price, "oldPrice" is the original price
      const displayPrice = p.isOnSale ? p.formattedSalePrice : p.formattedPrice;
      const displayOldPrice = p.isOnSale ? p.formattedPrice : (p.oldPrice ? p.formattedOldPrice : null);
      
      return {
        ...p,
        // Frontend component expects these specific names currently:
        price: displayPrice,
        oldPrice: displayOldPrice,
        offerPrice: p.salePrice || p.price, // Number value
        imageUrl: p.thumbnail || p.image || null,
        // Ensure rating is a number
        rating: typeof p.rating === "number" ? p.rating : 4.5,
        emoji: p.emoji || null,
        gradient: p.gradient || "from-blue-500 to-purple-600",
      };
    });

    if (process.env.NODE_ENV === "development") {
      console.log(
        `🖼️ Hero products: ${products.length} in ${Date.now() - startTime}ms`
      );
    }
    
    return products;
  } catch (error) {
    console.error("HERO PRODUCTS DATA ERROR:", error);
    return [];
  }
}

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
