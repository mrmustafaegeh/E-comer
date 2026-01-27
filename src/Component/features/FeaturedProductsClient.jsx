"use client";

import { useCart } from "../../hooks/useCart";
import FeaturedProductsWithQuery from "../products/FeaturedProductsWithQuery";

export default function FeaturedProductsClient() {
  const { addToCart } = useCart();

  return <FeaturedProductsWithQuery addToCart={addToCart} />;
}
