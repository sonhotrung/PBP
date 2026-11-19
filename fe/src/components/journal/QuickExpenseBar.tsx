"use client";

import React, { useState } from "react";
import { Plus, Send } from "lucide-react";
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
    <div className="bg-white rounded-3xl border border-[#E8E3D9] shadow-2xs p-3.5 transition-all hover:border-[#D8D2C6]">
      <form onSubmit={handleQuickSubmit} className="flex flex-col sm:flex-row items-center gap-2.5">
        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 pl-1">
          <span className="w-8 h-8 rounded-xl bg-[#DCFCE7] flex items-center justify-center text-[#15803D]">
            <Plus className="w-4 h-4" />
          </span>
          <span className="text-xs font-black text-[#1C1917] whitespace-nowrap">
            Ghi nhanh:
          </span>
        </div>

        {/* Ô nhập số tiền (Nền Be nhạt) */}
        <div className="relative w-full sm:w-36 shrink-0">
          <input
            type="number"
            placeholder="Số tiền (đ)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full text-xs font-bold px-3 py-2 rounded-xl bg-[#F7F5F0] border border-[#E8E3D9] text-[#1C1917] focus:outline-none focus:ring-2 focus:ring-[#15803D]/20 focus:border-[#15803D]"
            required
          />
        </div>

        {/* Ô nhập mô tả (Nền Be nhạt) */}
        <div className="w-full sm:flex-1">
          <input
            type="text"
            placeholder="Bạn vừa chi việc gì? (Cà phê, Ăn trưa, Đổ xăng...)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full text-xs px-3 py-2 rounded-xl bg-[#F7F5F0] border border-[#E8E3D9] text-[#1C1917] focus:outline-none focus:ring-2 focus:ring-[#15803D]/20 focus:border-[#15803D]"
          />
        </div>

        {/* Chọn danh mục */}
        <div className="w-full sm:w-36 shrink-0">
          <select
            value={selectedCategoryId}
            onChange={(e) => setSelectedCategoryId(e.target.value)}
            className="w-full text-xs px-2.5 py-2 rounded-xl bg-[#F7F5F0] border border-[#E8E3D9] text-[#44403C] focus:outline-none focus:border-[#15803D] font-medium"
          >
            <option value="">-- Danh mục --</option>
            {expenseCategories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Nút Lưu (Xanh Lá Cây) & Chi tiết (Be) */}
        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
          <button
            type="submit"
            disabled={loading || !amount}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-[#15803D] hover:bg-[#166534] disabled:opacity-40 text-white text-xs font-bold rounded-xl transition-all shadow-xs shadow-emerald-800/15"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Lưu</span>
          </button>

          <button
            type="button"
            onClick={onOpenFullModal}
            className="px-2.5 py-2 text-xs font-semibold text-[#78716C] hover:text-[#1C1917] hover:bg-[#F4F1EA] rounded-xl transition-colors whitespace-nowrap"
            title="Mở form chi tiết"
          >
            Chi tiết...
          </button>
        </div>
      </form>
    </div>
  );
}
