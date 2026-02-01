import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { getUserById, updateProfile } from "@/services/authService";
import { updateProfileSchema } from "@/validators/authValidator";
import { validateRequest, forbiddenResponse } from "@/lib/security";
import { transformUser } from "@/lib/transformers";

export async function GET() {
  try {
    const session = await getCurrentUser();
    
    if (!session || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getUserById(session.userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(transformUser(user), {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
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
    const validatedData = updateProfileSchema.parse(body);

    const updatedUser = await updateProfile(session.userId, validatedData);

    return NextResponse.json({ 
      success: true, 
      message: "Protocol: Profile data synchronized.",
      user: transformUser(updatedUser)
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Update failed", details: error.message },
      { status: 400 }
    );
  }
}
