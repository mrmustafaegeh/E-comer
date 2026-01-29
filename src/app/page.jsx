
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';
import HeroSlider from "../Component/slider/HeroSlider";
import FeaturedProductsClient from "../Component/features/FeaturedProductsClient";
import { get } from "../services/api";

export const metadata = {
  title: "My Shop - Best Products for You",
  description: "Discover premium tech products and lifestyle essentials with unbeatable deals.",
  openGraph: {
    title: "My Shop - Best Products for You", 
    description: "Discover premium tech products and lifestyle essentials with unbeatable deals.",
    type: "website",
  }
};

async function getData() {
  try {
    // Parallel data fetching for performance
    const [heroRes, featuredRes] = await Promise.all([
      get("/hero-products").catch(err => {
        console.error("Hero fetch error:", err);
        return null; 
      }),
      get("/products/featured").catch(err => {
         console.error("Featured fetch error:", err);
         return null;
      })
    ]);

    return {
      heroProducts: heroRes?.products || [],
      // Handle different api responses (sometimes nested in products, sometimes direct array)
      featuredProducts: featuredRes?.products || (Array.isArray(featuredRes) ? featuredRes : [])
    };
  } catch (error) {
    console.error("Failed to fetch page data:", error);
    return { heroProducts: [], featuredProducts: [] };
  }
}

export default async function HomePage() {
  // Fetch data on the server (SSR)
  // This ensures the initial HTML contains the product data, improving SEO and LCP.
  const { heroProducts, featuredProducts } = await getData();

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
