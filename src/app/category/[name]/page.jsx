"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import ProductFilters from "../../../Component/products/ProductFilters";
import useDebouncedValue from "../../../hooks/useDebouncedValue";
import { get } from "../../../services/api"; // Import your API service

export default function CategoryPage({ params }) {
  const categoryName = decodeURIComponent(params.name);

  const [products, setProducts] = useState([]);
  const [meta, setMeta] = useState({
    total: 0,
    page: 1,
    totalPages: 1,
    limit: 24,
  });
  const [loading, setLoading] = useState(true);

  // Local filters state
  const [localFilters, setLocalFilters] = useState({
    search: "",
    category: categoryName,
    minPrice: "",
    maxPrice: "",
  });

  // Applied filters (after clicking Apply button)
  const [appliedFilters, setAppliedFilters] = useState(localFilters);

  // Debounce search
  const debouncedSearch = useDebouncedValue(appliedFilters.search, 450);

  // Build params object
  const queryParams = useMemo(() => {
    const params = {
      page: String(meta.page),
      limit: String(meta.limit),
    };

    if (appliedFilters.category) params.category = appliedFilters.category;
    if (debouncedSearch) params.search = debouncedSearch;
    if (appliedFilters.minPrice) params.minPrice = appliedFilters.minPrice;
    if (appliedFilters.maxPrice) params.maxPrice = appliedFilters.maxPrice;

    return params;
  }, [
    appliedFilters.category,
    appliedFilters.minPrice,
    appliedFilters.maxPrice,
    debouncedSearch,
    meta.page,
    meta.limit,
  ]);

  // Fetch products
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        // Use the API service - it handles the /api prefix correctly
        const data = await get("products", queryParams);

        if (!cancelled) {
          setProducts(data.products || []);
          setMeta((m) => ({
            ...m,
            total: data.total || 0,
            totalPages: data.totalPages || 1,
          }));
        }
      } catch (e) {
        console.error("Category fetch failed:", e);
        if (!cancelled) setProducts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [queryParams]);

  // Sync category when route changes
  useEffect(() => {
    setLocalFilters((f) => ({ ...f, category: categoryName }));
    setAppliedFilters((f) => ({ ...f, category: categoryName }));
    setMeta((m) => ({ ...m, page: 1 }));
  }, [categoryName]);

  const applyFilters = () => {
    setAppliedFilters(localFilters);
    setMeta((m) => ({ ...m, page: 1 }));
  };

  const clearFilters = () => {
    const cleared = {
      search: "",
      category: categoryName,
      minPrice: "",
      maxPrice: "",
    };
    setLocalFilters(cleared);
    setAppliedFilters(cleared);
    setMeta((m) => ({ ...m, page: 1 }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="px-6 md:px-16 py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold capitalize bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            {categoryName.replaceAll("-", " ")}
          </h1>
          <p className="text-sm text-gray-600">
            {loading ? "Loading..." : `${meta.total} product(s) found`}
          </p>
        </motion.div>

        {/* Filters */}
        <ProductFilters
          localFilters={localFilters}
          setLocalFilters={setLocalFilters}
          applyFilters={applyFilters}
          clearFilters={clearFilters}
        />

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-white rounded-xl shadow-sm p-4">
                  <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">
              No products found
            </h3>
            <p className="text-gray-500 mb-6">
              Try adjusting your filters or search terms
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear All Filters
            </button>
          </motion.div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
              {products.map((product, idx) => (
                <motion.div
                  key={product.id || product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Link
                    href={`/products/${product.id || product._id}`}
                    className="group block bg-white p-4 border border-gray-200 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={
                          product.image ||
                          product.thumbnail ||
                          "/placeholder.png"
                        }
                        alt={product.title || product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-contain group-hover:scale-110 transition-transform duration-300"
                      />
                      {product.discount && (
                        <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          {product.discount}
                        </span>
                      )}
                    </div>

                    <h2 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {product.title || product.name}
                    </h2>

                    <div className="flex items-center gap-2 mb-2">
                      <p className="text-blue-600 font-bold text-xl">
                        $
                        {product.salePrice ||
                          product.offerPrice ||
                          product.price}
                      </p>
                      {product.oldPrice && (
                        <p className="text-gray-400 text-sm line-through">
                          ${product.oldPrice}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-500">
                        ⭐ {product.rating ?? 4.5}
                      </p>
                      {product.stock > 0 ? (
                        <span className="text-xs text-green-600 font-medium">
                          In Stock
                        </span>
                      ) : (
                        <span className="text-xs text-red-600 font-medium">
                          Out of Stock
                        </span>
                      )}
                    </div>

                    <button className="mt-3 w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2 rounded-lg transition-all duration-300 font-medium">
                      View Details
                    </button>
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            {/* Pagination */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center gap-3 mt-10"
            >
              <button
                className="px-6 py-3 rounded-lg border border-gray-300 bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors font-medium"
                disabled={meta.page <= 1}
                onClick={() => setMeta((m) => ({ ...m, page: m.page - 1 }))}
              >
                ← Previous
              </button>

              <span className="text-sm text-gray-600 px-4 py-3 bg-white rounded-lg border border-gray-300 font-medium">
                Page {meta.page} of {meta.totalPages}
              </span>

              <button
                className="px-6 py-3 rounded-lg border border-gray-300 bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors font-medium"
                disabled={meta.page >= meta.totalPages}
                onClick={() => setMeta((m) => ({ ...m, page: m.page + 1 }))}
              >
                Next →
              </button>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
