import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const options = {
  maxPoolSize: 10, // ✅ Connection pool size
  minPoolSize: 5,
  maxIdleTimeMS: 30000,
  serverSelectionTimeoutMS: 5000, // ✅ Fail fast if DB is down
  socketTimeoutMS: 45000,
};

let client;
let clientPromise;

if (!process.env.MONGODB_URI) {
  throw new Error("Please add MONGODB_URI to .env.local");
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();

    // ✅ Log connection status
    global._mongoClientPromise
      .then(() => {
        console.log("✅ MongoDB connected successfully");
      })
      .catch((err) => {
        console.error("❌ MongoDB connection error:", err);
      });
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
