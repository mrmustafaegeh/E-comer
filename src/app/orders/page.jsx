"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
import { get } from "../../services/api";
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  ArrowRight,
  ShoppingBag,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import LoadingSpinner from "../../Component/ui/LoadingSpinner";

export default function OrdersPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If not authenticated, redirect
    if (!authLoading && !user) {
      router.push("/auth/login?returnUrl=/orders");
    }

    if (user) {
      fetchOrders();
    }
  }, [user, authLoading, router]);

  const fetchOrders = async () => {
    try {
      const res = await get("/orders");
      // res is already the data body from the API
      // The API returns { orders: [...], ... }
      const data = res.orders || [];
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setError("Unable to load your orders. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const s = status?.toLowerCase() || "";
    if (s === "delivered" || s === "completed")
      return "bg-green-100 text-green-700";
    if (s === "processing") return "bg-blue-100 text-blue-700";
    if (s === "cancelled") return "bg-red-100 text-red-700";
    return "bg-yellow-100 text-yellow-700"; // pending
  };

  const getStatusIcon = (status) => {
    const s = status?.toLowerCase() || "";
    if (s === "delivered") return <CheckCircle size={16} />;
    if (s === "processing") return <Truck size={16} />;
    if (s === "cancelled") return <XCircle size={16} />;
    return <Clock size={16} />;
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Package className="text-blue-600" />
            My Orders
          </h1>
          <Link
            href="/products"
            className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
          >
            Continue Shopping <ArrowRight size={16} />
          </Link>
        </div>

        {error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-center">
            {error}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-gray-100">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
              <ShoppingBag size={40} />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No orders yet
            </h2>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto">
              Looks like you haven't placed any orders yet. Start shopping to fill
              your history!
            </p>
            <Link
              href="/products"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300"
              >
                {/* Header */}
                <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex flex-wrap gap-4 justify-between items-center">
                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                    <div>
                      <span className="text-gray-500 block text-xs uppercase tracking-wide font-semibold mb-1">
                        Order ID
                      </span>
                      <span className="font-mono text-gray-900 font-medium">
                        #{order.id.slice(-8).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-xs uppercase tracking-wide font-semibold mb-1">
                        Date
                      </span>
                      <span className="text-gray-900">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-xs uppercase tracking-wide font-semibold mb-1">
                        Total
                      </span>
                      <span className="font-bold text-gray-900">
                        ${Number(order.totalPrice).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <div
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {getStatusIcon(order.status)}
                    {order.status}
                  </div>
                </div>

                {/* Body */}
                <div className="p-6">
                  <div className="space-y-4">
                    {order.products?.map((item, idx) => (
                      <div key={idx} className="flex gap-4 items-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative">
                          <Image
                            src={
                              item.image ||
                              item.imgSrc ||
                              "/images/placeholder.png"
                            }
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 truncate">
                            {item.name}
                          </h4>
                          <p className="text-sm text-gray-500">
                            Qty: {item.quantity} × ${Number(item.price).toFixed(2)}
                          </p>
                        </div>
                        <div className="text-right font-medium text-gray-900">
                          ${(item.quantity * Number(item.price)).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer / Shipping Info */}
                  <div className="mt-6 pt-6 border-t border-gray-100 flex flex-col sm:flex-row justify-between gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-semibold text-gray-900 block mb-1">
                        Shipping Address
                      </span>
                      {order.shippingAddress ? (
                        <>
                          <p>{order.shippingAddress.fullName}</p>
                          <p>
                            {order.shippingAddress.address},{" "}
                            {order.shippingAddress.city}
                          </p>
                          <p>
                            {order.shippingAddress.state}{" "}
                            {order.shippingAddress.zipCode}
                          </p>
                          <p>{order.shippingAddress.country}</p>
                        </>
                      ) : (
                        <p className="italic text-gray-400">Not available</p>
                      )}
                    </div>
                    <div className="sm:text-right">
                      <span className="font-semibold text-gray-900 block mb-1">
                        Payment Method
                      </span>
                      <p className="capitalize">
                        {order.paymentMethod === "cod"
                          ? "Cash on Delivery"
                          : order.paymentMethod || "Standard"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
