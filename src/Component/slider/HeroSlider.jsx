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

// ✅ Lazy loaded components - strictly non-critical/interactive only
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

function AnimatedHeroSection({ initialProducts = [] }) {
  const [activeProduct, setActiveProduct] = useState(0);
  const heroRef = useRef(null);

  // ✅ Normalize Data with Memoization
  // Even though it comes from server, we ensure consistent shape
  const products = useMemo(() => {
    if (!initialProducts || initialProducts.length === 0) {
      // Demo fallback if server data fails
      return [
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
      ];
    }

    return initialProducts.map((p, idx) => ({
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
  }, [initialProducts]);

  // Handle auto-rotation
  useEffect(() => {
    if (products.length <= 1) return;

    const interval = setInterval(() => {
      setActiveProduct((prev) => (prev + 1) % products.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [products.length]);

  const currentProduct = products[activeProduct];

  return (
    <LazyMotion features={domAnimation}>
      <section
        ref={heroRef}
        className="hero-section relative bg-[#F1F2F4] overflow-hidden" 
        style={{ minHeight: "90vh" }}
        aria-label="Hero section"
      >
        {/* Subtle texture or noise if desired, but keeping it clean for now */}
        
        <div className="relative z-10 max-w-[1600px] mx-auto px-6 lg:px-12 py-20 min-h-[90vh] flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center w-full">
            {/* Left Column - Content */}
            <div className="space-y-8 text-center lg:text-left order-2 lg:order-1">
              <div className="min-h-[32px]">
                {/* 
                  Note: Suspense/Dynamic imports with ssr:false usually don't need Suspense on server, 
                  but strictly adhering to React boundaries is good.
                */}
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
              <div className="product-card product-card-3d relative">
                {/* 
                  AnimatePresence works on client. 
                  On server (SSR), it should simply render the initial child.
                  We ensure the first render matches the server data.
                */}
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
                products={products}
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
