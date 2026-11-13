"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { BudgetStatus, Category, SpendingForecast } from "@/types";
import BudgetCard from "@/components/budgets/BudgetCard";
import BudgetAlert from "@/components/budgets/BudgetAlert";
import BudgetForm from "@/components/budgets/BudgetForm";
import ForecastCard from "@/components/dashboard/ForecastCard";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Spinner from "@/components/ui/Spinner";
import { PlusCircle, Target } from "lucide-react";

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
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Quản lý Ngân sách
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Thiết lập hạn mức chi tiêu cho từng danh mục để kiểm soát tài chính
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            size="sm"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 font-semibold"
          >
            <PlusCircle className="w-4 h-4" /> Thiết lập ngân sách
          </Button>
        </div>
      </div>

      {/* Cảnh báo nếu có danh mục vượt ngưỡng */}
      {budgets.length > 0 && <BudgetAlert budgets={budgets} />}

      {/* Dự báo chi tiêu */}
      {forecast && <ForecastCard forecast={forecast} />}

      {/* Danh sách thẻ ngân sách */}
      <div className="space-y-4">
        <h3 className="text-base font-semibold text-slate-800 flex items-center gap-2">
          <Target className="w-4 h-4 text-blue-600" /> Ngân sách tháng {month}/{year}
        </h3>

        {loading ? (
          <div className="py-24">
            <Spinner className="w-8 h-8" />
          </div>
        ) : budgets.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
            <p className="text-sm text-slate-500">
              Chưa có ngân sách nào được thiết lập cho tháng {month}/{year}.
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsModalOpen(true)}
              className="mt-3"
            >
              Thêm ngân sách đầu tiên
            </Button>
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

