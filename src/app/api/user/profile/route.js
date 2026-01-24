import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { validateRequest, forbiddenResponse } from "@/lib/security";

export async function GET() {
  try {
    const session = await getCurrentUser();
    
    if (!session || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    
    // Convert ID safely
    const userId = new ObjectId(session.userId);

    const user = await db.collection("users").findOne(
      { _id: userId },
      { projection: { password: 0 } } // Exclude password
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
        name: user.name,
        email: user.email,
        image: user.image,
        address: user.address, // Assuming address is stored here or extended
        phone: user.phone,
        role: user.role || user.roles
    });

  } catch (error) {
    console.error("PROFILE GET ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


export async function PUT(request) {
  try {
    const isValidRequest = await validateRequest(request);
    if (!isValidRequest) return forbiddenResponse();

    const session = await getCurrentUser();
    
    if (!session || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, image, address, phone } = body;

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const userId = new ObjectId(session.userId);

    const updateData = {};
    if (name) updateData.name = name;
    if (image) updateData.image = image;
    if (address) updateData.address = address; // Can be object or string
    if (phone) updateData.phone = phone;

    updateData.updatedAt = new Date();

    const result = await db.collection("users").updateOne(
        { _id: userId },
        { $set: updateData }
    );

    return NextResponse.json({ success: true, message: "Profile updated" });

  } catch (error) {
    console.error("PROFILE PUT ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
