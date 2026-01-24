import { headers } from "next/headers";
import { NextResponse } from "next/server";

/**
 * Validates the request origin to prevent CSRF.
 * Uses exact matching and protocol validation.
 */
export async function validateRequest(request) {
  const headerList = await headers();
  const origin = headerList.get("origin");
  
  const rawAllowedOrigin = process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null);
  
  if (!rawAllowedOrigin) {
    if (process.env.NODE_ENV === 'development') return true;
    console.error("❌ NEXT_PUBLIC_APP_URL not configured");
    return false;
  }

  try {
    const allowedUrl = new URL(rawAllowedOrigin);
    
    // In development, localhost is always permitted
    if (process.env.NODE_ENV === 'development') {
      if (origin && (origin.includes('localhost') || origin.includes('127.0.0.1'))) {
         return true;
      }
    }

    if (!origin) {
      // For mutations via forms/JSON, origin is usually required.
      // We permit missing origin only in non-strict dev environments if necessary.
      return process.env.NODE_ENV === 'development';
    }

    const requestOriginUrl = new URL(origin);
    
    // Strict comparison
    return (
      requestOriginUrl.protocol === allowedUrl.protocol &&
      requestOriginUrl.host === allowedUrl.host
    );
  } catch (e) {
    console.error("❌ Origin validation error:", e.message);
    return false;
  }
}

/**
 * Validates if a string is a valid MongoDB ObjectId
 */
export function isValidObjectId(id) {
  if (!id || typeof id !== 'string') return false;
  return /^[0-9a-fA-F]{24}$/.test(id);
}

/**
 * Very basic in-memory rate limiting for demonstration.
 * In production, use Redis (Upstash) or similar.
 */
const rateLimitMap = new Map();

export async function rateLimit(ip, limit = 5, windowMs = 60000) {
  const now = Date.now();
  const record = rateLimitMap.get(ip) || { count: 0, startTime: now };

  if (now - record.startTime > windowMs) {
    record.count = 1;
    record.startTime = now;
  } else {
    record.count++;
  }

  rateLimitMap.set(ip, record);

  return record.count <= limit;
}

export function forbiddenResponse() {
  return NextResponse.json(
    { error: "Security check failed. Forbidden request." },
    { status: 403 }
  );
}

export function rateLimitResponse() {
  return NextResponse.json(
    { error: "Too many requests. Please try again later." },
    { status: 429 }
  );
}
