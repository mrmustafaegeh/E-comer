import { useQuery } from "@tanstack/react-query";
import { get } from "@/services/api";

export function useProducts(filters = {}) {
  const {
    page = 1,
    limit = 12,
    search,
    category,
    minPrice,
    maxPrice,
  } = filters;

  return useQuery({
    queryKey: [
      "products",
      { page, limit, search, category, minPrice, maxPrice },
    ],
    queryFn: async () => {
      const params = {
        page: page.toString(),
        limit: limit.toString(),
      };

      if (search) params.search = search;
      if (category) params.category = category;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;

      return await get("/products", params);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    keepPreviousData: true, // Keep old data while fetching new
  });
}

export function useFeaturedProducts() {
  return useQuery({
    queryKey: ["products", "featured"],
    queryFn: () => get("/products/featured"),
    staleTime: 10 * 60 * 1000, // 10 minutes - featured rarely changes
    cacheTime: 30 * 60 * 1000, // 30 minutes
  });
}

export function useHeroProducts() {
  return useQuery({
    queryKey: ["products", "hero"],
    queryFn: () => get("/hero-products"),
    staleTime: 10 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
  });
}

export function useProduct(id) {
  return useQuery({
    queryKey: ["products", id],
    queryFn: () => get(`/products/${id}`),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => get("/categories"),
    staleTime: 30 * 60 * 1000, // Categories rarely change
    cacheTime: 60 * 60 * 1000, // 1 hour
  });
}
