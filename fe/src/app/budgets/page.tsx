"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { BudgetStatus, Category, SpendingForecast } from "@/types";
import BudgetCard from "@/components/budgets/BudgetCard";
import BudgetAlert from "@/components/budgets/BudgetAlert";
import BudgetForm from "@/components/budgets/BudgetForm";
import ForecastCard from "@/components/dashboard/ForecastCard";
import Modal from "@/components/ui/Modal";
import Spinner from "@/components/ui/Spinner";
import { PlusCircle, Target, Sparkles, RefreshCw } from "lucide-react";

export default function BudgetsPage() {
  const [loading, setLoading] = useState(true);
  const [budgets, setBudgets] = useState<BudgetStatus[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [forecast, setForecast] = useState<SpendingForecast | null>(null);

  const [month, setMonth] = useState(11);
  const [year, setYear] = useState(2026);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [budgetsRes, catsRes, forecastRes] = await Promise.all([
        api.getBudgetStatus(month, year).catch(() => []),
        api.getCategories("EXPENSE").catch(() => []),
        api.getSpendingForecast(month, year).catch(() => null),
      ]);
      setBudgets(budgetsRes);
      setCategories(catsRes);
      setForecast(forecastRes);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [month, year]);

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <Target className="w-4 h-4 text-slate-500" />
            <span>Kế hoạch chi tiêu</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Mục tiêu ngân sách
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {/* Month Selector */}
          <div className="flex items-center p-1 bg-white rounded-2xl border border-[#E8E3D9] shadow-2xs">
            {[10, 11, 12].map((m) => (
              <button
                key={m}
                onClick={() => setMonth(m)}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                  month === m
                    ? "bg-[#15803D] text-white shadow-xs"
                    : "text-[#78716C] hover:text-[#1C1917]"
                }`}
              >
                Tháng {m}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white text-xs font-bold shadow-xs shadow-emerald-800/15 transition-all"
          >
            <PlusCircle className="w-4 h-4 text-emerald-200" />
            <span>Thiết lập hạn mức</span>
          </button>
        </div>
      </div>

      {/* Cảnh báo nếu có danh mục vượt ngưỡng */}
      {budgets.length > 0 && <BudgetAlert budgets={budgets} />}

      {/* Thẻ dự báo tốc độ chi tiêu */}
      {forecast && <ForecastCard forecast={forecast} />}

      {/* Danh sách thẻ ngân sách */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <span>Hạn mức danh mục ({budgets.length})</span>
          </h3>
          <span className="text-xs text-slate-400 font-medium">
            Tự động đổi màu khi chạm ngưỡng 70% và 90%
          </span>
        </div>

        {loading ? (
          <div className="py-24">
            <Spinner className="w-8 h-8" />
          </div>
        ) : budgets.length === 0 ? (
          <div className="p-10 text-center bg-white rounded-3xl border border-slate-200 shadow-2xs">
            <p className="text-sm text-slate-500 font-medium">
              Chưa có hạn mức nào cho tháng {month}/{year}.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-3 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold"
            >
              Thêm ngân sách đầu tiên
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {budgets.map((b) => (
              <BudgetCard key={b.budgetId} budget={b} />
            ))}
          </div>
        )}
      </div>

      {/* Modal Form */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Thiết lập ngân sách danh mục"
      >
        <BudgetForm
          categories={categories}
          currentMonth={month}
          currentYear={year}
          onSuccess={() => {
            setIsModalOpen(false);
            loadData();
          }}
        />
      </Modal>
    </div>
  );
}
