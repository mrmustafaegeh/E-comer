// lib/security.js
import { NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * Normalize URL by removing trailing slash.
 */
function normalizeUrl(url) {
  return String(url || "")
    .trim()
    .replace(/\/$/, "");
}

/**
 * Get canonical allowed origins for CSRF protection.
 */
function getAllowedOrigins() {
  const allowed = new Set();

  const appUrl = normalizeUrl(process.env.NEXT_PUBLIC_APP_URL);
  if (appUrl) allowed.add(appUrl);

  const siteUrl = normalizeUrl(process.env.NEXT_PUBLIC_SITE_URL);
  if (siteUrl) allowed.add(siteUrl);

  const vercelUrl = normalizeUrl(
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : ""
  );
  if (vercelUrl) allowed.add(vercelUrl);

  return allowed;
}

/**
 * CSRF / Origin validation for browser POST/PUT/PATCH/DELETE.
 */
export async function validateRequest(request) {
  if (process.env.NODE_ENV === "development") return true;

  const origin = request.headers.get("origin");
  if (!origin) return false;

  const normalizedOrigin = normalizeUrl(origin);
  const allowedOrigins = getAllowedOrigins();

  if (!process.env.NEXT_PUBLIC_APP_URL) {
    console.error("❌ NEXT_PUBLIC_APP_URL is missing in production env");
    return false;
  }

  if (allowedOrigins.has(normalizedOrigin)) return true;

  if (process.env.ALLOW_VERCEL_PREVIEWS === "true") {
    const prefix = process.env.VERCEL_PREVIEW_PREFIX || "e-comer-webside";
    const re = new RegExp(`^https:\\/\\/${prefix}.*\\.vercel\\.app$`);
    if (re.test(normalizedOrigin)) return true;
  }

  return false;
}

/**
 * Extract client IP reliably on Vercel.
 */
export function getClientIp(request) {
  const xff = request.headers.get("x-forwarded-for") || "";
  const ip = xff.split(",")[0].trim();
  const realIp = request.headers.get("x-real-ip") || "";
  return ip || realIp || "127.0.0.1";
}

// ---------------------------------------------------------
// RATE LIMITING (Redis + Fallback)
// ---------------------------------------------------------

// In-memory fallback for development or Redis failure
const memoryStore = new Map();

function memoryRateLimit(identifier, limit, windowMs) {
  const now = Date.now();
  const record = memoryStore.get(identifier) || { count: 0, startTime: now };

  if (now - record.startTime > windowMs) {
    record.count = 1;
    record.startTime = now;
  } else {
    record.count++;
  }

  memoryStore.set(identifier, record);
  return {
    success: record.count <= limit,
    limit,
    remaining: Math.max(0, limit - record.count),
    reset: record.startTime + windowMs,
  };
}

/**
 * Distributed rate limiting using Upstash Redis.
 * Falls back to memory if not configured (Dev) or if Redis fails.
 * 
 * @param {string} identifier - Unique ID (IP, User ID)
 * @param {number} limit - Max requests
 * @param {string} duration - Duration string (e.g., "1 m", "10 s")
 * @returns {Promise<{success: boolean, limit: number, remaining: number, reset: number}>}
 */
export async function rateLimit(identifier, limit = 10, duration = "1 m") {
  // 1. Production / Redis Path
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    try {
      const redis = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      });

      const ratelimit = new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(limit, duration),
        analytics: true,
        prefix: "@upstash/ratelimit",
      });

      const { success, limit: l, remaining, reset } = await ratelimit.limit(identifier);
      return { success, limit: l, remaining, reset };

    } catch (e) {
      console.error("❌ Redis Rate Limit Error (Falling back to memory):", e?.message || e);
      // Fallthrough to memory
    }
  }

  // 2. Memory / Dev Path
  // Parse duration string to ms roughly (simple fallback)
  const durationMs = parseDuration(duration);
  return memoryRateLimit(identifier, limit, durationMs);
}

function parseDuration(d) {
  const [val, unit] = d.split(" ");
  const v = parseInt(val, 10);
  if (unit === "s") return v * 1000;
  if (unit === "m") return v * 60 * 1000;
  if (unit === "h") return v * 60 * 60 * 1000;
  if (unit === "d") return v * 24 * 60 * 60 * 1000;
  return 60000; // default 1m
}

export function forbiddenResponse(meta = {}) {
  return NextResponse.json(
    { error: "Security check failed. Forbidden request.", ...meta },
    { status: 403 }
  );
}

export function rateLimitResponse(headers = {}) {
  const response = NextResponse.json(
    { error: "Too many requests. Please try again later." },
    { status: 429 }
  );
  
  if (headers) {
    Object.entries(headers).forEach(([k, v]) => response.headers.set(k, v));
  }
  
  return response;
}

export function isValidObjectId(id) {
  if (!id || typeof id !== "string") return false;
  return /^[0-9a-fA-F]{24}$/.test(id);
}
