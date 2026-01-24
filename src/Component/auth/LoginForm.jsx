"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "../../lib/validation";
import { useState } from "react";
import Link from "next/link";
import { Mail, Lock, Loader2, ArrowRight, AlertCircle, ShoppingBag } from "lucide-react";
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
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-[#0A0A0B]">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="relative z-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-8 pb-4">
            <div className="flex justify-center mb-6">
              <div className="p-3 bg-gradient-to-tr from-purple-500 to-blue-500 rounded-2xl shadow-lg ring-4 ring-white/5">
                <ShoppingBag className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <div className="text-center mb-10">
              <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Welcome Back</h1>
              <p className="text-gray-400">Sign in to manage your premium store</p>
            </div>

            <AnimatePresence mode="wait">
              {loginError && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl flex items-center gap-3 text-sm"
                >
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p>{loginError}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 ml-1">Email address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-purple-500 text-gray-500">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    {...register("email")}
                    type="email"
                    placeholder="name@company.com"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white placeholder:text-gray-600 outline-none transition-all focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 hover:bg-white/10"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-400 text-xs mt-1 ml-1">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-sm font-medium text-gray-300">Password</label>
                  <Link href="/auth/forgot-password" size="sm" className="text-xs text-purple-400 hover:text-purple-300 transition-colors">
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-purple-500 text-gray-500">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    {...register("password")}
                    type="password"
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white placeholder:text-gray-600 outline-none transition-all focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 hover:bg-white/10"
                  />
                </div>
                {errors.password && (
                  <p className="text-red-400 text-xs mt-1 ml-1">{errors.password.message}</p>
                )}
              </div>

              <div className="flex items-center space-x-2 ml-1">
                <input
                  type="checkbox"
                  id="remember"
                  className="rounded-md bg-white/5 border-white/10 text-purple-500 focus:ring-purple-500/50 transition-colors"
                />
                <label htmlFor="remember" className="text-sm text-gray-400 cursor-pointer">Remember me for 30 days</label>
              </div>

              <button
                disabled={isSubmitting}
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:active:scale-100"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          </div>
          
          <div className="p-8 pt-4 text-center border-t border-white/5 bg-black/20">
            <p className="text-gray-400 text-sm">
              Don't have an account?{" "}
              <Link href="/auth/register" className="text-white font-semibold hover:text-purple-400 transition-colors">
                Create an account
              </Link>
            </p>
          </div>
        </div>

        {/* Footer info */}
        <p className="mt-8 text-center text-gray-500 text-xs uppercase tracking-widest font-medium">
          Secure Cloud Authentication
        </p>
      </motion.div>
    </div>
  );
}
