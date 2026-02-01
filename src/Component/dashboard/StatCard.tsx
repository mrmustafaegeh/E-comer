"use client";

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
    <div className="bg-white rounded-[2rem] border border-gray-100 p-8 hover:shadow-2xl hover:shadow-gray-100 transition-all duration-500 group">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">{title}</p>
          <h3 className="text-3xl font-black text-gray-900 tracking-tighter mb-4">{value}</h3>

          <div className="flex items-center gap-2">
            <div
              className={`flex items-center px-3 py-1 rounded-full ${
                positive
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              <span className="text-[10px] font-black tracking-widest">{change}</span>
            </div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{trend}</span>
          </div>
        </div>

        <div className={`p-4 rounded-2xl bg-gray-50 group-hover:bg-gray-900 transition-all duration-500`}>
          <Icon className="w-6 h-6 text-gray-900 group-hover:text-white transition-colors" />
        </div>
      </div>
    </div>
  );
}
