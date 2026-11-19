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
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#E8E3D9]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#15803D]" />
              <h3 className="text-xs font-black uppercase tracking-wider text-[#1C1917]">
                {group.label}
              </h3>
              <span className="text-[11px] text-[#78716C] font-semibold">
                ({group.items.length} giao dịch)
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs font-bold">
              {group.totalExpense > 0 && (
                <span className="text-[#57534E] font-medium">
                  Chi: <span className="text-rose-600 font-bold">-{formatCurrency(group.totalExpense)}</span>
                </span>
              )}
              {group.totalIncome > 0 && (
                <span className="text-[#57534E] font-medium">
                  Thu: <span className="text-[#15803D] font-bold">+{formatCurrency(group.totalIncome)}</span>
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
                  className="group flex items-center justify-between p-3.5 bg-white hover:bg-[#FAF7F2] rounded-2xl border border-[#EFECE6] hover:border-[#E0D9CD] shadow-2xs transition-all"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-2xs"
                      style={{
                        backgroundColor: tx.category?.color ? `${tx.category.color}18` : "#F5F2EB",
                        color: tx.category?.color || "#57534E",
                      }}
                    >
                      {icon}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-[#1C1917] truncate">
                          {tx.description || tx.category?.name || "Giao dịch không tên"}
                        </span>
                        <span className="text-[11px] text-[#A8A29E] flex items-center gap-1 shrink-0">
                          <Clock className="w-3 h-3" /> {timeStr}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mt-0.5 text-xs text-[#78716C]">
                        {tx.category && (
                          <span className="font-semibold text-[#57534E]">
                            {tx.category.name}
                          </span>
                        )}
                        <span>•</span>
                        <span className="font-medium text-[#78716C]">
                          {tx.wallet?.name || "Ví chính"}
                        </span>
                        {isTransfer && tx.toWallet && (
                          <span className="text-[11px] text-[#15803D] font-bold">
                            ➔ {tx.toWallet.name}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 ml-4">
                    <div className="text-right">
                      <span
                        className={`text-sm font-black tracking-tight ${
                          isIncome
                            ? "text-[#15803D]"
                            : isTransfer
                            ? "text-blue-600"
                            : "text-[#1C1917]"
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
