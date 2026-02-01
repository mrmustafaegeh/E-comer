import clientPromise from "@/lib/mongodb";
import { transformProducts } from "@/lib/transformers";

export async function getProducts(params = {}) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const collection = db.collection("products");

    const search = (params.search || "").trim();
    const category = (params.category || "").trim();

    const page = Math.max(1, Number(params.page || 1));
    const limit = Math.min(48, Math.max(1, Number(params.limit || 24)));

    const minPriceRaw = params.minPrice;
    const maxPriceRaw = params.maxPrice;

    const minPrice =
      minPriceRaw !== undefined && minPriceRaw !== ""
        ? Number(minPriceRaw)
        : null;
    const maxPrice =
      maxPriceRaw !== undefined && maxPriceRaw !== ""
        ? Number(maxPriceRaw)
        : null;

    // Build filters
    const filters = {};

    // Category filter
    if (category && category !== "all") {
      filters.category = category.toLowerCase();
    }

    // Price filter
    if (Number.isFinite(minPrice) || Number.isFinite(maxPrice)) {
      const priceConditions = [];
      const priceFilter = {};
      if (Number.isFinite(minPrice)) priceFilter.$gte = minPrice;
      if (Number.isFinite(maxPrice)) priceFilter.$lte = maxPrice;

      priceConditions.push({ price: priceFilter });
      priceConditions.push({
        salePrice: {
          ...priceFilter,
          $ne: null,
        },
      });

      filters.$or = priceConditions;
    }

    // Search filter
    if (search) {
      filters.$text = { $search: search };
    }

    const skip = (page - 1) * limit;

    // Projection
    const projection = {
      name: 1,
      title: 1,
      price: 1,
      salePrice: 1,
      oldPrice: 1,
      discount: 1,
      image: 1,
      thumbnail: 1,
      emoji: 1,
      category: 1,
      rating: 1,
      numReviews: 1,
      featured: 1,
      isFeatured: 1,
      stock: 1,
      createdAt: 1,
      slug: 1,
    };

    const [products, total] = await Promise.all([
      collection
        .find(filters, { projection })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      collection.countDocuments(filters),
    ]);

    // Transform products using centralized utility
    const transformedProducts = transformProducts(products);

    return {
      products: transformedProducts,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    console.error("ProductService getProducts Error:", error);
    throw new Error("Failed to fetch products");
  }
}

export async function createProduct(productData) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    const collection = db.collection("products");

    // Standardize category
    const finalData = {
      ...productData,
      category: productData.category.toLowerCase(),
    };

    // Generate slug
    const slug = (productData.slug || productData.name || productData.title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    // Check existing
    const existing = await collection.findOne({ slug });
    if (existing) {
      throw new Error("A product with this slug already exists");
    }

    const doc = {
      ...finalData,
      slug,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(doc);

    return {
      ...doc,
      _id: result.insertedId.toString(),
      id: result.insertedId.toString(),
    };
  } catch (error) {
    console.error("ProductService createProduct Error:", error);
    throw error;
  }
}

export async function getProductById(id) {
  // Placeholder
}

export async function getHeroProductsData() {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    const docs = await db
      .collection("products")
      .find({ $or: [{ isFeatured: true }, { featured: true }] })
      .sort({ featuredOrder: 1, createdAt: -1 })
      .limit(5)
      .project({
        name: 1,
        title: 1,
        price: 1,
        salePrice: 1,
        oldPrice: 1,
        discount: 1,
        rating: 1,
        image: 1,
        thumbnail: 1,
        emoji: 1,
        gradient: 1,
      })
      .toArray();

    return transformProducts(docs).map((p) => {
      const displayPrice = p.isOnSale ? p.formattedSalePrice : p.formattedPrice;
      const displayOldPrice = p.isOnSale ? p.formattedPrice : (p.oldPrice ? p.formattedOldPrice : null);
      
      return {
        ...p,
        price: displayPrice,
        oldPrice: displayOldPrice,
        offerPrice: p.salePrice || p.price,
        imageUrl: p.thumbnail || p.image || null,
        rating: typeof p.rating === "number" ? p.rating : 4.5,
        emoji: p.emoji || null,
        gradient: p.gradient || "from-blue-500 to-purple-600",
      };
    });
  } catch (error) {
    console.error("ProductService getHeroProductsData Error:", error);
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
      console.error("ProductService getFeaturedProductsData Error:", error);
      return [];
  }
}
