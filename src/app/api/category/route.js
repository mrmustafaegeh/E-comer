import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET(request) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    const categories = await db
      .collection("categories")
      .find({ isActive: true })
      .sort({ displayOrder: 1 })
      .limit(10)
      .toArray();

    // Transform _id to string
    const transformedCategories = categories.map((cat) => ({
      ...cat,
      _id: cat._id.toString(),
      id: cat._id.toString(),
    }));

    return NextResponse.json(transformedCategories);
  } catch (error) {
    console.error("Categories API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    // Create slug from name
    const slug = (body.slug || body.name)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    // Check if slug exists
    const existing = await db.collection("categories").findOne({ slug });
    if (existing) {
      return NextResponse.json(
        { error: "A category with this slug already exists" },
        { status: 409 }
      );
    }

    const doc = {
      name: body.name,
      slug,
      icon: body.icon || null,
      gradient: body.gradient || null,
      description: body.description || null,
      productCount: 0,
      isActive: body.isActive != null ? Boolean(body.isActive) : true,
      displayOrder: body.displayOrder || 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("categories").insertOne(doc);

    return NextResponse.json(
      {
        ...doc,
        _id: result.insertedId.toString(),
        id: result.insertedId.toString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create category error:", error);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}
