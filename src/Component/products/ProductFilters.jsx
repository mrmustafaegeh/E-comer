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
    <div className="w-full mb-8">
      <div className="bg-white rounded-none border-b border-gray-200">
        <div className="py-6 max-w-[1600px] mx-auto px-6 lg:px-12">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-medium text-gray-900 tracking-tight">All Products</h1>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>{categories.length} Categories</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="relative w-full sm:w-auto sm:flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
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
                className="w-full bg-white border border-gray-300 px-3 py-3 pl-10 pr-9 rounded-none text-sm placeholder-gray-500 focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category */}
            <div className="relative min-w-[180px]">
                <select
                className="w-full appearance-none bg-white border border-gray-300 px-4 py-3 pr-10 rounded-none text-sm text-gray-900 focus:border-black focus:ring-1 focus:ring-black outline-none cursor-pointer"
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
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </div>
            </div>

            {/* Price Range */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                <input
                  type="number"
                  className="w-24 bg-white border border-gray-300 px-3 py-3 pl-6 rounded-none text-sm placeholder-gray-400 focus:border-black focus:ring-1 focus:ring-black outline-none"
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

              <span className="text-gray-400">—</span>

              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                <input
                  type="number"
                  className="w-24 bg-white border border-gray-300 px-3 py-3 pl-6 rounded-none text-sm placeholder-gray-400 focus:border-black focus:ring-1 focus:ring-black outline-none"
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
              className="bg-black text-white px-8 py-3 rounded-none text-sm font-medium hover:bg-gray-800 transition-colors uppercase tracking-widest whitespace-nowrap"
            >
              Filter
            </button>

            <button
              type="button"
              onClick={clearFilters}
              className="px-4 py-3 text-sm font-medium text-gray-500 hover:text-black transition-colors whitespace-nowrap"
            >
              Reset
            </button>
          </div>

          {/* Active Filters Display */}
          {(safe.search || safe.category || safe.minPrice || safe.maxPrice) && (
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="text-xs text-gray-400 uppercase tracking-widest font-medium mr-2">
                Active:
              </span>

              {safe.search && (
                <span className="inline-flex items-center gap-2 bg-gray-100 text-gray-900 px-3 py-1.5 text-xs font-medium border border-gray-200">
                  "{safe.search}"
                  <button
                    onClick={() =>
                      setLocalFilters((prev) => ({ ...prev, search: "" }))
                    }
                    className="hover:text-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {safe.category && (
                <span className="inline-flex items-center gap-2 bg-gray-100 text-gray-900 px-3 py-1.5 text-xs font-medium border border-gray-200">
                  {safe.category}
                  <button
                    onClick={() =>
                      setLocalFilters((prev) => ({ ...prev, category: "" }))
                    }
                    className="hover:text-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {(safe.minPrice || safe.maxPrice) && (
                <span className="inline-flex items-center gap-2 bg-gray-100 text-gray-900 px-3 py-1.5 text-xs font-medium border border-gray-200">
                  ${safe.minPrice || "0"} - ${safe.maxPrice || "∞"}
                  <button
                    onClick={() =>
                      setLocalFilters((prev) => ({
                        ...prev,
                        minPrice: "",
                        maxPrice: "",
                      }))
                    }
                    className="hover:text-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
