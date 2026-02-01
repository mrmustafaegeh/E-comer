import { z } from "zod";

export const productQuerySchema = z.object({
  page: z.string().transform(val => Math.max(1, parseInt(val) || 1)).optional(),
  limit: z.string().transform(val => Math.min(100, Math.max(1, parseInt(val) || 12))).optional(),
  search: z.string().optional(),
  category: z.string().optional(),
  minPrice: z.string().transform(val => val ? parseFloat(val) : undefined).optional(),
  maxPrice: z.string().transform(val => val ? parseFloat(val) : undefined).optional(),
  sort: z.enum(["newest", "price-low", "price-high", "rating"]).optional().default("newest"),
});

export const productSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  title: z.string().min(2, "Title must be at least 2 characters").optional(),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().positive("Price must be positive"),
  salePrice: z.number().nonnegative().nullable().optional(),
  category: z.string().min(2, "Category is required"),
  image: z.string().url("Valid image URL is required").optional(),
  images: z.array(z.string().url()).optional(),
  stock: z.number().int().nonnegative().default(0),
  isFeatured: z.boolean().default(false),
  featuredOrder: z.number().int().optional(),
  rating: z.number().min(0).max(5).default(0),
  numReviews: z.number().int().nonnegative().default(0),
  tags: z.array(z.string()).optional(),
  slug: z.string().optional(),
});
