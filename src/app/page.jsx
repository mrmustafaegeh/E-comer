"use client";

import { Suspense } from "react";
import HeroSlider from "../Component/slider/HeroSlider";
import FeaturedProducts from "../Component/products/FeaturedProducts";
import NewsletterSignup from "../Component/features/NewLetterSignup";
import { useCart } from "../hooks/useCart";
import { useFeaturedProducts } from "../hooks/useProducts";

// Loading skeleton component
function FeaturedProductsSkeleton() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="animate-pulse bg-white rounded-lg shadow p-4"
          >
            <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
            <div className="bg-gray-200 h-4 rounded mb-2"></div>
            <div className="bg-gray-200 h-4 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function HomePage() {
  const { addToCart } = useCart();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <Suspense
        fallback={<div className="min-h-[60vh] bg-gray-100 animate-pulse" />}
      >
        <HeroSlider />
      </Suspense>

      {/* Featured Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Featured Products
          </h2>
          <p className="text-gray-600">Check out our top-rated products</p>
        </div>

        <Suspense fallback={<FeaturedProductsSkeleton />}>
          <FeaturedProductsWithQuery addToCart={addToCart} />
        </Suspense>
      </section>

      {/* Newsletter */}
      <NewsletterSignup />
    </div>
  );
}

// Separate component to use the hook
function FeaturedProductsWithQuery({ addToCart }) {
  const { data, isLoading, error } = useFeaturedProducts();

  if (isLoading) {
    return <FeaturedProductsSkeleton />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Failed to load featured products</p>
      </div>
    );
  }

  const products = data?.products || [];

  return <FeaturedProducts products={products} addToCart={addToCart} />;
}
