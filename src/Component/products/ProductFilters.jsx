"use client";

import { Search, X, DollarSign, SlidersHorizontal } from "lucide-react";
import { useState, useEffect } from "react";

export default function ProductFilters({
  localFilters,
  setLocalFilters,
  applyFilters,
  clearFilters,
}) {
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const safe = localFilters || {
    search: "",
    category: "",
    minPrice: "",
    maxPrice: "",
  };

  // Fetch categories from API
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/category");
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoadingCategories(false);
      }
    }

    fetchCategories();
  }, []);

  return (
    <div className="max-w-7xl mx-auto mb-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4">
          {/* Header */}
          <div className="flex items-center gap-2 mb-4">
            <SlidersHorizontal className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold text-gray-800">Filters</h3>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 min-w-[250px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={safe.search}
                onChange={(e) =>
                  setLocalFilters((prev) => ({
                    ...(prev || {}),
                    search: e.target.value,
                  }))
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") applyFilters();
                }}
                className="w-full bg-gray-50 border border-gray-200 px-3 py-2.5 pl-10 pr-9 rounded-lg text-sm transition-colors focus:bg-white focus:border-blue-500 focus:outline-none"
              />
              {safe.search && (
                <button
                  type="button"
                  onClick={() =>
                    setLocalFilters((prev) => ({
                      ...(prev || {}),
                      search: "",
                    }))
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category */}
            <select
              className="bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-lg text-sm transition-colors focus:bg-white focus:border-blue-500 focus:outline-none cursor-pointer min-w-[160px]"
              value={safe.category}
              onChange={(e) =>
                setLocalFilters((prev) => ({
                  ...(prev || {}),
                  category: e.target.value,
                }))
              }
            >
              <option value="">All Categories</option>
              {loadingCategories ? (
                <option disabled>Loading...</option>
              ) : (
                categories.map((cat) => (
                  <option key={cat._id} value={cat.slug}>
                    {cat.name}
                  </option>
                ))
              )}
            </select>

            {/* Price Range */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input
                  type="number"
                  className="w-28 bg-gray-50 border border-gray-200 px-3 py-2.5 pl-7 rounded-lg text-sm transition-colors focus:bg-white focus:border-blue-500 focus:outline-none"
                  placeholder="Min"
                  value={safe.minPrice}
                  onChange={(e) =>
                    setLocalFilters((prev) => ({
                      ...(prev || {}),
                      minPrice: e.target.value,
                    }))
                  }
                />
              </div>

              <span className="text-gray-400">-</span>

              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input
                  type="number"
                  className="w-28 bg-gray-50 border border-gray-200 px-3 py-2.5 pl-7 rounded-lg text-sm transition-colors focus:bg-white focus:border-blue-500 focus:outline-none"
                  placeholder="Max"
                  value={safe.maxPrice}
                  onChange={(e) =>
                    setLocalFilters((prev) => ({
                      ...(prev || {}),
                      maxPrice: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            {/* Buttons */}
            <button
              type="button"
              onClick={applyFilters}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors whitespace-nowrap"
            >
              Apply Filters
            </button>

            <button
              type="button"
              onClick={clearFilters}
              className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors whitespace-nowrap border border-gray-200"
            >
              Clear All
            </button>
          </div>

          {/* Active Filters Display */}
          {(safe.search || safe.category || safe.minPrice || safe.maxPrice) && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-gray-500 font-medium">
                  Active filters:
                </span>

                {safe.search && (
                  <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs">
                    Search: {safe.search}
                    <button
                      onClick={() =>
                        setLocalFilters((prev) => ({ ...prev, search: "" }))
                      }
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {safe.category && (
                  <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-xs">
                    Category: {safe.category}
                    <button
                      onClick={() =>
                        setLocalFilters((prev) => ({ ...prev, category: "" }))
                      }
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}

                {(safe.minPrice || safe.maxPrice) && (
                  <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs">
                    Price: ${safe.minPrice || "0"} - ${safe.maxPrice || "∞"}
                    <button
                      onClick={() =>
                        setLocalFilters((prev) => ({
                          ...prev,
                          minPrice: "",
                          maxPrice: "",
                        }))
                      }
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
