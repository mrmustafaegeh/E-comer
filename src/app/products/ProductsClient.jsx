"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import LoadingSpinner from "../../Component/ui/LoadingSpinner";
import EmptyState from "../../Component/ui/EmptyState";
import { useProducts } from "../../hooks/useProducts";

const ProductList = dynamic(() => import("../../Component/products/ProductsList"), { ssr: false });
const ProductFilters = dynamic(() => import("../../Component/products/ProductFilters"), { 
  ssr: false,
  loading: () => <div className="h-40 bg-gray-100 animate-pulse rounded-xl mb-6" />
});
const ProductPagination = dynamic(() => import("../../Component/products/ProductPagination"), { ssr: false });

export default function ProductsClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Parse current params from URL
  const currentPage = Number(searchParams.get("page")) || 1;
  const currentSearch = searchParams.get("search") || "";
  const currentCategory = searchParams.get("category") || "";
  const currentMinPrice = searchParams.get("minPrice") || "";
  const currentMaxPrice = searchParams.get("maxPrice") || "";
  const limit = 12;

  // Initial local state mimics the URL state
  const [localFilters, setLocalFilters] = useState({
    search: currentSearch,
    category: currentCategory,
    minPrice: currentMinPrice,
    maxPrice: currentMaxPrice,
  });

  // Sync local filters if URL changes externally
  useEffect(() => {
    setLocalFilters({
      search: currentSearch,
      category: currentCategory,
      minPrice: currentMinPrice,
      maxPrice: currentMaxPrice,
    });
  }, [currentSearch, currentCategory, currentMinPrice, currentMaxPrice]);

  // Use React Query
  const { data, isLoading, error, isFetching } = useProducts({
    page: currentPage,
    limit,
    search: currentSearch,
    category: currentCategory,
    minPrice: currentMinPrice,
    maxPrice: currentMaxPrice,
  });

  const products = data?.products || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / limit);

  // Update URL function
  const updateUrl = (newParams) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (newParams.page) params.set("page", newParams.page);
    else params.set("page", "1"); 

    if (newParams.search !== undefined) {
      if (newParams.search) params.set("search", newParams.search);
      else params.delete("search");
    }

    if (newParams.category !== undefined) {
      if (newParams.category) params.set("category", newParams.category);
      else params.delete("category");
    }
    
    if (newParams.minPrice !== undefined) {
      if (newParams.minPrice) params.set("minPrice", newParams.minPrice);
      else params.delete("minPrice");
    }

    if (newParams.maxPrice !== undefined) {
      if (newParams.maxPrice) params.set("maxPrice", newParams.maxPrice);
      else params.delete("maxPrice");
    }

    router.push(`?${params.toString()}`, { scroll: false });
  };

  const applyFilters = () => {
    updateUrl({
      search: localFilters.search,
      category: localFilters.category,
      minPrice: localFilters.minPrice,
      maxPrice: localFilters.maxPrice,
      page: 1
    });
  };

  const clearFilters = () => {
    const emptyFilters = {
      search: "",
      category: "",
      minPrice: "",
      maxPrice: "",
    };
    setLocalFilters(emptyFilters);
    updateUrl({ ...emptyFilters, page: 1 });
  };

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`?${params.toString()}`, { scroll: true });
  };

  const hasActiveFilters = currentSearch || currentCategory || currentMinPrice || currentMaxPrice;

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error loading products</p>
          <p className="text-sm text-gray-600">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full">
        <ProductFilters
          localFilters={localFilters}
          setLocalFilters={setLocalFilters}
          applyFilters={applyFilters}
          clearFilters={clearFilters}
        />
      </div>

      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 pb-24">
        {isFetching && !isLoading && (
          <div className="text-center mb-4">
            <span className="text-xs text-gray-500 uppercase tracking-widest">Updating...</span>
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-32">
            <LoadingSpinner />
          </div>
        ) : products.length === 0 ? (
          <div className="py-20 text-center">
            <div className="text-6xl mb-6">🔍</div>
            <EmptyState
              message={
                hasActiveFilters
                  ? "We couldn't find any matches. Try different filters."
                  : "No products available yet."
              }
            />
            {hasActiveFilters && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={clearFilters}
                  className="text-black underline underline-offset-4 hover:text-gray-600 font-medium text-sm"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="mb-8 text-xs text-gray-400 uppercase tracking-widest text-right">
              {products.length} Items
            </div>
            <div className="mb-16">
              <ProductList products={products} />
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center border-t border-gray-100 pt-12">
                <ProductPagination
                  page={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
