// src/components/common/WishlistButton.jsx
"use client";
import React from "react";
import { useWishlist } from "@/hooks/useWishlist";

export default function WishlistButton({ product, className = "" }) {
  const { isSaved, add, remove } = useWishlist();
  const saved = isSaved(product.id);

  const toggle = (e) => {
    e.preventDefault();
    if (saved) remove(product.id);
    else add(product);
  };

  return (
    <button
      onClick={toggle}
      className={`px-3 py-1 border rounded ${className}`}
    >
      {saved ? "♥ Saved" : "♡ Save"}
    </button>
  );
}
