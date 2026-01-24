import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, "..", ".env.local") });

const uri = process.env.MONGODB_URI;

async function analyzeQueries() {
  console.log("🔍 Analyzing Query Performance...\n");

  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db();

    const queries = [
      {
        name: "Featured Products",
        collection: "products",
        query: { $or: [{ featured: true }, { rating: { $gte: 4.5 } }] },
        sort: { rating: -1 },
        limit: 4,
      },
      {
        name: "Admin Products List (page 1)",
        collection: "products",
        query: {},
        sort: { createdAt: -1 },
        limit: 50,
      },
      {
        name: "Product Search",
        collection: "products",
        query: { name: { $regex: "phone", $options: "i" } },
        sort: { createdAt: -1 },
        limit: 20,
      },
      {
        name: "Category Filter",
        collection: "products",
        query: { category: "electronics" },
        sort: { createdAt: -1 },
        limit: 50,
      },
      {
        name: "Admin Users List",
        collection: "users",
        query: {},
        sort: { createdAt: -1 },
        limit: 10,
      },
      {
        name: "Admin Orders List",
        collection: "orders",
        query: {},
        sort: { createdAt: -1 },
        limit: 10,
      },
    ];

    for (const q of queries) {
      const coll = db.collection(q.collection);

      const explain = await coll
        .find(q.query)
        .sort(q.sort || {})
        .limit(q.limit)
        .explain("executionStats");

      const stats = explain.executionStats;
      const time = stats.executionTimeMillis;
      const examined = stats.totalDocsExamined;
      const returned = stats.nReturned;
      const efficiency =
        returned > 0 ? (examined / returned).toFixed(1) : "N/A";

      console.log(`📊 ${q.name}:`);
      console.log(
        `   Time: ${time}ms ${
          time < 50
            ? "🚀 Excellent"
            : time < 100
            ? "✅ Good"
            : time < 200
            ? "⚠️  Slow"
            : "❌ Very Slow"
        }`
      );
      console.log(`   Docs examined: ${examined}`);
      console.log(`   Docs returned: ${returned}`);
      console.log(
        `   Efficiency: ${efficiency}x ${
          efficiency < 5 ? "🚀" : efficiency < 10 ? "✅" : "⚠️"
        }`
      );

      if (examined > returned * 10) {
        console.log(
          `   ⚠️  WARNING: Examining ${examined} docs to return ${returned}!`
        );
        console.log(`   💡 Consider adding an index for this query`);
      }

      console.log();
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await client.close();
    process.exit(0);
  }
}

// Uncomment to run:
// analyzeQueries();
