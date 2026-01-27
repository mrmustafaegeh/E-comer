// app/store/cartSlice.js
import { createSlice } from "@reduxjs/toolkit";

import { products } from "../data/productData";

// Helper function to get initial state from localStorage (client-side only)
const getInitialState = () => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("cart");
    const cartItems = saved ? JSON.parse(saved) : [];

    // Validate cart items against the product data
    const validatedCartItems = cartItems.filter((item) => {
      return products.some((product) => product.id === item.id);
    });

    if (validatedCartItems.length !== cartItems.length) {
      localStorage.setItem("cart", JSON.stringify(validatedCartItems));
    }

    return validatedCartItems;
  }
  return [];
};

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: getInitialState(),
  },
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const existingItem = state.items.find((item) => item.id === product.id);

      if (existingItem) {
        existingItem.qty += 1;
      } else {
        state.items.push({
          ...product,
          qty: 1,
          price: Number(product.price),
        });
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("cart", JSON.stringify(state.items));
      }
    },

    increaseQuantity: (state, action) => {
      const id = action.payload;
      const item = state.items.find((item) => item.id === id);
      if (item) {
        item.qty += 1;
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("cart", JSON.stringify(state.items));
      }
    },

    decreaseQuantity: (state, action) => {
      const id = action.payload;
      const item = state.items.find((item) => item.id === id);
      if (item) {
        item.qty = Math.max(1, item.qty - 1);
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("cart", JSON.stringify(state.items));
      }
    },

    removeFromCart: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter((item) => item.id !== id);

      if (typeof window !== "undefined") {
        localStorage.setItem("cart", JSON.stringify(state.items));
      }
    },

    clearCart: (state) => {
      state.items = [];

      if (typeof window !== "undefined") {
        localStorage.setItem("cart", JSON.stringify([]));
      }
    },
  },
});

export const {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
