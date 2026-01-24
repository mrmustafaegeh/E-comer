import { NextResponse } from "next/server";
import { v4 as uuid } from "uuid";
import { writeFile } from "fs/promises";
import path from "path";
import sharp from "sharp"; // ✅ Install: npm install sharp

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // ✅ Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG, and WebP allowed." },
        { status: 400 }
      );
    }

    // ✅ Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File too large. Maximum 5MB allowed." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const filename = uuid() + ".webp"; // ✅ Convert to WebP for smaller size

    // ✅ OPTIMIZE IMAGE: Compress and resize
    const optimizedBuffer = await sharp(buffer)
      .resize(1200, 1200, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 80 }) // ✅ Convert to WebP with 80% quality
      .toBuffer();

    const filepath = path.join(process.cwd(), "public/uploads/" + filename);
    await writeFile(filepath, optimizedBuffer);

    // ✅ Also create thumbnail
    const thumbnailFilename = "thumb-" + filename;
    const thumbnailBuffer = await sharp(buffer)
      .resize(300, 300, { fit: "cover" })
      .webp({ quality: 70 })
      .toBuffer();

    const thumbnailPath = path.join(
      process.cwd(),
      "public/uploads/" + thumbnailFilename
    );
    await writeFile(thumbnailPath, thumbnailBuffer);

    return NextResponse.json({
      url: "/uploads/" + filename,
      thumbnail: "/uploads/" + thumbnailFilename,
      size: optimizedBuffer.length,
      originalSize: buffer.length,
      saved:
        Math.round((1 - optimizedBuffer.length / buffer.length) * 100) + "%",
    });
  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}
