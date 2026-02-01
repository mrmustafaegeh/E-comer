import { NextResponse } from "next/server";
import { getProducts, createProduct } from "@/services/productService";
import { productQuerySchema, productSchema } from "@/validators/productValidator";
import { validateRequest, forbiddenResponse, rateLimit, rateLimitResponse, getClientIp } from "@/lib/security";
import { verifySession } from "@/lib/session";

export async function GET(request) {
  try {
    const ip = getClientIp(request);
    const { success } = await rateLimit(ip, 100, "1 m");
    if (!success) return rateLimitResponse();

    const urlParams = Object.fromEntries(request.nextUrl.searchParams);
    
    // Validate Query Params
    const query = productQuerySchema.parse(urlParams);
    
    const result = await getProducts(query);

    return NextResponse.json(result, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to load products", details: err.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const isValidOrigin = await validateRequest(request);
    if (!isValidOrigin) return forbiddenResponse();

    const session = await verifySession();
    if (!session || !session.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = productSchema.parse(body);

    const newProduct = await createProduct(validatedData);
    return NextResponse.json(newProduct, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to create product", details: err.message },
      { status: 400 }
    );
  }
}
