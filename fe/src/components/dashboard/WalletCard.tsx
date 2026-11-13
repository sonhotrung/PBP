import React from "react";
import Card from "@/components/ui/Card";
import { formatCurrency } from "@/lib/utils";
import { Wallet } from "@/types";
import { Building2, Banknote } from "lucide-react";

interface WalletCardProps {
  wallet: Wallet;
}

export default function WalletCard({ wallet }: WalletCardProps) {
  const isBank = wallet.type === "BANK";

  return (
    <Card className="p-5 hover:shadow-md transition-shadow border-slate-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm"
            style={{ backgroundColor: wallet.color || (isBank ? "#2563EB" : "#10B981") }}
          >
            {isBank ? <Building2 className="w-5 h-5" /> : <Banknote className="w-5 h-5" />}
          </div>
          <div>
            <h4 className="font-semibold text-slate-800 text-sm">{wallet.name}</h4>
            <span className="text-xs text-slate-500 uppercase tracking-wide">
              {isBank ? "Ngân hàng" : "Tiền mặt"}
            </span>
          </div>
        </div>
      </div>
      <div className="text-xl font-bold text-slate-900 mt-2">
        {formatCurrency(wallet.balance)}
      </div>
    </Card>
  );
}
