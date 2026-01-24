// app/api/auth/login/route.js
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import { createSession } from "@/lib/session";

import { validateRequest, rateLimit, forbiddenResponse, rateLimitResponse } from "@/lib/security";
import { headers } from "next/headers";

export async function POST(request) {
  try {
    // 1. Validate Origin
    const isValidRequest = await validateRequest(request);
    if (!isValidRequest) return forbiddenResponse();

    // 2. Rate Limiting (IP based)
    const headerList = await headers();
    const ip = headerList.get("x-forwarded-for") || "127.0.0.1";
    const isRateLimited = !(await rateLimit(ip, 5, 60000)); // 5 attempts per minute
    if (isRateLimited) return rateLimitResponse();

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
