"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, ArrowRight, ShoppingBag, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function OrderSuccessPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Border Layer */}
      <div className="fixed inset-0 border-[24px] border-gray-50 pointer-events-none z-50 hidden lg:block" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-[500px] w-full text-center relative z-10"
      >
        <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-900 rounded-[2.5rem] text-white shadow-2xl shadow-gray-200 mb-10 border-4 border-white">
            <ShieldCheck size={44} strokeWidth={2.5} />
        </div>

        <h1 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tighter mb-6 leading-none">
          Protocol <br /> Completed.
        </h1>
        
        <p className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em] mb-12 max-w-sm mx-auto leading-relaxed">
          Transaction successfully validated and logged. Your assets are being prepared for dispatch.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/products"
            className="flex items-center justify-center gap-2 px-8 py-5 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-gray-200 group"
          >
            New Acquisition <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-8 py-5 bg-white border border-gray-100 text-gray-400 hover:text-gray-900 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
          >
            System Root
          </Link>
        </div>

        <div className="mt-24 pt-8 border-t border-gray-50">
             <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-200">
                Logistics Confirmation v2.0 // Success Code 201
            </p>
        </div>
      </motion.div>
    </div>
  );
}
