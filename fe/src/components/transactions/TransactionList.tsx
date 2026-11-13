"use client";

import React from "react";
import Card from "@/components/ui/Card";
import TransactionItem from "./TransactionItem";
import { Transaction } from "@/types";
import { Receipt } from "lucide-react";

interface TransactionListProps {
  transactions: Transaction[];
  onDelete?: (id: string) => void;
}

export default function TransactionList({ transactions, onDelete }: TransactionListProps) {
  if (!transactions || transactions.length === 0) {
    return (
      <Card className="p-8 text-center border-slate-200">
        <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
          <Receipt className="w-6 h-6" />
        </div>
        <p className="text-sm font-medium text-slate-600">Chưa có giao dịch nào</p>
        <p className="text-xs text-slate-400 mt-1">
          Hãy thêm giao dịch mới để bắt đầu theo dõi chi tiêu
        </p>
      </Card>
    );
  }

  return (
    <Card className="border-slate-200 divide-y divide-slate-100 overflow-hidden">
      {transactions.map((tx) => (
        <TransactionItem key={tx.id} transaction={tx} onDelete={onDelete} />
      ))}
    </Card>
  );
}
