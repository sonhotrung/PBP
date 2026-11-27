"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Button from "@/components/ui/Button";
import { Wallet } from "@/types";
import { api } from "@/lib/api";
import { ArrowRightLeft } from "lucide-react";

const transferSchema = z
  .object({
    amount: z.number().min(1, "Số tiền chuyển phải lớn hơn 0"),
    fromWalletId: z.string().min(1, "Vui lòng chọn ví nguồn"),
    toWalletId: z.string().min(1, "Vui lòng chọn ví nhận"),
    description: z.string().optional(),
    date: z.string(),
  })
  .refine((data) => data.fromWalletId !== data.toWalletId, {
    message: "Ví nguồn và ví nhận phải khác nhau",
    path: ["toWalletId"],
  });

type TransferFormData = z.infer<typeof transferSchema>;

interface TransferModalProps {
  wallets: Wallet[];
  onSuccess: () => void;
}

export default function TransferModal({ wallets, onSuccess }: TransferModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<TransferFormData>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      amount: 500000,
      fromWalletId: wallets[0]?.id || "",
      toWalletId: wallets[1]?.id || "",
      date: "",
      description: "Chuyển tiền nội bộ",
    },
  });

  React.useEffect(() => {
    setValue("date", new Date().toISOString().split("T")[0]);
  }, [setValue]);

  const onSubmit = async (data: TransferFormData) => {
    try {
      setLoading(true);
      setError(null);
      await api.transferMoney({
        amount: data.amount,
        fromWalletId: data.fromWalletId,
        toWalletId: data.toWalletId,
        description: data.description,
        date: data.date,
      });
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Lỗi khi thực hiện chuyển tiền");
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

      {/* Số tiền chuyển */}
      <div>
        <label className="text-xs font-semibold text-slate-600 block mb-1.5">
          Số tiền chuyển (VND)
        </label>
        <input
          type="number"
          step="1000"
          {...register("amount", { valueAsNumber: true })}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
          placeholder="500,000"
        />
        {errors.amount && (
          <span className="text-xs text-rose-500 mt-1 block">
            {errors.amount.message}
          </span>
        )}
      </div>

      {/* Chọn Ví nguồn và Ví nhận */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-slate-600 block mb-1.5">
            Từ ví nguồn (Trừ tiền)
          </label>
          <select
            {...register("fromWalletId")}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium"
          >
            {wallets.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name}
              </option>
            ))}
          </select>
          {errors.fromWalletId && (
            <span className="text-xs text-rose-500 mt-1 block">
              {errors.fromWalletId.message}
            </span>
          )}
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-600 block mb-1.5">
            Đến ví nhận (Cộng tiền)
          </label>
          <select
            {...register("toWalletId")}
            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium"
          >
            {wallets.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name}
              </option>
            ))}
          </select>
          {errors.toWalletId && (
            <span className="text-xs text-rose-500 mt-1 block">
              {errors.toWalletId.message}
            </span>
          )}
        </div>
      </div>

      {/* Ghi chú */}
      <div>
        <label className="text-xs font-semibold text-slate-600 block mb-1.5">
          Ghi chú
        </label>
        <input
          type="text"
          {...register("description")}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Rút tiền mặt chi tiêu tiêu dùng..."
        />
      </div>

      {/* Ngày thực hiện */}
      <div>
        <label className="text-xs font-semibold text-slate-600 block mb-1.5">
          Ngày chuyển
        </label>
        <input
          type="date"
          {...register("date")}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="pt-2">
        <Button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 font-semibold flex items-center justify-center gap-2"
        >
          <ArrowRightLeft className="w-4 h-4" />
          {loading ? "Đang xử lý chuyển tiền..." : "Xác nhận chuyển khoản"}
        </Button>
      </div>
    </form>
  );
}
