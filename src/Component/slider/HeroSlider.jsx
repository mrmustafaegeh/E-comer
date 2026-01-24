"use client";

import { useState, useEffect, useRef, Suspense, useMemo, memo } from "react";
import {
  LazyMotion,
  domAnimation,
  m,
  AnimatePresence,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import dynamic from "next/dynamic";

// ✅ Critical LCP components - Static imports (render immediately)
import HeroTitle from "./Component/HeroTitle";
import CTAButtons from "./Component/CtpButton";
import ProductIndicators from "./Component/ProductIndicators";
import HeroProductSkeleton from "./Component/HeroProductSkeleton";

// ✅ Heavy component - Lazy loaded
const ProductCard = dynamic(() => import("./Component/ProductCard"), {
  loading: () => <div className="h-96 bg-gray-100 animate-pulse rounded-xl" />,
  ssr: false,
});

// ✅ Non-critical components - Lazy loaded with no SSR
const AnimatedBadge = dynamic(() => import("./Component/AnimatedBadge"), { 
  ssr: false,
  loading: () => null 
});

const StatsSection = dynamic(() => import("./Component/StatsComponent"), { 
  ssr: false,
  loading: () => null 
});

const FloatingBadges = dynamic(() => import("./Component/FloatingBadges"), { 
  ssr: false,
  loading: () => null 
});

// ✅ 3D Globe - Super lazy (only for high-end devices)
const Floating3DGlobe = dynamic(() => import("./Component/Floating3DGlobe"), {
  ssr: false,
  loading: () => null,
});

import { useHeroProducts } from "../../hooks/useProducts";

// ✅ Memoized ProductCard to prevent re-renders
const MemoizedProductCard = memo(ProductCard);

function AnimatedHeroSection() {
  const [activeProduct, setActiveProduct] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [show3D, setShow3D] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll();

  const { data, isLoading: loading, error } = useHeroProducts();
  const products = data?.products || [];

  // ✅ Simplified scroll animations (no spring for better performance)
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.2], [0, -30]);

  // ✅ Demo products - MEMOIZED (only created once)
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

  // ✅ Client-side hydration + 3D check (delayed)
  useEffect(() => {
    setIsClient(true);

    // ✅ Delay 3D loading until after paint
    const timer = setTimeout(() => {
      const isDesktop = window.innerWidth >= 1280; // xl breakpoint
      const hasGoodPerformance = navigator.hardwareConcurrency >= 4;
      const hasGoodConnection = 
        !navigator.connection || 
        navigator.connection.effectiveType === '4g';

      if (isDesktop && hasGoodPerformance && hasGoodConnection && !prefersReducedMotion) {
        setShow3D(true);
      }
    }, 2000); // Load 3D after 2 seconds

    return () => clearTimeout(timer);
  }, [prefersReducedMotion]);

  // ✅ Normalize products function (memoized)
  const normalizeHeroProducts = useMemo(() => {
    return (arr) =>
      (arr ?? []).map((p, idx) => ({
        id: p._id || p.id || `api-${idx}`,
        title: p.title || p.name || "Untitled Product",
        price: p.price ?? "",
        oldPrice: p.oldPrice ?? null,
        discount: p.discount ?? null,
        rating: typeof p.rating === "number" ? p.rating : Number(p.rating) || 4.8,
        imageUrl: p.imageUrl || null,
        emoji: p.emoji || "🛍️",
        gradient: p.gradient || "from-slate-700 to-slate-900",
      }));
  }, []);

  // ✅ Display products (memoized)
  const displayProducts = useMemo(() => {
    return loading
      ? defaultProducts
      : normalizeHeroProducts(products).length > 0
      ? normalizeHeroProducts(products)
      : defaultProducts;
  }, [products, loading, defaultProducts, normalizeHeroProducts]);

  // ✅ Auto-rotate products (optimized interval)
  useEffect(() => {
    if (!isClient || displayProducts.length <= 1 || prefersReducedMotion) return;

    const interval = setInterval(() => {
      setActiveProduct((prev) => (prev + 1) % displayProducts.length);
    }, 5000); // Increased to 5s for smoother experience

    return () => clearInterval(interval);
  }, [isClient, displayProducts.length, prefersReducedMotion]);

  // ✅ Simplified animation variants (faster, less complex)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08, // Reduced from 0.1
        delayChildren: 0.1,    // Reduced from 0.2
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 }, // Reduced from y: 20
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3, // Faster animation
        ease: "easeOut",
      },
    },
  };

  const currentProduct = displayProducts[activeProduct];

  // ✅ SSR Fallback (simplified)
  if (!isClient) {
    return (
      <div className="relative bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 overflow-hidden min-h-screen">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 min-h-screen flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center w-full">
            <div className="space-y-8 text-center lg:text-left">
              <div className="h-8 bg-gray-800/50 rounded-full w-40 animate-pulse mx-auto lg:mx-0" />
              <div className="space-y-4">
                <div className="h-16 bg-gray-800/50 rounded-lg animate-pulse" />
                <div className="h-16 bg-gray-800/50 rounded-lg animate-pulse" />
              </div>
            </div>
            <div className="relative">
              <div className="h-96 bg-gradient-to-br from-gray-900/50 to-gray-800/30 rounded-3xl animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <LazyMotion features={domAnimation}>
      <div
        ref={heroRef}
        className="hero-section relative bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 overflow-hidden"
      >
        {/* ✅ Simple gradient overlay (GPU-accelerated) */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-cyan-900/20 pointer-events-none" />
  
        {/* ✅ Floating 3D Globe (lazy loaded) */}
        {show3D && (
          <div className="hidden xl:block absolute right-10 top-1/2 -translate-y-1/2 w-[400px] h-[400px] z-5">
            <Suspense fallback={null}>
              <Floating3DGlobe
                products={displayProducts}
                activeProduct={activeProduct}
              />
            </Suspense>
          </div>
        )}
  
        <m.div
          style={prefersReducedMotion ? {} : { opacity, y }}
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 min-h-screen flex items-center"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center w-full">
            {/* ✅ Left Column */}
            <m.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-10 text-center lg:text-left"
            >
              <m.div variants={itemVariants}>
                <AnimatedBadge />
              </m.div>
  
              <m.div variants={itemVariants}>
                <HeroTitle />
              </m.div>
  
              <m.div variants={itemVariants}>
                <CTAButtons />
              </m.div>
  
              <m.div variants={itemVariants}>
                <StatsSection />
              </m.div>
            </m.div>
  
            {/* ✅ Right Column */}
            <m.div
              initial={prefersReducedMotion ? {} : { opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.4, // Faster
                ease: "easeOut",
                delay: 0.15, // Reduced delay
              }}
              className="relative"
            >
              {loading ? (
                <div className="product-card-3d relative">
                  <HeroProductSkeleton />
                </div>
              ) : (
                <>
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
  
                  <m.div className="product-card product-card-3d relative">
                    <AnimatePresence mode="wait">
                      <m.div
                        key={currentProduct?.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="relative"
                      >
                        <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-3xl blur-xl opacity-50" />
                        <MemoizedProductCard product={currentProduct} />
                      </m.div>
                    </AnimatePresence>
                  </m.div>
  
                  <m.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <FloatingBadges />
                  </m.div>
  
                  <m.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <ProductIndicators
                      products={displayProducts}
                      activeProduct={activeProduct}
                      setActiveProduct={setActiveProduct}
                    />
                  </m.div>
                </>
              )}
            </m.div>
          </div>
        </m.div>
  
        {/* ✅ Bottom Section (Categories) */}
        <div className="relative z-10 py-24 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <m.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.4 }}
              className="text-center"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  Featured
                </span>
                <span className="block">Categories</span>
              </h2>
  
              <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
                Explore our curated collection of premium products
              </p>
  
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {[
                  { name: "Electronics", icon: "💻" },
                  { name: "Fashion", icon: "👔" },
                  { name: "Home & Living", icon: "🏠" },
                ].map((category, idx) => (
                  <m.div
                    key={idx}
                    className="relative group"
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.08, duration: 0.4 }}
                    whileHover={prefersReducedMotion ? {} : { y: -4 }}
                  >
                    <div className="relative p-8 rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-white/10 backdrop-blur-xl h-full flex flex-col items-center justify-center text-center hover:bg-slate-800/80 transition-colors">
                      <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                        {category.icon}
                      </div>
  
                      <h3 className="text-xl font-bold text-white mb-2">
                        {category.name}
                      </h3>
  
                      <p className="text-gray-400 text-sm mb-4">
                        Discover amazing deals and new arrivals
                      </p>
  
                      <button className="px-5 py-2 rounded-full bg-slate-700/50 border border-slate-600/50 text-white text-sm font-medium transition-all group-hover:bg-cyan-500/20 group-hover:border-cyan-400/50 group-hover:text-cyan-300">
                        Explore Now
                      </button>
                    </div>
                  </m.div>
                ))}
              </div>
            </m.div>
          </div>
        </div>
      </div>
    </LazyMotion>
  );
}


export default memo(AnimatedHeroSection);