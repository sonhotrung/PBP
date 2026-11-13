import React from "react";
import Card from "@/components/ui/Card";
import { formatCurrency } from "@/lib/utils";
import { SpendingForecast } from "@/types";
import { Sparkles, Calendar, TrendingUp } from "lucide-react";

interface ForecastCardProps {
  forecast: SpendingForecast;
}

export default function ForecastCard({ forecast }: ForecastCardProps) {
  return (
    <Card className="p-6 border-slate-200 bg-gradient-to-br from-indigo-50/50 via-white to-blue-50/30">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800">
              Dự báo chi tiêu cuối tháng
            </h3>
            <p className="text-xs text-slate-500">
              Tháng {forecast.month}/{forecast.year}
            </p>
          </div>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 font-medium border border-indigo-100 flex items-center gap-1">
          <Calendar className="w-3 h-3" /> Còn {forecast.daysRemaining} ngày
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
          <span className="text-xs text-slate-500 block mb-1">Đã chi hiện tại</span>
          <span className="text-lg font-bold text-slate-800">
            {formatCurrency(forecast.currentSpent)}
          </span>
          <span className="text-[11px] text-slate-400 block mt-0.5">
            ({forecast.daysElapsed} ngày qua)
          </span>
        </div>

        <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
          <span className="text-xs text-slate-500 block mb-1">Trung bình mỗi ngày</span>
          <span className="text-lg font-bold text-amber-600">
            {formatCurrency(forecast.avgPerDay)}
          </span>
          <span className="text-[11px] text-slate-400 block mt-0.5">/ ngày</span>
        </div>

        <div className="p-3 bg-white rounded-xl border border-indigo-100 shadow-sm bg-gradient-to-br from-indigo-50/30 to-transparent">
          <span className="text-xs text-indigo-600 font-medium block mb-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Dự kiến hết tháng
          </span>
          <span className="text-lg font-bold text-indigo-700">
            {formatCurrency(forecast.projectedTotal)}
          </span>
          <span className="text-[11px] text-indigo-500/80 block mt-0.5">
            Dựa trên tốc độ chi tiêu
          </span>
        </div>
      </div>
    </Card>
  );
}
