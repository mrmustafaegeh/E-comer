import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("❌ MONGODB_URI not found in .env.local");
  process.exit(1);
}

const client = new MongoClient(uri);

async function main() {
  try {
    await client.connect();
    const db = client.db();

    const products = await db.collection("products").countDocuments();
    const users = await db.collection("users").countDocuments();
    const orders = await db.collection("orders").countDocuments();

    console.log("✅ Connected to MongoDB");
    console.log(`📦 products: ${products}`);
    console.log(`👤 users: ${users}`);
    console.log(`🧾 orders: ${orders}`);
  } catch (e) {
    console.error("❌ DB check failed:", e?.message || e);
    process.exitCode = 1;
  } finally {
    await client.close();
  }
}

main();
