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
      <nav className="pointer-events-auto flex items-center gap-1.5 sm:gap-2.5 p-1.5 bg-white/95 backdrop-blur-xl border border-[#E8E3D9] rounded-full shadow-lg shadow-stone-900/5 neon-island-border transition-all">
        {/* Brand Logo với chữ NEON Xanh Lá Cây */}
        <Link
          href="/dashboard"
          className="flex items-center gap-2 pl-2 pr-3.5 py-1 rounded-full bg-[#0A2616] hover:bg-[#071D11] transition-all group shrink-0 border border-emerald-500/40 shadow-xs"
        >
          <div className="w-6 h-6 rounded-full bg-emerald-900/60 flex items-center justify-center text-[#4ADE80] border border-emerald-400/40">
            <WalletCards className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-black tracking-wider neon-logo-text uppercase">
            PBP Journal
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80] animate-pulse shadow-[0_0_8px_#4ADE80]" />
        </Link>

        {/* Dấu phân cách dọc viền be */}
        <div className="h-4 w-px bg-[#E8E3D9] shrink-0" />

        {/* Navigation Items (Pills Be + Xanh Lá) */}
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
                  "flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap",
                  isActive
                    ? "bg-[#15803D] text-white shadow-xs shadow-emerald-800/25"
                    : "text-[#57534E] hover:text-[#1C1917] hover:bg-[#F4F1EA]"
                )}
              >
                <Icon
                  className={cn(
                    "w-3.5 h-3.5",
                    isActive ? "text-emerald-100" : "text-[#78716C]"
                  )}
                />
                <span className="hidden md:inline">{item.fullLabel}</span>
                <span className="inline md:hidden">{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Dấu phân cách dọc viền be */}
        <div className="h-4 w-px bg-[#E8E3D9] shrink-0 hidden sm:block" />

        {/* Mini Be Tag */}
        <div className="hidden sm:flex items-center gap-1.5 pr-2.5 pl-1 py-1">
          <span className="flex items-center gap-1 text-[11px] font-bold text-[#15803D] bg-[#F4F1EA] border border-[#E8E3D9] px-2.5 py-0.5 rounded-full">
            <Sparkles className="w-3 h-3 text-[#15803D]" />
            <span>2026</span>
          </span>
        </div>
      </nav>
    </header>
  );
}
