"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "../../hooks/useCart";
import { useAuth } from "../../contexts/AuthContext";
import { post } from "../../services/api";
import { useTranslation } from "react-i18next";
import { ArrowLeft, CreditCard, MapPin, Truck, ShieldCheck, ArrowRight, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CheckoutPage() {
  return (
    <Suspense fallback={
        <div className="min-h-screen flex flex-col items-center justify-center bg-white">
            <Loader2 className="animate-spin w-10 h-10 text-gray-900 mb-4" />
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Constructing Checkout Terminal...</p>
        </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}

function CheckoutContent() {
  const router = useRouter();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    city: "",
    zipCode: "",
    country: "",
    paymentMethod: "cod",
  });

  useEffect(() => {
    if (cartItems.length === 0) {
      router.push("/cart");
    }
  }, [cartItems, router]);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: user.name || "",
      }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const calculateTotal = () => {
    const subtotal = Number(cartTotal) || 0;
    return subtotal;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!user) {
      setError("Protocol Error: Identity authentication required.");
      setLoading(false);
      return;
    }

    try {
      if (formData.paymentMethod === "stripe") {
        const response = await post("/checkout/session", {
          items: cartItems.map(item => ({
            id: item.id || item._id,
            name: item.name,
            price: item.price,
            qty: item.qty,
            imgSrc: item.imgSrc || item.image,
          })),
          email: user?.email,
        });

        if (response && response.url) {
          window.location.href = response.url;
          return;
        } else {
          throw new Error("No secure gateway URL returned.");
        }
      }

      const orderPayload = {
        userId: user.id || user._id,
        products: cartItems.map((item) => ({
          productId: item.id || item._id,
          name: item.name,
          quantity: item.qty,
          price: item.price,
          image: item.imgSrc || item.image,
        })),
        totalPrice: calculateTotal(),
        shippingAddress: {
          fullName: formData.fullName,
          address: formData.address,
          city: formData.city,
          zipCode: formData.zipCode,
          country: formData.country,
        },
        paymentMethod: formData.paymentMethod,
        status: "pending",
      };

      await post("/orders", orderPayload);
      clearCart();
      router.push("/orders/success");
    } catch (err) {
      setError(err.message || "Transmission Failure. Retry protocol.");
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) return null;

  return (
    <div className="min-h-screen bg-white">
      {/* Decorative Layer */}
      <div className="fixed inset-0 border-[24px] border-gray-50 pointer-events-none z-50 hidden lg:block" />
      
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-20 md:py-32 relative z-10">
        <header className="mb-20">
            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-gray-900 transition-colors mb-8"
            >
                <ArrowLeft size={14} strokeWidth={3} /> Return to Bag
            </button>
            <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter leading-none">Checkout.</h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 xl:gap-24">
          {/* Left: Input Segments */}
          <div className="lg:col-span-7 space-y-16">
            
            {/* 01 Logistics */}
            <section className="space-y-10">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                    <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">01 Logistic Destination</h2>
                    <ShieldCheck size={18} className="text-gray-200" />
                </div>
                
                <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Consignee Name</label>
                        <input name="fullName" required value={formData.fullName} onChange={handleInputChange} className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-gray-900 placeholder:text-gray-300 outline-none transition-all focus:bg-white focus:ring-4 focus:ring-gray-100 font-bold tracking-tight" placeholder="Full Legal Name" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Address Entry</label>
                        <input name="address" required value={formData.address} onChange={handleInputChange} className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-gray-900 placeholder:text-gray-300 outline-none transition-all focus:bg-white focus:ring-4 focus:ring-gray-100 font-bold tracking-tight" placeholder="Street, Apartment, Suite" />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Metropolis (City)</label>
                            <input name="city" required value={formData.city} onChange={handleInputChange} className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-gray-900 placeholder:text-gray-300 outline-none transition-all focus:bg-white focus:ring-4 focus:ring-gray-100 font-bold tracking-tight" placeholder="City" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Locality Code</label>
                            <input name="zipCode" required value={formData.zipCode} onChange={handleInputChange} className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-gray-900 placeholder:text-gray-300 outline-none transition-all focus:bg-white focus:ring-4 focus:ring-gray-100 font-bold tracking-tight" placeholder="000000" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Sovereign State (Country)</label>
                        <select name="country" required value={formData.country} onChange={handleInputChange} className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-gray-900 outline-none transition-all focus:bg-white focus:ring-4 focus:ring-gray-100 font-bold tracking-tight appearance-none">
                            <option value="">Select Territory</option>
                            <option value="US">United States</option>
                            <option value="CA">Canada</option>
                            <option value="UK">United Kingdom</option>
                            <option value="AU">Australia</option>
                        </select>
                    </div>
                </form>
            </section>

            {/* 02 Transaction */}
            <section className="space-y-10 pb-12">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                    <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">02 Transaction Protocol</h2>
                    <CreditCard size={18} className="text-gray-200" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className={`group flex items-center p-6 rounded-3xl cursor-pointer transition-all border-2 ${
                        formData.paymentMethod === "cod" ? "bg-gray-900 border-gray-900" : "bg-gray-50 border-gray-50 hover:bg-white hover:border-gray-200"
                    }`}>
                        <input type="radio" name="paymentMethod" value="cod" checked={formData.paymentMethod === "cod"} onChange={handleInputChange} className="hidden" />
                        <div className="flex-1">
                            <p className={`text-xs font-black uppercase tracking-widest mb-1 ${formData.paymentMethod === "cod" ? "text-white" : "text-gray-900"}`}>Terminal Delivery</p>
                            <p className={`text-[10px] font-bold ${formData.paymentMethod === "cod" ? "text-gray-400" : "text-gray-400"}`}>Pay on arrival</p>
                        </div>
                        <Truck className={formData.paymentMethod === "cod" ? "text-white" : "text-gray-300"} size={24} />
                    </label>

                    <label className={`group flex items-center p-6 rounded-3xl cursor-pointer transition-all border-2 ${
                        formData.paymentMethod === "stripe" ? "bg-gray-900 border-gray-900" : "bg-gray-50 border-gray-50 hover:bg-white hover:border-gray-200"
                    }`}>
                        <input type="radio" name="paymentMethod" value="stripe" checked={formData.paymentMethod === "stripe"} onChange={handleInputChange} className="hidden" />
                        <div className="flex-1">
                            <p className={`text-xs font-black uppercase tracking-widest mb-1 ${formData.paymentMethod === "stripe" ? "text-white" : "text-gray-900"}`}>Digital Clearance</p>
                            <p className={`text-[10px] font-bold ${formData.paymentMethod === "stripe" ? "text-gray-400" : "text-gray-400"}`}>Secure stripe gateway</p>
                        </div>
                        <CreditCard className={formData.paymentMethod === "stripe" ? "text-white" : "text-gray-300"} size={24} />
                    </label>
                </div>
            </section>
          </div>

          {/* Right: Summary */}
          <div className="lg:col-span-5">
            <div className="sticky top-32 space-y-8 bg-gray-50 p-8 md:p-12 rounded-[3rem] border border-gray-100">
                <div className="flex items-center justify-between border-b border-gray-200/50 pb-4">
                    <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Asset Verification</h2>
                    <span className="text-[10px] font-black text-gray-900 bg-white px-3 py-1 rounded-full border border-gray-200">{cartItems.length} IDs</span>
                </div>

                <div className="space-y-6 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                    {cartItems.map((item) => (
                        <div key={item.id} className="flex gap-6 items-center">
                            <div className="relative w-16 h-20 bg-white rounded-2xl overflow-hidden border border-gray-200 flex-shrink-0">
                                <img src={item.imgSrc || item.image || "/images/placeholder.png"} alt={item.name} className="w-full h-full object-cover" />
                                <div className="absolute inset-x-0 bottom-0 bg-gray-900/80 backdrop-blur-sm text-white text-[8px] font-black uppercase tracking-widest text-center py-1">QTY: {item.qty}</div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-black text-gray-900 tracking-tight truncate">{item.name}</h4>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">${Number(item.price).toFixed(2)} / Unit</p>
                            </div>
                            <div className="text-sm font-black text-gray-900 tracking-tighter">${(Number(item.price) * item.qty).toFixed(2)}</div>
                        </div>
                    ))}
                </div>

                <div className="space-y-4 pt-4 border-t border-gray-200/50">
                    <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-gray-400 uppercase tracking-widest">Asset Value</span>
                        <span className="font-black text-gray-900">${Number(cartTotal).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-gray-400 uppercase tracking-widest">Logistic Fee</span>
                        <span className="font-black text-green-600 uppercase tracking-widest text-[8px]">Waived</span>
                    </div>
                </div>

                <div className="pt-6 border-t border-gray-200/50">
                    <div className="flex justify-between items-end mb-8">
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Requirement</p>
                            <p className="text-4xl font-black text-gray-900 tracking-tighter">${calculateTotal().toFixed(2)}</p>
                        </div>
                        <ShieldCheck size={32} strokeWidth={1} className="text-gray-200" />
                    </div>

                    <AnimatePresence>
                        {error && (
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mb-6 p-4 bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest rounded-2xl border border-red-100">{error}</motion.div>
                        )}
                    </AnimatePresence>

                    <button
                        type="submit"
                        form="checkout-form"
                        disabled={loading || !user}
                        className="w-full bg-gray-900 text-white py-6 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-black transition-all shadow-2xl shadow-gray-200 flex items-center justify-center gap-3 group disabled:opacity-50"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin" size={18} strokeWidth={3} />
                                Processing...
                            </>
                        ) : (
                            <>
                                {formData.paymentMethod === "stripe" ? "Redirect to Gateway" : "Execute Order"}
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                    {!user && (
                        <p className="text-[8px] font-black text-center text-red-400 mt-4 uppercase tracking-[0.2em]">* Unauthorized: Identity synchronization required</p>
                    )}
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}