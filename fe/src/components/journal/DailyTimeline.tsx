"use client";

import React from "react";
import { Transaction } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";
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
  Calendar,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react";

interface DailyTimelineProps {
  transactions: Transaction[];
  onDeleteTransaction?: (id: string) => void;
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

interface DayGroup {
  dateStr: string; // "2026-11-13"
  label: string;   // "Hôm nay", "Hôm qua", "Thứ Sáu, 13/11/2026"
  totalExpense: number;
  totalIncome: number;
  items: Transaction[];
}

export default function DailyTimeline({
  transactions,
  onDeleteTransaction,
}: DailyTimelineProps) {
  const [groups, setGroups] = React.useState<DayGroup[]>([]);

  // 1. Nhóm các giao dịch theo ngày (an toàn với prerender của Next.js 16)
  React.useEffect(() => {
    const map = new Map<string, Transaction[]>();

    transactions.forEach((tx) => {
      const d = new Date(tx.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
        d.getDate()
      ).padStart(2, "0")}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(tx);
    });

    const now = new Date();
    const todayKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterdayKey = `${yesterdayDate.getFullYear()}-${String(yesterdayDate.getMonth() + 1).padStart(2, "0")}-${String(yesterdayDate.getDate()).padStart(2, "0")}`;

    const result: DayGroup[] = [];
    map.forEach((items, dateKey) => {
      let label = "";
      if (dateKey === todayKey) {
        label = "Hôm nay";
      } else if (dateKey === yesterdayKey) {
        label = "Hôm qua";
      } else {
        const [y, m, d] = dateKey.split("-");
        const dt = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
        const dayNames = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
        label = `${dayNames[dt.getDay()]}, ${d}/${m}/${y}`;
      }

      let totalExpense = 0;
      let totalIncome = 0;
      items.forEach((item) => {
        if (item.type === "EXPENSE") totalExpense += item.amount;
        if (item.type === "INCOME") totalIncome += item.amount;
      });

      result.push({
        dateStr: dateKey,
        label,
        totalExpense,
        totalIncome,
        items,
      });
    });

    // Sắp xếp ngày mới nhất lên trước
    setGroups(result.sort((a, b) => b.dateStr.localeCompare(a.dateStr)));
  }, [transactions]);

  if (!transactions || transactions.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-200">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-3">
          <Calendar className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-semibold text-slate-700">Chưa có mục nhật ký nào</h4>
        <p className="text-xs text-slate-400 mt-1">
          Hãy nhập nhanh một khoản thu hoặc chi để bắt đầu trang nhật ký hôm nay!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {groups.map((group) => (
        <div key={group.dateStr} className="relative">
          {/* Header của từng ngày (Editorial Journal Date Tag) */}
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-200/80">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-slate-900" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                {group.label}
              </h3>
              <span className="text-[11px] text-slate-400 font-medium">
                ({group.items.length} giao dịch)
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs font-bold">
              {group.totalExpense > 0 && (
                <span className="text-slate-700 font-semibold">
                  Chi: <span className="text-rose-600">-{formatCurrency(group.totalExpense)}</span>
                </span>
              )}
              {group.totalIncome > 0 && (
                <span className="text-slate-700 font-semibold">
                  Thu: <span className="text-emerald-600">+{formatCurrency(group.totalIncome)}</span>
                </span>
              )}
            </div>
          </div>

          {/* Danh sách các giao dịch trong ngày dạng Feed Cards */}
          <div className="space-y-2">
            {group.items.map((tx) => {
              const isIncome = tx.type === "INCOME";
              const isTransfer = tx.type === "TRANSFER";
              const icon = (tx.category?.icon && ICON_MAP[tx.category.icon]) || <Tag className="w-4 h-4" />;
              const timeStr = new Date(tx.date).toLocaleTimeString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <div
                  key={tx.id}
                  className="group flex items-center justify-between p-3.5 bg-white hover:bg-slate-50/80 rounded-2xl border border-slate-100 hover:border-slate-200 shadow-2xs transition-all"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-2xs"
                      style={{
                        backgroundColor: tx.category?.color ? `${tx.category.color}18` : "#F1F5F9",
                        color: tx.category?.color || "#475569",
                      }}
                    >
                      {icon}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-800 truncate">
                          {tx.description || tx.category?.name || "Giao dịch không tên"}
                        </span>
                        <span className="text-[11px] text-slate-400 flex items-center gap-1 shrink-0">
                          <Clock className="w-3 h-3" /> {timeStr}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                        {tx.category && (
                          <span className="font-medium text-slate-600">
                            {tx.category.name}
                          </span>
                        )}
                        <span>•</span>
                        <span className="px-1.5 py-0.5 rounded-md bg-slate-100 text-[10px] font-semibold text-slate-600">
                          {tx.wallet?.name || "Ví chính"}
                        </span>
                        {isTransfer && tx.toWallet && (
                          <span className="text-[11px] text-blue-600 font-medium">
                            ➔ {tx.toWallet.name}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 ml-4">
                    <div className="text-right">
                      <span
                        className={`text-sm font-extrabold tracking-tight ${
                          isIncome
                            ? "text-emerald-600"
                            : isTransfer
                            ? "text-blue-600"
                            : "text-slate-900"
                        }`}
                      >
                        {isIncome ? "+" : isTransfer ? "⇄ " : "-"}
                        {formatCurrency(tx.amount)}
                      </span>
                    </div>

                    {onDeleteTransaction && (
                      <button
                        onClick={() => onDeleteTransaction(tx.id)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                        title="Xóa mục này"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
