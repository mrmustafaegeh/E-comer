// src/components/admin/StatGrid.tsx
import StatCard from "./StatCard";
import React from "react";

interface StatCard {
  title: string;
  value: string | number;
  icon: any;
  color: string;
  change: string;
  positive: boolean;
  trend: string;
}

interface StatGridProps {
  stats: StatCard[];
}

export default function StatGrid({ stats }: StatGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
}
