import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function getProductByIdData(id) {
  try {
    if (!id || id === 'undefined' || id === '[id]') return null;

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    const product = await db
      .collection("products")
      .findOne({ _id: new ObjectId(id) });

    if (!product) return null;

    return {
      ...product,
      _id: product._id.toString(),
      id: product._id.toString(),
      title: product.title || product.name,
      name: product.name || product.title,
      offerPrice: product.salePrice || product.offerPrice || null,
    };
  } catch (err) {
    console.error("getProductByIdData error:", err);
    return null;
  }
}

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const product = await getProductByIdData(id);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const response = NextResponse.json(product);

    // ✅ Product details cache for 5 minutes
    response.headers.set(
      "Cache-Control",
      process.env.NODE_ENV === "production"
        ? "public, s-maxage=300, stale-while-revalidate=600"
        : "private, max-age=30"
    );

    return response;
  } catch (err) {
    console.error("PRODUCT DETAIL API ERROR:", err);
    return NextResponse.json(
      { error: "Failed to load product" },
      { status: 500 }
    );
  }
}
