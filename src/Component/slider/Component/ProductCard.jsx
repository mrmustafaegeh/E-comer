import { m } from "framer-motion";
import { memo } from "react";
import Image from "next/image";

function HeroProductCard({ product }) {
  if (!product) return null;

  const cardVariants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const imageSrc = product.imageUrl;
  const isImageUrl =
    typeof imageSrc === "string" &&
    (imageSrc.startsWith("/") || imageSrc.startsWith("http"));

  return (
    <m.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      className="relative group w-full max-w-md mx-auto"
    >
      {/* Soft shadow instead of glow */}
      <div className="absolute inset-0 bg-black/5 rounded-[2.5rem] blur-3xl transform translate-y-10" />

      {/* Card - Minimalist White or Transparent */}
      <div className="relative bg-white rounded-[2rem] p-6 shadow-2xl border border-gray-100 overflow-hidden">
        
        {/* Image Area */}
        <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-gray-50 mb-6">
          {isImageUrl ? (
            <Image
              src={imageSrc}
              alt={product.title || "Product"}
              className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700 ease-out"
              priority
              fetchPriority="high"
              width={600}
              height={750}
              quality={90}
              sizes="(max-width: 768px) 100vw, 500px"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                e.currentTarget.nextSibling.style.display = "flex";
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-6xl opacity-20">
              {product.emoji || "✨"}
            </div>
          )}
        </div>

        {/* Info Area - Clean Typography */}
        <div className="space-y-3 px-2">
          <div className="flex justify-between items-start">
             <h3 className="text-2xl font-medium text-gray-900 tracking-tight leading-tight">
              {product.title || "Untitled Product"}
            </h3>
            {product.discount && (
               <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase">
                 {product.discount}
               </span>
             )}
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-semibold text-gray-900 tracking-tight">
                {product.price || ""}
              </span>
              {product.oldPrice && (
                <span className="text-lg text-gray-400 line-through font-light">
                  {product.oldPrice}
                </span>
              )}
            </div>
            
            {/* Minimal Rating */}
            {product.rating > 0 && (
                <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full">
                  <span className="text-sm font-medium text-gray-900">{product.rating}</span>
                  <svg className="w-4 h-4 text-black fill-current" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                </div>
            )}
          </div>
        </div>
      </div>
    </m.div>
  );
}

export default memo(HeroProductCard);
