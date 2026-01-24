import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    // Get session with error handling
    let session;
    try {
      session = await getCurrentUser();
    } catch (sessionError) {
      console.error("❌ getCurrentUser error:", sessionError);
      return NextResponse.json({ user: null }, { status: 200 });
    }

    if (!session || !session.userId) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    // Fetch fresh user data from database
    let client;
    try {
      client = await clientPromise;
    } catch (dbError) {
      console.error("❌ MongoDB connection error:", dbError);
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const db = client.db(process.env.MONGODB_DB || "quickcart");
    const usersCollection = db.collection("users");

    // Convert userId to ObjectId if it's a string
    let userId;
    try {
      userId =
        typeof session.userId === "string"
          ? new ObjectId(session.userId)
          : session.userId;
    } catch (idError) {
      console.error("❌ Invalid userId format:", session.userId);
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const user = await usersCollection.findOne(
      { _id: userId },
      { projection: { password: 0 } }
    );

    if (!user) {
      console.log("⚠️ User not found in database:", userId);
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const userResponse = {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      roles: user.roles || ["user"],
      createdAt: user.createdAt,
    };

    return NextResponse.json({ user: userResponse }, { status: 200 });
  } catch (error) {
    console.error("❌ Session route error:", error);
    // Return null user instead of error to prevent auth loops
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
