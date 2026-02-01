# Testing Strategy

This project uses **Vitest** for unit/integration testing and **Playwright** for E2E testing.

## Unit Tests
Located in `__tests__/unit`.
Focus on business logic, utilities, and services.

### Running Unit Tests
```bash
npm test
# or
npx vitest
```

### Key Test Files
- `lib/transformers.test.js`: Verifies data transformation logic.
- `lib/formatters.test.js`: Verifies currency/date formatting.
- `services/productService.test.js`: Verifies product business logic and DB query construction.

## E2E Tests
Located in `__tests__/e2e`.
Focus on critical user flows (Products, Checkout).

### Running E2E Tests
```bash
npm run test:e2e
# or
npx playwright test
```

### Key Test Files
- `products.spec.js`: Verifies products page loading and filtering.
- `auth.spec.js`: Verifies login/register flows.

## Continuous Integration
Tests are run automatically on PRs via GitHub Actions (`.github/workflows/test.yml`).
