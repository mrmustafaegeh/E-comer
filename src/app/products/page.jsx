"use client";

import { useState } from "react";
import ProductList from "../../Component/products/ProductsList";
import ProductFilters from "../../Component/products/ProductFilters";
import ProductPagination from "../../Component/products/ProductPagination";
import LoadingSpinner from "../../Component/ui/LoadingSpinner";
import EmptyState from "../../Component/ui/EmptyState";
import { useProducts } from "../../hooks/useProducts";

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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="mb-6">
          <ProductFilters
            localFilters={localFilters}
            setLocalFilters={setLocalFilters}
            applyFilters={applyFilters}
            clearFilters={clearFilters}
          />
        </div>

        {/* Loading indicator for background fetches */}
        {isFetching && !isLoading && (
          <div className="text-center mb-4">
            <span className="text-sm text-blue-600">Updating products...</span>
          </div>
        )}

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <LoadingSpinner />
          </div>
        ) : products.length === 0 ? (
          <div className="py-20">
            <EmptyState
              message={
                hasActiveFilters
                  ? "No products match your filters. Try adjusting your search criteria."
                  : "No products found"
              }
            />
            {hasActiveFilters && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={clearFilters}
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Results count */}
            <div className="mb-4 text-sm text-gray-600">
              Showing {products.length} of {total} products
            </div>

            {/* Product Grid */}
            <div className="mb-8">
              <ProductList products={products} />
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center">
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
