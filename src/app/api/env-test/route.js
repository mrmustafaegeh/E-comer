// Create this test file:
// app/api/env-test/route.js
export async function GET() {
  const envVars = {
    MONGODB_URI: process.env.MONGODB_URI ? "✓ Set" : "✗ Missing",
    MONGODB_DB: process.env.MONGODB_DB ? "✓ Set" : "✗ Missing",
    NODE_ENV: process.env.NODE_ENV || "✗ Missing",
    ALL_VARS: Object.keys(process.env).filter(
      (key) => key.includes("MONGO") || key.includes("DB")
    ),
  };

  return Response.json(envVars);
}
