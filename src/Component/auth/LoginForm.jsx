// app/auth/login/page.jsx
"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "../../lib/validation";
import { useState } from "react";

export default function LoginPage() {
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
        setLoginError(result.error || "Login failed");
        return;
      }

      if (result.success) {
        // Refresh user context (will fetch from /api/auth/session)
        await refreshUser();
        // Redirect to dashboard
        router.push("/admin/dashboard");
        router.refresh(); // Refresh server components
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginError("Something went wrong. Please try again.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form className="w-full max-w-md p-6" onSubmit={handleSubmit(onSubmit)}>
        <h1 className="text-2xl font-bold mb-6">Login</h1>

        {loginError && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {loginError}
          </div>
        )}

        <div className="mb-4">
          <label className="block mb-2">Email</label>
          <input
            {...register("email")}
            type="email"
            className="w-full px-4 py-2 border rounded"
          />
          {errors.email && (
            <div className="text-red-500 text-sm mt-1">
              {errors.email.message}
            </div>
          )}
        </div>

        <div className="mb-6">
          <label className="block mb-2">Password</label>
          <input
            {...register("password")}
            type="password"
            className="w-full px-4 py-2 border rounded"
          />
          {errors.password && (
            <div className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </div>
          )}
        </div>

        <button
          disabled={isSubmitting}
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
