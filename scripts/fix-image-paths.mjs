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
    const col = db.collection("products");

    // Fix fields like "//image/xxx" => "/image/xxx"
    const result1 = await col.updateMany(
      { image: { $type: "string", $regex: /^\/\// } },
      [
        {
          $set: {
            image: {
              $replaceOne: { input: "$image", find: "//", replacement: "/" },
            },
          },
        },
      ]
    );

    // Optional: if you also have thumbnail with //
    const result2 = await col.updateMany(
      { thumbnail: { $type: "string", $regex: /^\/\// } },
      [
        {
          $set: {
            thumbnail: {
              $replaceOne: {
                input: "$thumbnail",
                find: "//",
                replacement: "/",
              },
            },
          },
        },
      ]
    );

    console.log(`✅ Fixed image on ${result1.modifiedCount} products`);
    console.log(`✅ Fixed thumbnail on ${result2.modifiedCount} products`);
  } catch (e) {
    console.error("❌ Fix images failed:", e?.message || e);
    process.exitCode = 1;
  } finally {
    await client.close();
  }
}

main();
