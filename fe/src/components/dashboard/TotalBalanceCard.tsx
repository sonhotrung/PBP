import React from "react";
import Card from "@/components/ui/Card";
import { formatCurrency } from "@/lib/utils";
import { Wallet as WalletIcon, TrendingUp } from "lucide-react";

interface TotalBalanceCardProps {
  totalBalance: number;
}

export default function TotalBalanceCard({ totalBalance }: TotalBalanceCardProps) {
  return (
    <Card className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white p-6 relative overflow-hidden shadow-lg shadow-blue-500/10">
      <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-blue-100 flex items-center gap-2">
          <WalletIcon className="w-4 h-4" /> Tổng số dư khả dụng
        </span>
        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-white/15 text-white flex items-center gap-1 backdrop-blur-sm">
          <TrendingUp className="w-3 h-3" /> Tất cả ví
        </span>
      </div>
      <div className="text-3xl font-bold tracking-tight">
        {formatCurrency(totalBalance)}
      </div>
      <p className="mt-2 text-xs text-blue-100/80">
        Bao gồm tài khoản ngân hàng và tiền mặt
      </p>
    </Card>
  );
}

