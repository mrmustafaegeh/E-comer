"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import LoadingSpinner from "../../Component/ui/LoadingSpinner";
import EmptyState from "../../Component/ui/EmptyState";
import { useProducts } from "../../hooks/useProducts";
import ProductList from "../../Component/products/ProductsList";
import ProductFilters from "../../Component/products/ProductFilters";
import ProductPagination from "../../Component/products/ProductPagination";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductsClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL States (Primary Source of Truth)
  const page = Math.max(1, parseInt(searchParams.get("page")) || 1);
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const sort = searchParams.get("sort") || "newest";

  const limit = 12;

  // Local Filter State (For the UI interaction before clicking "Filter")
  const [localFilters, setLocalFilters] = useState({
    search,
    category,
    minPrice,
    maxPrice,
    sort
  });

  // Sync local state when URL changes externally
  useEffect(() => {
    setLocalFilters({ search, category, minPrice, maxPrice, sort });
  }, [search, category, minPrice, maxPrice, sort]);

  // Data Fetching (Uses Hydration Boundary if data pre-fetched on server)
  const { data, isLoading, isPlaceholderData, error } = useProducts({
    page,
    limit,
    search,
    category,
    minPrice,
    maxPrice,
    sort
  });

  const updateUrl = useCallback((newParams) => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Reset to page 1 on filter change unless specifically changing page
    if (newParams.page) {
        params.set("page", String(newParams.page));
    } else {
        params.set("page", "1");
    }

    Object.keys(newParams).forEach(key => {
        if (key === 'page') return;
        if (newParams[key]) {
            params.set(key, String(newParams[key]));
        } else {
            params.delete(key);
        }
    });

    router.push(`?${params.toString()}`, { scroll: false });
  }, [router, searchParams]);

  const handleApplyFilters = () => {
    updateUrl(localFilters);
  };

  const handleClearFilters = () => {
    const cleared = { search: "", category: "", minPrice: "", maxPrice: "", sort: "newest" };
    setLocalFilters(cleared);
    updateUrl(cleared);
  };

  if (error) return (
    <div className="py-20 text-center">
        <p className="text-red-500 font-bold uppercase tracking-widest text-xs">Error: Protocol Failure</p>
        <p className="text-gray-400 mt-2">{error.message}</p>
    </div>
  );

  const products = data?.products || [];
  const totalItems = data?.total || 0;
  const totalPages = data?.totalPages || 1;

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full">
        <ProductFilters
          localFilters={localFilters}
          setLocalFilters={setLocalFilters}
          applyFilters={handleApplyFilters}
          clearFilters={handleClearFilters}
        />
      </div>

      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 pb-24">
        {/* Results Info */}
        <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Displaying Archive: {products.length} of {totalItems}
                </span>
                {isPlaceholderData && (
                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest animate-pulse">
                        Sychronizing...
                    </span>
                )}
            </div>
            
            <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sort:</span>
                <select 
                    value={localFilters.sort} 
                    onChange={(e) => {
                        const newSort = e.target.value;
                        setLocalFilters(p => ({ ...p, sort: newSort }));
                        updateUrl({ ...localFilters, sort: newSort });
                    }}
                    className="text-[10px] font-black uppercase tracking-widest bg-transparent border-none focus:ring-0 cursor-pointer pointer-events-auto"
                >
                    <option value="newest">Latest Assets</option>
                    <option value="price-low">Value: Low to High</option>
                    <option value="price-high">Value: High to Low</option>
                    <option value="rating">Protocol Rating</option>
                </select>
            </div>
        </div>

        <section className="relative">
            <AnimatePresence mode="wait">
                {isLoading && !products.length ? (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="py-32 flex justify-center"
                    >
                        <LoadingSpinner />
                    </motion.div>
                ) : products.length === 0 ? (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="py-20 text-center"
                    >
                        <EmptyState message="No matching assets found in the identity grid." />
                    </motion.div>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={isPlaceholderData ? "opacity-30 pointer-events-none transition-opacity duration-300" : "transition-opacity duration-300"}
                    >
                        <ProductList products={products} />
                    </motion.div>
                )}
            </AnimatePresence>
        </section>

        {/* Pagination Grid */}
        {totalPages > 1 && (
            <div className="mt-20 border-t border-gray-100 pt-10">
                <ProductPagination
                    page={page}
                    totalPages={totalPages}
                    onPageChange={(newPage) => updateUrl({ ...localFilters, page: newPage })}
                />
            </div>
        )}
      </div>
    </div>
  );
}
