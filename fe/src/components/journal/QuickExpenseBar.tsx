"use client";

import React, { useState } from "react";
import { Plus, ArrowRightLeft, Sparkles, Send } from "lucide-react";
import { Wallet, Category } from "@/types";
import { api } from "@/lib/api";

interface QuickExpenseBarProps {
  wallets: Wallet[];
  categories: Category[];
  onSuccess: () => void;
  onOpenFullModal: () => void;
}

export default function QuickExpenseBar({
  wallets,
  categories,
  onSuccess,
  onOpenFullModal,
}: QuickExpenseBarProps) {
  const [amount, setAmount] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [selectedWalletId, setSelectedWalletId] = useState<string>(wallets[0]?.id || "");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const expenseCategories = categories.filter((c) => c.type === "EXPENSE");

  const handleQuickSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount.replace(/[^0-9]/g, ""));
    if (!numAmount || numAmount <= 0) return;

    try {
      setLoading(true);
      await api.createTransaction({
        amount: numAmount,
        type: "EXPENSE",
        description: description.trim() || "Chi tiêu nhanh",
        date: new Date().toISOString(),
        walletId: selectedWalletId || wallets[0]?.id || "",
        categoryId: selectedCategoryId || expenseCategories[0]?.id,
      });

      setAmount("");
      setDescription("");
      onSuccess();
    } catch (err: any) {
      alert(err.message || "Lỗi khi thêm nhanh");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-3 transition-all hover:border-slate-300">
      <form onSubmit={handleQuickSubmit} className="flex flex-col sm:flex-row items-center gap-2.5">
        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 pl-1">
          <span className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
            <Plus className="w-4 h-4" />
          </span>
          <span className="text-xs font-bold text-slate-700 whitespace-nowrap">
            Ghi nhanh:
          </span>
        </div>

        {/* Ô nhập số tiền */}
        <div className="relative w-full sm:w-36 shrink-0">
          <input
            type="number"
            placeholder="Số tiền (đ)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full text-xs font-semibold px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            required
          />
        </div>

        {/* Ô nhập mô tả */}
        <div className="w-full sm:flex-1">
          <input
            type="text"
            placeholder="Bạn vừa chi cho việc gì? (Cà phê, Ăn trưa, Đổ xăng...)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        {/* Chọn danh mục */}
        <div className="w-full sm:w-36 shrink-0">
          <select
            value={selectedCategoryId}
            onChange={(e) => setSelectedCategoryId(e.target.value)}
            className="w-full text-xs px-2.5 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none text-slate-700 font-medium"
          >
            <option value="">-- Danh mục --</option>
            {expenseCategories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Nút gửi & nút mở form đầy đủ */}
        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
          <button
            type="submit"
            disabled={loading || !amount}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white text-xs font-semibold rounded-xl transition-colors shadow-xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Lưu</span>
          </button>

          <button
            type="button"
            onClick={onOpenFullModal}
            className="px-2.5 py-2 text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors whitespace-nowrap"
            title="Mở form chi tiết (Thu/Chi/Chuyển khoản)"
          >
            Chi tiết...
          </button>
        </div>
      </form>
    </div>
  );
}
