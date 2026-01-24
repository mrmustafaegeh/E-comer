"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, Loader2, ArrowRight, AlertCircle, ShoppingBag, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [registerError, setRegisterError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm();

  const password = watch("password");

  const onSubmit = async (data) => {
    try {
      setRegisterError("");
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setRegisterError(result.error || "Registration failed");
        return;
      }

      setIsSuccess(true);
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    } catch (error) {
      setRegisterError("An unexpected error occurred. Please try again.");
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#0A0A0B]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-12 text-center max-w-md w-full shadow-2xl"
        >
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-green-500/20 rounded-full">
              <CheckCircle2 className="w-12 h-12 text-green-400" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Account Created!</h2>
          <p className="text-gray-400 mb-8">Your premium account has been set up successfully. Redirecting to login...</p>
          <Loader2 className="w-6 h-6 text-purple-500 animate-spin mx-auto" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-[#0A0A0B]">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full" />
      
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
              <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Create Account</h1>
              <p className="text-gray-400">Join our exclusive community today</p>
            </div>

            <AnimatePresence mode="wait">
              {registerError && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl flex items-center gap-3 text-sm"
                >
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p>{registerError}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Name Field */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-300 ml-1">Full Name</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 transition-colors group-focus-within:text-purple-500">
                    <User className="w-5 h-5" />
                  </div>
                  <input
                    {...register("name", { required: "Name is required" })}
                    type="text"
                    placeholder="John Doe"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white placeholder:text-gray-600 outline-none transition-all focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 hover:bg-white/10"
                  />
                </div>
                {errors.name && <p className="text-red-400 text-xs ml-1">{errors.name.message}</p>}
              </div>

              {/* Email Field */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-300 ml-1">Email address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 transition-colors group-focus-within:text-purple-500">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    {...register("email", { 
                      required: "Email is required",
                      pattern: { value: /^\S+@\S+$/i, message: "Invalid email" }
                    })}
                    type="email"
                    placeholder="john@example.com"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white placeholder:text-gray-600 outline-none transition-all focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 hover:bg-white/10"
                  />
                </div>
                {errors.email && <p className="text-red-400 text-xs ml-1">{errors.email.message}</p>}
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-300 ml-1">Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 transition-colors group-focus-within:text-purple-500">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    {...register("password", { 
                      required: "Password is required",
                      minLength: { value: 6, message: "At least 6 characters" }
                    })}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white placeholder:text-gray-600 outline-none transition-all focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 hover:bg-white/10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                {errors.password && <p className="text-red-400 text-xs ml-1">{errors.password.message}</p>}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-300 ml-1">Confirm Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 transition-colors group-focus-within:text-purple-500">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    {...register("confirmPassword", { 
                      required: "Please confirm password",
                      validate: val => val === password || "Passwords do not match"
                    })}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white placeholder:text-gray-600 outline-none transition-all focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 hover:bg-white/10"
                  />
                </div>
                {errors.confirmPassword && <p className="text-red-400 text-xs ml-1">{errors.confirmPassword.message}</p>}
              </div>

              <div className="pt-2">
                <button
                  disabled={isSubmitting}
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Creating Profile...</span>
                    </>
                  ) : (
                    <>
                      <span>Create Account</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
          
          <div className="p-8 pt-4 text-center border-t border-white/5 bg-black/20">
            <p className="text-gray-400 text-sm">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-white font-semibold hover:text-purple-400 transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <p className="mt-8 text-center text-gray-500 text-xs uppercase tracking-widest font-medium">
          Premium Membership Access
        </p>
      </motion.div>
    </div>
  );
}
