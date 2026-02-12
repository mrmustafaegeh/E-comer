# API Documentation

## Base URL
```
Development: http://localhost:3000/api
Production: https://yourstore.com/api
```

## Authentication
Most endpoints require authentication via JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Products API

### List Products
Get a paginated list of products with optional filtering.

**Endpoint:** `GET /products`

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | number | 1 | Page number |
| limit | number | 12 | Items per page (max: 100) |
| category | string | - | Filter by category slug |
| search | string | - | Search in name, title, description |
| sort | string | newest | Sort: `newest`, `price-low`, `price-high`, `rating` |
| minPrice | number | - | Minimum price filter |
| maxPrice | number | - | Maximum price filter |

**Example Request:**
```bash
curl "http://localhost:3000/api/products?category=electronics&page=1&limit=12&sort=price-low"
```

**Response:** `200 OK`
```json
{
  "products": [
    {
      "id": "507f1f77bcf86cd799439011",
      "name": "Apple AirPods Pro 2nd Gen",
      "slug": "apple-airpods-pro-2nd-gen",
      "description": "Apple AirPods Pro (2nd Gen) with MagSafe Case...",
      "price": 249.99,
      "salePrice": 199.99,
      "discount": "-20%",
      "rating": 4.8,
      "category": "electronics",
      "image": "/image/apple_earphone_image.png",
      "stock": 150,
      "numReviews": 542,
      "featured": true
    }
  ],
  "total": 47,
  "page": 1,
  "limit": 12,
  "totalPages": 4
}
```

---

### Get Product by ID
**Endpoint:** `GET /products/:id`

**Example:**
```bash
curl "http://localhost:3000/api/products/507f1f77bcf86cd799439011"
```

**Response:** `200 OK`
```json
{
  "id": "507f1f77bcf86cd799439011",
  "name": "Apple AirPods Pro 2nd Gen",
  "slug": "apple-airpods-pro-2nd-gen",
  "description": "Apple AirPods Pro (2nd Gen)...",
  "price": 249.99,
  "salePrice": 199.99,
  "rating": 4.8,
  "category": "electronics",
  "image": "/image/apple_earphone_image.png",
  "stock": 150,
  "numReviews": 542
}
```

---

### Get Product by Slug
**Endpoint:** `GET /products/slug/:slug`

**Example:**
```bash
curl "http://localhost:3000/api/products/slug/apple-airpods-pro-2nd-gen"
```

---

### Get Products by Category
Get all products in a specific category.

**Endpoint:** `GET /products/category/:slug`

**Example:**
```bash
curl "http://localhost:3000/api/products/category/electronics?page=1&limit=12"
```

**Response:** `200 OK`
```json
{
  "products": [...],
  "total": 15,
  "page": 1,
  "limit": 12,
  "totalPages": 2,
  "category": {
    "name": "Electronics",
    "slug": "electronics",
    "description": "Latest tech gadgets and devices",
    "icon": "💻",
    "gradient": "from-blue-500 to-purple-600"
  }
}
```

---

### Search Products
Search products across all fields.

**Endpoint:** `GET /products/search`

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| q or query | string | Yes | Search query (min 2 chars) |
| category | string | No | Filter by category |
| page | number | No | Page number |
| limit | number | No | Items per page |
| sort | string | No | Sort order |
| minPrice | number | No | Min price |
| maxPrice | number | No | Max price |

**Example:**
```bash
curl "http://localhost:3000/api/products/search?q=laptop&category=electronics"
```

---

### Create Product (Admin Only)
**Endpoint:** `POST /products`

**Headers:**
```
Authorization: Bearer <admin-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Product Name",
  "title": "Full Product Title",
  "description": "Product description",
  "price": 99.99,
  "salePrice": 79.99,
  "category": "electronics",
  "image": "/path/to/image.jpg",
  "stock": 100,
  "rating": 4.5,
  "featured": false
}
```

**Response:** `201 Created`

---

### Update Product (Admin Only)
**Endpoint:** `PUT /products/:id`

**Headers:**
```
Authorization: Bearer <admin-token>
Content-Type: application/json
```

**Request Body:** (All fields optional)
```json
{
  "price": 89.99,
  "stock": 150
}
```

**Response:** `200 OK`

---

### Delete Product (Admin Only)
**Endpoint:** `DELETE /products/:id`

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Response:** `200 OK`
```json
{
  "success": true
}
```

---

## Categories API

### List All Categories
**Endpoint:** `GET /category`

**Example:**
```bash
curl "http://localhost:3000/api/category"
```

**Response:** `200 OK`
```json
[
  {
    "id": "507f1f77bcf86cd799439011",
    "name": "Electronics",
    "slug": "electronics",
    "icon": "💻",
    "gradient": "from-blue-500 to-purple-600",
    "description": "Latest tech gadgets and devices",
    "productCount": 15,
    "isActive": true,
    "displayOrder": 1
  }
]
```

---

### Get Category by Slug
**Endpoint:** `GET /category/:slug`

**Example:**
```bash
curl "http://localhost:3000/api/category/electronics"
```

---

### Create Category (Admin Only)
**Endpoint:** `POST /category`

**Headers:**
```
Authorization: Bearer <admin-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Category Name",
  "slug": "category-slug",
  "icon": "📱",
  "gradient": "from-blue-500 to-purple-600",
  "description": "Category description",
  "isActive": true,
  "displayOrder": 1
}
```

---

## Checkout API

### Create Checkout Session
Create a Stripe checkout session for payment processing.

**Endpoint:** `POST /checkout`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "items": [
    {
      "productId": "507f1f77bcf86cd799439011",
      "quantity": 2
    }
  ],
  "successUrl": "http://localhost:3000/orders/success",
  "cancelUrl": "http://localhost:3000/cart"
}
```

**Response:** `200 OK`
```json
{
  "sessionId": "cs_test_...",
  "url": "https://checkout.stripe.com/pay/cs_test_..."
}
```

---

## Orders API

### Get User Orders
**Endpoint:** `GET /orders`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
[
  {
    "id": "507f1f77bcf86cd799439011",
    "userId": "507f191e810c19729de860ea",
    "items": [...],
    "total": 299.98,
    "status": "processing",
    "createdAt": "2024-01-15T10:30:00Z"
  }
]
```

---

## Authentication API

### Sign Up
**Endpoint:** `POST /auth/signup`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:** `201 Created`

---

### Sign In
**Endpoint:** `POST /auth/signin`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:** `200 OK`
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f191e810c19729de860ea",
    "name": "John Doe",
    "email": "john@example.com",
    "isAdmin": false
  }
}
```

---

## Rate Limiting

API endpoints are rate-limited to prevent abuse:

- **Public Endpoints**: 100 requests per minute per IP
- **Search Endpoint**: 50 requests per minute per IP
- **Admin Endpoints**: 200 requests per minute per authenticated user

**Rate Limit Headers:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642258200
```

**Rate Limit Exceeded Response:** `429 Too Many Requests`
```json
{
  "error": "Too many requests, please try again later"
}
```

---

## Error Responses

### Common Error Codes

| Code | Status | Description |
|------|--------|-------------|
| 400 | Bad Request | Invalid request parameters |
| 401 | Unauthorized | Missing or invalid authentication |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource already exists |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |

### Error Response Format
```json
{
  "error": "Error message",
  "details": "Additional error details (development only)"
}
```

---

## Caching

API responses include appropriate Cache-Control headers:

- **Product List**: `public, s-maxage=60, stale-while-revalidate=120`
- **Product Detail**: `public, s-maxage=300, stale-while-revalidate=600`
- **Categories**: `public, s-maxage=3600, stale-while-revalidate=7200`
- **Search**: `public, s-maxage=30, stale-while-revalidate=60`

---

## Webhooks

### Stripe Webhook
Handle Stripe payment events.

**Endpoint:** `POST /webhooks/stripe`

**Events Handled:**
- `checkout.session.completed`
- `payment_intent.succeeded`
- `payment_intent.failed`

---

## Testing the API

### Using cURL
```bash
# Get all products
curl "http://localhost:3000/api/products"

# Search products
curl "http://localhost:3000/api/products/search?q=laptop"

# Get categories
curl "http://localhost:3000/api/category"

# Get products in a category
curl "http://localhost:3000/api/products/category/electronics?page=1"
```

### Using Postman
Import the following base URL and test each endpoint:
```
http://localhost:3000/api
```

---

## Data Validation

All API endpoints use Zod schema validation. Invalid requests will return `400 Bad Request` with validation errors.

**Example Validation Error:**
```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "price",
      "message": "Price must be a positive number"
    }
  ]
}
```

---

## Need Help?

- Check the main [README.md](./README.md) for setup instructions
- Review the code examples in the `/src/app/api` directory
- Open an issue on GitHub for bugs or feature requests
