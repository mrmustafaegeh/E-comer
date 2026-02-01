"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Plus, Filter, Search, ArrowLeft, Loader2, Package } from "lucide-react";
import Link from "next/link";
import { fetchAdminProducts } from "../../../store/adminProductSlice";
import ProductTable from "../../../Component/dashboard/ProductTable";
import { motion } from "framer-motion";

export default function AdminProductsPage() {
  const dispatch = useDispatch();
  const {
    items: products,
    loading,
    error,
  } = useSelector((state) => state.adminProducts);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    dispatch(fetchAdminProducts());
  }, [dispatch]);

  const categories = [
    "all",
    ...new Set(
      (Array.isArray(products) ? products : [])
        .map((p) => p.category)
        .filter(Boolean)
    ),
  ];

  const filteredProducts = (Array.isArray(products) ? products : []).filter(
    (product) => {
      const matchesSearch =
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    }
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] bg-white">
        <Loader2 className="animate-spin w-10 h-10 text-gray-900 mb-4" />
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Synchronizing Asset Database...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-12 text-center bg-red-50 rounded-[3rem] border border-red-100 max-w-2xl mx-auto my-12">
        <h3 className="text-2xl font-black text-red-600 tracking-tighter mb-2">Protocol: Database Error.</h3>
        <p className="text-sm font-bold text-red-400 uppercase tracking-widest mb-8">{error}</p>
        <button
          onClick={() => dispatch(fetchAdminProducts())}
          className="px-8 py-4 bg-red-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-all"
        >
          Retry Link
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-12">
      {/* Header Segment */}
      <header className="mb-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-4 block">Archive Management</span>
                <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter leading-none">Product File.</h1>
            </div>
            <Link
                href="/admin/create-product"
                className="inline-flex items-center gap-3 px-10 py-5 bg-gray-900 text-white rounded-[2.5rem] font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all shadow-2xl shadow-gray-200 group"
            >
                <Plus size={16} strokeWidth={3} /> Register Asset
            </Link>
        </div>

        {/* Filters Minimalist */}
        <div className="flex flex-col lg:flex-row gap-6 items-center">
             <div className="relative flex-1 w-full">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search by Asset Name or Description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-gray-50 border-none rounded-[2rem] py-5 pl-14 pr-8 text-gray-900 placeholder:text-gray-300 outline-none transition-all focus:bg-white focus:ring-4 focus:ring-gray-100 font-bold tracking-tight text-sm"
                />
            </div>

            <div className="relative w-full lg:w-64">
                <Filter className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full bg-gray-50 border-none rounded-[2rem] py-5 pl-14 pr-10 text-gray-900 font-bold tracking-tight text-sm appearance-none focus:bg-white focus:ring-4 focus:ring-gray-100"
                >
                    {categories.map((cat) => (
                    <option key={cat} value={cat}>
                        {cat === "all" ? "All Categories" : cat.toUpperCase()}
                    </option>
                    ))}
                </select>
            </div>
        </div>
      </header>

      {/* Main Database Table */}
      <div className="bg-white rounded-[3.5rem] border border-gray-100 shadow-2xl shadow-gray-100 overflow-hidden">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-32 px-6">
            <div className="w-20 h-20 bg-gray-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 border border-gray-100">
                <Package size={32} className="text-gray-200" />
            </div>
            <h3 className="text-3xl font-black text-gray-900 tracking-tighter mb-4">No Assets Identified.</h3>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest max-w-sm mx-auto mb-10 leading-relaxed">
              {searchTerm || selectedCategory !== "all"
                ? "The specified query returned no matches in the current database"
                : "The primary asset archive is currently empty"}
            </p>
            {!searchTerm && selectedCategory === "all" && (
              <Link
                href="/admin/create-product"
                className="inline-flex items-center gap-3 px-10 py-5 bg-gray-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all"
              >
                <Plus size={16} strokeWidth={3} /> Initialize Database
              </Link>
            )}
          </div>
        ) : (
          <ProductTable products={filteredProducts} />
        )}
      </div>

      <footer className="mt-16 text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-200">
                Asset Management Terminal // Security: High // Mode: Read-Write
            </p>
      </footer>
    </div>
  );
}
