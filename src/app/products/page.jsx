"use client";

import { useState } from "react";
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

export default function ProductsPage() {
  const [localFilters, setLocalFilters] = useState({
    search: "",
    category: "",
    minPrice: "",
    maxPrice: "",
  });

  const [appliedFilters, setAppliedFilters] = useState({
    search: "",
    category: "",
    minPrice: "",
    maxPrice: "",
  });

  const [page, setPage] = useState(1);
  const limit = 12;

  // ✅ Use React Query hook
  const { data, isLoading, error, isFetching } = useProducts({
    page,
    limit,
    ...appliedFilters,
  });

  const products = data?.products || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / limit);

  const applyFilters = () => {
    setAppliedFilters({ ...localFilters });
    setPage(1);
  };

  const clearFilters = () => {
    const emptyFilters = {
      search: "",
      category: "",
      minPrice: "",
      maxPrice: "",
    };
    setLocalFilters(emptyFilters);
    setAppliedFilters(emptyFilters);
    setPage(1);
  };

  const hasActiveFilters =
    appliedFilters.search ||
    appliedFilters.category ||
    appliedFilters.minPrice ||
    appliedFilters.maxPrice;

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
      {/* Filters Full Width */}
      <div className="w-full">
          <ProductFilters
            localFilters={localFilters}
            setLocalFilters={setLocalFilters}
            applyFilters={applyFilters}
            clearFilters={clearFilters}
          />
      </div>

      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 pb-24">
        
        {/* Loading indicator for background fetches */}
        {isFetching && !isLoading && (
          <div className="text-center mb-4">
            <span className="text-xs text-gray-500 uppercase tracking-widest">Updating...</span>
          </div>
        )}

        {/* Content */}
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
            {/* Results count minimal */}
            <div className="mb-8 text-xs text-gray-400 uppercase tracking-widest text-right">
              {products.length} Items
            </div>

            {/* Product Grid */}
            <div className="mb-16">
              <ProductList products={products} />
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center border-t border-gray-100 pt-12">
                <ProductPagination
                  page={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
