const { MongoClient } = require('mongodb');

// URI from .env
const uri = "mongodb+srv://Ve0ir:Ve0ir1990@mystore.ywsyaw1.mongodb.net/?appName=myStore";
const dbName = "ecommerce";

async function run() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    
    const db = client.db(dbName);
    
    // Count collections
    const productsCount = await db.collection('products').countDocuments();
    const ordersCount = await db.collection('orders').countDocuments();
    const usersCount = await db.collection('users').countDocuments();
    
    console.log("--- DB STATS ---");
    console.log(`Database: ${dbName}`);
    console.log(`Products: ${productsCount}`);
    console.log(`Orders: ${ordersCount}`);
    console.log(`Users: ${usersCount}`);
    
    if (productsCount > 0) {
        const p = await db.collection('products').findOne({});
        console.log("Sample Product ID:", p._id, "Type:", typeof p._id);
    }
    
    if (ordersCount > 0) {
        const allOrders = await db.collection('orders').find({}).toArray();
        console.log("Checking Product IDs in Orders:");
        allOrders.forEach(o => {
            if (o.products && Array.isArray(o.products)) {
                o.products.forEach(p => {
                    console.log(`Order ${o._id}: ProductID "${p.productId}" (Len: ${p.productId ? p.productId.length : 'N/A'})`);
                });
            }
        });
        
        console.log("Checking CreatedAt format:");
        allOrders.forEach(o => {
             console.log(`Order ${o._id}: createdAt type: ${typeof o.createdAt} value: ${o.createdAt}`);
        });

    }

  } catch (err) {
    console.error("DB Error:", err);
  } finally {
    await client.close();
  }
}

run();
