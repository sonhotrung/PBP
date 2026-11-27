import React from "react";
import { formatCurrency } from "@/lib/utils";
import { Sparkles, TrendingUp, AlertCircle } from "lucide-react";
import { SpendingForecast, BudgetStatus } from "@/types";

interface DailyInsightCardProps {
  forecast: SpendingForecast | null;
  budgetStatus: BudgetStatus[];
  todaySpent: number;
}

export default function DailyInsightCard({
  forecast,
  budgetStatus,
  todaySpent,
}: DailyInsightCardProps) {
  const exceededBudgets = budgetStatus.filter((b) => b.status === "EXCEEDED");

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#F2F8F4] via-white to-[#FAF6EE] border border-[#E5DFD4] p-5 shadow-2xs">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#DCFCE7] text-[#15803D] border border-emerald-200/50">
              <Sparkles className="h-3.5 w-3.5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#15803D]">
              Nhật ký dòng tiền hôm nay
            </span>
          </div>

          <h2 className="text-lg font-bold text-[#1C1917] tracking-tight">
            {todaySpent > 0 ? (
              <>
                Hôm nay bạn đã chi{" "}
                <span className="text-rose-600 underline decoration-rose-300 underline-offset-4 font-black">
                  {formatCurrency(todaySpent)}
                </span>
              </>
            ) : (
              "Hôm nay bạn chưa có khoản chi tiêu nào"
            )}
          </h2>

          <p className="text-xs text-[#57534E] leading-relaxed max-w-xl">
            {forecast ? (
              <>
                Tốc độ chi tiêu trung bình tháng này là{" "}
                <strong className="text-[#15803D] font-bold">{formatCurrency(forecast.avgPerDay)}/ngày</strong>. Còn{" "}
                <strong className="text-[#1C1917] font-bold">{forecast.daysRemaining} ngày</strong> nữa sẽ kết thúc tháng.
                {exceededBudgets.length > 0 && (
                  <span className="block mt-1 text-rose-600 font-semibold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 inline shrink-0" />
                    Cảnh báo: Danh mục {exceededBudgets.map((b) => b.categoryName).join(", ")} đã vượt hạn mức ngân sách!
                  </span>
                )}
              </>
            ) : (
              "Hãy duy trì thói quen ghi nhận mọi khoản chi để có dự báo chính xác nhất."
            )}
          </p>
        </div>

        {forecast && (
          <div className="hidden sm:flex flex-col items-end shrink-0 bg-white px-4 py-2.5 rounded-2xl border border-[#E8E3D9] shadow-2xs">
            <span className="text-[11px] font-bold text-[#78716C] uppercase tracking-wider flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-[#15803D]" /> Dự kiến cuối tháng
            </span>
            <span className="text-base font-black text-[#15803D] mt-0.5">
              {formatCurrency(forecast.projectedTotal)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
