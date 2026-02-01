# API Documentation

## Authentication Endpoints

### `POST /api/auth/login`
- Body: `{ email, password }`
- Returns: User object and set-cookie header.

### `POST /api/auth/register`
- Body: `{ name, email, password }`
- Returns: New user object.

### `GET /api/user/profile`
- Headers: `Authorization` (JWT)
- Returns: Current user profile.

## Products Endpoints

### `GET /api/products`
- Query Params: `page`, `limit`, `search`, `category`, `minPrice`, `maxPrice`, `sort`.
- Returns: Paginated product list.

### `POST /api/products` (Admin Only)
- Body: Product object.
- Returns: Created product.

### `GET /api/products/:id`
- Returns: Detailed product information.

## Orders Endpoints

### `POST /api/orders`
- Body: Order details.
- Returns: Confirmation.

### `GET /api/orders`
- Returns: List of orders for the authenticated user.

## Error Handling
The API uses standard HTTP status codes:
- `200/201`: Success
- `400`: Validation failed (Zod error details included)
- `401/403`: Authentication/Authorization failed
- `404`: Resource not found
- `500`: Internal Server Error
