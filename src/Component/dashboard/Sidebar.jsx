"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
} from "lucide-react";

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

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
        <p className="text-sm text-gray-500">E-commerce Store</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || pathname?.startsWith(item.href);

            return (
              <li key={item.title}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={`
                    flex items-center gap-3 p-3 rounded-lg transition-colors
                    ${
                      isActive
                        ? "bg-blue-50 text-blue-700 border border-blue-100"
                        : "hover:bg-gray-50 text-gray-700"
                    }
                  `}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={() => {
            // Handle logout
          }}
          className="flex items-center gap-3 p-3 w-full text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}
