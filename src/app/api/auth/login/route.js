// app/api/auth/login/route.js
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import { createSession } from "@/lib/session";

import {
  validateRequest,
  rateLimit,
  forbiddenResponse,
  rateLimitResponse,
  getClientIp,
} from "@/lib/security";

export async function POST(request) {
  try {
    // 1) CSRF / Origin validation
    const ok = await validateRequest(request);
    if (!ok) {
      return forbiddenResponse({
        code: "ORIGIN_FORBIDDEN",
        origin: request.headers.get("origin"),
      });
    }

    // 2) Rate limit (IP based)
    // 2) Rate limit (IP based)
    const ip = getClientIp(request);
    const { success } = await rateLimit(ip, 5, "15 m"); // 5 per 15 minutes
    if (!success) return rateLimitResponse();

    // 3) Parse JSON
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const email = String(body?.email || "")
      .trim()
      .toLowerCase();
    const password = String(body?.password || "");

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // 4) DB lookup
    const client = await clientPromise;
    const dbName = process.env.MONGODB_DB;

    if (!dbName) {
      console.error("❌ MONGODB_DB is not set");
      return NextResponse.json(
        { error: "Server misconfigured" },
        { status: 500 }
      );
    }

    const db = client.db(dbName);
    const users = db.collection("users");

    const user = await users.findOne({ email });

    // 5) Auth check
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const userPasswordHash = user.password;
    if (!userPasswordHash || typeof userPasswordHash !== "string") {
      console.error(
        "❌ User has no password hash stored:",
        user?._id?.toString()
      );
      return NextResponse.json(
        { error: "Account misconfigured" },
        { status: 500 }
      );
    }

    const passOk = await bcrypt.compare(password, userPasswordHash);
    if (!passOk) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // 6) Create session cookie
    await createSession(
      user._id.toString(),
      user.email,
      user.roles || ["user"]
    );

    // 7) Respond
    return NextResponse.json(
      {
        success: true,
        message: "Login successful",
        user: {
          id: user._id.toString(),
          email: user.email,
          name: user.name || null,
          roles: user.roles || ["user"],
          createdAt: user.createdAt || null,
        },
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
