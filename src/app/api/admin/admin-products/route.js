import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request) {
  const startTime = Date.now();

  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const collection = db.collection("products");

    const { search = "", category, page = "1", limit = "50" } =
      Object.fromEntries(request.nextUrl.searchParams);

    const filters = {};
    if (category) filters.category = category;
    if (search) {
      filters.$or = [
        { name: { $regex: search, $options: "i" } },
        { title: { $regex: search, $options: "i" } },
      ];
    }

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      collection
        .find(filters)
        .project({
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

    if (process.env.NODE_ENV === "development") {
      console.log(
        `✅ Admin products loaded: ${products.length} in ${Date.now() - startTime}ms`
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
          "Cache-Control":
            process.env.NODE_ENV === "production"
              ? "private, s-maxage=60, stale-while-revalidate=120"
              : "no-store",
        },
      }
    );
  } catch (err) {
    console.error("ADMIN PRODUCTS GET ERROR:", err);
    return NextResponse.json(
      { error: "Failed to load products" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const collection = db.collection("products");

    const data = await request.json();

    // Basic validation
    if (!data.title || !data.price) {
      return NextResponse.json(
        { error: "Title and price are required" },
        { status: 400 }
      );
    }

    const newProduct = {
      ...data,
      name: data.title, // Ensure name is populated
      price: Number(data.price),
      salePrice: data.offerPrice ? Number(data.offerPrice) : 0,
      stock: Number(data.stock || 0),
      rating: { rate: 0, count: 0 },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Remove undefined fields
    Object.keys(newProduct).forEach(key => 
      newProduct[key] === undefined && delete newProduct[key]
    );

    const result = await collection.insertOne(newProduct);

    return NextResponse.json({
      ...newProduct,
      _id: result.insertedId.toString(),
      id: result.insertedId.toString()
    }, { status: 201 });

  } catch (error) {
    console.error("ADMIN PRODUCTS POST ERROR:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
