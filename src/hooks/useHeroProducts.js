import { useState, useEffect } from "react";

// Helper to get API URL
const getApiUrl = () => {
  if (typeof window !== "undefined") {
    // Client-side: use relative path for same-origin, full URL for different origin
    return process.env.NODE_ENV === "production"
      ? "/api/hero-products" // Same origin in production
      : "/api/hero-products"; // Use relative path
  }

  // Server-side: use environment variable
  return process.env.NEXT_PUBLIC_API_URL
    ? `${process.env.NEXT_PUBLIC_API_URL}/hero-products`
    : "/api/hero-products";
};

export function useHeroProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchHeroProducts() {
      try {
        setLoading(true);
        setError(null);

        const apiUrl = getApiUrl();
        console.log(`🖼️ Fetching hero products from: ${apiUrl}`);

        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-cache", // Prevent caching issues
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        console.log("Hero products response:", data);

        if (data.success && Array.isArray(data.products)) {
          setProducts(data.products);
        } else if (Array.isArray(data)) {
          // Handle case where API returns array directly
          setProducts(data);
        } else {
          console.warn("Unexpected response format:", data);
          setProducts([]);
        }
      } catch (err) {
        console.error("❌ Error fetching hero products:", {
          message: err.message,
          url: getApiUrl(),
          environment: process.env.NODE_ENV,
        });

        setError(err.message);
        setProducts([]); // Fallback to empty array
      } finally {
        setLoading(false);
      }
    }

    fetchHeroProducts();
  }, []);

  return { products, loading, error };
}
