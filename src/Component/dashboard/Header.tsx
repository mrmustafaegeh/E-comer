// src/components/admin/Header.tsx
"use client";

import {
  Menu,
  Bell,
  Search,
  User,
  ChevronDown,
  Settings,
  LogOut,
} from "lucide-react";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import React from "react";

interface AdminHeaderProps {
  onMenuClick: () => void;
  sidebarOpen: boolean;
}

export default function AdminHeader({
  onMenuClick,
  sidebarOpen,
}: AdminHeaderProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/auth/signin");
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left: Menu Button & Brand */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="p-2 hover:bg-gray-100 rounded-lg lg:hidden"
            aria-label={sidebarOpen ? "Close menu" : "Open menu"}
          >
            <Menu size={20} />
          </button>

          <div className="hidden lg:flex items-center gap-2">
            <Link
              href="/admin/dashboard"
              className="font-semibold text-gray-900"
            >
              QuickCart Admin
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-sm text-gray-600">Dashboard</span>
          </div>
        </div>

        {/* Center: Search Bar */}
        <div className="flex-1 max-w-2xl mx-4 hidden lg:block">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search products, orders, customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        {/* Right: User Menu & Notifications */}
        <div className="flex items-center gap-3">
          {/* Mobile Search */}
          <button className="lg:hidden p-2 hover:bg-gray-100 rounded-lg">
            <Search size={20} />
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 hover:bg-gray-100 rounded-lg relative"
            >
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  <div className="px-4 py-3 hover:bg-gray-50">
                    <p className="text-sm font-medium">New order received</p>
                    <p className="text-xs text-gray-500 mt-1">2 minutes ago</p>
                  </div>
                  <div className="px-4 py-3 hover:bg-gray-50">
                    <p className="text-sm font-medium">Low stock alert</p>
                    <p className="text-xs text-gray-500 mt-1">1 hour ago</p>
                  </div>
                </div>
                <div className="px-4 py-2 border-t border-gray-100">
                  <Link
                    href="/admin/notifications"
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    View all notifications
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg"
            >
              <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">
                {session?.user?.name?.[0] || "A"}
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-sm font-medium">
                  {session?.user?.name || "Admin"}
                </p>
                <p className="text-xs text-gray-500">
                  {session?.user?.email || "admin@example.com"}
                </p>
              </div>
              <ChevronDown size={16} className="hidden lg:block" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="font-medium">
                    {session?.user?.name || "Admin User"}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {session?.user?.email}
                  </p>
                </div>

                <Link
                  href="/admin/profile"
                  className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-gray-700"
                >
                  <User size={16} />
                  My Profile
                </Link>

                <Link
                  href="/admin/settings"
                  className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-gray-700"
                >
                  <Settings size={16} />
                  Settings
                </Link>

                <div className="border-t border-gray-100 mt-2 pt-2">
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 w-full px-4 py-2 hover:bg-red-50 text-red-600"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {searchQuery && (
        <div className="mt-4 lg:hidden">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
        </div>
      )}
    </header>
  );
}
