import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env.local
dotenv.config({ path: join(__dirname, "..", ".env.local") });

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error("❌ MONGODB_URI not found in .env.local");
  process.exit(1);
}

async function setupIndexes() {
  console.log("🔧 Setting up MongoDB indexes...\n");

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("✅ Connected to MongoDB\n");

    const db = client.db();
    const products = db.collection("products");

    // Drop existing indexes
    console.log("📊 Dropping existing indexes...");
    try {
      await products.dropIndexes();
      console.log("✅ Old indexes dropped\n");
    } catch (err) {
      console.log("ℹ️  No indexes to drop\n");
    }

    // Create indexes
    console.log("📊 Creating featured_rating index...");
    await products.createIndex(
      { featured: 1, rating: -1 },
      { name: "featured_rating_idx", background: true }
    );
    console.log("✅ featured_rating_idx created");

    console.log("📊 Creating rating index...");
    await products.createIndex(
      { rating: -1 },
      { name: "rating_idx", background: true }
    );
    console.log("✅ rating_idx created");

    console.log("📊 Creating category_rating index...");
    await products.createIndex(
      { category: 1, rating: -1 },
      { name: "category_rating_idx", background: true }
    );
    console.log("✅ category_rating_idx created");

    console.log("📊 Creating text search index...");
    await products.createIndex(
      { title: "text", description: "text" },
      { name: "text_search_idx", background: true }
    );
    console.log("✅ text_search_idx created");

    // Verify indexes
    console.log("\n📋 All indexes:");
    const indexes = await products.listIndexes().toArray();
    indexes.forEach((idx) => {
      console.log(`   - ${idx.name}: ${JSON.stringify(idx.key)}`);
    });

    // Test query performance
    console.log("\n⏱️  Testing featured products query...");
    const start = Date.now();
    const result = await products
      .find({ $or: [{ featured: true }, { rating: { $gte: 4.5 } }] })
      .sort({ rating: -1 })
      .limit(4)
      .toArray();
    const queryTime = Date.now() - start;

    console.log(`✅ Query completed in ${queryTime}ms`);
    console.log(`📦 Found ${result.length} products`);

    if (queryTime < 50) {
      console.log("🚀 Excellent performance!");
    } else if (queryTime < 100) {
      console.log("✅ Good performance");
    } else {
      console.log("⚠️  Performance could be better");
    }

    // Explain query
    console.log("\n📊 Query execution plan:");
    const explain = await products
      .find({ $or: [{ featured: true }, { rating: { $gte: 4.5 } }] })
      .sort({ rating: -1 })
      .limit(4)
      .explain("executionStats");

    console.log(
      `   - Documents examined: ${explain.executionStats.totalDocsExamined}`
    );
    console.log(`   - Documents returned: ${explain.executionStats.nReturned}`);
    console.log(
      `   - Execution time: ${explain.executionStats.executionTimeMillis}ms`
    );

    if (
      explain.executionStats.totalDocsExamined >
      explain.executionStats.nReturned * 10
    ) {
      console.log("⚠️  Warning: Query is examining too many documents.");
    } else {
      console.log("✅ Indexes are working efficiently!");
    }

    console.log("\n✨ Setup complete!\n");
  } catch (error) {
    console.error("\n❌ Error:", error.message);
    process.exit(1);
  } finally {
    await client.close();
    process.exit(0);
  }
}

setupIndexes();
