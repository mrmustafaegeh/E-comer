// Component/products/HeroProductCard.jsx

import { m } from "framer-motion";
import { memo } from "react";
import Image from "next/image";

function HeroProductCard({ product }) {
  if (!product) return null;

  // ✅ Simplified animation - no complex floating
  const cardVariants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  const imageSrc = product.imageUrl;
  const fallbackEmoji = product.emoji;
  const isImageUrl =
    typeof imageSrc === "string" &&
    (imageSrc.startsWith("/") || imageSrc.startsWith("http"));

  const safeGradient =
    typeof product.gradient === "string" && product.gradient.trim().length > 0
      ? product.gradient
      : "from-blue-500 to-purple-600";

  const rating =
    product.rating !== undefined && product.rating !== null
      ? Number(product.rating)
      : null;

  return (
    <m.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      className="relative group"
    >
      {/* ✅ Static glow - no animation */}
      <div
        className={`absolute -inset-1 bg-gradient-to-r ${safeGradient} rounded-2xl blur opacity-30`}
      />

      {/* Card */}
      <div className="relative bg-gradient-to-br from-slate-900/90 to-slate-800/90 rounded-2xl p-8 backdrop-blur-xl border border-white/10">
        {/* ✅ Image with PROPER optimization for LCP */}
        <div className="aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-slate-800 to-slate-700 mb-6 flex items-center justify-center">
          {isImageUrl ? (
            <Image
              src={imageSrc}
              alt={product.title || "Product"}
              className="w-full h-full object-cover"
              priority // ✅ CRITICAL: Preload this image
              fetchPriority="high" // ✅ Browser hint
              width={528}
              height={528}
              quality={85}
              sizes="(max-width: 768px) 90vw, 528px"
              onError={(e) => {
                // ✅ Fallback on error
                e.currentTarget.style.display = "none";
                e.currentTarget.nextSibling.style.display = "flex";
              }}
            />
          ) : (
            <div className="text-9xl" aria-label={product.title}>
              {fallbackEmoji || "✨"}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-xl font-semibold text-white line-clamp-2">
              {product.title || "Untitled Product"}
            </h3>

            {rating !== null && !Number.isNaN(rating) && (
              <div
                className="flex items-center gap-1 shrink-0"
                aria-label={`Rating: ${rating} out of 5`}
              >
                <svg
                  className="w-5 h-5 text-yellow-400 fill-current"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
                <span className="text-white font-medium">
                  {rating.toFixed(1)}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-end justify-between">
            <div>
              {product.oldPrice && (
                <p className="text-sm text-gray-400 line-through">
                  {product.oldPrice}
                </p>
              )}
              <p className="text-2xl font-bold text-white">
                {product.price || ""}
              </p>
            </div>

            {product.discount && (
              <div
                className={`px-4 py-2 bg-gradient-to-r ${safeGradient} text-white text-sm font-bold rounded-full`}
              >
                {product.discount}
              </div>
            )}
          </div>
        </div>
      </div>
    </m.div>
  );
}

export default memo(HeroProductCard);
