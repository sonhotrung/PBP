import React from "react";
import Card from "@/components/ui/Card";
import { formatCurrency } from "@/lib/utils";
import { MonthlyStats } from "@/types";
import { ArrowDownLeft, ArrowUpRight, Scale } from "lucide-react";

interface MonthlyStatsCardsProps {
  stats: MonthlyStats;
}

export default function MonthlyStatsCards({ stats }: MonthlyStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Tổng thu nhập */}
      <Card className="p-5 border-slate-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Tổng thu nhập
          </span>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ArrowDownLeft className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-bold text-emerald-600">
          +{formatCurrency(stats.totalIncome)}
        </div>
        <p className="text-xs text-slate-400 mt-1">Tháng {stats.month}/{stats.year}</p>
      </Card>

      {/* Tổng chi tiêu */}
      <Card className="p-5 border-slate-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Tổng chi tiêu
          </span>
          <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-bold text-rose-600">
          -{formatCurrency(stats.totalExpense)}
        </div>
        <p className="text-xs text-slate-400 mt-1">Tháng {stats.month}/{stats.year}</p>
      </Card>

      {/* Chênh lệch thu chi */}
      <Card className="p-5 border-slate-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Dư ròng (Thu - Chi)
          </span>
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Scale className="w-4 h-4" />
          </div>
        </div>
        <div
          className={`text-2xl font-bold ${
            stats.netBalance >= 0 ? "text-blue-600" : "text-rose-600"
          }`}
        >
          {stats.netBalance >= 0 ? "+" : ""}
          {formatCurrency(stats.netBalance)}
        </div>
        <p className="text-xs text-slate-400 mt-1">
          {stats.netBalance >= 0 ? "Tích lũy dương" : "Chi vượt thu"}
        </p>
      </Card>
    </div>
  );
}

