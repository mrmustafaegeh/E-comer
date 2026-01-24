// src/app/(admin)/products/create/page.jsx
"use client";

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import ProductForm from "../../../Component/dashboard/ProductForm";
import ProtectedAdmin from "../../../Component/dashboard/ProtectedAdmin";
import { ArrowLeft, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { createAdminProduct } from "../../../store/adminProductSlice";

export default function AdminCreateProduct() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSave = async (data) => {
    setLoading(true);
    setError(null);

    try {
      const result = await dispatch(createAdminProduct(data)).unwrap();

      if (result?.id || result?._id) {
        // Success - redirect to products list
        setTimeout(() => {
          router.push("/admin/products");
          router.refresh();
        }, 1000);
      } else {
        throw new Error("Failed to create product - no ID returned");
      }
    } catch (err) {
      console.error("Failed to create product:", err);
      setError(
        err?.error ||
          err?.message ||
          "Failed to create product. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedAdmin>
      <div className="p-6 lg:p-8 max-w-6xl mx-auto">
        {/* Header with back button */}
        <div className="mb-8">
          <Link
            href="/admin/admin-products"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 group"
          >
            <ArrowLeft
              size={18}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Back to Products
          </Link>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-red-500 mt-0.5" size={20} />
              <div className="flex-1">
                <h3 className="font-semibold text-red-800">
                  Unable to Create Product
                </h3>
                <p className="text-red-600 text-sm mt-1">{error}</p>
                <button
                  onClick={() => setError(null)}
                  className="text-red-700 hover:text-red-800 text-sm font-medium mt-2"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Product Form */}
        <ProductForm initialValues={{}} onSaved={handleSave} />

        {/* Loading overlay */}
        {loading && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl p-8 max-w-sm mx-4">
              <div className="flex flex-col items-center">
                <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Creating Product
                </h3>
                <p className="text-gray-600 text-center">
                  Please wait while we save your product...
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedAdmin>
  );
}
