import { validateRequest, forbiddenResponse } from "@/lib/security";
import { verifySession } from "@/lib/session";
import { ProductSchema, formatZodErrors } from "@/lib/validation";
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(request) {
  const start = Date.now();

  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB); 
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

    // Category filter - Use exact match instead of regex for performance
    if (category && category !== "all") {
      filters.category = category.toLowerCase();
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

    // Search filter - in production use MongoDB Text Index
    if (search) {
      filters.$text = { $search: search };
      // Fallback if no text index:
      // const searchRegex = new RegExp(search, "i");
      // filters.$or = [{ name: searchRegex }, { title: searchRegex }, { description: searchRegex }];
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
      slug: 1,
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
              ? "public, s-maxage=60, stale-while-revalidate=120"
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
    // 1. Validate Origin
    const isValidRequest = await validateRequest(request);
    if (!isValidRequest) return forbiddenResponse();

    // 2. Authorize - Must be Admin
    const session = await verifySession();
    if (!session || !session.roles?.includes("admin")) {
      return NextResponse.json(
        { error: "Unauthorized. Admin privileges required." },
        { status: 403 }
      );
    }

    const body = await request.json();

    // 3. Validate Input with Zod
    const parsed = ProductSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", errors: formatZodErrors(parsed.error) },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const collection = db.collection("products");

    const productData = {
      ...parsed.data,
      category: parsed.data.category.toLowerCase(),
    };

    // Create slug from name
    const slug = (body.slug || productData.name)
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
      ...productData,
      slug,
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
