import { useQuery } from "@tanstack/react-query";
import { get } from "@/services/api";

export function useProducts(filters = {}) {
  const {
    page = 1,
    limit = 12,
    search = "",
    category = "",
    minPrice = "",
    maxPrice = "",
    sort = "newest"
  } = filters;

  return useQuery({
    queryKey: [
      "products",
      { page, limit, search, category, minPrice, maxPrice, sort },
    ],
    queryFn: async () => {
      const params = {
        page: String(page),
        limit: String(limit),
        sort
      };

      if (search) params.search = search;
      if (category) params.category = category;
      if (minPrice) params.minPrice = String(minPrice);
      if (maxPrice) params.maxPrice = String(maxPrice);

      return await get("products", params);
    },
    staleTime: 60 * 1000, 
    placeholderData: (previousData) => previousData,
  });
}

export function useFeaturedProducts() {
  return useQuery({
    queryKey: ["products", "featured"],
    queryFn: () => get("products/featured"),
    staleTime: 5 * 60 * 1000,
  });
}

export function useHeroProducts() {
  return useQuery({
    queryKey: ["products", "hero"],
    queryFn: () => get("hero-products"),
    staleTime: 5 * 60 * 1000,
  });
}

export function useProduct(id) {
  return useQuery({
    queryKey: ["products", id],
    queryFn: () => get(`products/${id}`),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => get("category"),
    staleTime: 30 * 60 * 1000,
  });
}
