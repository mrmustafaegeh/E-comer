# Deployment Guide

## Prerequisites
- MongoDB Atlas cluster.
- Vercel Account.
- Stripe Account (Production API keys).
- Cloudinary Account (for asset management).

## Environment Variables
Ensure the following are set in your production environment (e.g., Vercel Dashboard):

- `MONGODB_URI`
- `MONGODB_DB`
- `JWT_SECRET`
- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
- `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`

## Database Setup
1. Create a `products` collection.
2. Enable **Text Indexing** for the `name`, `title`, and `description` fields to support advanced search.
   ```js
   db.products.createIndex({ name: "text", title: "text", description: "text" })
   ```
3. Create indexes on `price`, `salePrice`, and `category` for performance.

## First Deployment
1. Connect your GitHub repository to Vercel.
2. Add your environment variables.
3. Deploy.
4. Run the seed script manually or via API if necessary to populate initial categories.

## Monitoring
- Use Vercel Web Analytics for performance monitoring.
- Use MongoDB Atlas charts for database load monitoring.
- Monitor `X-Environment` headers in API responses to verify production vs development logic.
