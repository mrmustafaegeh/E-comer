import { z } from "zod";

const envSchema = z.object({
  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
  MONGODB_DB: z.string().min(1, "MONGODB_DB is required"),
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters long"),
  
  // Optional but recommended
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  
  // Production only requirements
  UPSTASH_REDIS_REST_URL: process.env.NODE_ENV === "production" 
    ? z.string().url("UPSTASH_REDIS_REST_URL is required in production")
    : z.string().optional(),
  UPSTASH_REDIS_REST_TOKEN: process.env.NODE_ENV === "production" 
    ? z.string().min(1, "UPSTASH_REDIS_REST_TOKEN is required in production")
    : z.string().optional(),
});

export function validateEnv() {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const formattedError = JSON.stringify(result.error.format(), null, 2);
    console.error("❌ FATAL: Invalid environment variables:\n", formattedError);
    // In strict mode we might want to exit, but throwing ensures Next.js catches it at build/runtime
    throw new Error("Invalid environment variables. Check server logs for details.");
  }

  return result.data;
}
