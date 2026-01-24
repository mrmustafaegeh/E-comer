// src/app/api/upload/route.ts
import { put, del } from "@vercel/blob";
import { NextResponse } from "next/server";

// POST - Upload image to Vercel Blob
export async function POST(request: Request): Promise<NextResponse> {
  try {
    //     const session = await getServerSession(authOptions);
    // if (!session) {
    //   return NextResponse.json(
    //     { error: 'Unauthorized' },
    //     { status: 401 }
    //   );
    // }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG, and WebP are allowed." },
        { status: 400 }
      );
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File size too large. Maximum size is 5MB." },
        { status: 400 }
      );
    }

    // Upload to Vercel Blob
    const blob = await put(file.name, file, {
      access: "public",
      addRandomSuffix: true, // Adds random suffix to prevent name conflicts
    });

    console.log("✅ Image uploaded successfully:", blob.url);

    return NextResponse.json({
      url: blob.url,
      pathname: blob.pathname,
      size: file.size,
      contentType: file.type,
    });
  } catch (error) {
    console.error("❌ Upload error:", error);
    return NextResponse.json(
      { error: "Upload failed. Please try again." },
      { status: 500 }
    );
  }
}

// DELETE - Remove image from Vercel Blob
export async function DELETE(request: Request): Promise<NextResponse> {
  try {
    // TODO: Add authentication check here
    // const session = await getServerSession();
    // if (!session?.user?.isAdmin) {
    //   return NextResponse.json(
    //     { error: 'Unauthorized - Admin access required' },
    //     { status: 401 }
    //   );
    // }

    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: "No URL provided" }, { status: 400 });
    }

    // Delete from Vercel Blob
    await del(url);

    console.log("✅ Image deleted successfully:", url);

    return NextResponse.json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    console.error("❌ Delete error:", error);
    return NextResponse.json(
      { error: "Delete failed. Please try again." },
      { status: 500 }
    );
  }
}
