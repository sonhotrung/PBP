import React from "react";
import { BudgetStatus } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { AlertTriangle, AlertCircle } from "lucide-react";

interface BudgetAlertProps {
  budgets: BudgetStatus[];
}

export default function BudgetAlert({ budgets }: BudgetAlertProps) {
  const alertedBudgets = budgets.filter(
    (b) => b.status === "EXCEEDED" || b.status === "DANGER" || b.status === "WARNING"
  );

  if (alertedBudgets.length === 0) return null;

  return (
    <div className="space-y-2 mb-6">
      {alertedBudgets.map((b) => {
        const isExceeded = b.status === "EXCEEDED";
        return (
          <div
            key={b.budgetId}
            className={`p-4 rounded-xl border flex items-center justify-between gap-3 text-sm animate-fade-in ${
              isExceeded
                ? "bg-rose-50 border-rose-200 text-rose-800"
                : "bg-amber-50 border-amber-200 text-amber-800"
            }`}
          >
            <div className="flex items-center gap-3">
              {isExceeded ? (
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              )}
              <div>
                <span className="font-semibold">{b.categoryName}: </span>
                {isExceeded ? (
                  <span>
                    Đã vượt ngân sách <strong>{formatCurrency(Math.abs(b.remainingAmount))}</strong> ({b.percentage.toFixed(0)}%)!
                  </span>
                ) : (
                  <span>
                    Đã sử dụng <strong>{b.percentage.toFixed(0)}%</strong> ngân sách tháng!
                  </span>
                )}
              </div>
            </div>
            <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/60">
              {isExceeded ? "Cảnh báo đỏ" : "Chú ý"}
            </span>
          </div>
        );
      })}
    </div>
  );
}
