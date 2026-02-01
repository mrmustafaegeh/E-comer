"use client";

import Link from "next/link";
import {
  Plus,
  ArrowUpRight,
  ShoppingCart,
  Users,
  BarChart3,
  Tag,
  Image as ImageIcon,
} from "lucide-react";
import React from "react";

interface QuickAction {
  title: string;
  description: string;
  icon: any;
  href: string;
  color: string;
}

export default function QuickActions() {
  const actions: QuickAction[] = [
    {
      title: "New Product",
      description: "Asset creation",
      icon: Plus,
      href: "/admin/create-product",
      color: "bg-gray-900",
    },
    {
      title: "Orders",
      description: "Revenue log",
      icon: ShoppingCart,
      href: "/admin/orders",
      color: "bg-blue-600",
    },
    {
      title: "Customers",
      description: "User database",
      icon: Users,
      href: "/admin/users",
      color: "bg-purple-600",
    },
    {
      title: "Analytics",
      description: "Trend reports",
      icon: BarChart3,
      href: "/admin/analytics",
      color: "bg-green-600",
    },
  ];

  return (
    <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm">
      <div className="mb-8">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Control</p>
        <h2 className="text-xl font-black text-gray-900 tracking-tight">Quick Actions.</h2>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {actions.map((action, index) => (
          <Link
            key={index}
            href={action.href}
            className="group flex items-center justify-between p-4 bg-gray-50 hover:bg-white border border-transparent hover:border-gray-200 rounded-2xl transition-all duration-300"
          >
            <div className="flex items-center gap-4">
              <div className={`${action.color} p-2.5 rounded-xl text-white shadow-lg shadow-gray-200 group-hover:scale-110 transition-transform`}>
                <action.icon size={18} strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="text-sm font-black text-gray-900 mb-0.5">{action.title}</h3>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{action.description}</p>
              </div>
            </div>
            <ArrowUpRight size={16} className="text-gray-300 group-hover:text-gray-900 transition-colors" />
          </Link>
        ))}
      </div>
    </div>
  );
}
