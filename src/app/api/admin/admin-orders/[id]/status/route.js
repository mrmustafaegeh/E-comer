import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function PUT(request, { params }) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const ordersCol = db.collection("orders");

    const { id } = params;
    const body = await request.json();
    const status = body.status;

    if (!status)
      return NextResponse.json(
        { error: "status is required" },
        { status: 400 }
      );

    const result = await ordersCol.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { status } },
      { returnDocument: "after" }
    );

    if (!result.value)
      return NextResponse.json({ error: "Order not found" }, { status: 404 });

    const o = result.value;
    return NextResponse.json(
      { ...o, _id: o._id.toString(), id: o._id.toString() },
      { status: 200 }
    );
  } catch (err) {
    console.error("ORDER STATUS API ERROR:", err);
    return NextResponse.json(
      { error: "Failed to update order status" },
      { status: 500 }
    );
  }
}
