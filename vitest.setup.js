import '@testing-library/jest-dom'
import { vi, afterEach } from 'vitest'
import '@testing-library/jest-dom'
import { vi, afterEach } from 'vitest'

// Mock Environment Variables
process.env.MONGODB_URI = "mongodb://localhost:27017/test"
process.env.MONGODB_DB = "test_db"
process.env.JWT_SECRET = "test_secret_key_at_least_32_characters_long"
process.env.NEXT_PUBLIC_APP_URL = "http://localhost:3000"

// Mock Next.js headers/cookies
vi.mock("next/headers", () => ({
  headers: () => ({
    get: vi.fn((key) => {
      if (key === 'x-forwarded-for') return '127.0.0.1'
      if (key === 'origin') return 'http://localhost:3000'
      return null
    })
  }),
  cookies: () => ({
    set: vi.fn(),
    get: vi.fn(),
    delete: vi.fn()
  })
}))

// Mock server-only to allow testing server files
vi.mock("server-only", () => {
  return {}
})

// Cleanup after each test
afterEach(() => {
  vi.clearAllMocks()
})
