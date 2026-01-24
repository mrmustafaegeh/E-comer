"use client";

import { memo, useMemo } from "react";
import ProductCard from "../products/ProductCard";

const FALLBACK_IMG = "/images/default-product.png";

function normalizeImageSrc(src) {
  const s = String(src || "").trim();
  if (!s) return FALLBACK_IMG;

  // ✅ keep absolute URLs untouched
  if (s.startsWith("http://") || s.startsWith("https://")) return s;

  // ✅ normalize relative paths
  const withSlash = s.startsWith("/") ? s : `/${s}`;
  return withSlash.replace(/\/{2,}/g, "/");
}

function normalizeProducts(products) {
  if (!Array.isArray(products)) return [];

  return products.map((p) => {
    const title = p?.title ?? p?.name ?? "Untitled product";
    const name = p?.name ?? p?.title ?? "Product";

    const price = Number(p?.price) || 0;
    const offerPrice =
      p?.offerPrice != null && p?.offerPrice !== ""
        ? Number(p.offerPrice)
        : p?.salePrice != null && p?.salePrice !== ""
        ? Number(p.salePrice)
        : null;

    const image = normalizeImageSrc(p?.image || p?.thumbnail);

    return {
      ...p,
      // normalize ids
      id: p?.id ?? p?._id,
      _id: p?._id ?? p?.id,
      title,
      name,
      price,
      offerPrice: Number.isFinite(offerPrice) ? offerPrice : null,
      image,
      rating: Number(p?.rating) || 0,
      numReviews: Number(p?.numReviews) || 0,
      stock: p?.stock != null ? Number(p.stock) : undefined,
      category: p?.category || "Uncategorized",
    };
  });
}

function FeaturedProducts({ products = [] }) {
  const normalized = useMemo(() => normalizeProducts(products), [products]);

  if (!normalized.length) {
    return (
      <div className="text-center py-16 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
        <svg
          className="w-20 h-20 text-yellow-400 mx-auto mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>

        <p className="text-gray-700 font-semibold text-lg mb-2">
          No products available
        </p>
        <p className="text-gray-600 text-sm mb-4">
          Add some products to get started
        </p>

        <code className="inline-block bg-gray-900 text-green-400 px-4 py-2 rounded-lg text-sm font-mono">
          node seed.js
        </code>
      </div>
    );
  }

  return (
    <section aria-label="Featured products">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {normalized.map((product, index) => (
          <ProductCard
            key={product?.id || product?._id || `${index}`}
            product={product}
            index={index} // if your ProductCard uses it for loading/priority
          />
        ))}
      </div>
    </section>
  );
}

export default memo(FeaturedProducts);
