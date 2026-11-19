"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import {
  Wallet,
  MonthlyStats,
  CategoryStat,
  SpendingForecast,
  BudgetStatus,
  Transaction,
  Category,
} from "@/types";
import DailyInsightCard from "@/components/journal/DailyInsightCard";
import QuickExpenseBar from "@/components/journal/QuickExpenseBar";
import DailyTimeline from "@/components/journal/DailyTimeline";
import WalletPockets from "@/components/journal/WalletPockets";
import BudgetHealthList from "@/components/journal/BudgetHealthList";
import ExpenseByCategoryChart from "@/components/dashboard/ExpenseByCategoryChart";
import MonthlyStatsCards from "@/components/dashboard/MonthlyStatsCards";
import TransferModal from "@/components/journal/TransferModal";
import Modal from "@/components/ui/Modal";
import TransactionForm from "@/components/transactions/TransactionForm";
import Spinner from "@/components/ui/Spinner";
import {
  Download,
  PlusCircle,
  RefreshCw,
  Calendar,
  BookOpen,
  PieChart as PieChartIcon,
} from "lucide-react";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats | null>(null);
  const [categoryStats, setCategoryStats] = useState<CategoryStat[]>([]);
  const [forecast, setForecast] = useState<SpendingForecast | null>(null);
  const [budgetStatus, setBudgetStatus] = useState<BudgetStatus[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [selectedMonth, setSelectedMonth] = useState<number>(11);
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [todaySpent, setTodaySpent] = useState<number>(0);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [
        walletsRes,
        totalRes,
        statsRes,
        catStatsRes,
        forecastRes,
        budgetsRes,
        txsRes,
        catsRes,
      ] = await Promise.all([
        api.getWallets().catch(() => []),
        api.getTotalBalance().catch(() => ({ total: 0 })),
        api.getMonthlyStats(selectedMonth, selectedYear).catch(() => null),
        api.getByCategory(selectedMonth, selectedYear).catch(() => []),
        api.getSpendingForecast(selectedMonth, selectedYear).catch(() => null),
        api.getBudgetStatus(selectedMonth, selectedYear).catch(() => []),
        api.getTransactions({ month: selectedMonth, year: selectedYear }).catch(() => []),
        api.getCategories().catch(() => []),
      ]);

      setWallets(walletsRes);
      setTotalBalance(totalRes.total);
      setMonthlyStats(statsRes);
      setCategoryStats(catStatsRes);
      setForecast(forecastRes);
      setBudgetStatus(budgetsRes);
      setTransactions(txsRes);
      setCategories(catsRes);

      // Tính chi tiêu hôm nay an toàn trong client effect
      const now = new Date();
      const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
      const spent = txsRes
        .filter((t: Transaction) => t.type === "EXPENSE" && t.date.startsWith(todayStr))
        .reduce((sum: number, t: Transaction) => sum + t.amount, 0);
      setTodaySpent(spent);
    } catch (err: any) {
      setError(err.message || "Không thể tải dữ liệu từ máy chủ API");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedMonth, selectedYear]);

  const handleDeleteTransaction = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa giao dịch này?")) return;
    try {
      await api.deleteTransaction(id);
      loadData();
    } catch (err: any) {
      alert(err.message || "Lỗi khi xóa");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16">
      {/* Editorial Journal Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <BookOpen className="w-4 h-4 text-slate-500" />
            <span>Nhật ký tài chính thường nhật</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Dòng tiền & Chi tiêu
          </h1>
        </div>

        {/* Thanh chọn tháng & Nút chức năng */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Month Selector Pills */}
          <div className="flex items-center p-1 bg-white rounded-2xl border border-[#E8E3D9] shadow-2xs">
            {[10, 11, 12].map((m) => (
              <button
                key={m}
                onClick={() => setSelectedMonth(m)}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                  selectedMonth === m
                    ? "bg-[#15803D] text-white shadow-xs"
                    : "text-[#57534E] hover:text-[#1C1917]"
                }`}
              >
                Tháng {m}
              </button>
            ))}
          </div>

          <button
            onClick={loadData}
            className="p-2 rounded-xl bg-white border border-[#E8E3D9] text-[#78716C] hover:text-[#1C1917] hover:bg-[#F4F1EA] shadow-2xs transition-colors"
            title="Làm mới"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={() => api.exportCSV(selectedMonth, selectedYear)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#E8E3D9] text-[#44403C] hover:bg-[#F4F1EA] hover:text-[#1C1917] text-xs font-bold shadow-2xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Xuất CSV</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white text-xs font-bold shadow-xs shadow-emerald-800/15 transition-all"
          >
            <PlusCircle className="w-4 h-4 text-emerald-200" />
            <span>Thêm mục</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-28">
          <Spinner className="w-8 h-8" />
          <p className="text-center text-xs text-[#78716C] mt-2">
            Đang mở trang nhật ký...
          </p>
        </div>
      ) : error ? (
        <div className="p-6 bg-rose-50 border border-rose-200 rounded-3xl text-rose-700 text-sm">
          <p className="font-bold mb-1">Không thể kết nối đến Backend API:</p>
          <p className="text-xs text-rose-600 mb-2">{error}</p>
          <p className="text-xs text-rose-500">
            Hãy đảm bảo bạn đã chạy <code>cd be && npm run dev</code> trên cổng 4000.
          </p>
        </div>
      ) : (
        <>
          {/* Tổng quan tháng 3 thẻ tinh tế */}
          {monthlyStats && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-white border border-[#E8E3D9] shadow-2xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#78716C]">
                  Thu nhập tháng {selectedMonth}
                </span>
                <div className="text-xl font-black text-[#15803D] tracking-tight mt-1">
                  +{monthlyStats.totalIncome.toLocaleString("vi-VN")} ₫
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#E8E3D9] shadow-2xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#78716C]">
                  Đã chi tiêu
                </span>
                <div className="text-xl font-black text-rose-600 tracking-tight mt-1">
                  -{monthlyStats.totalExpense.toLocaleString("vi-VN")} ₫
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#E8E3D9] shadow-2xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#78716C]">
                  Dư tích lũy
                </span>
                <div
                  className={`text-xl font-black tracking-tight mt-1 ${
                    monthlyStats.netBalance >= 0 ? "text-[#1C1917]" : "text-rose-600"
                  }`}
                >
                  {monthlyStats.netBalance >= 0 ? "+" : ""}
                  {monthlyStats.netBalance.toLocaleString("vi-VN")} ₫
                </div>
              </div>
            </div>
          )}

          {/* BỐ CỤC 2 CỘT CHÍNH (EDITORIAL JOURNAL LAYOUT) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* CỘT TRÁI (65% = 8 cols): DAILY TIMELINE FEED */}
            <div className="lg:col-span-8 space-y-5">
              {/* Thẻ nhận định thông minh hôm nay */}
              <DailyInsightCard
                forecast={forecast}
                budgetStatus={budgetStatus}
                todaySpent={todaySpent}
              />

              {/* Thanh nhập nhanh 1 dòng kiểu Quick Note */}
              <QuickExpenseBar
                wallets={wallets}
                categories={categories}
                onSuccess={loadData}
                onOpenFullModal={() => setIsAddModalOpen(true)}
              />

              {/* Dòng thời gian Timeline theo từng ngày */}
              <div className="pt-2">
                <DailyTimeline
                  transactions={transactions}
                  onDeleteTransaction={handleDeleteTransaction}
                />
              </div>
            </div>

            {/* CỘT PHẢI (35% = 4 cols): FINANCIAL VITALS SIDEBAR */}
            <div className="lg:col-span-4 space-y-5">
              {/* Thẻ Ví Pockets */}
              <WalletPockets
                wallets={wallets}
                totalBalance={totalBalance}
                onOpenTransfer={() => setIsTransferModalOpen(true)}
              />

              {/* Hạn mức ngân sách */}
              <BudgetHealthList
                budgets={budgetStatus}
                month={selectedMonth}
                year={selectedYear}
              />

              {/* Cơ cấu chi tiêu theo nhóm */}
              <div className="bg-white rounded-3xl p-5 border border-[#E8E3D9] shadow-2xs">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-6 h-6 rounded-lg bg-[#DCFCE7] text-[#15803D] flex items-center justify-center">
                    <PieChartIcon className="w-3.5 h-3.5" />
                  </span>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#1C1917]">
                    Cơ cấu chi tiêu
                  </h3>
                </div>
                <ExpenseByCategoryChart data={categoryStats} />
              </div>
            </div>
          </div>
        </>
      )}

      {/* Modal Thêm Giao Dịch Đầy Đủ */}
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

      {/* Modal Chuyển Tiền Giữa Các Ví */}
      <Modal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        title="Chuyển tiền nội bộ giữa các ví"
      >
        <TransferModal
          wallets={wallets}
          onSuccess={() => {
            setIsTransferModalOpen(false);
            loadData();
          }}
        />
      </Modal>
    </div>
  );
}
