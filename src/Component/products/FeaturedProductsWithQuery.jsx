"use client";

import { useFeaturedProducts } from "../../hooks/useProducts";
import FeaturedProducts from "./FeaturedProducts";

/* ---------------- SKELETON (PIXEL-STABLE) ---------------- */
function FeaturedProductsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-[360px] bg-white rounded-lg shadow p-4">
          <div className="h-48 bg-gray-200 rounded mb-4" />
          <div className="h-4 bg-gray-200 rounded mb-2" />
          <div className="h-4 bg-gray-200 rounded w-3/4" />
        </div>
      ))}
    </div>
  );
}

/* ---------------- DATA WRAPPER ---------------- */
export default function FeaturedProductsWithQuery({ addToCart }) {
  const { data, isLoading, error } = useFeaturedProducts();

  if (isLoading) return <FeaturedProductsSkeleton />;

  if (error) {
    return (
      <div className="h-[360px] flex items-center justify-center">
        <p className="text-red-500">Failed to load featured products</p>
      </div>
    );
  }

  return (
    <FeaturedProducts products={data?.products || []} addToCart={addToCart} />
  );
}
