import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export const runtime = "nodejs";

function formatMoney(value) {
  const num = Number(value);
  if (!Number.isFinite(num)) return null;
  return `$${num.toFixed(2)}`;
}

function calcDiscount(price, oldPrice) {
  const p = Number(price);
  const o = Number(oldPrice);
  if (!Number.isFinite(p) || !Number.isFinite(o) || o <= 0 || p >= o)
    return null;
  const pct = Math.round(((o - p) / o) * 100);
  return `-${pct}%`;
}

export async function GET() {
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
        oldPrice: 1,
        discount: 1,
        rating: 1,
        image: 1,
        thumbnail: 1,
        emoji: 1,
        gradient: 1,
      })
      .toArray();

    const products = docs.map((p) => {
      const rawPrice = p.salePrice ?? p.price ?? 0;
      const rawOld = p.oldPrice ?? null;

      const price = formatMoney(rawPrice) ?? "$0.00";
      const oldPrice = formatMoney(rawOld);

      const discount =
        p.discount || (oldPrice ? calcDiscount(rawPrice, rawOld) : null) || "";

      return {
        id: p._id.toString(),
        _id: p._id.toString(),
        title: p.title || p.name || "Untitled",
        price,
        offerPrice: rawPrice, // ✅ Add for ProductCard compatibility
        oldPrice,
        discount,
        rating: Number.isFinite(Number(p.rating)) ? Number(p.rating) : 4.5,
        image: p.thumbnail || p.image || null,
        imageUrl: p.thumbnail || p.image || null,
        emoji: p.emoji || null,
        gradient: p.gradient || "from-blue-500 to-purple-600",
      };
    });

    const ms = Date.now() - startTime;
    if (process.env.NODE_ENV === "development") {
      console.log(`🖼️ Hero products: ${products.length} in ${ms}ms`);
    }

    const response = NextResponse.json({ success: true, products });

    // ✅ Hero products cache for 10 minutes
    response.headers.set(
      "Cache-Control",
      process.env.NODE_ENV === "production"
        ? "public, s-maxage=600, stale-while-revalidate=1200" // 10min cache, 20min stale
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
