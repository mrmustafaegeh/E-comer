# System Architecture

## Overview
QuickCart follows a modular architecture centered around a **Service Layer** and a **Centralized Transformer** system. This ensures that business logic is decoupled from both the UI (React components) and the delivery mechanism (API routes).

## Directory Structure

```text
src/
├── app/              # Next.js App Router (Pages & API Routes)
├── Component/        # Reusable UI components (Editorial Design)
├── services/         # Business logic (Service Layer)
├── validators/       # Input validation (Zod schemas)
├── lib/              # Shared utilities (DB, JWT, Transformers)
├── store/            # Redux global state
├── hooks/            # Custom React hooks (React Query integrations)
└── types/            # TypeScript definitions
```

## Data Flow

1. **Client Interaction**: User triggers an action (e.g., search).
2. **Hook Execution**: `useProducts` hook sends a request to the API or server component.
3. **API/Server Handler**: Parses params using `validators`.
4. **Service Execution**: Calls `productService` to query MongoDB.
5. **Transformation**: Raw DB documents are passed through `transformers` to create standard, frontend-ready objects.
6. **UI Rendering**: Component receives clean, formatted data.

## Service Layer
All database interactions are abstracted into services (`productService.js`, `authService.js`, `orderService.js`). API routes and Server Components call these services instead of the DB driver directly.

## Security Architecture
- **CSP**: Strict Content Security Policy in `next.config.js`.
- **JWT**: Stateless authentication using secure session tokens.
- **Rate Limiting**: IP-based rate limiting to prevent brute force and scraping.
- **Validation**: All inputs (Query tokens, POST bodies) are strictly validated via Zod.
