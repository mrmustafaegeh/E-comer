import { validateRequest, forbiddenResponse, rateLimit, rateLimitResponse, getClientIp } from "@/lib/security";
import { verifySession } from "@/lib/session";
import { ProductSchema, formatZodErrors } from "@/lib/validation";
import { NextResponse } from "next/server";
import { getProducts, createProduct } from "@/services/productService";

export async function GET(request) {
  const start = Date.now();

  try {
    // Rate Limit: 100 req / minute
    const ip = getClientIp(request);
    const { success } = await rateLimit(ip, 100, "1 m");
    if (!success) return rateLimitResponse();

    const params = Object.fromEntries(request.nextUrl.searchParams);
    
    // Call Service Layer
    const result = await getProducts(params);

    return NextResponse.json(
      result,
      {
        status: 200,
        headers: {
          "Cache-Control":
            process.env.NODE_ENV === "production"
              ? "public, s-maxage=60, stale-while-revalidate=120"
              : "private, max-age=10",
        },
      }
    );
  } catch (err) {
    console.error("PRODUCTS API ERROR:", err);
    return NextResponse.json(
      { error: "Failed to load products" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    // 1. Validate Origin
    const isValidRequest = await validateRequest(request);
    if (!isValidRequest) return forbiddenResponse();

    // 2. Authorize - Must be Admin
    const session = await verifySession();
    if (!session || !session.roles?.includes("admin")) {
      return NextResponse.json(
        { error: "Unauthorized. Admin privileges required." },
        { status: 403 }
      );
    }

    const body = await request.json();

    // 3. Validate Input with Zod
    const parsed = ProductSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", errors: formatZodErrors(parsed.error) },
        { status: 400 }
      );
    }

    // Call Service Layer
    try {
      const newProduct = await createProduct(parsed.data);
      return NextResponse.json(newProduct, { status: 201 });
    } catch (err) {
      if (err.message.includes("slug already exists")) {
        return NextResponse.json(
          { error: err.message },
          { status: 409 }
        );
      }
      throw err;
    }

  } catch (err) {
    console.error("PRODUCTS POST API ERROR:", err);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
