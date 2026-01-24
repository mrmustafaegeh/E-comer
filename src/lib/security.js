// lib/security.js
import { NextResponse } from "next/server";

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
 * - NEXT_PUBLIC_APP_URL should be your real production URL (recommended).
 * - Optionally allow preview deployments via ALLOW_VERCEL_PREVIEWS=true
 */
function getAllowedOrigins() {
  const allowed = new Set();

  const appUrl = normalizeUrl(process.env.NEXT_PUBLIC_APP_URL);
  if (appUrl) allowed.add(appUrl);

  // Optional: if you use another canonical env var name
  const siteUrl = normalizeUrl(process.env.NEXT_PUBLIC_SITE_URL);
  if (siteUrl) allowed.add(siteUrl);

  // Vercel provides VERCEL_URL (hostname only). We can form https://<host>
  // BUT this can point to preview URLs, so don't rely on it as the only option.
  const vercelUrl = normalizeUrl(
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : ""
  );
  if (vercelUrl) allowed.add(vercelUrl);

  return allowed;
}

/**
 * CSRF / Origin validation for browser POST/PUT/PATCH/DELETE.
 *
 * Rules:
 * - In development: allow.
 * - In production: require Origin for browser mutations.
 * - Origin must match allowlist OR (optional) match project preview pattern.
 */
export async function validateRequest(request) {
  // Dev bypass
  if (process.env.NODE_ENV === "development") return true;

  const origin = request.headers.get("origin");
  if (!origin) {
    // Browsers send Origin for fetch POSTs; missing Origin is suspicious for mutations.
    return false;
  }

  const normalizedOrigin = normalizeUrl(origin);
  const allowedOrigins = getAllowedOrigins();

  // If NEXT_PUBLIC_APP_URL isn't configured, be strict (fail closed)
  // because otherwise your prod security becomes unpredictable.
  if (!process.env.NEXT_PUBLIC_APP_URL) {
    console.error("❌ NEXT_PUBLIC_APP_URL is missing in production env");
    return false;
  }

  // Exact match allowlist
  if (allowedOrigins.has(normalizedOrigin)) return true;

  // Optional: allow preview deployments safely (same project prefix)
  // Enable with: ALLOW_VERCEL_PREVIEWS=true
  if (process.env.ALLOW_VERCEL_PREVIEWS === "true") {
    // Example: https://e-comer-webside-git-branch-user.vercel.app
    // Restrict to your project prefix to avoid allowing random vercel.app origins.
    const prefix = process.env.VERCEL_PREVIEW_PREFIX || "e-comer-webside";
    const re = new RegExp(`^https:\\/\\/${prefix}.*\\.vercel\\.app$`);
    if (re.test(normalizedOrigin)) return true;
  }

  return false;
}

/**
 * Extract client IP reliably on Vercel.
 * x-forwarded-for may be a list "client, proxy1, proxy2"
 */
export function getClientIp(request) {
  const xff = request.headers.get("x-forwarded-for") || "";
  const ip = xff.split(",")[0].trim();

  // Fallback headers sometimes present on platforms
  const realIp = request.headers.get("x-real-ip") || "";

  return ip || realIp || "127.0.0.1";
}

/**
 * Distributed rate limiting.
 * Uses Upstash Redis if configured, else in-memory fallback.
 */
const rateLimitMap = new Map();

export async function rateLimit(identifier, limit = 5, windowMs = 60000) {
  // 1) Upstash Redis (recommended for serverless)
  if (
    process.env.UPSTASH_REDIS_REST_URL &&
    process.env.UPSTASH_REDIS_REST_TOKEN
  ) {
    try {
      const base = process.env.UPSTASH_REDIS_REST_URL;
      const token = process.env.UPSTASH_REDIS_REST_TOKEN;
      const key = `ratelimit:${identifier}`;

      const incrRes = await fetch(`${base}/incr/${encodeURIComponent(key)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const incrJson = await incrRes.json();
      const count = incrJson?.result ?? 0;

      // set expiry on first hit
      if (count === 1) {
        const ttl = Math.floor(windowMs / 1000);
        await fetch(`${base}/expire/${encodeURIComponent(key)}/${ttl}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      return count <= limit;
    } catch (e) {
      console.error("❌ Redis Rate Limit Error:", e?.message || e);
      // fallback to in-memory to avoid blocking legit users if redis fails
    }
  }

  // 2) In-memory fallback (not perfect on serverless, but OK as fallback)
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

export function forbiddenResponse(meta = {}) {
  return NextResponse.json(
    {
      error: "Security check failed. Forbidden request.",
      ...meta,
    },
    { status: 403 }
  );
}

export function rateLimitResponse() {
  return NextResponse.json(
    { error: "Too many requests. Please try again later." },
    { status: 429 }
  );
}
