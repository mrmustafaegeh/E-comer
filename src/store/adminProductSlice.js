// src/store/adminProductSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Fetch all products
export const fetchAdminProducts = createAsyncThunk(
  "adminProducts/fetchAll",
  async (params = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams({
        page: params.page || 1,
        limit: params.limit || 50,
        ...(params.search && { search: params.search }),
        ...(params.category && { category: params.category }),
      });

      const response = await fetch(`/api/admin/admin-products?${queryParams}`);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to fetch products");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Create product
export const createAdminProduct = createAsyncThunk(
  "adminProducts/create",
  async (productData, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/admin/admin-products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create product");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update product
export const updateAdminProduct = createAsyncThunk(
  "adminProducts/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/admin/admin-products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update product");
      }

      const result = await response.json();
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Delete product
export const deleteAdminProduct = createAsyncThunk(
  "adminProducts/delete",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/admin/admin-products/${productId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete product");
      }

      return productId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const adminProductSlice = createSlice({
  name: "adminProducts",
  initialState: {
    items: [],
    total: 0,
    loading: false,
    error: null,
    currentPage: 1,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch products
      .addCase(fetchAdminProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.products || [];
        state.total = action.payload.total || 0;
      })
      .addCase(fetchAdminProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch products";
      })

      // Create product
      .addCase(createAdminProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAdminProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload);
        state.total += 1;
      })
      .addCase(createAdminProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create product";
      })

      // Update product
      .addCase(updateAdminProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAdminProduct.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(
          (item) =>
            item._id === action.payload._id || item.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateAdminProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update product";
      })

      // Delete product
      .addCase(deleteAdminProduct.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteAdminProduct.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (item) => item._id !== action.payload && item.id !== action.payload
        );
        state.total -= 1;
      })
      .addCase(deleteAdminProduct.rejected, (state, action) => {
        state.error = action.payload || "Failed to delete product";
      });
  },
});

export const { clearError } = adminProductSlice.actions;
export default adminProductSlice.reducer;
