"use client";

import { useState } from "react";
import Image from "next/image";
import { 
  Heart, 
  ShoppingCart, 
  Truck, 
  ShieldCheck, 
  Minus, 
  Plus, 
  ArrowRight,
  ChevronRight,
  Box,
  RefreshCcw,
  Zap,
  Info
} from "lucide-react";
import { useCart } from "../../hooks/useCart";
import { useWishlist } from "../../hooks/useWishlist";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function ProductDetailClient({ product }) {
  const { addToCart } = useCart();
  const { wishlistItems, toggleWishlist } = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isAdding, setIsAdding] = useState(false);

  const images = product.images?.length > 0 ? product.images : [product.image];
  const isWishlisted = wishlistItems?.some((item) => item._id === product._id);

  const handleAddToCart = async () => {
    setIsAdding(true);
    // Add multiple quantities if selected
    for (let i = 0; i < quantity; i++) {
        await addToCart({
            ...product,
            id: product._id,
            name: product.title,
            price: product.offerPrice || product.price,
            qty: 1
        });
    }
    setTimeout(() => setIsAdding(false), 1500);
  };

  const discount = product.offerPrice
    ? Math.round(((product.price - product.offerPrice) / product.price) * 100)
    : 0;

  return (
    <div className="bg-white">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-12 lg:py-24">
        
        {/* Navigation / Breadcrumbs */}
        <nav className="flex flex-wrap items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-16">
          <Link href="/" className="hover:text-gray-900 transition-colors">System Root</Link>
          <ChevronRight size={12} className="text-gray-200" />
          <Link href="/products" className="hover:text-gray-900 transition-colors">Archive</Link>
          <ChevronRight size={12} className="text-gray-200" />
          <span className="text-gray-900">{product.category}</span>
        </nav>

        <div className="grid lg:grid-cols-12 gap-16 xl:gap-24">
          
          {/* LEFT: Visual Showcase */}
          <div className="lg:col-span-7 space-y-10">
            <div className="relative aspect-[4/5] bg-gray-50 rounded-[3.5rem] overflow-hidden border border-gray-100 shadow-2xl shadow-gray-100 group">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedImage}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
                  className="w-full h-full"
                >
                  <Image
                    src={images[selectedImage]}
                    alt={product.title}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                    priority
                    unoptimized={true}
                    sizes="(max-width: 1024px) 100vw, 60vw"
                  />
                </motion.div>
              </AnimatePresence>

              {discount > 0 && (
                <div className="absolute top-10 left-10 bg-gray-900 text-white px-6 py-2.5 rounded-full font-black text-[10px] tracking-widest shadow-2xl">
                  YIELD -{discount}%
                </div>
              )}

              {product.stock <= 5 && product.stock > 0 && (
                <div className="absolute bottom-10 left-10 bg-white/90 backdrop-blur-sm px-6 py-2.5 rounded-full font-black text-[10px] tracking-widest text-red-600 shadow-xl border border-red-50">
                  CRITICAL: {product.stock} UNITS REMAINING
                </div>
              )}
            </div>

            {/* Gallery Navigation */}
            {images.length > 1 && (
              <div className="flex flex-wrap gap-4">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative w-24 h-32 rounded-3xl overflow-hidden border-2 transition-all duration-500 ${
                      selectedImage === idx 
                        ? "border-gray-900 scale-105 shadow-xl shadow-gray-200" 
                        : "border-transparent opacity-40 hover:opacity-100 scale-95 hover:scale-100"
                    }`}
                  >
                    <Image src={img} alt="Thumb" fill className="object-cover" unoptimized={true} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Data Specifications */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="space-y-12">
              <header className="space-y-6">
                <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black tracking-[0.3em] uppercase text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full">
                        {product.category}
                    </span>
                    <span className="text-[10px] font-black tracking-[0.3em] uppercase text-gray-400">
                        SKU: {(product._id || "REF-000").substring(0, 8).toUpperCase()}
                    </span>
                </div>
                
                <h1 className="text-5xl md:text-6xl xl:text-7xl font-black text-gray-900 tracking-tighter leading-[0.85] mb-8">
                  {product.title}.
                </h1>

                <div className="flex items-center gap-6">
                    <span className="text-4xl font-black text-gray-900 tracking-tighter">
                        ${(product.offerPrice || product.price).toFixed(2)}
                    </span>
                    {product.offerPrice && (
                        <span className="text-2xl text-gray-300 line-through font-bold tracking-tighter">
                            ${product.price.toFixed(2)}
                        </span>
                    )}
                </div>
              </header>

              <div className="text-lg text-gray-400 font-medium leading-relaxed max-w-md">
                {product.description || "A precision-engineered essential designed for high-performance integration within contemporary digital and physical ecosystems. Minimalist aesthetics meet maximum functional output."}
              </div>

              {/* Interaction Terminal */}
              <div className="space-y-8 pt-10 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                     <span className="text-[10px] font-black tracking-[0.2em] uppercase text-gray-300">Quantity Module</span>
                     <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
                        <button
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-400 hover:text-gray-900 hover:bg-white transition-all disabled:opacity-20"
                            disabled={quantity <= 1}
                        >
                            <Minus size={16} strokeWidth={3} />
                        </button>
                        <span className="w-10 text-center font-black text-gray-900">{quantity}</span>
                        <button
                            onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))}
                            className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-400 hover:text-gray-900 hover:bg-white transition-all"
                        >
                            <Plus size={16} strokeWidth={3} />
                        </button>
                     </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                        onClick={handleAddToCart}
                        disabled={isAdding || product.stock === 0}
                        className="flex-1 h-20 bg-gray-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-4 hover:bg-black shadow-2xl shadow-gray-200 active:scale-[0.98] transition-all duration-500 disabled:opacity-50 group"
                    >
                        {isAdding ? (
                            <>
                                <Loader2 className="animate-spin" size={20} strokeWidth={3} />
                                Synchronizing...
                            </>
                        ) : product.stock === 0 ? (
                            "Inventory Depleted"
                        ) : (
                            <>
                                <ShoppingCart size={20} strokeWidth={2.5} />
                                Execute Acquisition
                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                    <button
                        onClick={() => toggleWishlist(product)}
                        className={`w-20 h-20 rounded-[2rem] border-2 flex items-center justify-center transition-all duration-500 active:scale-95 ${
                            isWishlisted 
                            ? "bg-red-50 border-red-500 text-red-500" 
                            : "bg-gray-50 border-gray-50 text-gray-300 hover:bg-white hover:border-gray-900 hover:text-gray-900"
                        }`}
                    >
                        <Heart className={isWishlisted ? "fill-current" : ""} size={24} strokeWidth={2.5} />
                    </button>
                  </div>
              </div>

              {/* Protocol Details */}
              <div className="grid grid-cols-2 gap-x-8 gap-y-10 pt-12 border-t border-gray-100">
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-900 border border-gray-100">
                    <Zap size={20} />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Logistics</h4>
                    <p className="font-black text-xs text-gray-900">Priority Transit</p>
                  </div>
                </div>
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-900 border border-gray-100">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Authenticity</h4>
                    <p className="font-black text-xs text-gray-900">Verified Origin</p>
                  </div>
                </div>
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-900 border border-gray-100">
                    <RefreshCcw size={20} />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Returns</h4>
                    <p className="font-black text-xs text-gray-900">30-Cycle Window</p>
                  </div>
                </div>
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-900 border border-gray-100">
                    <Info size={20} />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Support</h4>
                    <p className="font-black text-xs text-gray-900">24/7 Terminal</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Loader2({ size, className, strokeWidth = 2 }) {
    return <svg className={`animate-spin ${className}`} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>;
}
