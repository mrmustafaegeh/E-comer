// src/app/admin/dashboard/page.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
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

/** ===== API SHAPES (Mongo) ===== */
interface ApiOrder {
  _id: string;
  userId?: string;
  user?: { email: string; name?: string };
  products?: Array<{
    productId: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  totalPrice: number;
  status: string;
  createdAt: string;
  items?: any[];
  shippingAddress?: { fullName: string };
}

interface ApiProduct {
  _id: string;
  name: string;
  price: number;
  stock: number;
  sold?: number;
  image?: string;
  images?: string[];
}

/** ===== UI COMPONENT SHAPES (what your components expect) ===== */
// RecentOrdersTable expects Order with "id"
type RecentOrdersTableOrder = {
  id: string;
  user?: { email: string; name?: string };
  status: string;
  totalPrice: number;
  createdAt: string;
  items?: any[];
  shippingAddress?: { fullName: string };
};

// TopProducts expects Product with "id", "sales", "revenue"
type TopProductsItem = {
  id: string;
  name: string;
  sales: number;
  revenue: number;
  stock: number;
  image?: string;
};

// ActivityFeed – we’ll pass a safe generic shape with "type"
type Activity = {
  id: string;
  type: "order" | "warning" | "info" | "success";
  description: string;
  timestamp: string;
};

type MonthlyData = {
  month: string;
  revenue: number;
  orders: number;
};

type DashboardStats = {
  products: number;
  orders: number;
  users: number;
  revenue: number;

  orderGrowth: number;
  revenueGrowth: number;
  productGrowth: number;
  userGrowth: number;

  recentOrders: RecentOrdersTableOrder[];
  topProducts: TopProductsItem[];
  monthlyData: MonthlyData[];
  activities: Activity[];

  orderStats: {
    pending: number;
    processing: number;
    delivered: number;
    cancelled: number;
  };
};

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
    productGrowth: 12, // placeholder
    userGrowth: 8, // placeholder

    recentOrders: [],
    topProducts: [],
    monthlyData: [],
    activities: [],
    orderStats: { pending: 0, processing: 0, delivered: 0, cancelled: 0 },
  });

  useEffect(() => {
    loadDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const calculateGrowth = (current: number, previous: number): number => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Number((((current - previous) / previous) * 100).toFixed(1));
  };

  const getMonthlyStats = (orders: ApiOrder[]): MonthlyData[] => {
    const monthNames = [
      "Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec",
    ];

    const buckets: Array<{ month: string; year: number; revenue: number; orders: number }> = [];
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      buckets.push({
        month: monthNames[d.getMonth()],
        year: d.getFullYear(),
        revenue: 0,
        orders: 0,
      });
    }

    orders.forEach((order) => {
      const d = new Date(order.createdAt);
      const m = monthNames[d.getMonth()];
      const y = d.getFullYear();
      const bucket = buckets.find((b) => b.month === m && b.year === y);
      if (bucket) {
        bucket.revenue += Number(order.totalPrice) || 0;
        bucket.orders += 1;
      }
    });

    return buckets.map(({ month, revenue, orders }) => ({
      month,
      revenue: Math.round(revenue),
      orders,
    }));
  };

  const getOrderStats = (orders: ApiOrder[]) => {
    return orders.reduce(
      (acc, order) => {
        const status = String(order.status || "").toLowerCase();
        if (status === "pending") acc.pending++;
        else if (status === "processing") acc.processing++;
        else if (status === "delivered") acc.delivered++;
        else if (status === "cancelled") acc.cancelled++;
        return acc;
      },
      { pending: 0, processing: 0, delivered: 0, cancelled: 0 }
    );
  };

  /** ✅ Map API orders -> RecentOrdersTable orders (id instead of _id) */
  const toRecentOrdersTableOrder = (o: ApiOrder): RecentOrdersTableOrder => ({
    id: o._id, // ✅ key fix
    user: o.user,
    status: o.status,
    totalPrice: Number(o.totalPrice) || 0,
    createdAt: o.createdAt,
    items: o.items,
    shippingAddress: o.shippingAddress,
  });

  /** ✅ Map API products -> TopProducts items (sales + revenue fields) */
  const toTopProductsItem = (p: ApiProduct): TopProductsItem => {
    const sales = Number(p.sold) || 0;
    const revenue = sales * (Number(p.price) || 0);

    // pick image from image field or first in images array
    const image = p.image || (Array.isArray(p.images) ? p.images[0] : undefined);

    return {
      id: p._id, // ✅ key fix
      name: p.name,
      sales,
      revenue: Math.round(revenue),
      stock: Number(p.stock) || 0,
      image,
    };
  };

  const generateActivities = (orders: ApiOrder[], products: ApiProduct[]): Activity[] => {
    const activities: Activity[] = [];

    const newestOrders = [...orders]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3);

    newestOrders.forEach((o) => {
      activities.push({
        id: `order-${o._id}`,
        type: "order",
        description: `New order #${String(o._id).slice(-6)} - $${Number(o.totalPrice || 0).toFixed(2)}`,
        timestamp: o.createdAt,
      });
    });

    products
      .filter((p) => (Number(p.stock) || 0) < 10)
      .slice(0, 2)
      .forEach((p) => {
        activities.push({
          id: `stock-${p._id}`,
          type: "warning",
          description: `Low stock alert: ${p.name} (${p.stock} left)`,
          timestamp: new Date().toISOString(),
        });
      });

    return activities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 5);
  };

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      const [productsRes, ordersRes, usersRes] = await Promise.allSettled([
        api.get("/admin/admin-products"),
        api.get("/admin/admin-orders"),
        api.get("/admin/users"),
      ]);

      const productsData =
        productsRes.status === "fulfilled" ? (productsRes.value as any).data : null;
      const ordersData =
        ordersRes.status === "fulfilled" ? (ordersRes.value as any).data : null;
      const usersData =
        usersRes.status === "fulfilled" ? (usersRes.value as any).data : null;

      const apiProducts: ApiProduct[] = productsData?.products ?? [];
      const apiOrders: ApiOrder[] = ordersData?.orders ?? [];
      const users: any[] = usersData?.users ?? [];

      // ✅ total products (if paginated backend)
      const productsTotal: number =
        productsData?.pagination?.total ?? apiProducts.length;

      const totalRevenue = apiOrders.reduce(
        (sum, o) => sum + (Number(o.totalPrice) || 0),
        0
      );

      // Growth current vs previous month
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      const currentMonthOrders = apiOrders.filter((o) => {
        const d = new Date(o.createdAt);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      });

      const previousMonthOrders = apiOrders.filter((o) => {
        const d = new Date(o.createdAt);
        const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
        return d.getMonth() === prevMonth && d.getFullYear() === prevYear;
      });

      const currentMonthRevenue = currentMonthOrders.reduce(
        (sum, o) => sum + (Number(o.totalPrice) || 0),
        0
      );
      const previousMonthRevenue = previousMonthOrders.reduce(
        (sum, o) => sum + (Number(o.totalPrice) || 0),
        0
      );

      const orderGrowth = calculateGrowth(
        currentMonthOrders.length,
        previousMonthOrders.length
      );
      const revenueGrowth = calculateGrowth(currentMonthRevenue, previousMonthRevenue);

      // ✅ map to UI types
      const recentOrders: RecentOrdersTableOrder[] = [...apiOrders]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5)
        .map(toRecentOrdersTableOrder);

      const topProducts: TopProductsItem[] = [...apiProducts]
        .map(toTopProductsItem)
        .sort((a, b) => b.sales - a.sales)
        .slice(0, 5);

      const monthlyData = getMonthlyStats(apiOrders);
      const orderStats = getOrderStats(apiOrders);
      const activities = generateActivities(apiOrders, apiProducts);

      setStats({
        products: productsTotal,
        orders: apiOrders.length,
        users: users.length,
        revenue: Math.round(totalRevenue),

        orderGrowth,
        revenueGrowth,
        productGrowth: 12,
        userGrowth: 8,

        recentOrders,
        topProducts,
        monthlyData,
        activities,
        orderStats,
      });
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };

  const statCards = useMemo(
    () => [
      {
        title: "Total Products",
        value: stats.products.toLocaleString(),
        icon: Package,
        color: "bg-blue-500",
        change: `+${stats.productGrowth}%`,
        positive: stats.productGrowth >= 0,
        trend: "from last month",
      },
      {
        title: "Total Orders",
        value: stats.orders.toLocaleString(),
        icon: ShoppingCart,
        color: "bg-green-500",
        change: `${stats.orderGrowth >= 0 ? "+" : ""}${stats.orderGrowth}%`,
        positive: stats.orderGrowth >= 0,
        trend: "from last month",
      },
      {
        title: "Total Revenue",
        value: `$${stats.revenue.toLocaleString()}`,
        icon: DollarSign,
        color: "bg-purple-500",
        change: `${stats.revenueGrowth >= 0 ? "+" : ""}${stats.revenueGrowth}%`,
        positive: stats.revenueGrowth >= 0,
        trend: "from last month",
      },
      {
        title: "Total Users",
        value: stats.users.toLocaleString(),
        icon: Users,
        color: "bg-orange-500",
        change: `+${stats.userGrowth}%`,
        positive: stats.userGrowth >= 0,
        trend: "from last month",
      },
    ],
    [
      stats.products,
      stats.orders,
      stats.users,
      stats.revenue,
      stats.orderGrowth,
      stats.revenueGrowth,
      stats.productGrowth,
      stats.userGrowth,
    ]
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen p-8">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:items-center lg:justify-between mb-6 lg:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Dashboard Overview
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
              Welcome back! Here&apos;s what&apos;s happening with your store today.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors text-sm sm:text-base"
            >
              <RefreshCw size={18} className={refreshing ? "animate-spin" : ""} />
              <span className="whitespace-nowrap">
                {refreshing ? "Refreshing..." : "Refresh"}
              </span>
            </button>

            <div className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg">
              <Clock size={18} className="flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium truncate">
                {new Date().toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mb-6 lg:mb-8">
          <StatGrid stats={statCards} />
        </div>

        {/* Charts & Tables Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <ChartSection data={stats.monthlyData} />

            <div className="bg-white rounded-xl shadow border border-gray-200 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3">
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                    Recent Orders
                  </h2>
                  <p className="text-gray-600 text-xs sm:text-sm mt-1">
                    Latest customer orders
                  </p>
                </div>
                <a
                  href="/admin/orders"
                  className="text-blue-600 hover:text-blue-800 text-xs sm:text-sm font-medium whitespace-nowrap"
                >
                  View all →
                </a>
              </div>

              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <div className="min-w-full inline-block align-middle">
                  {/* ✅ FIXED: orders have "id" now */}
                  <RecentOrdersTable orders={stats.recentOrders} />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4 sm:space-y-6">
            <QuickActions />

            <div className="bg-white rounded-xl shadow border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                    Top Products
                  </h2>
                  <p className="text-gray-600 text-xs sm:text-sm mt-1">
                    Best selling items
                  </p>
                </div>
                <BarChart3 size={20} className="text-gray-400 flex-shrink-0" />
              </div>

              {/* ✅ FIXED: products now have {id,sales,revenue} */}
              <TopProducts products={stats.topProducts} />
            </div>

            <div className="bg-white rounded-xl shadow border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                    Recent Activity
                  </h2>
                  <p className="text-gray-600 text-xs sm:text-sm mt-1">
                    Latest store activities
                  </p>
                </div>
                <Clock size={20} className="text-gray-400 flex-shrink-0" />
              </div>

              <ActivityFeed activities={stats.activities} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
