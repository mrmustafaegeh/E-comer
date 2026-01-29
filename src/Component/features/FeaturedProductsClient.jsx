"use client";

import { useCart } from "../../hooks/useCart";
import FeaturedProductsWithQuery from "../products/FeaturedProductsWithQuery";
import FeaturedProducts from "../products/FeaturedProducts";

export default function FeaturedProductsClient({ initialProducts }) {
  const { addToCart } = useCart();

  // Optimized Path: If server provides data, render immediately
  if (initialProducts) {
    return <FeaturedProducts products={initialProducts} addToCart={addToCart} />;
  }

  // Fallback: Client-side fetching
  return <FeaturedProductsWithQuery addToCart={addToCart} />;
}
