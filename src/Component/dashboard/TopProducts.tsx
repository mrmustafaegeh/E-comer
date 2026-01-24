// src/components/admin/TopProducts.tsx
import Image from "next/image";
import { TrendingUp, Star } from "lucide-react";
import { Package } from "lucide-react";
import React from "react";

interface Product {
  id: string;
  name: string;
  sales: number;
  revenue: number;
  stock: number;
  image?: string;
}

interface TopProductsProps {
  products: Product[];
}

export default function TopProducts({ products }: TopProductsProps) {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-6">
        <div className="text-gray-400 mb-2">No products yet</div>
        <p className="text-gray-500 text-sm">Add products to see them here</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {products.map((product, index) => (
        <div
          key={product.id}
          className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <Package className="w-6 h-6 text-gray-400" />
                </div>
              )}
            </div>
            <div>
              <h4 className="font-medium text-gray-900">{product.name}</h4>
              <div className="flex items-center gap-4 mt-1">
                <span className="text-xs text-gray-500">
                  {product.sales} sales
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    product.stock > 10
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  Stock: {product.stock}
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="font-semibold text-gray-900">
              ${product.revenue.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500">Revenue</div>
          </div>
        </div>
      ))}
    </div>
  );
}
