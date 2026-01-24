// src/components/products/AddToCartButton.jsx
"use client";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "@/store/slices/cartSlice";
import toast from "react-hot-toast";

export default function AddToCartButton({ product, qty = 1, className = "" }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleAdd = (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      dispatch(addToCart({ ...product, qty }));
      if (toast && typeof toast.success === "function") {
        toast.success("Added to cart");
      } else {
        // fallback
        window.alert("Added to cart");
      }
    } catch (err) {
      console.error("Add to cart failed", err);
      if (toast && typeof toast.error === "function")
        toast.error("Failed to add to cart");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleAdd}
      disabled={loading}
      className={`${className} px-4 py-2 rounded ${
        loading
          ? "bg-gray-400 text-gray-700"
          : "bg-green-600 text-white hover:bg-green-700"
      }`}
    >
      {loading ? "Adding..." : "Add to cart"}
    </button>
  );
}
