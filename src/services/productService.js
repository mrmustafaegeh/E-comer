import { get } from "./api";

export const productService = {
  // Get all products
  getProducts: async (params = {}) => {
    try {
      console.log("🛒 Fetching products...");
      return await get("products", params); // No leading slash, no /api prefix
    } catch (error) {
      console.error("Error fetching products:", error);
      return {
        products: [],
        total: 0,
        message: "Failed to load products",
        error: error.message,
      };
    }
  },

  // Get single product
  getProduct: async (id) => {
    try {
      console.log(`📦 Fetching product ${id}...`);
      return await get(`products/${id}`);
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw error;
    }
  },

  // Get categories
  getCategories: async () => {
    try {
      console.log("📂 Fetching categories...");

      // Try dedicated categories endpoint first
      try {
        const categories = await get("category"); // Your API uses /api/category
        if (categories && Array.isArray(categories)) {
          return categories;
        }
      } catch (categoriesError) {
        console.log("Categories endpoint error, extracting from products...");
      }

      // Fallback: extract from products
      const response = await get("products");
      const products = response.products || response || [];

      if (Array.isArray(products)) {
        const categories = [
          ...new Set(
            products
              .map((p) => p.category)
              .filter((category) => category && typeof category === "string")
          ),
        ];
        return categories;
      }

      return [];
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  },

  // Get products by category
  getProductsByCategory: async (category) => {
    try {
      console.log(`🏷️ Fetching products in category "${category}"...`);
      const response = await get("products", { category });
      const products = response.products || response || [];

      if (category && Array.isArray(products)) {
        return products.filter(
          (p) =>
            p.category && p.category.toLowerCase() === category.toLowerCase()
        );
      }

      return products;
    } catch (error) {
      console.error(`Error fetching products by category ${category}:`, error);
      return [];
    }
  },

  // Featured products
  async getFeaturedProducts() {
    try {
      console.log("⭐ Fetching featured products...");

      // Try hero-products endpoint first
      try {
        const response = await get("hero-products");
        if (response.success && Array.isArray(response.products)) {
          return response.products;
        }
      } catch (heroError) {
        console.log("Hero products endpoint error, trying fallback...");
      }

      // Fallback: fetch all and filter
      console.log("Filtering from all products...");
      const response = await this.getProducts();
      const allProducts = response.products || response || [];

      if (!Array.isArray(allProducts)) {
        console.error("Invalid products data structure:", response);
        return [];
      }

      // Filter featured products
      const featuredProducts = allProducts
        .filter((p) => p.featured === true || p.isFeatured === true)
        .slice(0, 4);

      return featuredProducts;
    } catch (error) {
      console.error("Featured products error:", error);
      return [];
    }
  },

  // Search products
  searchProducts: async (query, params = {}) => {
    try {
      console.log(`🔍 Searching for "${query}"...`);
      const allParams = { ...params, search: query }; // Your API uses "search" not "q"
      const response = await get("products", allParams);
      return response.products || response || [];
    } catch (error) {
      console.error("Search error:", error);

      // Fallback client-side search
      const response = await this.getProducts();
      const products = response.products || response || [];

      if (query && Array.isArray(products)) {
        const searchTerm = query.toLowerCase();
        return products.filter(
          (p) =>
            (p.title && p.title.toLowerCase().includes(searchTerm)) ||
            (p.name && p.name.toLowerCase().includes(searchTerm)) ||
            (p.description &&
              p.description.toLowerCase().includes(searchTerm)) ||
            (p.category && p.category.toLowerCase().includes(searchTerm))
        );
      }

      return products;
    }
  },
};
