"use client";

import Image from "next/image";
import { TrendingUp, Package, ChevronRight } from "lucide-react";
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
      <div className="text-center py-12">
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">No assets recorded</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {products.map((product) => (
        <div
          key={product.id}
          className="group flex items-center justify-between p-4 bg-white hover:bg-gray-50 border border-transparent hover:border-gray-100 rounded-2xl transition-all duration-300 cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <div className="relative w-14 h-14 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 group-hover:scale-110 transition-transform">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="w-6 h-6 text-gray-300" />
                </div>
              )}
            </div>
            <div>
              <h4 className="text-sm font-black text-gray-900 tracking-tight mb-1">{product.name}</h4>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  {product.sales} units
                </span>
                <span className={`w-1 h-1 rounded-full ${product.stock > 10 ? 'bg-green-400' : 'bg-red-400'}`}></span>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Stock: {product.stock}
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-black text-gray-900 tracking-tight">
              ${product.revenue.toLocaleString()}
            </div>
            <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest flex items-center justify-end gap-1">
               Rev. <TrendingUp size={10} />
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
