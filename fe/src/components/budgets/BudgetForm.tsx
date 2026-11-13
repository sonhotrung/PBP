"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Button from "@/components/ui/Button";
import { Category } from "@/types";
import { api } from "@/lib/api";

const schema = z.object({
  categoryId: z.string().min(1, "Vui lòng chọn danh mục"),
  amount: z.number().min(1000, "Ngân sách tối thiểu là 1,000 VND"),
  month: z.number().min(1).max(12),
  year: z.number().min(2020),
});

type FormData = z.infer<typeof schema>;

interface BudgetFormProps {
  categories: Category[];
  currentMonth: number;
  currentYear: number;
  onSuccess: () => void;
}

export default function BudgetForm({
  categories,
  currentMonth,
  currentYear,
  onSuccess,
}: BudgetFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const expenseCategories = categories.filter((c) => c.type === "EXPENSE");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      categoryId: expenseCategories[0]?.id || "",
      amount: 3000000,
      month: currentMonth,
      year: currentYear,
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      setError(null);
      await api.upsertBudget(data);
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Không thể lưu ngân sách");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="p-3 bg-rose-50 text-rose-600 rounded-xl text-xs font-medium border border-rose-100">
          {error}
        </div>
      )}

      {/* Danh mục */}
      <div>
        <label className="text-xs font-semibold text-slate-600 block mb-1.5">
          Danh mục chi tiêu
        </label>
        <select
          {...register("categoryId")}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          {expenseCategories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        {errors.categoryId && (
          <span className="text-xs text-rose-500 mt-1 block">
            {errors.categoryId.message}
          </span>
        )}
      </div>

      {/* Số tiền ngân sách */}
      <div>
        <label className="text-xs font-semibold text-slate-600 block mb-1.5">
          Hạn mức ngân sách (VND)
        </label>
        <input
          type="number"
          step="100000"
          {...register("amount", { valueAsNumber: true })}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
          placeholder="3,000,000"
        />
        {errors.amount && (
          <span className="text-xs text-rose-500 mt-1 block">
            {errors.amount.message}
          </span>
        )}
      </div>

      {/* Tháng & Năm */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-slate-600 block mb-1.5">
            Tháng
          </label>
          <input
            type="number"
            min="1"
            max="12"
            {...register("month", { valueAsNumber: true })}
            className="w-full px-4 py-2 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-600 block mb-1.5">
            Năm
          </label>
          <input
            type="number"
            {...register("year", { valueAsNumber: true })}
            className="w-full px-4 py-2 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="pt-2">
        <Button type="submit" disabled={loading} className="w-full py-2.5 font-semibold">
          {loading ? "Đang lưu..." : "Thiết lập ngân sách"}
        </Button>
      </div>
    </form>
  );
}
