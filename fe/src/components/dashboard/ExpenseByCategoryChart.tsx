"use client";

import React from "react";
import Card from "@/components/ui/Card";
import { CategoryStat } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface ExpenseByCategoryChartProps {
  data: CategoryStat[];
}

const DEFAULT_COLORS = [
  "#F59E0B",
  "#EC4899",
  "#8B5CF6",
  "#06B6D4",
  "#EF4444",
  "#10B981",
  "#3B82F6",
  "#6B7280",
];

export default function ExpenseByCategoryChart({ data }: ExpenseByCategoryChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card className="p-6 flex flex-col items-center justify-center min-h-[320px] text-slate-400">
        <p className="text-sm">Chưa có dữ liệu chi tiêu trong tháng này</p>
      </Card>
    );
  }

  const chartData = data.map((item, index) => ({
    name: item.categoryName,
    value: item.total,
    color: item.categoryColor || DEFAULT_COLORS[index % DEFAULT_COLORS.length],
  }));

  return (
    <Card className="p-6 border-slate-200">
      <h3 className="text-base font-semibold text-slate-800 mb-4">
        Chi tiêu theo danh mục
      </h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={85}
              paddingAngle={4}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: any) => [formatCurrency(Number(value) || 0), "Số tiền"]}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value: string) => (
                <span className="text-xs text-slate-600 font-medium">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
