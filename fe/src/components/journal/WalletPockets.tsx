import React from "react";
import { Wallet } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { Building2, Banknote, ArrowRightLeft } from "lucide-react";

interface WalletPocketsProps {
  wallets: Wallet[];
  totalBalance: number;
  onOpenTransfer: () => void;
}

export default function WalletPockets({
  wallets,
  totalBalance,
  onOpenTransfer,
}: WalletPocketsProps) {
  return (
    <div className="bg-white rounded-3xl p-5 border border-emerald-100/90 shadow-2xs space-y-4">
      <div className="flex items-center justify-between pb-1">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Tổng tài sản khả dụng
          </span>
          <div className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">
            {formatCurrency(totalBalance)}
          </div>
        </div>

        <button
          onClick={onOpenTransfer}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition-colors border border-emerald-200/50 shadow-2xs"
          title="Chuyển tiền qua lại giữa các ví"
        >
          <ArrowRightLeft className="w-3.5 h-3.5 text-emerald-600" />
          <span>Chuyển ví</span>
        </button>
      </div>

      <div className="space-y-2 pt-1 border-t border-slate-100">
        {wallets.map((w) => {
          const isBank = w.type === "BANK";
          return (
            <div
              key={w.id}
              className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/70 hover:bg-slate-50 border border-slate-100 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs shadow-2xs"
                  style={{
                    backgroundColor: w.color || (isBank ? "#2563EB" : "#10B981"),
                  }}
                >
                  {isBank ? <Building2 className="w-4 h-4" /> : <Banknote className="w-4 h-4" />}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{w.name}</h4>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {isBank ? "Tài khoản ngân hàng" : "Tiền mặt trong ví"}
                  </span>
                </div>
              </div>

              <span className="text-sm font-bold text-slate-900">
                {formatCurrency(w.balance)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

