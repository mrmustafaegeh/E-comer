import clientPromise from "@/lib/mongodb";
import { transformProducts, transformProduct } from "@/lib/transformers";
import { ObjectId } from "mongodb";

/**
 * Get products with filtering and pagination
 */
export async function getProducts(params = {}) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const collection = db.collection("products");

    const page = Math.max(1, parseInt(params.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(params.limit) || 12));
    const skip = (page - 1) * limit;

    const filters = {};

    if (params.category && params.category !== "all") {
      filters.category = params.category.toLowerCase();
    }

    if (params.search) {
      filters.$or = [
        { name: { $regex: params.search, $options: "i" } },
        { title: { $regex: params.search, $options: "i" } },
        { description: { $regex: params.search, $options: "i" } },
        { category: { $regex: params.search, $options: "i" } }
      ];
    }

    // Price Filtering
    // Ensure we handle empty strings correctly (which typically come from URL params)
    const hasMinPrice = params.minPrice !== undefined && params.minPrice !== "" && params.minPrice !== null;
    const hasMaxPrice = params.maxPrice !== undefined && params.maxPrice !== "" && params.maxPrice !== null;

    if (hasMinPrice || hasMaxPrice) {
      filters.$and = [];
      const priceFilter = {};
      
      if (hasMinPrice) {
        const minVal = parseFloat(params.minPrice);
        if (!isNaN(minVal)) priceFilter.$gte = minVal;
      }
      
      if (hasMaxPrice) {
        const maxVal = parseFloat(params.maxPrice);
        if (!isNaN(maxVal)) priceFilter.$lte = maxVal;
      }
      
      // Only apply if we have valid price constraints
      if (Object.keys(priceFilter).length > 0) {
        // Filter by either price OR salePrice
        filters.$and.push({
          $or: [
            { price: priceFilter },
            { salePrice: priceFilter }
          ]
        });
      }
    }

    const sort = {};
    switch (params.sort) {
      case "price-low": sort.price = 1; break;
      case "price-high": sort.price = -1; break;
      case "rating": sort.rating = -1; break;
      case "newest":
      default: sort.createdAt = -1; break;
    }

    const [docs, total] = await Promise.all([
      collection.find(filters).sort(sort).skip(skip).limit(limit).toArray(),
      collection.countDocuments(filters)
    ]);

    return {
      products: transformProducts(docs),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  } catch (error) {
    console.error("ProductService.getProducts Error:", error);
    throw error;
  }
}

/**
 * Get product by ID or Slug
 */
export async function getProductById(idOrSlug) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const collection = db.collection("products");

    let query = { slug: idOrSlug };
    if (ObjectId.isValid(idOrSlug)) {
      query = { $or: [{ _id: new ObjectId(idOrSlug) }, { slug: idOrSlug }] };
    }

    const p = await collection.findOne(query);
    return transformProduct(p);
  } catch (error) {
    console.error("ProductService.getProductById Error:", error);
    return null;
  }
}

/**
 * Create a new product
 */
export async function createProduct(data) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const collection = db.collection("products");

    const slug = data.slug || (data.name || data.title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const doc = {
      ...data,
      slug,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await collection.insertOne(doc);
    return { ...doc, id: result.insertedId.toString() };
  } catch (error) {
    console.error("ProductService.createProduct Error:", error);
    throw error;
  }
}

/**
 * Update a product
 */
export async function updateProduct(id, data) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const collection = db.collection("products");

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...data, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );

    return transformProduct(result.value);
  } catch (error) {
    console.error("ProductService.updateProduct Error:", error);
    throw error;
  }
}

/**
 * Delete a product
 */
export async function deleteProduct(id) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const result = await db.collection("products").deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  } catch (error) {
    console.error("ProductService.deleteProduct Error:", error);
    throw error;
  }
}

/**
 * Hero & Featured Data
 */
export async function getHeroProductsData() {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const docs = await db.collection("products")
      .find({ $or: [{ isFeatured: true }, { featured: true }] })
      .sort({ featuredOrder: 1, createdAt: -1 })
      .limit(5)
      .toArray();

    return transformProducts(docs).map(p => ({
      ...p,
      imageUrl: p.thumbnail || p.image || null,
      offerPrice: p.salePrice || p.price,
      gradient: p.gradient || "from-blue-500 to-purple-600"
    }));
  } catch (error) {
    return [];
  }
}

export async function getFeaturedProductsData() {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const docs = await db.collection("products")
      .find({ isFeatured: true })
      .sort({ createdAt: -1 })
      .limit(12)
      .toArray();
    return transformProducts(docs);
  } catch (error) {
    return [];
  }
}
