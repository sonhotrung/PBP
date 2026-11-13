"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Button from "@/components/ui/Button";
import { Wallet, Category } from "@/types";
import { api } from "@/lib/api";

const schema = z.object({
  type: z.enum(["INCOME", "EXPENSE", "TRANSFER"]),
  amount: z.number().min(1, "Số tiền phải lớn hơn 0"),
  description: z.string().optional(),
  date: z.string(),
  walletId: z.string().min(1, "Vui lòng chọn ví"),
  categoryId: z.string().optional(),
  toWalletId: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface TransactionFormProps {
  wallets: Wallet[];
  categories: Category[];
  onSuccess: () => void;
}

export default function TransactionForm({
  wallets,
  categories,
  onSuccess,
}: TransactionFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: "EXPENSE",
      amount: 50000,
      date: new Date().toISOString().split("T")[0],
      walletId: wallets[0]?.id || "",
    },
  });

  const selectedType = watch("type");

  const filteredCategories = categories.filter((c) => c.type === selectedType);

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      setError(null);

      if (data.type === "TRANSFER") {
        if (!data.toWalletId) {
          setError("Vui lòng chọn ví nhận tiền");
          return;
        }
        if (data.walletId === data.toWalletId) {
          setError("Ví chuyển và ví nhận phải khác nhau");
          return;
        }
        await api.transferMoney({
          amount: data.amount,
          fromWalletId: data.walletId,
          toWalletId: data.toWalletId,
          description: data.description,
          date: data.date,
        });
      } else {
        await api.createTransaction({
          amount: data.amount,
          type: data.type,
          description: data.description,
          date: data.date,
          walletId: data.walletId,
          categoryId: data.categoryId,
        });
      }

      onSuccess();
    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi khi tạo giao dịch");
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

      {/* Chọn loại giao dịch */}
      <div>
        <label className="text-xs font-semibold text-slate-600 block mb-1.5">
          Loại giao dịch
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: "EXPENSE", label: "Chi tiêu", color: "peer-checked:bg-rose-500" },
            { id: "INCOME", label: "Thu nhập", color: "peer-checked:bg-emerald-500" },
            { id: "TRANSFER", label: "Chuyển tiền", color: "peer-checked:bg-blue-500" },
          ].map((item) => (
            <label key={item.id} className="relative cursor-pointer">
              <input
                type="radio"
                value={item.id}
                {...register("type")}
                className="peer sr-only"
              />
              <div
                className={`py-2 text-center text-xs font-semibold rounded-xl border border-slate-200 text-slate-600 peer-checked:text-white transition-all ${item.color} peer-checked:border-transparent`}
              >
                {item.label}
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Số tiền */}
      <div>
        <label className="text-xs font-semibold text-slate-600 block mb-1.5">
          Số tiền (VND)
        </label>
        <input
          type="number"
          step="1000"
          {...register("amount", { valueAsNumber: true })}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
          placeholder="50,000"
        />
        {errors.amount && (
          <span className="text-xs text-rose-500 mt-1 block">
            {errors.amount.message}
          </span>
        )}
      </div>

      {/* Ghi chú mô tả */}
      <div>
        <label className="text-xs font-semibold text-slate-600 block mb-1.5">
          Ghi chú / Mô tả
        </label>
        <input
          type="text"
          {...register("description")}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ăn trưa, Đổ xăng, Mua đồ..."
        />
      </div>

      {/* Ngày giao dịch */}
      <div>
        <label className="text-xs font-semibold text-slate-600 block mb-1.5">
          Ngày giao dịch
        </label>
        <input
          type="date"
          {...register("date")}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Ví tiền nguồn */}
      <div>
        <label className="text-xs font-semibold text-slate-600 block mb-1.5">
          {selectedType === "TRANSFER" ? "Từ ví nguồn" : "Ví thanh toán"}
        </label>
        <select
          {...register("walletId")}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          {wallets.map((w) => (
            <option key={w.id} value={w.id}>
              {w.name} ({w.type === "BANK" ? "Ngân hàng" : "Tiền mặt"})
            </option>
          ))}
        </select>
      </div>

      {/* Nếu là Chuyển tiền: Ví đích */}
      {selectedType === "TRANSFER" ? (
        <div>
          <label className="text-xs font-semibold text-slate-600 block mb-1.5">
            Đến ví nhận tiền
          </label>
          <select
            {...register("toWalletId")}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">-- Chọn ví nhận --</option>
            {wallets.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name} ({w.type === "BANK" ? "Ngân hàng" : "Tiền mặt"})
              </option>
            ))}
          </select>
        </div>
      ) : (
        /* Nếu là Thu/Chi: Chọn Danh mục */
        <div>
          <label className="text-xs font-semibold text-slate-600 block mb-1.5">
            Danh mục
          </label>
          <select
            {...register("categoryId")}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">-- Chọn danh mục --</option>
            {filteredCategories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="pt-2">
        <Button type="submit" disabled={loading} className="w-full py-2.5 font-semibold">
          {loading ? "Đang xử lý..." : "Lưu giao dịch"}
        </Button>
      </div>
    </form>
  );
}

