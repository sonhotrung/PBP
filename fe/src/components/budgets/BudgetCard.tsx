import React from "react";
import Card from "@/components/ui/Card";
import { BudgetStatus } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { AlertCircle, CheckCircle2, AlertTriangle } from "lucide-react";

interface BudgetCardProps {
  budget: BudgetStatus;
}

export default function BudgetCard({ budget }: BudgetCardProps) {
  const isExceeded = budget.status === "EXCEEDED";
  const isDanger = budget.status === "DANGER";
  const isWarning = budget.status === "WARNING";

  let statusBg = "bg-emerald-50 text-emerald-700 border-emerald-100";
  let progressBarColor = "bg-emerald-500";
  let StatusIcon = CheckCircle2;

  if (isExceeded) {
    statusBg = "bg-rose-50 text-rose-700 border-rose-100";
    progressBarColor = "bg-rose-500";
    StatusIcon = AlertCircle;
  } else if (isDanger) {
    statusBg = "bg-orange-50 text-orange-700 border-orange-100";
    progressBarColor = "bg-orange-500";
    StatusIcon = AlertTriangle;
  } else if (isWarning) {
    statusBg = "bg-amber-50 text-amber-700 border-amber-100";
    progressBarColor = "bg-amber-500";
    StatusIcon = AlertTriangle;
  }

  const cappedPercentage = Math.min(budget.percentage, 100);

  return (
    <Card className={`p-5 border transition-all ${isExceeded ? "border-rose-200 shadow-sm" : "border-slate-200"}`}>
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-slate-800 text-sm">{budget.categoryName}</h4>
        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border flex items-center gap-1 ${statusBg}`}>
          <StatusIcon className="w-3 h-3" />
          {budget.percentage.toFixed(0)}%
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mb-3">
        <div
          className={`h-full rounded-full transition-all duration-500 ${progressBarColor}`}
          style={{ width: `${cappedPercentage}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-xs">
        <div>
          <span className="text-slate-400 block">Đã chi</span>
          <span className="font-bold text-slate-800">
            {formatCurrency(budget.spentAmount)}
          </span>
        </div>
        <div className="text-right">
          <span className="text-slate-400 block">
            {isExceeded ? "Vượt ngân sách" : "Còn lại"}
          </span>
          <span
            className={`font-bold ${
              isExceeded ? "text-rose-600" : "text-slate-800"
            }`}
          >
            {formatCurrency(Math.abs(budget.remainingAmount))}
          </span>
        </div>
      </div>
    </Card>
  );
}
