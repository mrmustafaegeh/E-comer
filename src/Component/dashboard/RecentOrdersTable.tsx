// src/components/admin/RecentOrdersTable.tsx
import Link from "next/link";
import {
  MoreVertical,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
} from "lucide-react";
import { ArrowUpRight } from "lucide-react";
import React from "react";

interface Order {
  id: string;
  user?: {
    email: string;
    name?: string;
  };
  status: string;
  totalPrice: number;
  createdAt: string;
  items?: any[];
  shippingAddress?: {
    fullName: string;
  };
}

interface RecentOrdersTableProps {
  orders: Order[];
}

export default function RecentOrdersTable({ orders }: RecentOrdersTableProps) {
  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return <CheckCircle size={14} className="text-green-500" />;
      case "processing":
        return <Clock size={14} className="text-blue-500" />;
      case "pending":
        return <Clock size={14} className="text-yellow-500" />;
      case "cancelled":
        return <XCircle size={14} className="text-red-500" />;
      default:
        return <AlertCircle size={14} className="text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (!orders || orders.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 mb-2">No recent orders</div>
        <p className="text-gray-500 text-sm">
          Orders will appear here once customers place them
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Order ID
              </th>
              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Customer
              </th>
              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Date
              </th>
              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Amount
              </th>
              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4">
                  <div className="text-sm font-medium text-gray-900">
                    #{order.id.slice(-8).toUpperCase()}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="text-sm text-gray-900">
                    {order.user?.name || order.user?.email || order.shippingAddress?.fullName || "Guest"}
                  </div>
                  <div className="text-xs text-gray-500">
                    {order.user?.email || ""}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="text-sm text-gray-900">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(order.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="text-sm font-semibold text-gray-900">
                    ${order.totalPrice?.toFixed(2) || "0.00"}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(order.status)}
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      View
                    </Link>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <MoreVertical size={16} className="text-gray-500" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="border-t border-gray-200 px-4 py-3">
        <Link
          href="/admin/orders"
          className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1"
        >
          View all orders
          <ArrowUpRight size={14} />
        </Link>
      </div>
    </div>
  );
}
