// src/components/dashboard/ProductTable.jsx
"use client";

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import Image from "next/image";
import Link from "next/link";
import { FiEdit2, FiTrash2, FiEye } from "react-icons/fi";
import { deleteAdminProduct } from "../../store/adminProductSlice";

export default function ProductTable({ products }) {
  const dispatch = useDispatch();
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (productId) => {
    if (!confirm("Are you sure you want to delete this product?")) {
      return;
    }

    setDeletingId(productId);
    try {
      await dispatch(deleteAdminProduct(productId)).unwrap();
      // Product will be removed from list automatically via Redux
    } catch (error) {
      console.error("Failed to delete product:", error);
      alert("Failed to delete product. Please try again.");
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
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Product
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Category
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Price
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Stock
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {products.map((product) => (
            <tr key={product._id || product.id} className="hover:bg-gray-50">
              {/* Product Info */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-12 w-12 relative bg-gray-100 rounded-lg overflow-hidden">
                    {product.image || product.thumbnail ? (
                      <Image
                        src={product.image || product.thumbnail}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-gray-400">
                        📦
                      </div>
                    )}
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {product.name}
                    </div>
                    {product.description && (
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {product.description.substring(0, 50)}...
                      </div>
                    )}
                  </div>
                </div>
              </td>

              {/* Category */}
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                  {product.category || "Uncategorized"}
                </span>
              </td>

              {/* Price */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {formatPrice(product.price)}
                </div>
                {product.salePrice && (
                  <div className="text-xs text-green-600">
                    Sale: {formatPrice(product.salePrice)}
                  </div>
                )}
              </td>

              {/* Stock */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {product.stock || 0}
                </div>
              </td>

              {/* Status */}
              <td className="px-6 py-4 whitespace-nowrap">
                {product.stock > 0 ? (
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    In Stock
                  </span>
                ) : (
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                    Out of Stock
                  </span>
                )}
              </td>

              {/* Actions */}
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center justify-end gap-2">
                  {/* View */}
                  <Link
                    href={`/product/${product._id || product.id}`}
                    className="text-gray-600 hover:text-gray-900 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="View Product"
                  >
                    <FiEye size={18} />
                  </Link>

                  {/* Edit */}
                  <Link
                    href={`/admin/admin-products/${product._id || product.id}`}
                    className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit Product"
                  >
                    <FiEdit2 size={18} />
                  </Link>

                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(product._id || product.id)}
                    disabled={deletingId === (product._id || product.id)}
                    className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    title="Delete Product"
                  >
                    {deletingId === (product._id || product.id) ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-600 border-t-transparent" />
                    ) : (
                      <FiTrash2 size={18} />
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
