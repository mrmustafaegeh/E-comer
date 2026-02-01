"use client";

import {
  Menu,
  Bell,
  Search,
  User,
  ChevronDown,
  Settings,
  LogOut,
  Command
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
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
  const { user, logout } = useAuth() as any;
  const router = useRouter();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSignOut = async () => {
    await logout();
    router.push("/auth/login");
  };

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 px-8 py-5">
      <div className="flex items-center justify-between">
        {/* Left: Section Title */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="p-2.5 hover:bg-gray-50 rounded-xl lg:hidden text-gray-500"
          >
            <Menu size={20} />
          </button>

          <div className="hidden lg:flex items-center gap-3">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] border-r border-gray-200 pr-4">Admin</span>
            <span className="text-sm font-black text-gray-900 tracking-tight">Overview Dashboard</span>
          </div>
        </div>

        {/* Center: Minimal Search */}
        <div className="flex-1 max-w-lg mx-12 hidden lg:block">
          <div className="relative group">
            <Search
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-gray-900 transition-colors"
              size={16}
            />
            <input
              type="text"
              placeholder="Search assets, ID, data..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-gray-100 transition-all outline-none text-sm font-medium"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 px-1.5 py-0.5 border border-gray-200 rounded-md text-[10px] font-black text-gray-400">
                ⌘K
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-3 hover:bg-gray-50 rounded-2xl relative text-gray-500 hover:text-gray-900 transition-all"
          >
            <Bell size={20} />
            <span className="absolute top-3 right-3 w-2 h-2 bg-blue-600 rounded-full border-2 border-white"></span>
          </button>

          {/* User Profile */}
          <div className="relative ml-2">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 p-1.5 pl-3 border border-gray-100 bg-white hover:bg-gray-50 rounded-[1.2rem] shadow-sm transition-all"
            >
              <div className="hidden lg:block text-right">
                <p className="text-[11px] font-black text-gray-900 leading-none mb-0.5">
                  {user?.name || "Admin"}
                </p>
                <p className="text-[10px] font-bold text-gray-400 tracking-tight leading-none uppercase">
                   {user?.role || "Global Admin"}
                </p>
              </div>
              <div className="w-9 h-9 bg-gray-900 rounded-xl flex items-center justify-center text-white text-xs font-black shadow-lg shadow-gray-200">
                {user?.name?.[0] || "A"}
              </div>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-4 w-64 bg-white rounded-3xl shadow-2xl shadow-gray-200 border border-gray-100 py-3 z-50 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-50 mb-2">
                  <p className="text-sm font-black text-gray-900">{user?.name || "Admin User"}</p>
                  <p className="text-[11px] font-medium text-gray-400 truncate">{user?.email}</p>
                </div>
                
                <Link href="/admin/settings" className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 text-gray-600 text-sm font-bold transition-colors">
                  <Settings size={18} /> Settings
                </Link>
                <div className="border-t border-gray-50 mt-2 pt-2">
                  <button onClick={handleSignOut} className="flex items-center gap-3 w-full px-5 py-3 hover:bg-red-50 text-red-600 text-sm font-bold transition-colors">
                    <LogOut size={18} /> Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
