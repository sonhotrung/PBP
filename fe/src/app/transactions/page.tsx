"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Transaction, Wallet, Category } from "@/types";
import TransactionList from "@/components/transactions/TransactionList";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import TransactionForm from "@/components/transactions/TransactionForm";
import Spinner from "@/components/ui/Spinner";
import { PlusCircle, Download, RefreshCw, Filter } from "lucide-react";

export default function TransactionsPage() {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [selectedMonth, setSelectedMonth] = useState<number>(11);
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [selectedType, setSelectedType] = useState<string>("");

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
    if (!confirm("Bạn có chắc chắn muốn xóa giao dịch này?")) return;
    try {
      await api.deleteTransaction(id);
      loadData();
    } catch (err: any) {
      alert(err.message || "Không thể xóa giao dịch");
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Lịch sử Giao dịch
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Theo dõi chi tiết các khoản thu, chi và chuyển tiền nội bộ
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => api.exportCSV(selectedMonth, selectedYear)}
            className="flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" /> Xuất CSV
          </Button>

          <Button
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 font-semibold"
          >
            <PlusCircle className="w-4 h-4" /> Thêm giao dịch
          </Button>
        </div>
      </div>

      {/* Bộ lọc Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Filter className="w-4 h-4" /> Bộ lọc:
          </div>

          {/* Chọn Tháng */}
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {[10, 11, 12].map((m) => (
              <option key={m} value={m}>
                Tháng {m}
              </option>
            ))}
          </select>

          {/* Chọn Năm */}
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={2026}>Năm 2026</option>
            <option value={2025}>Năm 2025</option>
          </select>

          {/* Chọn Loại */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả loại giao dịch</option>
            <option value="EXPENSE">Chi tiêu</option>
            <option value="INCOME">Thu nhập</option>
            <option value="TRANSFER">Chuyển tiền nội bộ</option>
          </select>
        </div>

        <span className="text-xs text-slate-400 font-medium">
          Hiển thị {transactions.length} giao dịch
        </span>
      </div>

      {/* Danh sách */}
      {loading ? (
        <div className="py-24">
          <Spinner className="w-8 h-8" />
        </div>
      ) : (
        <TransactionList transactions={transactions} onDelete={handleDelete} />
      )}

      {/* Modal Thêm Giao Dịch */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Thêm giao dịch mới"
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
