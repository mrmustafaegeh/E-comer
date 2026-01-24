// src/app/(admin)/products/page.jsx
"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { FiPlus, FiFilter, FiSearch } from "react-icons/fi";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { fetchAdminProducts } from "../../../store/adminProductSlice";
import ProductTable from "../../../Component/dashboard/ProductTable";

export default function AdminProductsPage() {
  const dispatch = useDispatch();
  const {
    items: products,
    loading,
    error,
  } = useSelector((state) => state.adminProducts);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Fetch products on mount
  useEffect(() => {
    dispatch(fetchAdminProducts());
  }, [dispatch]);

  // Extract unique categories SAFELY
  const categories = [
    "all",
    ...new Set(
      (Array.isArray(products) ? products : [])
        .map((p) => p.category)
        .filter(Boolean) // Remove null/undefined
    ),
  ];

  // Filter products SAFELY
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
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        <p>Error loading products: {error}</p>
        <button
          onClick={() => dispatch(fetchAdminProducts())}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Left: back */}
        <Link
          href="/admin/admin-products"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 group"
        >
          <ArrowLeft
            size={18}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Back to Products
        </Link>

        {/* Right: create button */}
        <Link
          href="/admin/create-product"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
        >
          <FiPlus className="mr-2" />
          Create Product
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="w-full md:w-48">
            <div className="relative">
              <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-5xl mb-4">📦</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No products found
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || selectedCategory !== "all"
                ? "Try adjusting your filters"
                : "Get started by adding your first product"}
            </p>
            {!searchTerm && selectedCategory === "all" && (
              <Link
                href="/admin/create-product"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
              >
                <FiPlus className="mr-2" />
                Add First Product
              </Link>
            )}
          </div>
        ) : (
          <ProductTable products={filteredProducts} />
        )}
      </div>
    </div>
  );
}
