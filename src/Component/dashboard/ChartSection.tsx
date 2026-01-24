// src/components/admin/ChartSection.tsx
"use client";

import { BarChart3, TrendingUp } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import React from "react";

interface ChartData {
  month: string;
  revenue: number;
  orders: number;
}

interface ChartSectionProps {
  data: ChartData[];
}

export default function ChartSection({ data }: ChartSectionProps) {
  return (
    <div className="bg-white rounded-xl shadow border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Revenue Overview
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            Monthly performance trends
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-green-50 text-green-700 rounded-lg">
          <TrendingUp size={16} />
          <span className="text-sm font-medium">+18.3% this month</span>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" stroke="#666" fontSize={12} />
            <YAxis
              stroke="#666"
              fontSize={12}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <Tooltip
              formatter={(value) => [
                `$${Number(value).toLocaleString()}`,
                "Revenue",
              ]}
              labelFormatter={(label) => `Month: ${label}`}
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                backgroundColor: "white",
              }}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              $
              {data
                .reduce((sum, item) => sum + item.revenue, 0)
                .toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Total Revenue</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {data.reduce((sum, item) => sum + item.orders, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Orders</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              $
              {(
                data.reduce((sum, item) => sum + item.revenue, 0) /
                data.reduce((sum, item) => sum + item.orders, 1)
              ).toFixed(2)}
            </div>
            <div className="text-sm text-gray-600">Avg. Order Value</div>
          </div>
        </div>
      </div>
    </div>
  );
}
