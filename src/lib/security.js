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
      // Mutations usually REQUIRE an origin.
      // Exception for development if really needed, but strict in production.
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
 * Distributed rate limiting.
 * Uses Upstash Redis if UPSTASH_REDIS_REST_URL is present.
 * Falls back to in-memory Map for dev/demo.
 */
const rateLimitMap = new Map();

export async function rateLimit(identifier, limit = 5, windowMs = 60000) {
  // 1. Try Upstash Redis if configured
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    try {
      const url = `${process.env.UPSTASH_REDIS_REST_URL}/incr/ratelimit:${identifier}`;
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}` }
      });
      
      const { result: count } = await response.json();
      
      // If it's the first hit, set expiry
      if (count === 1) {
        await fetch(`${process.env.UPSTASH_REDIS_REST_URL}/expire/ratelimit:${identifier}/${Math.floor(windowMs / 1000)}`, {
          headers: { Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}` }
        });
      }
      
      return count <= limit;
    } catch (e) {
      console.error("❌ Redis Rate Limit Error:", e.message);
      // Fallback to in-memory on redis failure to avoid blocking legitimate users
    }
  }

  // 2. In-memory fallback
  const now = Date.now();
  const record = rateLimitMap.get(identifier) || { count: 0, startTime: now };

  if (now - record.startTime > windowMs) {
    record.count = 1;
    record.startTime = now;
  } else {
    record.count++;
  }

  rateLimitMap.set(identifier, record);

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
