// src/components/admin/ProtectedAdmin.jsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function ProtectedAdmin({ children }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    // For development - check localStorage for auth
    const checkAuth = () => {
      // Check if user is logged in
      const isLoggedIn = localStorage.getItem("admin_logged_in") === "true";

      if (!isLoggedIn) {
        // If not logged in, check if we should auto-login for dev
        const devMode = process.env.NODE_ENV === "development";
        if (devMode) {
          // Auto-login for development
          localStorage.setItem("admin_logged_in", "true");
          localStorage.setItem(
            "admin_user",
            JSON.stringify({
              id: "1",
              name: "Admin User",
              email: "admin@example.com",
              isAdmin: true,
            })
          );
          setAuthenticated(true);
        } else {
          // Redirect to login in production
          router.push("/auth/signin");
        }
      } else {
        setAuthenticated(true);
      }

      setLoading(false);
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
          <p className="mt-2 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return null;
  }

  return <>{children}</>;
}
