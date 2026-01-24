// Centralized API configuration
export const apiConfig = {
  // Base URLs
  get baseUrl() {
    return (
      process.env.NEXT_PUBLIC_API_URL ||
      (process.env.NODE_ENV === "production"
        ? "https://e-comer-webside-1bo2.vercel.app/api"
        : "http://localhost:3000/api")
    );
  },

  get backendUrl() {
    return (
      process.env.NEXT_PUBLIC_BACKEND_URL ||
      (process.env.NODE_ENV === "production"
        ? "https://e-comer-webside-1bo2.vercel.app"
        : "http://localhost:3000")
    );
  },

  // Endpoints
  endpoints: {
    products: "/products",
    featured: "/featured",
    categories: "/categories",
    heroProducts: "/hero-products",
    search: "/products/search",
    auth: {
      login: "/auth/login",
      register: "/auth/register",
    },
    admin: {
      base: "/admin",
      products: "/admin/admin-products",
      users: "/admin/admin-users",
    },
  },

  // Full URL builder
  url(endpoint) {
    return `${this.baseUrl}${endpoint}`;
  },

  // Log configuration (development only)
  logConfig() {
    if (process.env.NODE_ENV === "development") {
      console.group("🔧 API Configuration");
      console.log("Base URL:", this.baseUrl);
      console.log("Backend URL:", this.backendUrl);
      console.log("Environment:", process.env.NODE_ENV);
      console.log("Public API URL:", process.env.NEXT_PUBLIC_API_URL);
      console.groupEnd();
    }
  },
};

// Initialize logging
if (typeof window !== "undefined") {
  apiConfig.logConfig();
}
