// app/api/admin/admin-products/[id]/route.js
import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

/** helper */
function badRequest(message) {
  return NextResponse.json({ error: message }, { status: 400 });
}

function notFound(message = "Product not found") {
  return NextResponse.json({ error: message }, { status: 404 });
}

export const dynamic = "force-dynamic";

// GET /api/admin/admin-products/[id]
export async function GET(request) {
  try {
    // Extract id from URL
    const url = new URL(request.url);
    const pathSegments = url.pathname.split("/");
    const id = pathSegments[pathSegments.length - 1];

    if (!id || !ObjectId.isValid(id)) return badRequest("Invalid product ID");

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const collection = db.collection("products");

    const product = await collection.findOne({ _id: new ObjectId(id) });
    if (!product) return notFound();

    return NextResponse.json(
      {
        ...product,
        id: product._id.toString(),
        _id: product._id.toString(),
        name: product.name ?? product.title ?? "",
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("ADMIN PRODUCT GET ERROR:", err);
    return NextResponse.json(
      { error: "Failed to fetch product", details: err.message },
      { status: 500 }
    );
  }
}

// PUT /api/admin/admin-products/[id]
export async function PUT(request) {
  try {
    // Extract id from URL
    const url = new URL(request.url);
    const pathSegments = url.pathname.split("/");
    const id = pathSegments[pathSegments.length - 1];

    if (!id || !ObjectId.isValid(id)) return badRequest("Invalid product ID");

    const body = await request.json();

    // ... rest of your PUT logic (same as before)
    // (Copy the rest of your PUT function logic here)
  } catch (err) {
    console.error("ADMIN PRODUCT PUT ERROR:", err);
    return NextResponse.json(
      { error: "Failed to update product", details: err.message },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/admin-products/[id]
export async function DELETE(request) {
  try {
    // Extract id from URL
    const url = new URL(request.url);
    const pathSegments = url.pathname.split("/");
    const id = pathSegments[pathSegments.length - 1];

    if (!id || !ObjectId.isValid(id)) return badRequest("Invalid product ID");

    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection("products");

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) return notFound();

    return NextResponse.json(
      { success: true, message: "Product deleted successfully", id },
      { status: 200 }
    );
  } catch (err) {
    console.error("ADMIN PRODUCT DELETE ERROR:", err);
    return NextResponse.json(
      { error: "Failed to delete product", details: err.message },
      { status: 500 }
    );
  }
}
