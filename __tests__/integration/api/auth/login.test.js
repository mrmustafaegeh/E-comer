
import { describe, it, expect, vi, beforeAll, afterAll, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { MongoClient } from 'mongodb';
import { startMockDB, stopMockDB } from '../../../helpers/memory-db';

describe('POST /api/auth/login', () => {
  let uri;
  let client;
  let POST; // The handler

  beforeAll(async () => {
    // 1. Start Memory DB
    uri = await startMockDB();
    
    // 2. Set Env Vars BEFORE importing the route
    vi.stubEnv('MONGODB_URI', uri);
    vi.stubEnv('MONGODB_DB', 'test_integration_auth');
    vi.stubEnv('JWT_SECRET', 'test_jwt_secret_extremely_long_random_string');
    vi.stubEnv('NODE_ENV', 'development'); // Skip origin check or we mock headers

    // 3. Import the route dynamically so it picks up the new Env Vars
    const routeModule = await import('@/app/api/auth/login/route');
    POST = routeModule.POST;

    // 4. Setup Client to seed data
    client = new MongoClient(uri);
    await client.connect();
  });

  afterAll(async () => {
    if (client) await client.close();
    await stopMockDB();
    vi.unstubEnv();
  });

  beforeEach(async () => {
    // Clear Users
    const db = client.db('test_integration_auth');
    await db.collection('users').deleteMany({});
  });

  it('should return 400 for missing credentials', async () => {
    const req = new NextRequest('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({})
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toMatch(/Email and password are required/);
  });

  it('should return 401 for non-existent user', async () => {
    const req = new NextRequest('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'nobody@example.com', password: '123' })
    });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it('should return 200 and user data for valid credentials', async () => {
    // Seed User
    const db = client.db('test_integration_auth');
    const hashedPassword = await bcrypt.hash('securePass123', 10);
    await db.collection('users').insertOne({
      email: 'user@example.com',
      password: hashedPassword,
      name: 'Integration User',
      roles: ['user'],
      createdAt: new Date()
    });

    const req = new NextRequest('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'user@example.com', password: 'securePass123' })
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.user.email).toBe('user@example.com');
    
    // Valid session cookie
    // Note: In Next.js App Router, cookies().set() is called.
    // Our vitest.setup.js mocks 'next/headers' but simplistic.
    // Real integration tests often verify Response Headers 'Set-Cookie'.
    // Here we trust the logic reached success.
  });

  it('should return 401 for wrong password', async () => {
     const db = client.db('test_integration_auth');
    const hashedPassword = await bcrypt.hash('securePass123', 10);
    await db.collection('users').insertOne({
      email: 'user2@example.com',
      password: hashedPassword
    });

    const req = new NextRequest('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'user2@example.com', password: 'WRONG_PASSWORD' })
    });

    const res = await POST(req);
    expect(res.status).toBe(401);
  });
});
