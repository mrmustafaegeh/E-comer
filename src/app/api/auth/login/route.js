// app/api/auth/login/route.js
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import { createSession } from "@/lib/session";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const usersCollection = db.collection("users");

    // Normalize email (case-insensitive)
    const normalizedEmail = String(email).trim().toLowerCase();
    const user = await usersCollection.findOne({ email: normalizedEmail });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Create session cookie (NOT token cookie)
    await createSession(
      user._id.toString(),
      user.email,
      user.roles || ["user"]
    );

    // Prepare user response
    const userResponse = {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      roles: user.roles || ["user"],
      createdAt: user.createdAt,
    };

    return NextResponse.json(
      {
        success: true,
        message: "Login successful",
        user: userResponse,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Login error:", error);
    return NextResponse.json(
      {
        error: "Login failed. Please try again.",
        details:
          process.env.NODE_ENV === "development"
            ? String(error?.message || error)
            : undefined,
      },
      { status: 500 }
    );
  }
}
