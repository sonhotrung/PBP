import React from "react";
import { BudgetStatus } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { Target, AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";

interface BudgetHealthListProps {
  budgets: BudgetStatus[];
  month: number;
  year: number;
}

export default function BudgetHealthList({
  budgets,
  month,
  year,
}: BudgetHealthListProps) {
  if (!budgets || budgets.length === 0) return null;

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs space-y-4">
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Target className="w-3.5 h-3.5" />
          </span>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Hạn mức tháng {month}/{year}
          </h3>
        </div>

        <Link
          href="/budgets"
          className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 hover:underline"
        >
          Quản lý ➔
        </Link>
      </div>

      <div className="space-y-3 pt-1 border-t border-slate-100">
        {budgets.map((b) => {
          const isExceeded = b.status === "EXCEEDED";
          const isDanger = b.status === "DANGER" || b.status === "WARNING";
          const cappedPct = Math.min(b.percentage, 100);

          let barColor = "bg-emerald-500";
          let badgeColor = "text-emerald-700 bg-emerald-50";

          if (isExceeded) {
            barColor = "bg-rose-500";
            badgeColor = "text-rose-700 bg-rose-50";
          } else if (isDanger) {
            barColor = "bg-amber-500";
            badgeColor = "text-amber-700 bg-amber-50";
          }

          return (
            <div key={b.budgetId} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                  {b.categoryName}
                  {isExceeded && (
                    <AlertCircle className="w-3 h-3 text-rose-500 shrink-0" />
                  )}
                </span>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400">
                    {formatCurrency(b.spentAmount)} / {formatCurrency(b.budgetAmount)}
                  </span>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${badgeColor}`}>
                    {b.percentage.toFixed(0)}%
                  </span>
                </div>
              </div>

              {/* Thanh tiến độ mảnh tinh tế */}
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                  style={{ width: `${cappedPct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
