// src/components/admin/StatCard.tsx
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

import React from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: any;
  color: string;
  change: string;
  positive: boolean;
  trend: string;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  color,
  change,
  positive,
  trend,
}: StatCardProps) {
  return (
    <div className="bg-white rounded-xl shadow border border-gray-200 p-6 hover:shadow-md transition-shadow duration-300">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">{value}</h3>

          <div className="flex items-center gap-2">
            <div
              className={`flex items-center px-2 py-1 rounded-full ${
                positive
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {positive ? (
                <ArrowUpRight size={14} className="mr-1" />
              ) : (
                <ArrowDownRight size={14} className="mr-1" />
              )}
              <span className="text-xs font-semibold">{change}</span>
            </div>
            <span className="text-xs text-gray-500">{trend}</span>
          </div>
        </div>

        <div className={`${color} p-3 rounded-xl`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}
