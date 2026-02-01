"use client";

import { Search, X, DollarSign, SlidersHorizontal, Filter, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
    <div className="w-full bg-white pt-16 pb-8">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        
        {/* Editorial Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-12">
            <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-4 block">Asset Archive</span>
                <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter leading-none">The Collection.</h1>
            </div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest max-w-[300px] leading-relaxed">
                Curated selection of premium digital and physical assets for the modern world.
            </p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col lg:flex-row gap-6 items-center">
            {/* Search */}
            <div className="relative flex-1 w-full group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-gray-900 transition-colors" />
              <input
                type="text"
                placeholder="Search Database..."
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
                className="w-full bg-gray-50 border-none rounded-[2rem] py-5 pl-14 pr-12 text-gray-900 placeholder:text-gray-300 outline-none transition-all focus:bg-white focus:ring-4 focus:ring-gray-100 font-bold tracking-tight text-sm"
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
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-900 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category */}
            <div className="relative w-full lg:w-64 group">
                <Filter className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-gray-900 transition-colors" />
                <select
                    className="w-full bg-gray-50 border-none rounded-[2rem] py-5 pl-14 pr-10 text-gray-900 font-bold tracking-tight text-sm appearance-none outline-none focus:bg-white focus:ring-4 focus:ring-gray-100 cursor-pointer transition-all"
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
                            {cat.name.toUpperCase()}
                        </option>
                        ))
                    )}
                </select>
                <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Price Range */}
            <div className="flex items-center gap-3 w-full lg:w-auto">
               <div className="relative flex-1 lg:w-32">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 font-black text-xs">$</span>
                  <input
                    type="number"
                    className="w-full bg-gray-50 border-none rounded-[2rem] py-5 pl-10 pr-6 text-gray-900 placeholder:text-gray-300 outline-none transition-all focus:bg-white focus:ring-4 focus:ring-gray-100 font-bold tracking-tight text-sm"
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
               <span className="text-gray-200">—</span>
               <div className="relative flex-1 lg:w-32">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 font-black text-xs">$</span>
                  <input
                    type="number"
                    className="w-full bg-gray-50 border-none rounded-[2rem] py-5 pl-10 pr-6 text-gray-900 placeholder:text-gray-300 outline-none transition-all focus:bg-white focus:ring-4 focus:ring-gray-100 font-bold tracking-tight text-sm"
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

            {/* Execute Button */}
            <button
               onClick={applyFilters}
               className="w-full lg:w-auto px-10 py-5 bg-gray-900 text-white rounded-[2rem] font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-gray-200 group"
            >
              Filter Collection
            </button>
        </div>

        {/* Active States */}
        <AnimatePresence>
            {(safe.search || safe.category || safe.minPrice || safe.maxPrice) && (
                <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-8 flex flex-wrap items-center gap-4"
                >
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Search:</span>
                    
                    {safe.search && (
                        <button 
                            onClick={() => setLocalFilters(prev => ({ ...prev, search: "" }))}
                            className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all"
                        >
                            "{safe.search}" <X size={12} strokeWidth={3} />
                        </button>
                    )}

                    {safe.category && (
                        <button 
                            onClick={() => setLocalFilters(prev => ({ ...prev, category: "" }))}
                            className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all"
                        >
                            {safe.category} <X size={12} strokeWidth={3} />
                        </button>
                    )}

                    {(safe.minPrice || safe.maxPrice) && (
                        <button 
                            onClick={() => setLocalFilters(prev => ({ ...prev, minPrice: "", maxPrice: "" }))}
                            className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all"
                        >
                            VAL {safe.minPrice || "0"} - {safe.maxPrice || "∞"} <X size={12} strokeWidth={3} />
                        </button>
                    )}

                    <button 
                        onClick={clearFilters}
                        className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-red-500 transition-colors ml-2"
                    >
                        Reset All
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
      </div>
    </div>
  );
}
