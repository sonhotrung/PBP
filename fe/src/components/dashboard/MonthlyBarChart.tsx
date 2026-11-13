"use client";

import React from "react";
import Card from "@/components/ui/Card";
import { formatCurrency } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface MonthlyBarChartProps {
  currentStats?: {
    month: number;
    year: number;
    totalIncome: number;
    totalExpense: number;
  };
}

export default function MonthlyBarChart({ currentStats }: MonthlyBarChartProps) {
  // Tạo dữ liệu so sánh tháng 10 và tháng 11
  const chartData = [
    {
      name: "Tháng 10/2026",
      "Thu nhập": 30000000,
      "Chi tiêu": 9815000,
    },
    {
      name: `Tháng ${currentStats?.month || 11}/${currentStats?.year || 2026}`,
      "Thu nhập": currentStats?.totalIncome || 28200000,
      "Chi tiêu": currentStats?.totalExpense || 9090000,
    },
  ];

  return (
    <Card className="p-6 border-slate-200">
      <h3 className="text-base font-semibold text-slate-800 mb-4">
        So sánh Thu nhập & Chi tiêu theo thời gian
      </h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#64748B" }} />
            <YAxis
              tick={{ fontSize: 11, fill: "#64748B" }}
              tickFormatter={(val) => `${(val / 1000000).toFixed(0)}M`}
            />
            <Tooltip
              formatter={(value: any) => [formatCurrency(Number(value) || 0), ""]}
            />
            <Legend
              verticalAlign="bottom"
              formatter={(value: string) => (
                <span className="text-xs text-slate-600 font-medium">{value}</span>
              )}
            />
            <Bar dataKey="Thu nhập" fill="#10B981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Chi tiêu" fill="#EF4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
