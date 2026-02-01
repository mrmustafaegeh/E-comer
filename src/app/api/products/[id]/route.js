import { NextResponse } from "next/server";
import { getProductById, updateProduct, deleteProduct } from "@/services/productService";
import { productSchema } from "@/validators/productValidator";
import { verifySession } from "@/lib/session";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const product = await getProductById(id);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (err) {
    return NextResponse.json({ error: "Failed to load product" }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await verifySession();
    if (!session || !session.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const validatedData = productSchema.partial().parse(body);

    const updated = await updateProduct(id, validatedData);
    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: "Update failed", details: err.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await verifySession();
    if (!session || !session.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    await deleteProduct(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
