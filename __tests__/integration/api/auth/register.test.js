
import { describe, it, expect, vi, beforeAll, afterAll, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { MongoClient } from 'mongodb';
import { startMockDB, stopMockDB } from '../../../helpers/memory-db';

describe('POST /api/auth/register', () => {
  let uri;
  let client;
  let POST;

  beforeAll(async () => {
    uri = await startMockDB();
    
    vi.stubEnv('MONGODB_URI', uri);
    vi.stubEnv('MONGODB_DB', 'test_integration_register');
    vi.stubEnv('NODE_ENV', 'development');

    const routeModule = await import('@/app/api/auth/register/route');
    POST = routeModule.POST;

    client = new MongoClient(uri);
    await client.connect();
  });

  afterAll(async () => {
    if (client) await client.close();
    await stopMockDB();
    vi.unstubEnv();
  });

  beforeEach(async () => {
    const db = client.db('test_integration_register');
    await db.collection('users').deleteMany({});
  });

  it('should return 400 if fields are missing', async () => {
    const req = new NextRequest('http://localhost:3000/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@example.com' })
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe("All fields are required");
  });

  it('should return 400 if password is too short', async () => {
    const req = new NextRequest('http://localhost:3000/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@example.com', name: 'User', password: '123' })
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe("Password must be at least 6 characters");
  });

  it('should create user and return 201', async () => {
    const req = new NextRequest('http://localhost:3000/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email: 'new@example.com', name: 'New User', password: 'password123' })
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.userId).toBeDefined();

    const db = client.db('test_integration_register');
    const user = await db.collection('users').findOne({ email: 'new@example.com' });
    expect(user).toBeDefined();
    expect(user.name).toBe('New User');
    expect(await bcrypt.compare('password123', user.password)).toBe(true);
  });

  it('should return 409 if user already exists', async () => {
    const db = client.db('test_integration_register');
    await db.collection('users').insertOne({ email: 'existing@example.com' });

    const req = new NextRequest('http://localhost:3000/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email: 'existing@example.com', name: 'User', password: 'password123' })
    });
    const res = await POST(req);
    expect(res.status).toBe(409);
  });
});
