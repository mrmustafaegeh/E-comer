
import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as Security from '@/lib/security';

// Mock Upstash
vi.mock('@upstash/redis', () => ({
  Redis: class {
    constructor() {}
  }
}));

vi.mock('@upstash/ratelimit', () => ({
  Ratelimit: {
    slidingWindow: vi.fn(),
  },
}));

describe('Security Library', () => {

  describe('validateRequest (CSRF)', () => {
    it('should allow requests in development mode', async () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';
      const req = { headers: { get: () => null } };
      const result = await Security.validateRequest(req);
      expect(result).toBe(true);
      process.env.NODE_ENV = originalEnv;
    });

    it('should block requests without Origin header in production', async () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';
      process.env.NEXT_PUBLIC_APP_URL = 'https://myapp.com';
      
      const req = { headers: { get: (k) => k === 'origin' ? null : '' } };
      const result = await Security.validateRequest(req);
      expect(result).toBe(false);
      
      process.env.NODE_ENV = originalEnv;
    });

    it('should allow requests from allowed origin', async () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';
      process.env.NEXT_PUBLIC_APP_URL = 'https://myapp.com';

      const req = { headers: { get: (k) => k === 'origin' ? 'https://myapp.com' : '' } };
      const result = await Security.validateRequest(req);
      expect(result).toBe(true);

      process.env.NODE_ENV = originalEnv;
    });

    it('should block requests from unknown origin', async () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';
      process.env.NEXT_PUBLIC_APP_URL = 'https://myapp.com';

      const req = { headers: { get: (k) => k === 'origin' ? 'https://evil.com' : '' } };
      const result = await Security.validateRequest(req);
      expect(result).toBe(false);

      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('rateLimit (Memory Fallback)', () => {
    // We assume Redis env vars are NOT set in test env, so it falls back to memory
    beforeEach(() => {
      delete process.env.UPSTASH_REDIS_REST_URL;
      delete process.env.UPSTASH_REDIS_REST_TOKEN;
    });

    it('should limit requests based on count', async () => {
      const id = 'test-ip-1';
      // Limit 2 per 1 minute
      await Security.rateLimit(id, 2, '1 m'); // 1
      const res2 = await Security.rateLimit(id, 2, '1 m'); // 2
      expect(res2.success).toBe(true);
      expect(res2.remaining).toBe(0);

      const res3 = await Security.rateLimit(id, 2, '1 m'); // 3 (Blocked)
      expect(res3.success).toBe(false);
    });

    it('should reset after window expires', async () => {
      const id = 'test-ip-2';
      // Mock Date.now
      const realNow = Date.now;
      let now = 100000;
      global.Date.now = () => now;

      // 1 hit
      await Security.rateLimit(id, 1, '1 m');
      
      // Advance time by 61 seconds
      now += 61000;

      // Should be fresh
      const res = await Security.rateLimit(id, 1, '1 m');
      expect(res.success).toBe(true);
      expect(res.remaining).toBe(0); // 1 limit - 1 used = 0

      global.Date.now = realNow;
    });
  });
});
