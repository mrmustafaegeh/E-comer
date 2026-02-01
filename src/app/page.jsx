import { Suspense } from 'react';
import HeroSlider from "../Component/slider/HeroSlider";
import FeaturedProductsClient from "../Component/features/FeaturedProductsClient";
import { getHeroProductsData, getFeaturedProductsData } from "@/services/productService";

import CategorySection from "../Component/home/CategorySection";
import ValueProps from "../Component/home/ValueProps";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Premium Tech & Lifestyle | QuickCart",
  description: "Discover premium tech products and lifestyle essentials with unbeatable deals.",
  openGraph: {
    title: "Premium Tech & Lifestyle | QuickCart", 
    description: "Discover premium tech products and lifestyle essentials with unbeatable deals.",
    type: "website",
  }
};

export default async function HomePage() {
  const [heroProducts, featuredProducts] = await Promise.all([
    getHeroProductsData(),
    getFeaturedProductsData()
  ]);

  return (
    <main className="bg-white min-h-screen">
      {/* 1. Hero Section */}
      <section className="relative min-h-[500px] md:min-h-[600px]">
        <HeroSlider initialProducts={heroProducts} />
      </section>

      {/* 2. Trust Section (Value Props) */}
      <ValueProps />

      {/* 3. Featured Products */}
      <section className="max-w-7xl mx-auto px-6 py-20 md:py-32" id="features">
        <div className="mb-16">
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-gray-400 mb-4 block">
            The Collection
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
            Featured Designs.
          </h2>
        </div>
        <FeaturedProductsClient initialProducts={featuredProducts} />
      </section>

      {/* 4. Editorial Categories Section */}
      <CategorySection />
    </main>
  );
}
