"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpenText,
  ReceiptText,
  Target,
  Sparkles,
  WalletCards,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    href: "/dashboard",
    label: "Nhật ký dòng tiền",
    desc: "Timeline & Nhận định ngày",
    icon: BookOpenText,
  },
  {
    href: "/transactions",
    label: "Sổ cái giao dịch",
    desc: "Lịch sử & Bộ lọc chi tiết",
    icon: ReceiptText,
  },
  {
    href: "/budgets",
    label: "Mục tiêu ngân sách",
    desc: "Hạn mức & Cảnh báo an toàn",
    icon: Target,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-[#FCFCFB] text-slate-800 flex flex-col z-40 border-r border-slate-200/80">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-200/60">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
            <WalletCards className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h1 className="text-sm font-black tracking-tight text-slate-900 flex items-center gap-1.5">
              <span>PBP Journal</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 font-bold">
                PRO
              </span>
            </h1>
            <p className="text-[11px] text-slate-400 font-medium">
              Nhật ký Tài chính Cá nhân
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-3.5 space-y-1.5">
        <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Không gian làm việc
        </div>
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all",
                isActive
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
              )}
            >
              <span
                className={cn(
                  "p-1.5 rounded-xl transition-colors",
                  isActive
                    ? "bg-white/10 text-amber-400"
                    : "text-slate-400 group-hover:text-slate-700 bg-slate-100/60"
                )}
              >
                <Icon className="w-4 h-4" />
              </span>
              <div className="flex flex-col">
                <span>{item.label}</span>
                <span
                  className={cn(
                    "text-[10px] font-normal",
                    isActive ? "text-slate-300" : "text-slate-400"
                  )}
                >
                  {item.desc}
                </span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-200/60">
        <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-200/50">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-900">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Mẹo chi tiêu</span>
          </div>
          <p className="text-[10px] text-amber-800/80 mt-1 leading-normal">
            Duy trì ghi chép mỗi ngày để thuật toán đưa ra con số dự báo chính xác nhất.
          </p>
        </div>
      </div>
    </aside>
  );
}
