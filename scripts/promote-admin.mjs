import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "ecommerce";

if (!uri) {
  console.error("❌ MONGODB_URI not found in .env.local");
  process.exit(1);
}

const client = new MongoClient(uri);

async function promote(email) {
  try {
    await client.connect();
    const db = client.db(dbName);
    const users = db.collection("users");

    const result = await users.updateOne(
      { email: email.toLowerCase().trim() },
      { $addToSet: { roles: "admin" } }
    );

    if (result.matchedCount === 0) {
      console.log(`❌ No user found with email: ${email}`);
    } else if (result.modifiedCount === 0) {
      console.log(`ℹ️ User ${email} already has admin role or was not updated.`);
    } else {
      console.log(`✅ User ${email} promoted to admin successfully!`);
    }
  } catch (e) {
    console.error("❌ Promotion failed:", e);
  } finally {
    await client.close();
  }
}

const email = process.argv[2] || "mr.mustafaegeh@gmail.com";
promote(email);
