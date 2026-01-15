// src/app/admin/dashboard/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import StatGrid from "../../../Component/dashboard/StatGrid";
import RecentOrdersTable from "../../../Component/dashboard/RecentOrdersTable";
import QuickActions from "../../../Component/dashboard/QuickActions";
import ChartSection from "../../../Component/dashboard/ChartSection";
import ActivityFeed from "../../../Component/dashboard/ActivityFeed";
import TopProducts from "../../../Component/dashboard/TopProducts";
import LoadingSpinner from "../../../Component/ui/LoadingSpinner";
import {
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  RefreshCw,
  BarChart3,
  Clock,
} from "lucide-react";
import api from "../../../services/api";

interface DashboardStats {
  products: number;
  orders: number;
  users: number;
  revenue: number;
  orderGrowth: number;
  revenueGrowth: number;
  recentOrders: any[];
  topProducts: any[];
  monthlyData: any[];
  activities: any[];
  orderStats: {
    pending: number;
    processing: number;
    delivered: number;
    cancelled: number;
  };
}

interface MonthlyData {
  month: string;
  revenue: number;
  orders: number;
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    products: 0,
    orders: 0,
    users: 0,
    revenue: 0,
    orderGrowth: 0,
    revenueGrowth: 0,
    recentOrders: [],
    topProducts: [],
    monthlyData: [],
    activities: [],
    orderStats: {
      pending: 0,
      processing: 0,
      delivered: 0,
      cancelled: 0,
    },
  });

  useEffect(() => {
    loadDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch parallel data
      const [statsRes, recentOrdersRes, topProductsRes] = await Promise.allSettled([
        api.get("/admin/stats"), // New server-side stats endpoint
        api.get("/admin/admin-orders?limit=5&sort=-createdAt"),
        api.get("/admin/admin-products?limit=5&sort=-sold"), // Assuming you maintain a sold count
      ]);

      const statsData =
        statsRes.status === "fulfilled" ? (statsRes.value as any) : {};
      const recentOrdersData =
        recentOrdersRes.status === "fulfilled" ? (recentOrdersRes.value as any) : {};
      
      const realStats = statsData || {};
      const recentOrders = recentOrdersData.orders || [];

      // Fallback for monthly data if empty
      const monthlyData =
        realStats.monthlyData && realStats.monthlyData.length > 0
          ? realStats.monthlyData
          : getMockMonthlyData(); // Keep a helper for empty states

      setStats({
        products: realStats.products || 0,
        orders: realStats.orders || 0,
        users: realStats.users || 0,
        revenue: realStats.revenue || 0,
        orderGrowth: 12.5, // You could calculate this too if needed
        revenueGrowth: 18.3,
        recentOrders,
        topProducts: [], // You can implement a real top products endpoint later
        monthlyData,
        activities: generateActivities(recentOrders),
        orderStats: realStats.orderStats || {
          pending: 0,
          processing: 0,
          delivered: 0,
          cancelled: 0,
        },
      });
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Helper for empty states
  const getMockMonthlyData = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    return months.map(m => ({ month: m, revenue: 0, orders: 0 }));
  };

  const generateActivities = (orders: any[]) => {
    return orders.map((order: any) => ({
      id: order._id || order.id,
      type: "order",
      user: order.user?.email || "Customer",
      action: "placed an order",
      amount: `$${order.totalPrice}`,
      time: order.createdAt,
    }));
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };

  const statCards = [
    {
      title: "Total Products",
      value: stats.products.toLocaleString(),
      icon: Package,
      color: "bg-blue-500",
      change: "+12%",
      positive: true,
      trend: "from last month",
    },
    {
      title: "Total Orders",
      value: stats.orders.toLocaleString(),
      icon: ShoppingCart,
      color: "bg-green-500",
      change: `${stats.orderGrowth}%`,
      positive: stats.orderGrowth > 0,
      trend: "from last month",
    },
    {
      title: "Total Revenue",
      value: `$${stats.revenue.toLocaleString()}`,
      icon: DollarSign,
      color: "bg-purple-500",
      change: `${stats.revenueGrowth}%`,
      positive: stats.revenueGrowth > 0,
      trend: "from last month",
    },
    {
      title: "Total Users",
      value: stats.users.toLocaleString(),
      icon: Users,
      color: "bg-orange-500",
      change: "+8%",
      positive: true,
      trend: "from last month",
    },
  ];

  if (loading) {
    return (
      <div className="p-8">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard Overview
          </h1>
          <p className="text-gray-600 mt-2">
            Welcome back! Here&apos;s what&apos;s happening with your store
            today.
          </p>
        </div>

        <div className="flex items-center gap-3 mt-4 lg:mt-0">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            <RefreshCw size={18} className={refreshing ? "animate-spin" : ""} />
            {refreshing ? "Refreshing..." : "Refresh Data"}
          </button>

          <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg">
            <Clock size={18} />
            <span className="text-sm font-medium">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <StatGrid stats={statCards} />

      {/* Charts & Tables Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <ChartSection data={stats.monthlyData} />

          <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Recent Orders
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  Latest customer orders
                </p>
              </div>
              <a
                href="/admin/orders"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                View all orders →
              </a>
            </div>
            <RecentOrdersTable orders={stats.recentOrders} />
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <QuickActions />

          <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Top Products
                </h2>
                <p className="text-gray-600 text-sm mt-1">Best selling items</p>
              </div>
              <BarChart3 size={20} className="text-gray-400" />
            </div>
            <TopProducts products={stats.topProducts} />
          </div>

          <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Recent Activity
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  Latest store activities
                </p>
              </div>
              <Clock size={20} className="text-gray-400" />
            </div>
            <ActivityFeed activities={stats.activities} />
          </div>
        </div>
      </div>
    </div>
  );
}
