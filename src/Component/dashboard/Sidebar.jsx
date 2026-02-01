"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  Image as ImageIcon,
  LogOut,
  Mail,
  ChevronRight,
  ShieldCheck
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const navItems = [
  { title: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { title: "Products", href: "/admin/admin-products", icon: Package },
  { title: "Orders", href: "/admin/order", icon: ShoppingCart },
  { title: "Customers", href: "/admin/users", icon: Users },
  { title: "Messages", href: "/admin/messages", icon: Mail },
  { title: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { title: "Media Library", href: "/admin/media", icon: ImageIcon },
  { title: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebar({ onClose }) {
  const pathname = usePathname();
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/auth/login");
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Brand Header */}
      <div className="px-8 py-10">
        <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center text-white shadow-xl shadow-gray-200">
                <ShieldCheck size={22} strokeWidth={2.5} />
            </div>
            <div>
                <h1 className="text-lg font-black tracking-tight text-gray-900 leading-none">QuickCart</h1>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-1">Console v2.0</p>
            </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/admin/dashboard" && pathname?.startsWith(item.href));

          return (
            <Link
              key={item.title}
              href={item.href}
              onClick={onClose}
              className={`
                group flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300
                ${
                  isActive
                    ? "bg-gray-900 text-white shadow-xl shadow-gray-200"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }
              `}
            >
              <div className="flex items-center gap-3">
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} className={isActive ? "text-white" : "text-gray-400 group-hover:text-gray-900 transition-colors"} />
                <span className={`text-sm font-bold tracking-tight ${isActive ? "" : "font-medium"}`}>{item.title}</span>
              </div>
              {isActive && <ChevronRight size={14} strokeWidth={3} className="text-white/50" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer / User Profile */}
      <div className="p-6 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3.5 w-full text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all duration-300"
        >
          <LogOut size={20} />
          <span className="text-sm font-bold tracking-tight">Sign Out</span>
        </button>
      </div>
    </div>
  );
}
