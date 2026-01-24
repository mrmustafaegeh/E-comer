"use client";

import { useRouter } from "next/navigation";
import { useCart } from "../../hooks/useCart";
import { useWishlist } from "../../hooks/useWishlist";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

export default function ProductCard({ product }) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { wishlistItems, toggleWishlist } = useWishlist();
  const [isAdding, setIsAdding] = useState(false);

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
    toggleWishlist(product);
  };

  const discount = product.offerPrice
    ? Math.round(((product.price - product.offerPrice) / product.price) * 100)
    : 0;

  return (
    <div
      className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-indigo-200 cursor-pointer"
      onClick={() => router.push(`/products/${product._id}`)}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden bg-gray-50 aspect-square">
        <Image
          src={product.image || "/images/default-product.png"}
          alt={product.title}
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          quality={75} // ✅ Use 75 instead of 85
          loading="lazy"
          placeholder="blur"
          blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2YzZjRmNiIvPjwvc3ZnPg=="
        />
        {/* Badges */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start gap-2">
          {discount > 0 && (
            <span className="bg-red-500 text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-lg">
              -{discount}%
            </span>
          )}
          {product.rating >= 4.5 && (
            <span className="bg-yellow-400 text-gray-900 px-2.5 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
              <Star className="w-3 h-3 fill-current" />
              {product.rating}
            </span>
          )}
        </div>
        {/* Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-sm transition-all duration-300 ${
            isWishlisted
              ? "bg-red-500 text-white shadow-lg scale-110"
              : "bg-white/90 text-gray-600 hover:bg-red-500 hover:text-white hover:scale-110"
          }`}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`} />
        </button>
        {/* Quick Add Overlay */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4">
          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className="w-full bg-white text-gray-900 py-2.5 rounded-lg font-semibold text-sm hover:bg-gray-100 transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <ShoppingCart className="w-4 h-4" />
            {isAdding ? "Added!" : "Quick Add"}
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Category */}
        <p className="text-xs text-indigo-600 font-medium uppercase tracking-wide mb-1">
          {product.category}
        </p>

        {/* Title */}
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[2.5rem] group-hover:text-indigo-600 transition">
          {product.title}
        </h3>

        {/* Rating */}
        {product.rating > 0 && (
          <div className="flex items-center gap-1 mb-3">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < Math.floor(product.rating)
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-600 ml-1">
              {product.rating.toFixed(1)} ({product.numReviews || 0})
            </span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-gray-900">
              ${(product.offerPrice || product.price).toFixed(2)}
            </span>
            {product.offerPrice && (
              <span className="text-sm text-gray-400 line-through">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>

          {/* Stock Status */}
          {product.stock !== undefined && (
            <span
              className={`text-xs font-medium ${
                product.stock > 10
                  ? "text-green-600"
                  : product.stock > 0
                  ? "text-orange-600"
                  : "text-red-600"
              }`}
            >
              {product.stock > 0 ? "In Stock" : "Out of Stock"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
