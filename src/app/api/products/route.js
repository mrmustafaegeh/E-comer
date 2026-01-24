import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(request) {
  const start = Date.now();

  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB); // Change to your DB name
    const collection = db.collection("products");

    const params = Object.fromEntries(request.nextUrl.searchParams);

    const search = (params.search || "").trim();
    const category = (params.category || "").trim();

    const page = Math.max(1, Number(params.page || 1));
    const limit = Math.min(48, Math.max(1, Number(params.limit || 24)));

    const minPriceRaw = params.minPrice;
    const maxPriceRaw = params.maxPrice;

    const minPrice =
      minPriceRaw !== undefined && minPriceRaw !== ""
        ? Number(minPriceRaw)
        : null;
    const maxPrice =
      maxPriceRaw !== undefined && maxPriceRaw !== ""
        ? Number(maxPriceRaw)
        : null;

    // Build filters
    const filters = {};

    // Category filter
    if (category && category !== "all") {
      filters.category = new RegExp(`^${category}$`, "i"); // Case-insensitive match
    }

    // Price filter - check both price and salePrice
    if (Number.isFinite(minPrice) || Number.isFinite(maxPrice)) {
      const priceConditions = [];

      const priceFilter = {};
      if (Number.isFinite(minPrice)) priceFilter.$gte = minPrice;
      if (Number.isFinite(maxPrice)) priceFilter.$lte = maxPrice;

      priceConditions.push({ price: priceFilter });

      // Also check salePrice if it exists
      priceConditions.push({
        salePrice: {
          ...priceFilter,
          $ne: null,
        },
      });

      filters.$or = priceConditions;
    }

    // Search filter - search in name, title, and description
    if (search) {
      const searchRegex = new RegExp(search, "i");
      filters.$or = [
        { name: searchRegex },
        { title: searchRegex },
        { description: searchRegex },
      ];
    }

    // If we have both price and search filters, combine them with $and
    if (search && (Number.isFinite(minPrice) || Number.isFinite(maxPrice))) {
      const searchRegex = new RegExp(search, "i");
      const priceFilter = {};
      if (Number.isFinite(minPrice)) priceFilter.$gte = minPrice;
      if (Number.isFinite(maxPrice)) priceFilter.$lte = maxPrice;

      filters.$and = [
        {
          $or: [
            { name: searchRegex },
            { title: searchRegex },
            { description: searchRegex },
          ],
        },
        {
          $or: [
            { price: priceFilter },
            { salePrice: { ...priceFilter, $ne: null } },
          ],
        },
      ];

      delete filters.$or;
    }

    const skip = (page - 1) * limit;

    // Projection - only return needed fields
    const projection = {
      name: 1,
      title: 1,
      price: 1,
      salePrice: 1,
      oldPrice: 1,
      discount: 1,
      image: 1,
      thumbnail: 1,
      emoji: 1,
      category: 1,
      rating: 1,
      numReviews: 1,
      featured: 1,
      isFeatured: 1,
      stock: 1,
      createdAt: 1,
    };

    // Run queries in parallel
    const [products, total] = await Promise.all([
      collection
        .find(filters, { projection })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      collection.countDocuments(filters),
    ]);

    // Transform products
    const transformedProducts = products.map((p) => ({
      ...p,
      _id: p._id.toString(),
      id: p._id.toString(),
      title: p.title || p.name,
      name: p.name || p.title,
    }));

    const ms = Date.now() - start;
    if (process.env.NODE_ENV === "development") {
      console.log(
        `✅ /api/products ${transformedProducts.length} items in ${ms}ms`
      );
    }

    return NextResponse.json(
      {
        products: transformedProducts,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      {
        status: 200,
        headers: {
          "Cache-Control":
            process.env.NODE_ENV === "production"
              ? "public, s-maxage=60, stale-while-revalidate=300"
              : "private, max-age=10",
        },
      }
    );
  } catch (err) {
    console.error("PRODUCTS API ERROR:", err);
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

    const body = await request.json();

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

    // Create slug from name
    const slug = (body.slug || name)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    // Check if slug already exists
    const existing = await collection.findOne({ slug });
    if (existing) {
      return NextResponse.json(
        { error: "A product with this slug already exists" },
        { status: 409 }
      );
    }

    const now = new Date();

    const doc = {
      name: name.trim(),
      title: (body.title || name).trim(),
      slug,
      description: body.description || null,
      price,
      salePrice: body.salePrice != null ? Number(body.salePrice) : null,
      oldPrice: body.oldPrice != null ? Number(body.oldPrice) : null,
      discount: body.discount || null,
      thumbnail: body.thumbnail || null,
      image: body.image || null,
      emoji: body.emoji || null,
      category: body.category || null,
      stock: body.stock != null ? Number(body.stock) : 0,
      rating: body.rating != null ? Number(body.rating) : 0,
      numReviews: body.numReviews != null ? Number(body.numReviews) : 0,
      featured: Boolean(body.featured),
      isFeatured: body.isFeatured != null ? Boolean(body.isFeatured) : false,
      featuredOrder:
        body.featuredOrder != null ? Number(body.featuredOrder) : null,
      gradient: body.gradient || null,
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
    console.error("PRODUCTS POST API ERROR:", err);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
