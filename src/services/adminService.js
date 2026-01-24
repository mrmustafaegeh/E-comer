// src/services/adminService.js
import { get, post, put, del } from "./api";

export const adminService = {
  // ========================================
  // PRODUCT MANAGEMENT
  // ========================================
  listProducts: (params = {}) => get("/admin/admin-products", params),
  getProduct: (id) => get(`/admin/admin-products/${id}`),
  createProduct: (productData) => post("/admin/admin-products", productData),
  updateProduct: (id, productData) =>
    put(`/admin/admin-products/${id}`, productData),
  deleteProduct: (id) => del(`/admin/admin-products/${id}`),

  // ========================================
  // IMAGE UPLOAD & DELETE (Vercel Blob)
  // ========================================

  /**
   * Upload image to Vercel Blob
   * @param {File} file - The image file to upload
   * @returns {Promise<{url: string, pathname: string}>}
   */
  uploadImage: async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Upload failed");
      }

      const data = await response.json();
      console.log("✅ Image uploaded:", data.url);
      return data; // { url, pathname, size, contentType }
    } catch (error) {
      console.error("❌ Upload error:", error);
      throw error;
    }
  },

  /**
   * Delete image from Vercel Blob
   * @param {string} imageUrl - The full Vercel Blob URL
   * @returns {Promise<void>}
   */
  deleteImage: async (imageUrl) => {
    try {
      // Skip if not a Vercel Blob URL
      if (!imageUrl || !imageUrl.includes("blob.vercel-storage.com")) {
        console.log("⚠️ Skipping delete - not a Vercel Blob URL:", imageUrl);
        return;
      }

      const response = await fetch("/api/upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: imageUrl }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Delete failed");
      }

      console.log("✅ Image deleted:", imageUrl);
    } catch (error) {
      console.error("❌ Failed to delete image:", error);
      // Don't throw - we don't want to block product deletion if image delete fails
    }
  },

  // ========================================
  // CATEGORY MANAGEMENT
  // ========================================
  getCategories: () => get("/categories"),

  // ========================================
  // ORDER MANAGEMENT
  // ========================================
  listOrders: (params = {}) => get("/orders", params),
  getOrder: (id) => get(`/orders/${id}`),
  updateOrderStatus: (id, statusData) =>
    put(`/orders/${id}/status`, statusData),

  // ========================================
  // USER MANAGEMENT
  // ========================================
  listUsers: (params = {}) => get("/users", params),
  getUser: (id) => get(`/users/${id}`),
  updateUser: (id, userData) => put(`/users/${id}`, userData),
  deleteUser: (id) => del(`/users/${id}`),

  // ========================================
  // DASHBOARD & ANALYTICS
  // ========================================
  getDashboardStats: () => get("/admin/stats"),
  getSalesAnalytics: (period = "monthly") =>
    get(`/analytics/sales?period=${period}`),
  getProductAnalytics: () => get("/analytics/products"),

  // ========================================
  // FEATURED PRODUCTS
  // ========================================
  getFeaturedProducts: () => get("/featured"),
  updateFeaturedProduct: (id, featured) =>
    put(`/products/${id}/featured`, { featured }),

  // ========================================
  // INVENTORY MANAGEMENT
  // ========================================
  updateStock: (id, stock) => put(`/products/${id}/stock`, { stock }),
  getLowStockProducts: (threshold = 10) =>
    get("/products/low-stock", { threshold }),

  // ========================================
  // BULK OPERATIONS
  // ========================================
  bulkUpdateProducts: (ids, updateData) =>
    post("/products/bulk-update", { ids, ...updateData }),
  bulkDeleteProducts: (ids) => del("/products/bulk-delete", { data: { ids } }),
};

export default adminService;
