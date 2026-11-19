"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Transaction, Wallet, Category } from "@/types";
import DailyTimeline from "@/components/journal/DailyTimeline";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import TransactionForm from "@/components/transactions/TransactionForm";
import Spinner from "@/components/ui/Spinner";
import {
  Download,
  PlusCircle,
  ReceiptText,
  Filter,
  Search,
  ArrowUpDown,
} from "lucide-react";

export default function TransactionsPage() {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [selectedMonth, setSelectedMonth] = useState<number>(11);
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [selectedType, setSelectedType] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const params: any = {
        month: selectedMonth,
        year: selectedYear,
      };
      if (selectedType) params.type = selectedType;

      const [txsRes, walletsRes, catsRes] = await Promise.all([
        api.getTransactions(params).catch(() => []),
        api.getWallets().catch(() => []),
        api.getCategories().catch(() => []),
      ]);

      setTransactions(txsRes);
      setWallets(walletsRes);
      setCategories(catsRes);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedMonth, selectedYear, selectedType]);

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa mục giao dịch này?")) return;
    try {
      await api.deleteTransaction(id);
      loadData();
    } catch (err: any) {
      alert(err.message || "Không thể xóa giao dịch");
    }
  };

  // Lọc theo từ khóa tìm kiếm
  const filteredTransactions = React.useMemo(() => {
    if (!searchQuery.trim()) return transactions;
    const q = searchQuery.toLowerCase();
    return transactions.filter(
      (t) =>
        t.description?.toLowerCase().includes(q) ||
        t.category?.name.toLowerCase().includes(q) ||
        t.wallet?.name.toLowerCase().includes(q)
    );
  }, [transactions, searchQuery]);

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <ReceiptText className="w-4 h-4 text-slate-500" />
            <span>Sổ cái chi tiết</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Lịch sử giao dịch
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => api.exportCSV(selectedMonth, selectedYear)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-emerald-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 text-xs font-semibold shadow-2xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Xuất CSV</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs shadow-emerald-600/25 transition-colors"
          >
            <PlusCircle className="w-4 h-4 text-emerald-200" />
            <span>Thêm mục</span>
          </button>
        </div>
      </div>

      {/* Bộ lọc Filter Bar dạng Editorial Strip */}
      <div className="bg-white p-3.5 rounded-2xl border border-emerald-100 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Month Selector Pills */}
          <div className="flex items-center p-0.5 bg-slate-100 rounded-xl">
            {[10, 11, 12].map((m) => (
              <button
                key={m}
                onClick={() => setSelectedMonth(m)}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  selectedMonth === m
                    ? "bg-emerald-700 text-white shadow-2xs"
                    : "text-slate-500 hover:text-emerald-800"
                }`}
              >
                T{m}
              </button>
            ))}
          </div>

          {/* Type Filter Pills */}
          <div className="flex items-center p-0.5 bg-slate-100 rounded-xl">
            {[
              { id: "", label: "Tất cả" },
              { id: "EXPENSE", label: "Chi tiêu" },
              { id: "INCOME", label: "Thu nhập" },
              { id: "TRANSFER", label: "Chuyển ví" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedType(t.id)}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                  selectedType === t.id
                    ? "bg-emerald-700 text-white shadow-2xs"
                    : "text-slate-500 hover:text-emerald-800"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Ô tìm kiếm */}
        <div className="relative w-full sm:w-56">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo mô tả, danh mục..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>
      </div>

      {/* Danh sách dòng thời gian */}
      {loading ? (
        <div className="py-24">
          <Spinner className="w-8 h-8" />
        </div>
      ) : (
        <DailyTimeline
          transactions={filteredTransactions}
          onDeleteTransaction={handleDelete}
        />
      )}

      {/* Modal Thêm Giao Dịch */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Ghi chép giao dịch mới"
      >
        <TransactionForm
          wallets={wallets}
          categories={categories}
          onSuccess={() => {
            setIsAddModalOpen(false);
            loadData();
          }}
        />
      </Modal>
    </div>
  );
}
