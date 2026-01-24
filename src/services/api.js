import axios from "axios";

// Get the correct API URL based on environment
const getApiBaseUrl = () => {
  // For Next.js API routes, just use /api (relative path)
  if (typeof window !== "undefined") {
    return "/api"; // Client-side: always use relative path
  }

  // Server-side
  return (
    process.env.NEXT_PUBLIC_API_URL ||
    (process.env.NODE_ENV === "production"
      ? "https://e-comer-webside-1bo2.vercel.app/api"
      : "http://localhost:3000/api")
  );
};

const getBackendBaseUrl = () => {
  if (typeof window !== "undefined") {
    return ""; // Client-side: use relative paths
  }

  return (
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    (process.env.NODE_ENV === "production"
      ? "https://e-comer-webside-1bo2.vercel.app"
      : "http://localhost:3000")
  );
};

// Log API configuration for debugging
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  console.log("🔧 API Configuration:");
  console.log("Environment:", process.env.NODE_ENV);
  console.log("API Base URL:", getApiBaseUrl());
  console.log("Backend URL:", getBackendBaseUrl());
}

// First instance - for external APIs if needed
export const backend = axios.create({
  baseURL: getBackendBaseUrl(),
  headers: { "Content-Type": "application/json" },
});

backend.interceptors.request.use(
  (config) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Second instance - for internal Next.js API routes
const api = axios.create({
  baseURL: getApiBaseUrl(), // This is already /api
  headers: {
    "Content-Type": "application/json",
    "X-Environment": process.env.NODE_ENV || "development",
  },
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) config.headers.Authorization = `Bearer ${token}`;

    // Log API calls in development
    if (process.env.NODE_ENV === "development") {
      console.log(
        `📡 API Call: ${config.method?.toUpperCase()} ${config.baseURL}${
          config.url
        }`
      );
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === "ECONNABORTED") {
      console.error("API Timeout:", error.config.url);
      throw { message: "Request timeout. Please try again." };
    }

    if (!error.response) {
      console.error("Network Error:", error.message);
      throw { message: "Network error. Please check your connection." };
    }

    return Promise.reject(error);
  }
);

export const handleRequest = async (request) => {
  try {
    const res = await request();
    return res.data;
  } catch (error) {
    console.error("API Error Details:", {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      environment: process.env.NODE_ENV,
    });

    throw (
      error.response?.data || {
        message: "Something went wrong. Please try again.",
        code: "NETWORK_ERROR",
      }
    );
  }
};

// BETTER: Keep slashes, remove the cleaning
export const get = async (url, params = {}) => {
  try {
    // Don't clean the URL - just use it as-is
    const res = await api.get(url, { params });
    return res.data;
  } catch (error) {
    console.error(`GET ${url} error:`, {
      status: error.response?.status,
      data: error.response?.data,
      environment: process.env.NODE_ENV,
    });
    throw (
      error.response?.data || {
        message: "Failed to fetch data",
        code: "GET_ERROR",
      }
    );
  }
};

export const post = async (url, data = {}) => {
  try {
    const res = await api.post(url, data);
    return res.data;
  } catch (error) {
    console.error(`POST ${url} error:`, error.response?.data || error.message);
    throw (
      error.response?.data || {
        message: "Failed to create resource",
        code: "POST_ERROR",
      }
    );
  }
};

export const put = async (url, data = {}) => {
  try {
    const res = await api.put(url, data);
    return res.data;
  } catch (error) {
    console.error(`PUT ${url} error:`, error.response?.data || error.message);
    throw (
      error.response?.data || {
        message: "Failed to update resource",
        code: "PUT_ERROR",
      }
    );
  }
};

export const del = async (url, data = {}) => {
  try {
    const res = await api.delete(url, { data });
    return res.data;
  } catch (error) {
    console.error(
      `DELETE ${url} error:`,
      error.response?.data || error.message
    );
    throw (
      error.response?.data || {
        message: "Failed to delete resource",
        code: "DELETE_ERROR",
      }
    );
  }
};
// Product API methods
export const productAPI = {
  getFeaturedProducts: async () => get("/products/featured"), // ✅ Add leading slash
  getProductById: async (id) => get(`/products/${id}`),
  getProducts: async (params) => get("/products", params), // ✅ Add leading slash
  getCategories: async () => {
    try {
      return await get("/category"); // ✅ Add leading slash
    } catch (error) {
      const response = await get("/products");
      const products = response.products || response || [];
      if (Array.isArray(products)) {
        const categories = [
          ...new Set(products.map((p) => p.category).filter(Boolean)),
        ];
        return categories;
      }
      return [];
    }
  },
};

export default api;
