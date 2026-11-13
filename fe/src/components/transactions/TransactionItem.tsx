import React from "react";
import { Transaction } from "@/types";
import { formatCurrency, formatDateShort } from "@/lib/utils";
import {
  Utensils,
  ShoppingBag,
  Home,
  Car,
  Film,
  Briefcase,
  TrendingUp,
  ArrowRightLeft,
  Tag,
  Trash2,
} from "lucide-react";

interface TransactionItemProps {
  transaction: Transaction;
  onDelete?: (id: string) => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Utensils: <Utensils className="w-4 h-4" />,
  ShoppingBag: <ShoppingBag className="w-4 h-4" />,
  Home: <Home className="w-4 h-4" />,
  Car: <Car className="w-4 h-4" />,
  Film: <Film className="w-4 h-4" />,
  Briefcase: <Briefcase className="w-4 h-4" />,
  TrendingUp: <TrendingUp className="w-4 h-4" />,
  ArrowRightLeft: <ArrowRightLeft className="w-4 h-4" />,
};

export default function TransactionItem({ transaction, onDelete }: TransactionItemProps) {
  const isIncome = transaction.type === "INCOME";
  const isTransfer = transaction.type === "TRANSFER";
  const icon = (transaction.category?.icon && ICON_MAP[transaction.category.icon]) || (
    <Tag className="w-4 h-4" />
  );

  return (
    <div className="flex items-center justify-between p-4 hover:bg-slate-50/80 transition-colors border-b border-slate-100 last:border-b-0 group">
      <div className="flex items-center gap-3 min-w-0">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
          style={{
            backgroundColor: transaction.category?.color ? `${transaction.category.color}20` : "#F1F5F9",
            color: transaction.category?.color || "#64748B",
          }}
        >
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-800 truncate">
            {transaction.description || transaction.category?.name || "Giao dịch"}
          </p>
          <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
            <span>{formatDateShort(transaction.date)}</span>
            <span>•</span>
            <span>{transaction.wallet?.name || "Ví"}</span>
            {isTransfer && transaction.toWallet && (
              <>
                <span>→</span>
                <span>{transaction.toWallet.name}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0 ml-4">
        <span
          className={`text-sm font-bold ${
            isIncome
              ? "text-emerald-600"
              : isTransfer
              ? "text-blue-600"
              : "text-slate-900"
          }`}
        >
          {isIncome ? "+" : isTransfer ? "⇄ " : "-"}
          {formatCurrency(transaction.amount)}
        </span>

        {onDelete && (
          <button
            onClick={() => onDelete(transaction.id)}
            className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
            title="Xóa giao dịch"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
