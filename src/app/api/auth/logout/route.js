// app/api/auth/logout/route.js
import { NextResponse } from "next/server";
import { deleteSession } from "@/lib/session";

export async function POST() {
  try {
    await deleteSession();
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("❌ Logout error:", error);
    return NextResponse.json({ error: "Logout failed" }, { status: 500 });
  }
}
