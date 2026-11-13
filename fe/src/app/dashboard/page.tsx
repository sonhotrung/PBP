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
import TotalBalanceCard from "@/components/dashboard/TotalBalanceCard";
import WalletCard from "@/components/dashboard/WalletCard";
import MonthlyStatsCards from "@/components/dashboard/MonthlyStatsCards";
import ExpenseByCategoryChart from "@/components/dashboard/ExpenseByCategoryChart";
import MonthlyBarChart from "@/components/dashboard/MonthlyBarChart";
import ForecastCard from "@/components/dashboard/ForecastCard";
import BudgetAlert from "@/components/budgets/BudgetAlert";
import TransactionList from "@/components/transactions/TransactionList";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import TransactionForm from "@/components/transactions/TransactionForm";
import Spinner from "@/components/ui/Spinner";
import { PlusCircle, Download, ArrowRight, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats | null>(null);
  const [categoryStats, setCategoryStats] = useState<CategoryStat[]>([]);
  const [forecast, setForecast] = useState<SpendingForecast | null>(null);
  const [budgetStatus, setBudgetStatus] = useState<BudgetStatus[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const currentMonth = 11;
  const currentYear = 2026;

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
        api.getMonthlyStats(currentMonth, currentYear).catch(() => null),
        api.getByCategory(currentMonth, currentYear).catch(() => []),
        api.getSpendingForecast(currentMonth, currentYear).catch(() => null),
        api.getBudgetStatus(currentMonth, currentYear).catch(() => []),
        api.getTransactions({ limit: 5 }).catch(() => []),
        api.getCategories().catch(() => []),
      ]);

      setWallets(walletsRes);
      setTotalBalance(totalRes.total);
      setMonthlyStats(statsRes);
      setCategoryStats(catStatsRes);
      setForecast(forecastRes);
      setBudgetStatus(budgetsRes);
      setRecentTransactions(txsRes);
      setCategories(catsRes);
    } catch (err: any) {
      setError(err.message || "Không thể tải dữ liệu từ máy chủ API");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Tổng quan Tài chính
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Tháng {currentMonth}/{currentYear} • Quản lý dòng tiền thông minh
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={loadData}
            className="flex items-center gap-1.5"
            title="Làm mới dữ liệu"
          >
            <RefreshCw className="w-4 h-4" /> Làm mới
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => api.exportCSV(currentMonth, currentYear)}
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

      {/* Cảnh báo ngân sách nếu có */}
      {budgetStatus.length > 0 && <BudgetAlert budgets={budgetStatus} />}

      {loading ? (
        <div className="py-24">
          <Spinner className="w-8 h-8" />
          <p className="text-center text-sm text-slate-400 mt-2">
            Đang tải dữ liệu từ máy chủ...
          </p>
        </div>
      ) : error ? (
        <div className="p-6 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-sm">
          <p className="font-semibold mb-1">Không thể kết nối đến Backend API:</p>
          <p className="text-xs mb-3 text-rose-600">{error}</p>
          <p className="text-xs text-rose-500">
            Hãy đảm bảo bạn đã chạy <code>cd be && npm run dev</code> tại cổng 4000.
          </p>
        </div>
      ) : (
        <>
          {/* Hàng 1: Tổng số dư & Thẻ ví */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <TotalBalanceCard totalBalance={totalBalance} />
            {wallets.map((wallet) => (
              <WalletCard key={wallet.id} wallet={wallet} />
            ))}
          </div>

          {/* Hàng 2: Thống kê Thu / Chi / Ròng trong tháng */}
          {monthlyStats && <MonthlyStatsCards stats={monthlyStats} />}

          {/* Hàng 3: Biểu đồ Tròn + Biểu đồ Cột */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ExpenseByCategoryChart data={categoryStats} />
            <MonthlyBarChart currentStats={monthlyStats || undefined} />
          </div>

          {/* Hàng 4: Dự báo chi tiêu cuối tháng */}
          {forecast && <ForecastCard forecast={forecast} />}

          {/* Hàng 5: Giao dịch gần đây */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-800">
                Giao dịch gần đây
              </h3>
              <Link
                href="/transactions"
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                Xem tất cả <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <TransactionList transactions={recentTransactions} />
          </div>
        </>
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
