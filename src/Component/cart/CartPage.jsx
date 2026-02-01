"use client";

import { useCart } from "../../hooks/useCart";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShoppingCart } from "lucide-react";

const CartPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const {
    cartItems,
    removeFromCart,
    clearCart,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const parsePrice = (price) => {
    if (price == null || price === "") return 0;
    if (typeof price === "number" && !isNaN(price)) return price;
    const cleaned = String(price).replace(/[^0-9.-]+/g, "");
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  };

  const validatedCartItems = cartItems
    .map((item, idx) => {
      const itemPrice = item.offerPrice || item.price;
      return {
        ...item,
        id: item.id || item._id,
        name: item.name || item.title || "Unknown Product",
        price: parsePrice(itemPrice),
        qty: Math.max(1, Math.min(Number(item.qty) || 1, 99)),
        imgSrc: item.image || item.imgSrc,
      };
    })
    .filter((item) => item.price > 0);

  const total = validatedCartItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse space-y-4">
            <div className="h-10 w-48 bg-gray-100 rounded-full mx-auto" />
            <div className="h-64 w-[600px] bg-gray-50 rounded-[2rem]" />
        </div>
      </div>
    );
  }

  if (validatedCartItems.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-6">
        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-8 border border-gray-100">
            <ShoppingBag size={40} className="text-gray-300" />
        </div>
        <h1 className="text-4xl font-black text-gray-900 tracking-tighter mb-4">Your Bag is Empty.</h1>
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-10 text-center">Time to fill it with premium assets</p>
        <button
          onClick={() => router.push("/products")}
          className="flex items-center gap-3 px-10 py-5 bg-gray-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-gray-200 group"
        >
          Explore Collection <ArrowRight className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 md:py-32">
      <div className="flex flex-col md:flex-row gap-20">
        
        {/* Left: Cart Items */}
        <div className="flex-1">
          <header className="mb-12">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-4 block">Shopping Bag</span>
            <h1 className="text-5xl font-black text-gray-900 tracking-tighter">Your Selection.</h1>
          </header>

          <div className="space-y-12">
            <AnimatePresence>
              {validatedCartItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="group flex flex-col sm:flex-row items-start sm:items-center gap-8 pb-12 border-b border-gray-100 last:border-0"
                >
                  {/* Product Image */}
                  <div className="relative w-full sm:w-40 aspect-[4/5] bg-gray-50 rounded-[2rem] overflow-hidden border border-gray-100 flex-shrink-0 group-hover:shadow-2xl group-hover:shadow-gray-100 transition-all duration-700">
                    <Image
                      src={item.imgSrc || "/images/default-product.png"}
                      alt={item.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 w-full">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-1 group-hover:text-blue-600 transition-colors">
                          {item.name}
                        </h3>
                        {item.category && (
                           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.category}</p>
                        )}
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-6 mt-8">
                       {/* Quantity Controls */}
                       <div className="flex items-center gap-1 p-1 bg-gray-50 rounded-2xl border border-gray-100">
                          <button
                            onClick={() => decreaseQuantity(item.id)}
                            disabled={item.qty <= 1}
                            className="p-3 text-gray-400 hover:text-gray-900 hover:bg-white rounded-xl transition-all disabled:opacity-20"
                          >
                            <Minus size={16} strokeWidth={3} />
                          </button>
                          <span className="w-10 text-center text-sm font-black text-gray-900">{item.qty}</span>
                          <button
                            onClick={() => increaseQuantity(item.id)}
                            className="p-3 text-gray-400 hover:text-gray-900 hover:bg-white rounded-xl transition-all"
                          >
                            <Plus size={16} strokeWidth={3} />
                          </button>
                       </div>

                       <div className="text-right">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total</p>
                          <p className="text-xl font-black text-gray-900 tracking-tight">{formatPrice(item.price * item.qty)}</p>
                       </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Right: Summary */}
        <div className="w-full md:w-[400px]">
          <div className="sticky top-32 p-10 bg-gray-50 rounded-[3rem] border border-gray-100">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-8">Summary.</h2>
            
            <div className="space-y-6 pb-8 border-b border-gray-200/50">
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-gray-400 uppercase tracking-widest">Subtotal</span>
                <span className="font-black text-gray-900">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-gray-400 uppercase tracking-widest">Logistics</span>
                <span className="font-black text-green-600 uppercase">Complimentary</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-gray-400 uppercase tracking-widest">Tax (VAT)</span>
                <span className="font-black text-gray-900">Calculated at checkout</span>
              </div>
            </div>

            <div className="py-8 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-lg font-black text-gray-900 tracking-tight">Total Payment.</span>
                <span className="text-3xl font-black text-gray-900 tracking-tighter">{formatPrice(total)}</span>
              </div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Includes all relevant duties & taxes</p>
            </div>

            <button
               onClick={() => router.push("/checkout")}
               className="w-full bg-gray-900 text-white py-6 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-gray-200 mt-4 flex items-center justify-center gap-3 group"
            >
              Finalize Order <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>

            <button
               onClick={() => router.push("/products")}
               className="w-full py-4 text-xs font-black text-gray-400 uppercase tracking-widest hover:text-gray-900 transition-colors mt-6"
            >
              Continue Experience
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
