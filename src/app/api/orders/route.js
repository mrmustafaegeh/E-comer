import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";

export async function GET(request) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const col = db.collection("orders");

    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const query = { userId: user.id };

    const params = Object.fromEntries(request.nextUrl.searchParams);
    const page = Math.max(1, Number(params.page || 1));
    const limit = Math.min(50, Math.max(1, Number(params.limit || 10)));
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      col
        .find(
          query,
          {
            projection: {
              userId: 1,
              products: 1,
              totalPrice: 1,
              status: 1,
              createdAt: 1,
              shippingAddress: 1,
              paymentMethod: 1,
            },
          }
        )
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      col.countDocuments(query),
    ]);

    const response = NextResponse.json({
      orders: orders.map((o) => ({
        ...o,
        _id: o._id.toString(),
        id: o._id.toString(),
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });

    // ✅ Orders are user-specific - short private cache only
    response.headers.set(
      "Cache-Control",
      "private, max-age=30, must-revalidate"
    );

    return response;
  } catch (err) {
    console.error("ORDERS GET ERROR:", err);
    return NextResponse.json(
      { error: "Failed to load orders" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const col = db.collection("orders");

    const body = await request.json();

    const userId = body.userId;
    const products = body.products;
    const totalPrice = Number(body.totalPrice);

    if (!userId)
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    if (!Array.isArray(products) || products.length === 0) {
      return NextResponse.json(
        { error: "products must be a non-empty array" },
        { status: 400 }
      );
    }
    if (!Number.isFinite(totalPrice)) {
      return NextResponse.json(
        { error: "Valid totalPrice is required" },
        { status: 400 }
      );
    }

    const doc = {
      userId,
      products,
      totalPrice,
      shippingAddress: body.shippingAddress,
      paymentMethod: body.paymentMethod,
      status: body.status || "processing",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await col.insertOne(doc);

    return NextResponse.json(
      {
        ...doc,
        _id: result.insertedId.toString(),
        id: result.insertedId.toString(),
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("ORDERS POST ERROR:", err);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
