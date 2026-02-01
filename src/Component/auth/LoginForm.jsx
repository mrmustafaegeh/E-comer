"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "../../lib/validation";
import { useState } from "react";
import Link from "next/link";
import { Mail, Lock, Loader2, ArrowRight, AlertCircle, ShoppingBag, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { email: "mr.mustafaegeh@gmail.com" },
    resolver: zodResolver(LoginSchema),
  });

  const router = useRouter();
  const { refreshUser } = useAuth();
  const [loginError, setLoginError] = useState("");

  async function onSubmit(data) {
    try {
      setLoginError("");

      const response = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setLoginError(result.error || "Invalid credentials");
        return;
      }

      if (result.success) {
        await refreshUser();
        router.push("/admin/dashboard");
        router.refresh();
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginError("Unexpected error occurred. Please try again.");
    }
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-white">
      {/* Decorative Border Layer */}
      <div className="fixed inset-0 border-[24px] border-gray-50 pointer-events-none z-50 hidden lg:block" />
      
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-[480px] z-10"
      >
        <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-900 rounded-3xl text-white shadow-2xl shadow-gray-200 mb-8">
                <ShieldCheck size={32} strokeWidth={2.5} />
            </div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tighter mb-4">Access Console.</h1>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Identify yourself to proceed</p>
        </div>

        <div className="bg-white p-2 md:p-10 rounded-[2.5rem] border border-gray-50 md:shadow-2xl md:shadow-gray-100">
            <AnimatePresence mode="wait">
              {loginError && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="mb-8 p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 text-xs font-bold uppercase tracking-widest border border-red-100"
                >
                  <AlertCircle size={18} />
                  <p>{loginError}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Authentication ID (Email)</label>
                <div className="relative group">
                  <input
                    {...register("email")}
                    type="email"
                    placeholder="name@console.v2"
                    className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-gray-900 placeholder:text-gray-300 outline-none transition-all focus:bg-white focus:ring-4 focus:ring-gray-100 font-bold tracking-tight"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest mt-2 ml-1">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1 mb-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Access Key (Password)</label>
                </div>
                <div className="relative group focus-within:z-10">
                  <input
                    {...register("password")}
                    type="password"
                    placeholder="••••••••"
                    className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-gray-900 placeholder:text-gray-300 outline-none transition-all focus:bg-white focus:ring-4 focus:ring-gray-100 font-bold tracking-tight"
                  />
                </div>
                {errors.password && (
                  <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest mt-2 ml-1">{errors.password.message}</p>
                )}
              </div>

              <div className="pt-2">
                <button
                    disabled={isSubmitting}
                    type="submit"
                    className="w-full bg-gray-900 hover:bg-black text-white py-5 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-gray-200 active:scale-[0.98] transition-all disabled:opacity-50 disabled:active:scale-100 group"
                >
                    {isSubmitting ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span className="text-sm font-black uppercase tracking-widest">Verifying...</span>
                    </>
                    ) : (
                    <>
                        <span className="text-sm font-black uppercase tracking-widest">Execute Login</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                    )}
                </button>
              </div>
            </form>
        </div>

        <div className="mt-12 text-center">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-4">
                No credentials found?
            </p>
            <Link 
                href="/auth/register" 
                className="inline-flex items-center text-gray-900 font-black text-sm tracking-tight hover:underline decoration-2 underline-offset-8"
            >
                Create Global Account <ArrowRight size={16} className="ml-2" />
            </Link>
        </div>

        <p className="mt-20 text-center text-[10px] font-black uppercase tracking-[0.3em] text-gray-200">
            Secure Asset Retrieval Protocol v2.0
        </p>
      </motion.div>
    </div>
  );
}
