import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

function parseSort(sortStr) {
  if (!sortStr) return { createdAt: -1 };
  const dir = sortStr.startsWith("-") ? -1 : 1;
  const field = sortStr.startsWith("-") ? sortStr.slice(1) : sortStr;
  return { [field]: dir };
}

export async function GET(request) {
  const startTime = Date.now();

  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const col = db.collection("orders");

    const params = Object.fromEntries(request.nextUrl.searchParams);
    const page = Math.max(1, Number(params.page || 1));
    const limit = Math.min(100, Math.max(1, Number(params.limit || 10)));
    const sort = params.sort || "-createdAt";
    const status = (params.status || "").trim();

    const filter = {};
    if (status) filter.status = status;

    const skip = (page - 1) * limit;



    const [orders, total] = await Promise.all([
      col
        .find(filter)
        .sort(parseSort(sort))
        .skip(skip)
        .limit(limit)
        .toArray(),
      col.countDocuments(filter),
    ]);

    const ms = Date.now() - startTime;
    if (process.env.NODE_ENV === "development") {
      console.log(`✅ Admin orders: ${orders.length} in ${ms}ms`);
    }

    return NextResponse.json(
      {
        orders: orders.map((o) => ({
          ...o,
          _id: o._id.toString(),
          id: o._id.toString(),
        })),
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
              ? "private, max-age=60"
              : "private, max-age=10",
        },
      }
    );
  } catch (err) {
    console.error("ADMIN ORDERS GET ERROR:", err);
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

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }
    if (!products) {
      return NextResponse.json(
        { error: "products is required" },
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
    console.error("ADMIN ORDERS POST ERROR:", err);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
