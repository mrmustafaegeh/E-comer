// src/components/products/RelatedProducts.jsx
"use client";
import React, { useEffect, useState } from "react";
import { productService } from "@/services/productService";
import ProductCard from "../features/ProductCard";

export default function RelatedProducts({ category, currentId }) {
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function loadRelated() {
      if (!category) {
        setRelated([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const data = await productService.getProductsByCategory(category);
        if (!mounted) return;
        const filtered = (Array.isArray(data) ? data : []).filter(
          (p) => p.id !== currentId
        );
        setRelated(filtered.slice(0, 4));
      } catch (err) {
        console.error("RelatedProducts error", err);
        setRelated([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadRelated();
    return () => (mounted = false);
  }, [category, currentId]);

  if (loading) {
    return (
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Related products</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded p-4 animate-pulse h-48" />
          ))}
        </div>
      </div>
    );
  }

  if (!related.length) return null;

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4">Related products</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {related.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
