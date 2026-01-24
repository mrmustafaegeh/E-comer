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

    // PRODUCTS
    const products = db.collection("products");
    await products.createIndex({ createdAt: -1 });
    await products.createIndex({ category: 1, createdAt: -1 });

    // If you search by regex on name, index doesn't fully help,
    // but keep it anyway for sorting/filters in future
    await products.createIndex({ name: 1 });

    // Your featured query: {$or:[{featured:true},{rating:{$gte:4.5}}]} + sort rating
    await products.createIndex({ featured: 1, rating: -1 });
    await products.createIndex({ rating: -1 });

    console.log("✅ products indexes created");

    // USERS
    const users = db.collection("users");
    await users.createIndex({ createdAt: -1 });
    await users.createIndex({ email: 1 }, { unique: true });
    console.log("✅ users indexes created");

    // ORDERS
    const orders = db.collection("orders");
    await orders.createIndex({ createdAt: -1 });
    await orders.createIndex({ status: 1, createdAt: -1 });
    await orders.createIndex({ userId: 1, createdAt: -1 });
    console.log("✅ orders indexes created");

    console.log("\n✨ Done.\n");
  } catch (e) {
    console.error("❌ Setup indexes failed:", e?.message || e);
    process.exitCode = 1;
  } finally {
    await client.close();
  }
}

main();
