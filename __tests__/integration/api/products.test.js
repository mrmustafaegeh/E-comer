
import { describe, it, expect, vi, beforeAll, afterAll, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { MongoClient } from 'mongodb';
import { startMockDB, stopMockDB } from '../../../helpers/memory-db';

describe('GET /api/products', () => {
  let uri;
  let client;
  let GET;

  beforeAll(async () => {
    uri = await startMockDB();
    
    vi.stubEnv('MONGODB_URI', uri);
    vi.stubEnv('MONGODB_DB', 'test_products_db');

    const routeModule = await import('@/app/api/products/route');
    GET = routeModule.GET;

    client = new MongoClient(uri);
    await client.connect();
  });

  afterAll(async () => {
    if (client) await client.close();
    await stopMockDB();
    vi.unstubEnv();
  });

  beforeEach(async () => {
    const db = client.db('test_products_db');
    await db.collection('products').deleteMany({});
  });

  it('should return empty list when no products', async () => {
    const req = new NextRequest('http://localhost:3000/api/products');
    const res = await GET(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.products).toEqual([]);
    expect(json.total).toBe(0);
  });

  it('should return paginated products', async () => {
    const db = client.db('test_products_db');
    // Insert 15 products
    const products = Array.from({ length: 15 }, (_, i) => ({
      name: `Product ${i + 1}`,
      price: 10 + i,
      category: 'test',
      createdAt: new Date(),
      _id: undefined // let mongo generate
    }));
    await db.collection('products').insertMany(products);

    // Request page 1, limit 10
    const req = new NextRequest('http://localhost:3000/api/products?page=1&limit=10');
    const res = await GET(req);
    const json = await res.json();

    expect(json.products.length).toBe(10);
    expect(json.products[0].name).toBe('Product 15'); // default sort is createdAt -1 (descending) so last inserted is first? 
    // Wait, insertMany inserts in order. logic sorts by createdAt -1.
    // Since we created them in loop, timestamps might be identical or sequential.
    // If sequential, Product 15 is newest -> first.
    
    expect(json.total).toBe(15);
    expect(json.totalPages).toBe(2);
  });

  it('should filter by category', async () => {
    const db = client.db('test_products_db');
    await db.collection('products').insertMany([
      { name: 'P1', category: 'cat1', price: 100, createdAt: new Date() },
      { name: 'P2', category: 'cat2', price: 100, createdAt: new Date() },
      { name: 'P3', category: 'cat1', price: 100, createdAt: new Date() }
    ]);

    const req = new NextRequest('http://localhost:3000/api/products?category=cat1');
    const res = await GET(req);
    const json = await res.json();

    expect(json.products.length).toBe(2);
    expect(json.products.map(p => p.name)).toContain('P1');
    expect(json.products.map(p => p.name)).toContain('P3');
  });

  it('should filter by price range', async () => {
    const db = client.db('test_products_db');
    await db.collection('products').insertMany([
      { name: 'Cheap', price: 10, createdAt: new Date() },
      { name: 'Mid', price: 50, createdAt: new Date() },
      { name: 'Expensive', price: 100, createdAt: new Date() }
    ]);

    const req = new NextRequest('http://localhost:3000/api/products?minPrice=20&maxPrice=80');
    const res = await GET(req);
    const json = await res.json();

    expect(json.products.length).toBe(1);
    expect(json.products[0].name).toBe('Mid');
  });
});
