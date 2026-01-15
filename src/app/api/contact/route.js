import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const col = db.collection("messages");

    const body = await request.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    const doc = {
      name,
      email,
      message,
      read: false,
      createdAt: new Date(),
    };

    const result = await col.insertOne(doc);

    return NextResponse.json(
      { message: "Message sent successfully", id: result.insertedId },
      { status: 201 }
    );
  } catch (err) {
    console.error("CONTACT POST ERROR:", err);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const col = db.collection("messages");

    const messages = await col.find({}).sort({ createdAt: -1 }).toArray();

    return NextResponse.json({ messages }, { status: 200 });
  } catch (err) {
    console.error("CONTACT GET ERROR:", err);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}
