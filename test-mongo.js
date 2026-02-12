import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

dotenv.config({ path: '.env.local' });

async function testConnection() {
  console.log('Testing MongoDB connection...');
  console.log('Connection URI:', process.env.MONGODB_URI ? 'Found ✓' : 'Missing ✗');
  
  if (!process.env.MONGODB_URI) {
    console.error('❌ MONGODB_URI not found in environment');
    process.exit(1);
  }

  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    console.log('Attempting to connect...');
    await client.connect();
    console.log('✅ MongoDB connected successfully!');
    
    const db = client.db(process.env.MONGODB_DB || 'ecommerce');
    console.log('Database:', db.databaseName);
    
    const collections = await db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name).join(', '));
    
    const productsCount = await db.collection('products').countDocuments();
    console.log('Products count:', productsCount);
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.error('\n📋 Possible solutions:');
    console.error('1. ✓ Check if MongoDB Atlas cluster is PAUSED (resume it at cloud.mongodb.com)');
    console.error('2. ✓ Whitelist your IP in MongoDB Atlas → Network Access');
    console.error('3. ✓ Verify your connection string in .env.local');
    console.error('4. ✓ Check your internet connection');
  } finally {
    await client.close();
  }
}

testConnection();
