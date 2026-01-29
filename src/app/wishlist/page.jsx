// src/app/wishlist/page.jsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useWishlist } from "../../hooks/useWishlist";
import { useAuth } from "../../contexts/AuthContext";

export default function WishlistPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { wishlistItems, toggleWishlist } = useWishlist();

  // ✅ Protect the route
  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login?redirect=/wishlist");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect via useEffect
  }

  const items = Array.isArray(wishlistItems) ? wishlistItems : [];

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-gray-100 p-6 rounded-full mb-4">
          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold mb-2">Your wishlist is empty</h2>
        <p className="text-gray-500 mb-6">Start saving your favorite items for later!</p>
        <Link 
          href="/" 
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Explore Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
        <span className="text-gray-500">{items.length} items</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((product) => (
          <div 
            key={product._id || product.id} 
            className="group block bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="relative aspect-square bg-gray-100 overflow-hidden">
              <Link href={`/products/${product._id || product.id}`}>
                <Image
                  src={product.image || "/images/default-product.png"}
                  alt={product.title || "Product"}
                  width={500}
                  height={500}
                  quality={85}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                />
              </Link>
              
              <button
                onClick={(e) => {
                  e.preventDefault();
                  toggleWishlist(product);
                }}
                className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur rounded-full text-red-500 hover:bg-red-50 transition-colors shadow-sm"
                title="Remove from wishlist"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                  <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" fillRule="evenodd" />
                </svg>
              </button>
            </div>

            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                <Link href={`/products/${product._id || product.id}`}>
                  {product.title}
                </Link>
              </h3>
              
              <div className="flex items-baseline gap-2 mb-3">
                 <span className="text-lg font-bold text-blue-600">
                  ${product.price}
                 </span>
                 {product.oldPrice && (
                   <span className="text-sm text-gray-400 line-through">
                     ${product.oldPrice}
                   </span>
                 )}
              </div>

              <Link
                href={`/products/${product._id || product.id}`}
                className="block w-full text-center py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium text-sm"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
