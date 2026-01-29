import { Suspense } from 'react';
import HeroSlider from "../Component/slider/HeroSlider";
import FeaturedProductsClient from "../Component/features/FeaturedProductsClient";
import { getHeroProductsData } from "./api/hero-products/route";
import { getFeaturedProductsData } from "./api/products/featured/route";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "My Shop - Best Products for You",
  description: "Discover premium tech products and lifestyle essentials with unbeatable deals.",
  openGraph: {
    title: "My Shop - Best Products for You", 
    description: "Discover premium tech products and lifestyle essentials with unbeatable deals.",
    type: "website",
  }
};

export default async function HomePage() {
  // Fetch data directly from the database logic (Server Component Pattern)
  // This avoids internal API calls which can fail during build/deployment
  const [heroProducts, featuredProducts] = await Promise.all([
    getHeroProductsData(),
    getFeaturedProductsData()
  ]);

  return (
    <main className="bg-gray-50 min-h-screen">
      {/* 
        Hero Section:
        - Critical for LCP. 
        - We pass 'initialProducts' to avoid client-side waterfalls.
      */}
      <section className="relative min-h-[600px]">
        <HeroSlider initialProducts={heroProducts} />
      </section>

      {/* 
        Features Section:
        - Now fully server-rendered as well for better SEO key-phrase coverage
      */}
      <section className="max-w-7xl mx-auto px-4 py-16" id="features">
        <FeaturedProductsClient initialProducts={featuredProducts} />
      </section>
    </main>
  );
}
