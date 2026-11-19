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
      <nav className="pointer-events-auto flex items-center gap-1.5 sm:gap-2.5 p-1.5 bg-white/85 backdrop-blur-xl border border-slate-200/90 rounded-full shadow-lg shadow-slate-900/5 transition-all">
        {/* Brand Logo Mini Pill */}
        <Link
          href="/dashboard"
          className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full hover:bg-slate-100/70 transition-colors shrink-0"
        >
          <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-2xs">
            <WalletCards className="w-4 h-4 text-amber-400" />
          </div>
          <span className="text-xs font-black tracking-tight text-slate-900 hidden sm:inline">
            PBP Journal
          </span>
        </Link>

        {/* Dấu phân cách dọc mảnh */}
        <div className="h-4 w-px bg-slate-200 shrink-0" />

        {/* Navigation Items dạng Segmented Pills */}
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
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                )}
              >
                <Icon
                  className={cn(
                    "w-3.5 h-3.5",
                    isActive ? "text-amber-400" : "text-slate-400"
                  )}
                />
                <span className="hidden md:inline">{item.fullLabel}</span>
                <span className="inline md:hidden">{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Dấu phân cách dọc mảnh */}
        <div className="h-4 w-px bg-slate-200 shrink-0 hidden sm:block" />

        {/* Mini Pro Badge / Quick Tag */}
        <div className="hidden sm:flex items-center gap-1.5 pr-2.5 pl-1 py-1">
          <span className="flex items-center gap-1 text-[11px] font-bold text-slate-500 bg-slate-100/80 px-2 py-0.5 rounded-full">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>2026</span>
          </span>
        </div>
      </nav>
    </header>
  );
}
