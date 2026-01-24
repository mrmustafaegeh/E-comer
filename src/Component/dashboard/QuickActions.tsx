// src/components/admin/QuickActions.tsx
import Link from "next/link";
import {
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
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
      title: "Add Product",
      description: "Create new product listing",
      icon: Package,
      href: "/admin/products/create",
      color: "bg-blue-500",
    },
    {
      title: "View Orders",
      description: "Manage customer orders",
      icon: ShoppingCart,
      href: "/admin/orders",
      color: "bg-green-500",
    },
    {
      title: "Manage Users",
      description: "View and manage users",
      icon: Users,
      href: "/admin/users",
      color: "bg-purple-500",
    },
    {
      title: "Analytics",
      description: "View store analytics",
      icon: BarChart3,
      href: "/admin/analytics",
      color: "bg-orange-500",
    },
    {
      title: "Categories",
      description: "Manage categories",
      icon: Tag,
      href: "/admin/categories",
      color: "bg-pink-500",
    },
    {
      title: "Media Library",
      description: "Manage images & files",
      icon: ImageIcon,
      href: "/admin/media",
      color: "bg-indigo-500",
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
        <p className="text-gray-600 text-sm mt-1">
          Common tasks at your fingertips
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {actions.map((action, index) => (
          <Link
            key={index}
            href={action.href}
            className="group p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all duration-200"
          >
            <div className="flex items-start gap-3">
              <div
                className={`${action.color} p-2 rounded-lg group-hover:scale-105 transition-transform`}
              >
                <action.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 group-hover:text-blue-600">
                  {action.title}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {action.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
