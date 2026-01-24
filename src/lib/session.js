import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secretString = process.env.JWT_SECRET;
if (!secretString) {
  console.error("❌ Missing JWT_SECRET env var");
}
const secret = new TextEncoder().encode(
  secretString || "dev-secret-key-change-in-production"
);

export const encrypt = async (payload) => {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
};

export const createSession = async (userId, email, roles = []) => {
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 7 days from now
  const token = await encrypt({
    userId,
    email,
    roles,
    expiresAt: expiresAt.getTime(),
  });

  // ✅ In Next.js 15+, cookies() is asynchronous and must be awaited
  const cookieStore = await cookies();

  cookieStore.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt, // Set explicit browser expiration
  });
};

export const verifySession = async () => {
  // ✅ Must await cookies() before using .get()
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret);

    // Validate expiration manually if stored in payload
    if (payload?.expiresAt && payload.expiresAt < Date.now()) {
      return null;
    }

    return payload;
  } catch (e) {
    console.error("❌ Invalid session token:", e?.message || e);
    return null;
  }
};

export const deleteSession = async () => {
  // ✅ Must await cookies() before using .delete()
  const cookieStore = await cookies();
  cookieStore.delete("session");
};

export const getCurrentUser = async () => {
  const session = await verifySession();
  if (!session) return null;

  return {
    userId: session.userId,
    email: session.email,
    roles: session.roles || [],
  };
};
