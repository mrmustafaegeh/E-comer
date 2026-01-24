import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function GET(request) {
  const startTime = Date.now();

  try {
    const client = await clientPromise;
    const db = client.db();
    const col = db.collection("users");

    const params = Object.fromEntries(request.nextUrl.searchParams);
    const page = Math.max(1, Number(params.page || 1));
    const limit = Math.min(100, Math.max(1, Number(params.limit || 10)));
    const search = (params.search || "").trim();

    const filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    // ✅ Use INCLUDE projection only (no password field included)
    const projection = {
      name: 1,
      email: 1,
      role: 1,
      createdAt: 1,
    };

    const [users, total] = await Promise.all([
      col
        .find(filter, { projection })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      col.countDocuments(filter),
    ]);

    const ms = Date.now() - startTime;
    if (process.env.NODE_ENV === "development") {
      console.log(`✅ Admin users: ${users.length} in ${ms}ms`);
    }

    return NextResponse.json(
      {
        users: users.map((u) => ({
          ...u,
          _id: u._id.toString(),
          id: u._id.toString(),
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
    console.error("ADMIN USERS GET ERROR:", err);
    return NextResponse.json(
      { error: "Failed to load users", details: err.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const col = db.collection("users");

    const body = await request.json();

    const name = (body.name || "").trim();
    const email = (body.email || "").trim().toLowerCase();
    const password = body.password || "";

    if (!name)
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    if (!email)
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    if (!password || password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const exists = await col.findOne({ email }, { projection: { _id: 1 } });
    if (exists)
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 409 }
      );

    const passwordHash = await bcrypt.hash(password, 10);

    const doc = {
      name,
      email,
      password: passwordHash,
      role: body.role || "user",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await col.insertOne(doc);

    return NextResponse.json(
      {
        _id: result.insertedId.toString(),
        id: result.insertedId.toString(),
        name,
        email,
        role: doc.role,
        createdAt: doc.createdAt,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("ADMIN USERS POST ERROR:", err);
    return NextResponse.json(
      { error: "Failed to create user", details: err.message },
      { status: 500 }
    );
  }
}
