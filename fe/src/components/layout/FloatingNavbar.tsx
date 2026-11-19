"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpenText,
  ReceiptText,
  Target,
  WalletCards,
  Sparkles,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    href: "/dashboard",
    label: "Nhật ký",
    fullLabel: "Nhật ký dòng tiền",
    icon: BookOpenText,
  },
  {
    href: "/transactions",
    label: "Sổ cái",
    fullLabel: "Sổ cái giao dịch",
    icon: ReceiptText,
  },
  {
    href: "/budgets",
    label: "Ngân sách",
    fullLabel: "Mục tiêu ngân sách",
    icon: Target,
  },
];

export default function FloatingNavbar() {
  const pathname = usePathname();

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-fit px-4 pointer-events-none">
      <nav className="pointer-events-auto flex items-center gap-1.5 sm:gap-2.5 p-1.5 bg-white/90 backdrop-blur-xl border border-emerald-200/80 rounded-full shadow-lg shadow-emerald-950/5 neon-box-green transition-all">
        {/* Brand Logo với chữ NEON Xanh lá cây phát quang */}
        <Link
          href="/dashboard"
          className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full bg-slate-950 hover:bg-black transition-all group shrink-0 border border-emerald-900/60 shadow-xs"
        >
          <div className="w-6 h-6 rounded-full bg-emerald-950 flex items-center justify-center text-emerald-400 border border-emerald-500/40">
            <WalletCards className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-black tracking-wider neon-text-green uppercase">
            PBP Journal
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
        </Link>

        {/* Dấu phân cách dọc mảnh */}
        <div className="h-4 w-px bg-emerald-200/60 shrink-0" />

        {/* Navigation Items dạng Segmented Pills theo chủ đề Xanh lá */}
        <div className="flex items-center gap-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap",
                  isActive
                    ? "bg-emerald-700 text-white shadow-xs shadow-emerald-700/20"
                    : "text-slate-600 hover:text-emerald-800 hover:bg-emerald-50/80"
                )}
              >
                <Icon
                  className={cn(
                    "w-3.5 h-3.5",
                    isActive ? "text-emerald-200" : "text-emerald-600/70"
                  )}
                />
                <span className="hidden md:inline">{item.fullLabel}</span>
                <span className="inline md:hidden">{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Dấu phân cách dọc mảnh */}
        <div className="h-4 w-px bg-emerald-200/60 shrink-0 hidden sm:block" />

        {/* Mini Status Tag chủ đề Xanh lá */}
        <div className="hidden sm:flex items-center gap-1.5 pr-2.5 pl-1 py-1">
          <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100/70 border border-emerald-200/60 px-2 py-0.5 rounded-full">
            <Zap className="w-3 h-3 text-emerald-600" />
            <span>2026</span>
          </span>
        </div>
      </nav>
    </header>
  );
}
