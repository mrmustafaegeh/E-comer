"use client";

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import Image from "next/image";
import Link from "next/link";
import { Edit3, Trash2, Eye, MoreHorizontal, Package } from "lucide-react";
import { deleteAdminProduct } from "../../store/adminProductSlice";

export default function ProductTable({ products }) {
  const dispatch = useDispatch();
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (productId) => {
    if (!confirm("Execute deletion protocol for this asset?")) {
      return;
    }

    setDeletingId(productId);
    try {
      await dispatch(deleteAdminProduct(productId)).unwrap();
    } catch (error) {
      console.error("Deletion failure:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Product Asset</th>
            <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Category</th>
            <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Valuation</th>
            <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Availability</th>
            <th className="px-6 py-5 text-right text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {products.map((product) => (
            <tr key={product._id || product.id} className="group hover:bg-gray-50/50 transition-colors">
              {/* Product Info */}
              <td className="px-6 py-6">
                <div className="flex items-center gap-4">
                  <div className="relative w-12 h-16 bg-gray-100 rounded-xl overflow-hidden border border-gray-100 flex-shrink-0">
                    {product.image || product.thumbnail ? (
                      <Image
                        src={product.image || product.thumbnail}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-gray-300">
                        <Package size={20} />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-black text-gray-900 tracking-tight truncate max-w-[200px] group-hover:text-blue-600 transition-colors">
                      {product.name}
                    </p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                      ID: {(product._id || product.id).substring(0, 8)}
                    </p>
                  </div>
                </div>
              </td>

              {/* Category */}
              <td className="px-6 py-6">
                <span className="inline-flex text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-white border border-gray-100 text-gray-900 rounded-full shadow-sm">
                  {product.category || "General"}
                </span>
              </td>

              {/* Price */}
              <td className="px-6 py-6">
                <p className="text-sm font-black text-gray-900 tracking-tighter">
                  {formatPrice(product.price)}
                </p>
                {product.salePrice && (
                  <p className="text-[10px] font-black text-green-600 uppercase tracking-widest mt-0.5">
                    Sale active
                  </p>
                )}
              </td>

              {/* Availability */}
              <td className="px-6 py-6">
                <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${product.stock > 0 ? "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]" : "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.4)]"}`} />
                    <span className={`text-[10px] font-black uppercase tracking-widest ${product.stock > 0 ? "text-gray-900" : "text-red-500"}`}>
                        {product.stock > 0 ? `${product.stock} Units` : "Depleted"}
                    </span>
                </div>
              </td>

              {/* Actions */}
              <td className="px-6 py-6 text-right">
                <div className="flex items-center justify-end gap-1 opacity-10 md:opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link
                    href={`/products/${product._id || product.id}`}
                    className="p-3 text-gray-400 hover:text-gray-900 hover:bg-white rounded-xl transition-all"
                  >
                    <Eye size={18} />
                  </Link>

                  <Link
                    href={`/admin/admin-products/${product._id || product.id}`}
                    className="p-3 text-gray-400 hover:text-gray-900 hover:bg-white rounded-xl transition-all"
                  >
                    <Edit3 size={18} />
                  </Link>

                  <button
                    onClick={() => handleDelete(product._id || product.id)}
                    disabled={deletingId === (product._id || product.id)}
                    className="p-3 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all disabled:opacity-50"
                  >
                    {deletingId === (product._id || product.id) ? (
                      <Loader2 size={18} className="animate-spin text-gray-900" />
                    ) : (
                      <Trash2 size={18} />
                    )}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Loader2({ size, className }) {
    return <svg className={`animate-spin ${className}`} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>;
}
