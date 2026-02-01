"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, Loader2, ArrowRight, AlertCircle, ShoppingBag, CheckCircle2, ShieldPlus } from "lucide-react";
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
      <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-white">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md w-full"
        >
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center border border-green-100">
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </div>
          </div>
          <h2 className="text-4xl font-black text-gray-900 tracking-tighter mb-4">Protocol Success.</h2>
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-10">Your account has been initialized</p>
          <div className="flex items-center justify-center gap-3">
             <Loader2 className="w-5 h-5 text-gray-900 animate-spin" />
             <span className="text-xs font-black uppercase tracking-widest text-gray-900">Redirecting to login...</span>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-white">
       {/* Decorative Border Layer */}
       <div className="fixed inset-0 border-[24px] border-gray-50 pointer-events-none z-50 hidden lg:block" />
      
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-[540px] z-10"
      >
        <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-900 rounded-3xl text-white shadow-2xl shadow-gray-200 mb-8">
                <ShieldPlus size={32} strokeWidth={2.5} />
            </div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tighter mb-4">Initialize Account.</h1>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Enroll in the Global Console v2.0</p>
        </div>

        <div className="bg-white p-2 md:p-10 rounded-[3rem] border border-gray-50 md:shadow-2xl md:shadow-gray-100">
            <AnimatePresence mode="wait">
              {registerError && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="mb-8 p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 text-xs font-bold uppercase tracking-widest border border-red-100"
                >
                  <AlertCircle size={18} />
                  <p>{registerError}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Name Field */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                    <input
                        {...register("name", { required: "Name is required" })}
                        type="text"
                        placeholder="John Doe"
                        className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-gray-900 placeholder:text-gray-300 outline-none transition-all focus:bg-white focus:ring-4 focus:ring-gray-100 font-bold tracking-tight"
                    />
                    {errors.name && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest mt-2">{errors.name.message}</p>}
                  </div>

                  {/* Email Field */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email address</label>
                    <input
                        {...register("email", { 
                        required: "Email is required",
                        pattern: { value: /^\S+@\S+$/i, message: "Invalid email" }
                        })}
                        type="email"
                        placeholder="john@console.v2"
                        className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-gray-900 placeholder:text-gray-300 outline-none transition-all focus:bg-white focus:ring-4 focus:ring-gray-100 font-bold tracking-tight"
                    />
                    {errors.email && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest mt-2">{errors.email.message}</p>}
                  </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                   {/* Password Field */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Access Key</label>
                    <input
                        {...register("password", { 
                        required: "Password is required",
                        minLength: { value: 6, message: "At least 6 characters" }
                        })}
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-gray-900 placeholder:text-gray-300 outline-none transition-all focus:bg-white focus:ring-4 focus:ring-gray-100 font-bold tracking-tight"
                    />
                    {errors.password && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest mt-2">{errors.password.message}</p>}
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Confirm Key</label>
                    <input
                        {...register("confirmPassword", { 
                        required: "Required",
                        validate: val => val === password || "Mismatch"
                        })}
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-gray-900 placeholder:text-gray-300 outline-none transition-all focus:bg-white focus:ring-4 focus:ring-gray-100 font-bold tracking-tight"
                    />
                    {errors.confirmPassword && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest mt-2">{errors.confirmPassword.message}</p>}
                </div>
              </div>

              <div className="pt-4">
                <button
                  disabled={isSubmitting}
                  type="submit"
                  className="w-full bg-gray-900 hover:bg-black text-white py-5 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-gray-200 active:scale-[0.98] transition-all disabled:opacity-50 group"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span className="text-sm font-black uppercase tracking-widest">Processing...</span>
                    </>
                  ) : (
                    <>
                      <span className="text-sm font-black uppercase tracking-widest">Create Profile</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </form>
        </div>

        <div className="mt-12 text-center">
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-4">
                Already registered?
            </p>
            <Link 
                href="/auth/login" 
                className="inline-flex items-center text-gray-900 font-black text-sm tracking-tight hover:underline decoration-2 underline-offset-8"
            >
                Return to Login <ArrowRight size={16} className="ml-2" />
            </Link>
        </div>

        <p className="mt-16 text-center text-[10px] font-black uppercase tracking-[0.3em] text-gray-200">
            Secure Entry Protocol v2.0
        </p>
      </motion.div>
    </div>
  );
}
