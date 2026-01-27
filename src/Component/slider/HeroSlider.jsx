// Component/hero/AnimatedHeroSection.jsx
"use client";

import { useState, useEffect, useRef, Suspense, useMemo, memo } from "react";
import { LazyMotion, domAnimation, m, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

// ✅ Critical LCP - static import
import HeroProductCard from "./Component/ProductCard";
import HeroTitle from "./Component/HeroTitle";
import CTAButtons from "./Component/CtpButton";
import ProductIndicators from "./Component/ProductIndicators";
import FeaturedCategories from "../categories/FeaturedCategories";

// ✅ Lazy loaded components
const AnimatedBadge = dynamic(() => import("./Component/AnimatedBadge"), {
  ssr: false,
  loading: () => <div className="h-8 w-40" />,
});

const StatsSection = dynamic(() => import("./Component/StatsComponent"), {
  ssr: false,
  loading: () => <div className="h-24" />,
});

const FloatingBadges = dynamic(() => import("./Component/FloatingBadges"), {
  ssr: false,
  loading: () => null,
});

import { useHeroProducts } from "../../hooks/useProducts";

function AnimatedHeroSection() {
  const [activeProduct, setActiveProduct] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const heroRef = useRef(null);

  const { data, isLoading: loading, error } = useHeroProducts();
  const products = data?.products || [];

  // ✅ Demo products - MEMOIZED
  const defaultProducts = useMemo(
    () => [
      {
        id: "demo-1",
        title: "Wireless Headphones Pro",
        price: "$199.99",
        oldPrice: "$299.99",
        discount: "-33%",
        rating: 4.9,
        imageUrl: null,
        emoji: "🎧",
        gradient: "from-blue-500 to-purple-600",
      },
      {
        id: "demo-2",
        title: "Smart Watch Ultra",
        price: "$349.99",
        oldPrice: "$499.99",
        discount: "-30%",
        rating: 4.8,
        imageUrl: null,
        emoji: "⌚",
        gradient: "from-purple-500 to-pink-600",
      },
      {
        id: "demo-3",
        title: "Premium Camera 4K",
        price: "$899.99",
        oldPrice: "$1299.99",
        discount: "-31%",
        rating: 5.0,
        imageUrl: null,
        emoji: "📷",
        gradient: "from-pink-500 to-orange-600",
      },
    ],
    []
  );

  useEffect(() => {
    setIsClient(true);
  }, []);

  const normalizeHeroProducts = useMemo(() => {
    return (arr) =>
      (arr ?? []).map((p, idx) => ({
        id: p._id || p.id || `api-${idx}`,
        title: p.title || p.name || "Untitled Product",
        price: p.price ?? "",
        oldPrice: p.oldPrice ?? null,
        discount: p.discount ?? null,
        rating:
          typeof p.rating === "number" ? p.rating : Number(p.rating) || 4.8,
        imageUrl: p.imageUrl || null,
        emoji: p.emoji || "🛍️",
        gradient: p.gradient || "from-slate-700 to-slate-900",
      }));
  }, []);

  const displayProducts = useMemo(() => {
    return loading
      ? defaultProducts
      : normalizeHeroProducts(products).length > 0
        ? normalizeHeroProducts(products)
        : defaultProducts;
  }, [products, loading, defaultProducts, normalizeHeroProducts]);

  useEffect(() => {
    if (!isClient || displayProducts.length <= 1) return;

    const interval = setInterval(() => {
      setActiveProduct((prev) => (prev + 1) % displayProducts.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isClient, displayProducts.length]);

  const currentProduct = displayProducts[activeProduct];

  // ✅ SSR with RESERVED SPACE
  if (!isClient) {
    return (
      <div
        className="relative bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 overflow-hidden"
        style={{ minHeight: "100vh" }}
      >
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 min-h-screen flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center w-full">
            <div className="space-y-8 text-center lg:text-left">
              <div className="h-8 bg-gray-800/50 rounded-full w-40 mx-auto lg:mx-0" />
              <div className="space-y-4" style={{ minHeight: "200px" }}>
                <div className="h-16 bg-gray-800/50 rounded-lg" />
                <div className="h-16 bg-gray-800/50 rounded-lg" />
              </div>
              <div className="h-16" />
              <div className="h-24" />
            </div>
            <div className="relative" style={{ minHeight: "400px" }}>
              <div className="h-96 bg-gradient-to-br from-gray-900/50 to-gray-800/30 rounded-3xl" />
            </div>
          </div>
        </div>
        <div className="relative z-10 py-24" style={{ minHeight: "400px" }}>
          <div className="h-64 bg-gray-800/20 rounded-xl mx-auto max-w-4xl" />
        </div>
      </div>
    );
  }

  return (
    <LazyMotion features={domAnimation}>
      <section
        ref={heroRef}
        className="hero-section relative bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 overflow-hidden"
        style={{ minHeight: "100vh" }}
        aria-label="Hero section"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-cyan-900/20 pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 min-h-screen flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center w-full">
            {/* Left Column */}
            <div className="space-y-10 text-center lg:text-left">
              <div className="min-h-[32px]">
                <Suspense fallback={<div className="h-8" />}>
                  <AnimatedBadge />
                </Suspense>
              </div>

              <div className="min-h-[200px]">
                <HeroTitle />
              </div>

              <div className="min-h-[64px]">
                <CTAButtons />
              </div>

              <div className="min-h-[96px]">
                <Suspense fallback={<div className="h-24" />}>
                  <StatsSection />
                </Suspense>
              </div>
            </div>

            {/* Right Column */}
            <div className="relative" style={{ minHeight: "400px" }}>
              {error && (
                <m.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mb-6 p-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-2xl border border-yellow-500/30 backdrop-blur-sm"
                >
                  <p className="text-sm text-yellow-300">
                    ⚠️ Couldn't load products. Showing demo content.
                  </p>
                </m.div>
              )}

              <div className="product-card product-card-3d relative">
                <AnimatePresence mode="wait">
                  <m.div
                    key={currentProduct?.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="relative"
                  >
                    <HeroProductCard product={currentProduct} />
                  </m.div>
                </AnimatePresence>
              </div>

              <Suspense fallback={null}>
                <FloatingBadges />
              </Suspense>

              <ProductIndicators
                products={displayProducts}
                activeProduct={activeProduct}
                setActiveProduct={setActiveProduct}
              />
            </div>
          </div>
        </div>
        <FeaturedCategories />
      </section>
    </LazyMotion>
  );
}

export default memo(AnimatedHeroSection);
