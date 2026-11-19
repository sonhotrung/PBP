import React from "react";
import { formatCurrency } from "@/lib/utils";
import { Sparkles, CalendarDays, TrendingUp, AlertCircle } from "lucide-react";
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
  const warningBudgets = budgetStatus.filter((b) => b.status === "WARNING" || b.status === "DANGER");

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-rose-500/10 border border-amber-200/60 p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-500/20 text-amber-700">
              <Sparkles className="h-3.5 w-3.5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800/80">
              Nhật ký dòng tiền hôm nay
            </span>
          </div>

          <h2 className="text-lg font-bold text-slate-800 tracking-tight">
            {todaySpent > 0 ? (
              <>
                Hôm nay bạn đã chi{" "}
                <span className="text-rose-600 underline decoration-rose-300 underline-offset-4">
                  {formatCurrency(todaySpent)}
                </span>
              </>
            ) : (
              "Hôm nay bạn chưa có khoản chi tiêu nào"
            )}
          </h2>

          <p className="text-xs text-slate-600 leading-relaxed max-w-xl">
            {forecast ? (
              <>
                Tốc độ chi tiêu trung bình tháng này là{" "}
                <strong>{formatCurrency(forecast.avgPerDay)}/ngày</strong>. Còn{" "}
                <strong>{forecast.daysRemaining} ngày</strong> nữa sẽ kết thúc tháng.
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
          <div className="hidden sm:flex flex-col items-end shrink-0 bg-white/80 backdrop-blur-sm px-4 py-2.5 rounded-xl border border-amber-100 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-amber-500" /> Dự kiến cuối tháng
            </span>
            <span className="text-base font-extrabold text-slate-900 mt-0.5">
              {formatCurrency(forecast.projectedTotal)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
