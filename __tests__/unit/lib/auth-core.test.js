
import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as AuthCore from '@/lib/auth-core';
import bcrypt from 'bcryptjs';

// Mock MongoDB
const mockCollection = {
  findOne: vi.fn(),
  insertOne: vi.fn(),
};
const mockDb = {
  collection: vi.fn(() => mockCollection),
};
const mockClient = {
  db: vi.fn(() => mockDb),
};

vi.mock('@/lib/mongodb', () => ({
  default: Promise.resolve(mockClient),
}));

vi.mock('@/lib/env-validator', () => ({
  validateEnv: () => ({
    MONGODB_DB: 'test_db',
  })
}));

describe('Auth Core Library', () => {
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('comparePassword', () => {
    it('should return true for matching passwords', async () => {
      const password = 'password123';
      const hash = await bcrypt.hash(password, 10);
      const result = await AuthCore.comparePassword(password, hash);
      expect(result).toBe(true);
    });

    it('should return false for non-matching passwords', async () => {
      const password = 'password123';
      const hash = await bcrypt.hash('different', 10);
      const result = await AuthCore.comparePassword(password, hash);
      expect(result).toBe(false);
    });
  });

  describe('findUserByEmail', () => {
    it('should return null if email is missing', async () => {
      const result = await AuthCore.findUserByEmail('');
      expect(result).toBeNull();
      expect(mockCollection.findOne).not.toHaveBeenCalled();
    });

    it('should normalize email strings', async () => {
      await AuthCore.findUserByEmail('  TeSt@ExAmPlE.CoM  ');
      expect(mockCollection.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
    });

    it('should return user object if found', async () => {
      const mockUser = { _id: '123', email: 'test@example.com' };
      mockCollection.findOne.mockResolvedValue(mockUser);
      const result = await AuthCore.findUserByEmail('test@example.com');
      expect(result).toEqual(mockUser);
    });
  });

  describe('createUser', () => {
    it('should create a new user with hashed password', async () => {
      const name = 'Test User';
      const email = 'test@example.com';
      const password = 'password123';
      const insertId = 'new_id_123';

      mockCollection.insertOne.mockResolvedValue({ insertedId: insertId });

      const result = await AuthCore.createUser(name, email, password);

      expect(mockCollection.insertOne).toHaveBeenCalledTimes(1);
      const callArgs = mockCollection.insertOne.mock.calls[0][0];

      expect(callArgs.name).toBe(name);
      expect(callArgs.email).toBe(email);
      expect(callArgs.roles).toEqual(['user']);
      expect(await bcrypt.compare(password, callArgs.password)).toBe(true);
      
      expect(result.id).toBe(insertId);
    });
  });
});
