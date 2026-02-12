// Component/products/ProductCard.jsx
"use client";

import { useRouter } from "next/navigation";
import { useCart } from "../../hooks/useCart";
import { useWishlist } from "../../hooks/useWishlist";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { useState, memo } from "react";
import Image from "next/image";

import { useAuth } from "../../contexts/AuthContext"; // ✅ Added import

function ProductCard({ product }) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { wishlistItems, toggleWishlist } = useWishlist();
  const { user } = useAuth(); // ✅ Get user
  const [isAdding, setIsAdding] = useState(false);
  const [imageError, setImageError] = useState(false);

  const safeWishlist = wishlistItems ?? [];
  const isWishlisted = safeWishlist.some((item) => item._id === product._id);

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    setIsAdding(true);

    const cartProduct = {
      ...product,
      id: product._id,
      name: product.title,
      price: product.offerPrice || product.price,
      qty: 1,
    };

    await addToCart(cartProduct);
    setTimeout(() => setIsAdding(false), 1000);
  };

  const handleToggleWishlist = (e) => {
    e.stopPropagation();
    
    // ✅ Enforce Login for Wishlist
    if (!user) {
      router.push("/auth/login?redirect=/wishlist"); 
      return;
    }

    toggleWishlist(product);
  };

  const discount = product.offerPrice
    ? Math.round(((product.price - product.offerPrice) / product.price) * 100)
    : 0;

  return (
    <article
      className="group bg-white rounded-none border border-transparent hover:border-gray-200 transition-all duration-300 cursor-pointer relative"
      onClick={() => router.push(`/products/${product.slug || product._id}`)}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden aspect-[4/5] bg-[#F4F4F5]">
        {!imageError ? (
          <Image
            src={product.image || "/images/default-product.png"}
            alt={product.title}
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            quality={80}
            loading="lazy"
            unoptimized={true}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
             <span className="text-4xl text-gray-300">✦</span>
          </div>
        )}

        {/* Badges - Minimal Top Left */}
        <div className="absolute top-0 left-0 p-3 flex flex-col gap-2 pointer-events-none">
          {discount > 0 && (
            <span className="bg-white text-black text-[10px] font-bold uppercase tracking-widest px-2 py-1 shadow-sm">
              Sale -{discount}%
            </span>
          )}
          {product.rating >= 4.8 && (
            <span className="bg-black text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1 shadow-sm">
              Best Seller
            </span>
          )}
        </div>

        {/* Wishlist Button - Hidden until hover to reduce clutter */}
        <button
          onClick={handleToggleWishlist}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-300 z-20 ${
            isWishlisted
              ? "bg-white text-red-500 shadow-sm opacity-100"
              : "bg-white/80 text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0"
          }`}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`} />
        </button>

        {/* Quick Add - Slide Up */}
        <div className="absolute inset-x-0 bottom-0 z-20 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className="w-full bg-black text-white py-3 font-medium text-xs uppercase tracking-widest hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
             {isAdding ? "Adding..." : "Add to Cart"}
          </button>
        </div>
      </div>

      {/* Product Info - Clean & Editorial */}
      <div className="pt-4 pb-2 px-1">
        
        {/* Title */}
        <h3 className="font-medium text-gray-900 mb-1 text-base leading-snug group-hover:underline decoration-1 underline-offset-4 decoration-gray-300 transition-all">
          {product.title}
        </h3>

        {/* Price & Rating Row */}
        <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
                <span className="text-sm font-semibold text-gray-900">
                ${(product.offerPrice || product.price).toFixed(2)}
                </span>
                {product.offerPrice && (
                <span className="text-xs text-gray-400 line-through">
                    ${product.price.toFixed(2)}
                </span>
                )}
            </div>

            {/* Minimal Stock Dot */}
            {product.stock !== undefined && (
                <div className={`w-1.5 h-1.5 rounded-full ${product.stock > 0 ? "bg-green-500" : "bg-red-500"}`} title={product.stock > 0 ? "In Stock" : "Out of Stock"} />
            )}
        </div>

        {/* Category (Optional, Keep it very subtle) */}
        <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest mt-1">
          {product.category}
        </p>
      </div>
    </article>
  );
}

export default memo(ProductCard);