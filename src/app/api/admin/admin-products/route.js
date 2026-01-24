import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const startTime = Date.now();

  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const collection = db.collection("products");

    const {
      search = "",
      category,
      page = "1",
      limit = "50",
    } = Object.fromEntries(request.nextUrl.searchParams);

    const filters = {};

    if (category) filters.category = category;

    // ✅ IMPROVED: Search both name AND title fields
    if (search) {
      filters.$or = [
        { name: { $regex: search, $options: "i" } },
        { title: { $regex: search, $options: "i" } },
      ];
    }

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Math.max(1, Number(limit))); // ✅ Cap at 100
    const skip = (pageNum - 1) * limitNum;

    // ✅ PARALLEL QUERIES: Run find and count at the same time
    const [products, total] = await Promise.all([
      collection
        .find(filters)
        .project({
          // ✅ Only select needed fields
          name: 1,
          title: 1,
          price: 1,
          salePrice: 1,
          image: 1,
          thumbnail: 1,
          category: 1,
          stock: 1,
          featured: 1,
          rating: 1,
          createdAt: 1,
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .toArray(),

      collection.countDocuments(filters),
    ]);

    const transformedProducts = products.map((product) => ({
      ...product,
      id: product._id.toString(),
      _id: product._id.toString(),
      name: product.name ?? product.title,
    }));

    const queryTime = Date.now() - startTime;

    if (process.env.NODE_ENV === "development") {
      console.log(
        `✅ Admin products loaded: ${products.length} items in ${queryTime}ms`
      );
    }

    return NextResponse.json(
      {
        products: transformedProducts,
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "private, max-age=30", // ✅ Cache for 30 seconds
        },
      }
    );
  } catch (err) {
    console.error("ADMIN PRODUCTS GET ERROR:", err);
    return NextResponse.json(
      {
        error: "Failed to load products",
        message:
          process.env.NODE_ENV === "development" ? err.message : undefined,
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection("products");

    const body = await request.json();

    // Accept name OR title
    const name = typeof body.name === "string" ? body.name : body.title;

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { error: "Product name is required" },
        { status: 400 }
      );
    }

    const price = Number(body.price);
    if (!Number.isFinite(price) || price < 0) {
      return NextResponse.json(
        { error: "Valid price is required" },
        { status: 400 }
      );
    }

    const now = new Date();

    const doc = {
      name: name.trim(),
      title: name.trim(), // ✅ Store in both fields for compatibility
      description: body.description ?? null,
      price,
      salePrice: body.salePrice != null ? Number(body.salePrice) : null,
      thumbnail: body.thumbnail ?? null,
      image: body.image ?? null,
      category: body.category ?? null,
      stock: body.stock != null ? Number(body.stock) : 0,
      rating: body.rating != null ? Number(body.rating) : 0,
      numReviews: body.numReviews != null ? Number(body.numReviews) : 0,
      featured: Boolean(body.featured),
      isFeatured: body.isFeatured ?? null,
      createdAt: now,
      updatedAt: now,
    };

    const result = await collection.insertOne(doc);

    return NextResponse.json(
      {
        ...doc,
        _id: result.insertedId.toString(),
        id: result.insertedId.toString(),
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("ADMIN PRODUCTS POST ERROR:", err);
    return NextResponse.json(
      {
        error: "Failed to create product",
        details: err.message,
      },
      { status: 500 }
    );
  }
}
