"use client";

import { useState, useEffect, useRef, Suspense, useMemo } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  useReducedMotion,
  useSpring,
} from "framer-motion";

// Your existing components
import AnimatedBadge from "./Component/AnimatedBadge";
import HeroTitle from "./Component/HeroTitle";
import CTAButtons from "./Component/CtpButton";
import StatsSection from "./Component/StatsComponent";
import ProductCard from "./Component/ProductCard";
import ProductIndicators from "./Component/ProductIndicators";
import FloatingBadges from "./Component/FloatingBadges";
import HeroProductSkeleton from "./Component/HeroProductSkeleton";
import { useHeroProducts } from "../../hooks/useHeroProducts";

// New 3D Components - LAZY LOADED
import dynamic from "next/dynamic";

const Floating3DGlobe = dynamic(() => import("./Component/Floating3DGlobe"), {
  ssr: false,
  loading: () => null,
});

export default function AnimatedHeroSection() {
  const [activeProduct, setActiveProduct] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isClient, setIsClient] = useState(false);
  const [show3D, setShow3D] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  // Refs to avoid forced reflows
  const heroRef = useRef(null);
  const animationFrameRef = useRef(null);
  const lastMouseUpdateRef = useRef(0);

  const { scrollYProgress } = useScroll();

  const { products, loading, error } = useHeroProducts();

  // Scroll animations with spring smoothing
  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  const smoothProgress = useSpring(scrollYProgress, springConfig);

  const opacity = useTransform(smoothProgress, [0, 0.3], [1, 0]);
  const scale = useTransform(smoothProgress, [0, 0.3], [1, 0.9]);
  const y = useTransform(smoothProgress, [0, 0.3], [0, -50]);

  // Demo products - MEMOIZED
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
        position: { x: -1, y: 0, z: 0 },
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
        position: { x: 0, y: 1, z: 0 },
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
        position: { x: 1, y: 0, z: 0 },
      },
    ],
    []
  );

  // Set client flag & 3D check
  useEffect(() => {
    setIsClient(true);

    // Delay 3D loading - use requestIdleCallback for better performance
    const idleCallback =
      window.requestIdleCallback || ((cb) => setTimeout(cb, 1));

    const handle = idleCallback(() => {
      const isDesktop = window.innerWidth >= 1024;
      // Simple check for modern device - rough proxy
      const hasGoodPerformance =
        typeof navigator !== "undefined" && navigator.hardwareConcurrency >= 4;

      if (isDesktop && hasGoodPerformance && !prefersReducedMotion) {
        setShow3D(true);
      }
    });

    return () => {
      if (window.cancelIdleCallback) {
        window.cancelIdleCallback(handle);
      } else {
        clearTimeout(handle);
      }
    };
  }, [prefersReducedMotion]);

  // OPTIMIZED Mouse tracking - batch reads/writes to avoid forced reflows
  useEffect(() => {
    if (!isClient || prefersReducedMotion) return;

    let pendingX = 0;
    let pendingY = 0;
    let ticking = false;

    const updateMousePosition = () => {
      setMousePosition({ x: pendingX, y: pendingY });
      ticking = false;
    };

    const handleMouseMove = (e) => {
      const now = performance.now();

      // Throttle to max 30fps (33ms)
      if (now - lastMouseUpdateRef.current < 33) return;
      lastMouseUpdateRef.current = now;

      // Normalize to -1 to 1
      pendingX = (e.clientX / window.innerWidth) * 2 - 1;
      pendingY = (e.clientY / window.innerHeight) * 2 - 1;

      if (!ticking) {
        ticking = true;
        animationFrameRef.current = requestAnimationFrame(updateMousePosition);
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isClient, prefersReducedMotion]);

  // Normalize products - MEMOIZED
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
        position: {
          x: Math.cos((idx / 3) * Math.PI * 2),
          y: Math.sin((idx / 3) * Math.PI * 2),
          z: 0,
        },
      }));
  }, []);

  const displayProducts = useMemo(() => {
    return loading
      ? defaultProducts
      : normalizeHeroProducts(products).length > 0
      ? normalizeHeroProducts(products)
      : defaultProducts;
  }, [products, loading, defaultProducts, normalizeHeroProducts]);

  // Auto-rotate products
  useEffect(() => {
    if (!isClient || displayProducts.length <= 1 || prefersReducedMotion)
      return;

    const interval = setInterval(() => {
      setActiveProduct((prev) => (prev + 1) % displayProducts.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isClient, displayProducts.length, prefersReducedMotion]);

  // Framer Motion Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  const currentProduct = displayProducts[activeProduct];

  // SSR Fallback
  if (!isClient) {
    return (
      <div className="relative bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 overflow-hidden min-h-screen">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 min-h-screen flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center w-full">
            <div className="space-y-8 text-center lg:text-left">
              <div className="h-8 bg-gray-800/50 rounded-full w-40 animate-pulse mx-auto lg:mx-0"></div>
              <div className="space-y-4">
                <div className="h-16 bg-gray-800/50 rounded-lg animate-pulse"></div>
                <div className="h-16 bg-gray-800/50 rounded-lg animate-pulse"></div>
              </div>
            </div>
            <div className="relative">
              <div className="h-96 bg-gradient-to-br from-gray-900/50 to-gray-800/30 rounded-3xl animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={heroRef}
      className="hero-section relative bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 overflow-hidden"
    >
      {/* Simple gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-cyan-900/20 pointer-events-none" />

      {/* Floating 3D Globe */}
      {show3D && (
        <div
          className="hidden xl:block absolute right-10 top-1/2 -translate-y-1/2 w-[400px] h-[400px] z-5"
          style={{ willChange: "transform", transform: "translateZ(0)" }}
        >
          <Suspense fallback={null}>
            <Floating3DGlobe
              products={displayProducts}
              activeProduct={activeProduct}
              mousePosition={mousePosition}
            />
          </Suspense>
        </div>
      )}

      <motion.div
        style={prefersReducedMotion ? {} : { opacity, scale, y }}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 min-h-screen flex items-center"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center w-full">
          {/* Left Column */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-10 text-center lg:text-left"
          >
            <motion.div variants={itemVariants} className="hero-badge">
              <AnimatedBadge />
            </motion.div>

            <motion.div variants={itemVariants} className="hero-title">
              <HeroTitle />
            </motion.div>

            <motion.div variants={itemVariants}>
              <CTAButtons />
            </motion.div>

            <motion.div variants={itemVariants}>
              <StatsSection />
            </motion.div>
          </motion.div>

          {/* Right Column */}
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.8,
              type: "spring",
              bounce: 0.2,
              delay: 0.3,
            }}
            className="relative"
            style={{ willChange: "transform", transform: "translateZ(0)" }}
          >
            {loading ? (
              <div className="product-card-3d relative">
                <HeroProductSkeleton />
              </div>
            ) : (
              <>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-6 p-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-2xl border border-yellow-500/30 backdrop-blur-sm"
                  >
                    <p className="text-sm text-yellow-300">
                      ⚠️ Couldn't load products. Showing demo content.
                    </p>
                  </motion.div>
                )}

                <motion.div
                  className="product-card product-card-3d relative"
                  style={{ contain: "layout style paint" }}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentProduct?.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                      className="relative"
                    >
                      <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-3xl blur-xl opacity-50" />
                      <ProductCard product={currentProduct} />
                    </motion.div>
                  </AnimatePresence>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <FloatingBadges />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <ProductIndicators
                    products={displayProducts}
                    activeProduct={activeProduct}
                    setActiveProduct={setActiveProduct}
                  />
                </motion.div>
              </>
            )}
          </motion.div>
        </div>
      </motion.div>

      {/* Bottom Section */}
      <div
        className="relative z-10 py-24 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"
        style={{ contain: "layout style paint" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
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
              {["Electronics", "Fashion", "Home & Living"].map(
                (category, idx) => (
                  <motion.div
                    key={idx}
                    className="relative group"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1, duration: 0.5 }}
                    whileHover={prefersReducedMotion ? {} : { y: -5 }}
                    style={{
                      willChange: "transform",
                      contain: "layout style paint",
                    }}
                  >
                    <div className="relative p-8 rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-white/10 backdrop-blur-xl h-full flex flex-col items-center justify-center text-center hover:bg-slate-800/80 transition-colors">
                      <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                        {idx === 0 ? "💻" : idx === 1 ? "👔" : "🏠"}
                      </div>

                      <h3 className="text-xl font-bold text-white mb-2">
                        {category}
                      </h3>

                      <p className="text-gray-400 text-sm mb-4">
                        Discover amazing deals and new arrivals
                      </p>

                      <button className="px-5 py-2 rounded-full bg-slate-700/50 border border-slate-600/50 text-white text-sm font-medium transition-all group-hover:bg-cyan-500/20 group-hover:border-cyan-400/50 group-hover:text-cyan-300">
                        Explore Now
                      </button>
                    </div>
                  </motion.div>
                )
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
