# 🛍️ E-Commerce Platform - Production Ready

> A modern, high-performance e-commerce platform built with Next.js 14, React 19, and MongoDB

[![Tests](https://github.com/your-org/your-repo/workflows/tests/badge.svg)](https://github.com/your-org/your-repo/actions)
[![Coverage](https://codecov.io/gh/your-org/your-repo/branch/main/graph/badge.svg)](https://codecov.io/gh/your-org/your-repo)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

---

## 📋 Table of Contents

- [Quick Start](#-quick-start)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Environment Setup](#-environment-setup)
- [Development](#-development)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Contributing](#-contributing)
- [Troubleshooting](#-troubleshooting)
- [License](#-license)

---

## 🚀 Quick Start

Get up and running in 5 minutes:

```bash
# 1. Clone the repository
git clone https://github.com/your-org/your-repo.git
cd your-repo

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your values

# 4. Set up database indexes
npm run setup:indexes

# 5. Run development server
npm run dev

# 6. Open your browser
# Visit http://localhost:3000
```

That's it! You're ready to start developing. 🎉

---

## ✨ Features

### For Users
- 🛒 **Seamless Shopping Experience** - Fast, responsive product browsing
- 🔍 **Advanced Search & Filters** - Find exactly what you need
- 💳 **Secure Checkout** - Multiple payment options with Stripe
- 📱 **Mobile First** - Perfect experience on any device
- ⚡ **Lightning Fast** - Optimized for performance (Lighthouse 90+)
- 🔐 **Secure** - Enterprise-grade security with rate limiting

### For Developers
- ✅ **80%+ Test Coverage** - Comprehensive test suite
- 🏗️ **Clean Architecture** - Service layer pattern
- 📚 **Well Documented** - Every feature explained
- 🔄 **CI/CD Ready** - Automated testing and deployment
- 🎨 **Modern Stack** - Latest Next.js and React
- 🚀 **Production Ready** - Battle-tested and optimized

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **UI Library**: React 19
- **Styling**: TailwindCSS 3
- **State Management**: React Query (TanStack Query)
- **Forms**: React Hook Form + Zod validation
- **Animations**: Framer Motion

### Backend
- **Runtime**: Node.js 20+
- **Framework**: Next.js API Routes
- **Database**: MongoDB 7
- **Cache**: Redis (Upstash)
- **Authentication**: Custom (JWT + HttpOnly cookies)
- **File Upload**: Cloudinary

### DevOps
- **Testing**: Vitest + Testing Library + Playwright
- **CI/CD**: GitHub Actions
- **Deployment**: Vercel
- **Monitoring**: Sentry + Vercel Analytics
- **Security**: Rate limiting, CSP, Security headers

---

## 📦 Prerequisites

Before you begin, make sure you have:

- **Node.js** >= 20.0.0 ([Download](https://nodejs.org/))
- **npm** >= 10.0.0 (comes with Node.js)
- **MongoDB** >= 7.0 ([Atlas](https://www.mongodb.com/cloud/atlas) or local)
- **Git** ([Download](https://git-scm.com/))
- **Redis** (Upstash account for production)

**Optional but recommended:**
- **MongoDB Compass** - Visual database tool
- **Postman** - API testing
- **VS Code** - Code editor with recommended extensions

---

## 💻 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/your-repo.git
cd your-repo
```

### 2. Install Dependencies

```bash
npm install
```

This installs:
- Next.js and React
- TailwindCSS
- MongoDB driver
- Testing libraries
- All dev dependencies

### 3. Verify Installation

```bash
npm run check
```

This runs:
- Dependency audit
- TypeScript check
- Linting

---

## 🔐 Environment Setup

### 1. Create Environment File

```bash
cp .env.example .env.local
```

### 2. Fill in Required Variables

Open `.env.local` and add your values:

```bash
# === DATABASE ===
# MongoDB connection string
# Get from: https://cloud.mongodb.com/
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
MONGODB_DB=your_database_name

# === AUTHENTICATION ===
# Generate with: openssl rand -base64 32
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
NEXTAUTH_SECRET=your-super-secret-nextauth-key

# === RATE LIMITING (Production) ===
# Get from: https://upstash.com/
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-redis-token

# === PAYMENT (Optional) ===
# Get from: https://stripe.com/
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# === FILE UPLOAD (Optional) ===
# Get from: https://cloudinary.com/
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# === MONITORING (Optional) ===
# Get from: https://sentry.io/
NEXT_PUBLIC_SENTRY_DSN=https://...@sentry.io/...

# === APP CONFIG ===
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### 3. Environment Variables Explained

#### Required Variables

| Variable | Description | Where to Get |
|----------|-------------|--------------|
| `MONGODB_URI` | Database connection string | MongoDB Atlas → Connect → Drivers |
| `MONGODB_DB` | Database name | Choose any name (e.g., "ecommerce") |
| `JWT_SECRET` | Secret for JWT tokens | Generate: `openssl rand -base64 32` |
| `NEXTAUTH_SECRET` | Secret for NextAuth | Generate: `openssl rand -base64 32` |

#### Production-Only Variables

| Variable | Description | Required When |
|----------|-------------|---------------|
| `UPSTASH_REDIS_REST_URL` | Redis URL for rate limiting | Deploying to production |
| `UPSTASH_REDIS_REST_TOKEN` | Redis auth token | Deploying to production |

#### Optional Variables

| Variable | Description | Used For |
|----------|-------------|----------|
| `STRIPE_SECRET_KEY` | Payment processing | Checkout feature |
| `CLOUDINARY_CLOUD_NAME` | Image hosting | Product images |
| `NEXT_PUBLIC_SENTRY_DSN` | Error tracking | Monitoring |

### 4. Validate Environment

```bash
npm run validate:env
```

This checks all required variables are set.

---

## 🏃 Development

### Start Development Server

```bash
npm run dev
```

The app runs at:
- **Frontend**: http://localhost:3000
- **API**: http://localhost:3000/api

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Check code quality |
| `npm run format` | Format code with Prettier |
| `npm test` | Run all tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Generate coverage report |
| `npm run test:e2e` | Run E2E tests |
| `npm run setup:indexes` | Create database indexes |
| `npm run check` | Run all checks (lint, type, test) |

### Development Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write code
   - Add tests
   - Update documentation

3. **Run checks**
   ```bash
   npm run check
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add your feature"
   ```
   
   We use [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat:` - New feature
   - `fix:` - Bug fix
   - `docs:` - Documentation
   - `test:` - Tests
   - `refactor:` - Code refactoring
   - `chore:` - Maintenance

5. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

---

## 🧪 Testing

We have comprehensive test coverage (80%+) with three types of tests:

### Unit Tests

Test individual functions and components:

```bash
# Run all unit tests
npm run test:unit

# Run specific test file
npm run test:unit auth

# Watch mode
npm run test:unit -- --watch
```

**Example:**
```javascript
// __tests__/unit/lib/formatters.test.js
describe('formatMoney', () => {
  it('formats cents to dollars', () => {
    expect(formatMoney(1999)).toBe('$19.99');
  });
});
```

### Integration Tests

Test API routes and database interactions:

```bash
# Run integration tests
npm run test:integration

# Run specific API tests
npm run test:integration api/products
```

**Example:**
```javascript
// __tests__/integration/api/products.test.js
describe('GET /api/products', () => {
  it('returns paginated products', async () => {
    const response = await fetch('/api/products?page=1');
    expect(response.status).toBe(200);
  });
});
```

### E2E Tests

Test complete user flows with Playwright:

```bash
# Run E2E tests
npm run test:e2e

# Run specific flow
npm run test:e2e -- purchase-flow

# Run in UI mode
npm run test:e2e:ui
```

**Example:**
```javascript
// __tests__/e2e/purchase-flow.spec.js
test('user can complete purchase', async ({ page }) => {
  await page.goto('/');
  await page.click('text=View Product');
  await page.click('text=Add to Cart');
  // ... complete flow
});
```

### Coverage Reports

```bash
# Generate coverage report
npm run test:coverage

# Open HTML report
open coverage/index.html
```

**Coverage Requirements:**
- Overall: 80%+
- Critical paths (auth, checkout): 90%+
- New features: 100%

### Writing Tests

**Guidelines:**
1. Test behavior, not implementation
2. Use descriptive test names
3. Follow AAA pattern (Arrange, Act, Assert)
4. Mock external dependencies
5. Clean up after tests

**Example test structure:**
```javascript
describe('Feature Name', () => {
  // Setup
  beforeEach(() => {
    // Arrange
  });

  // Cleanup
  afterEach(() => {
    // Cleanup
  });

  it('should do something specific', () => {
    // Arrange - Set up test data
    const input = 'test';
    
    // Act - Execute the code
    const result = myFunction(input);
    
    // Assert - Verify the outcome
    expect(result).toBe('expected');
  });
});
```

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

Vercel is optimized for Next.js and provides zero-config deployments:

#### 1. Install Vercel CLI

```bash
npm install -g vercel
```

#### 2. Login

```bash
vercel login
```

#### 3. Deploy

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

#### 4. Set Environment Variables

In Vercel dashboard:
1. Go to your project → Settings → Environment Variables
2. Add all variables from `.env.local`
3. Make sure to mark production-only variables appropriately

#### 5. Configure Build

Vercel automatically detects Next.js. Our build command:

```json
{
  "buildCommand": "npm run setup:indexes && next build",
  "outputDirectory": ".next"
}
```

### Deploy to Other Platforms

<details>
<summary>Deploy to AWS</summary>

Coming soon...
</details>

<details>
<summary>Deploy to Google Cloud</summary>

Coming soon...
</details>

<details>
<summary>Deploy with Docker</summary>

```dockerfile
# Dockerfile
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Build the app
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
```

Build and run:
```bash
docker build -t ecommerce .
docker run -p 3000:3000 ecommerce
```
</details>

### Pre-Deployment Checklist

Before deploying to production, verify:

- [ ] All tests passing (`npm run test`)
- [ ] Coverage above 80% (`npm run test:coverage`)
- [ ] No linting errors (`npm run lint`)
- [ ] Environment variables set in hosting platform
- [ ] Database indexes created (`npm run setup:indexes`)
- [ ] Redis configured (Upstash for rate limiting)
- [ ] Security headers enabled (in `next.config.js`)
- [ ] Error monitoring set up (Sentry)
- [ ] Performance tested (Lighthouse score >90)
- [ ] SEO verified (meta tags, sitemap, robots.txt)

### Post-Deployment Verification

After deployment, check:

1. **Health Check**: Visit `/api/health`
2. **SEO**: Run Lighthouse audit
3. **Security**: Check [SecurityHeaders.com](https://securityheaders.com)
4. **Performance**: Monitor response times
5. **Errors**: Check Sentry dashboard

---

## 📁 Project Structure

```
.
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Auth route group
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── products/          # Product pages
│   │   │   ├── [id]/          # Dynamic product page
│   │   │   └── page.jsx       # Products list (SSR)
│   │   ├── api/               # API Routes
│   │   │   ├── auth/
│   │   │   ├── products/
│   │   │   └── orders/
│   │   ├── layout.jsx         # Root layout
│   │   └── page.jsx           # Home page
│   │
│   ├── components/            # React components
│   │   ├── ui/               # Reusable UI components
│   │   ├── forms/            # Form components
│   │   └── layout/           # Layout components
│   │
│   ├── services/             # Business logic layer
│   │   ├── productService.js # Product operations
│   │   ├── authService.js    # Auth operations
│   │   └── orderService.js   # Order operations
│   │
│   ├── lib/                  # Shared utilities
│   │   ├── mongodb.js        # Database connection
│   │   ├── auth-core.js      # Auth utilities
│   │   ├── security.js       # Security utils
│   │   ├── transformers.js   # Data transformers
│   │   └── formatters.js     # Formatting utilities
│   │
│   ├── validators/           # Input validation (Zod)
│   │   ├── productValidator.js
│   │   └── authValidator.js
│   │
│   ├── hooks/                # Custom React hooks
│   │   ├── useAuth.js
│   │   └── useCart.js
│   │
│   └── types/                # TypeScript types
│       └── product.ts
│
├── __tests__/                # Test files
│   ├── unit/                 # Unit tests
│   ├── integration/          # Integration tests
│   └── e2e/                  # E2E tests
│
├── public/                   # Static files
│   ├── images/
│   └── favicon.ico
│
├── scripts/                  # Utility scripts
│   └── setup-admin-indexes.mjs
│
├── .github/                  # GitHub Actions
│   └── workflows/
│       └── test.yml
│
├── docs/                     # Documentation
│   ├── ARCHITECTURE.md
│   ├── API.md
│   └── DEPLOYMENT.md
│
├── .env.example              # Environment template
├── .gitignore
├── next.config.js            # Next.js configuration
├── tailwind.config.js        # Tailwind configuration
├── vitest.config.js          # Test configuration
├── playwright.config.js      # E2E test configuration
├── package.json
└── README.md                 # This file
```

### Key Directories Explained

**`src/app/`** - Next.js App Router
- Route-based file structure
- Server and Client Components
- API Routes in `/api`

**`src/services/`** - Business Logic
- Separated from API routes
- Reusable across app
- Easy to test

**`src/lib/`** - Utilities
- Database connections
- Security functions
- Helper utilities

**`src/validators/`** - Input Validation
- Zod schemas
- Type-safe validation
- Reusable validators

**`__tests__/`** - Tests
- Organized by type
- Mirrors src structure
- Fixtures and mocks

---

## 📚 API Documentation

### Authentication

#### POST /api/auth/register
Register a new user

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "user": {
    "id": "123",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "token": "jwt-token-here"
}
```

#### POST /api/auth/login
Login existing user

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "user": {
    "id": "123",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "token": "jwt-token-here"
}
```

### Products

#### GET /api/products
Get paginated products list

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20)
- `category` (string): Filter by category
- `minPrice` (number): Minimum price
- `maxPrice` (number): Maximum price
- `sort` (string): Sort field (price, name, createdAt)
- `order` (string): Sort order (asc, desc)

**Example:**
```
GET /api/products?page=1&limit=20&category=electronics&sort=price&order=asc
```

**Response:**
```json
{
  "products": [
    {
      "id": "1",
      "name": "Product Name",
      "price": "$19.99",
      "category": "electronics",
      "images": ["url1", "url2"],
      "stock": 10
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

#### GET /api/products/[id]
Get single product by ID

**Response:**
```json
{
  "id": "1",
  "name": "Product Name",
  "description": "Detailed description",
  "price": "$19.99",
  "category": "electronics",
  "images": ["url1", "url2"],
  "stock": 10,
  "reviews": []
}
```

### Orders

See [API.md](./docs/API.md) for complete API documentation.

---

## 🤝 Contributing

We welcome contributions! Here's how to get started:

### 1. Fork and Clone

```bash
git clone https://github.com/your-username/your-fork.git
cd your-fork
```

### 2. Create a Branch

```bash
git checkout -b feature/amazing-feature
```

### 3. Make Changes

- Write code
- Add tests (maintain 80%+ coverage)
- Update documentation
- Follow code style (ESLint)

### 4. Test Your Changes

```bash
npm run check  # Runs all checks
```

### 5. Commit

```bash
git commit -m "feat: add amazing feature"
```

Use [Conventional Commits](https://www.conventionalcommits.org/)

### 6. Push and PR

```bash
git push origin feature/amazing-feature
```

Then create a Pull Request on GitHub.

### Code Review Process

1. **Automated Checks** - CI/CD runs tests
2. **Code Review** - Team reviews your code
3. **Approval** - Need 1 approval to merge
4. **Merge** - Squash and merge to main

### Development Guidelines

**Code Style:**
- Use ESLint and Prettier
- Follow existing patterns
- Write meaningful comments
- Use descriptive variable names

**Testing:**
- Write tests for new features
- Maintain 80%+ coverage
- Include edge cases
- Mock external dependencies

**Documentation:**
- Update README if needed
- Add JSDoc comments
- Document complex logic
- Update API docs

---

## 🐛 Troubleshooting

### Common Issues

#### Environment Variables Not Loading

**Problem:** App can't connect to database

**Solution:**
1. Make sure `.env.local` exists
2. Verify all required variables are set
3. Restart development server
4. Run `npm run validate:env`

```bash
# Check if environment is loaded
npm run validate:env
```

---

#### Database Connection Failed

**Problem:** `MongoServerError: bad auth`

**Solution:**
1. Check `MONGODB_URI` is correct
2. Verify IP whitelist in MongoDB Atlas
3. Check username/password
4. Ensure database name matches

```bash
# Test connection
npm run test:db-connection
```

---

#### Tests Failing

**Problem:** Tests fail locally but work in CI

**Solution:**
1. Clear test cache: `npm run test:clear-cache`
2. Update snapshots: `npm run test -- -u`
3. Check Node version matches CI
4. Verify dependencies: `npm ci`

---

#### Build Fails

**Problem:** `Error: Cannot find module...`

**Solution:**
1. Clear Next.js cache: `rm -rf .next`
2. Reinstall dependencies: `rm -rf node_modules && npm install`
3. Check TypeScript errors: `npm run type-check`

---

#### Rate Limiting in Development

**Problem:** Getting rate limited while developing

**Solution:**
1. Rate limiting is relaxed in development
2. If using production Redis, set `NODE_ENV=development`
3. Or temporarily disable: Comment out rate limit middleware

---

#### Slow Development Server

**Problem:** Dev server is slow to start

**Solution:**
1. Clear cache: `rm -rf .next`
2. Check for large files in public/
3. Disable unused features
4. Use `npm run dev -- --turbo` for faster rebuilds

---

### Getting Help

**Found a bug?**
- Check [existing issues](https://github.com/your-org/your-repo/issues)
- Create a new issue with reproduction steps

**Need help?**
- Read [full documentation](./docs/)
- Ask in [Discussions](https://github.com/your-org/your-repo/discussions)
- Check [Stack Overflow](https://stackoverflow.com/questions/tagged/nextjs)

**Security issue?**
- Email: security@yourcompany.com
- Do NOT create public issue

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

Built with:
- [Next.js](https://nextjs.org/) - The React Framework
- [React](https://react.dev/) - UI Library
- [TailwindCSS](https://tailwindcss.com/) - Styling
- [MongoDB](https://www.mongodb.com/) - Database
- [Vercel](https://vercel.com/) - Hosting

---

## 📧 Contact

- **Website**: https://yourcompany.com
- **Email**: support@yourcompany.com
- **Twitter**: [@yourcompany](https://twitter.com/yourcompany)
- **Discord**: [Join our community](https://discord.gg/your-invite)

---

**Made with ❤️ by Your Team**

⭐ Star this repo if you find it helpful!