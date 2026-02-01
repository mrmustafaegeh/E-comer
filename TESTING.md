# Testing Guide

## Running Tests

### Unit Tests (Vitest)
```bash
npm run test
```
Tests individual functions, specifically in `transformers.js`, `formatters.js`, and `validators`.

### Integration Tests
Tests the interaction between Services and the Database. Requires a running MongoDB or `mongodb-memory-server`.

### E2E Tests (Playwright)
```bash
npm run test:e2e
```
Tests critical user flows like:
- Authentication (Login/Register)
- Search & Filtering
- Cart and Checkout flow

## Writing Tests
- Place unit tests in `__tests__` directories next to the code.
- Use mocks for `clientPromise` to avoid connecting to the real DB during unit tests.

## Coverage Reports
Generate coverage reports to ensure >80% coverage:
```bash
npm run test:coverage
```

## CI/CD Integration
Tests are automatically run on GitHub Actions for every Pull Request to `main`. Merging is blocked if tests fail.
