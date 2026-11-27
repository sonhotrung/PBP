"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpenText,
  ReceiptText,
  Target,
  WalletCards,
  LogIn,
  LogOut,
  User as UserIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

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
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  // Ẩn thanh điều hướng khi chưa đăng nhập hoặc đang ở trang đăng nhập
  if (!user || pathname === "/login") {
    return null;
  }

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-fit px-4 pointer-events-none">
      <nav className="pointer-events-auto flex items-center gap-1.5 sm:gap-2 p-1.5 bg-white/95 backdrop-blur-xl border border-[#E8E3D9] rounded-full shadow-lg shadow-stone-900/5 island-shadow transition-all">
        {/* Brand Logo màu Xanh Lá Cây thanh lịch, ổn định */}
        <Link
          href="/dashboard"
          className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full hover:bg-[#F4F1EA] transition-all group shrink-0"
        >
          <div className="w-6 h-6 rounded-full bg-[#15803D] flex items-center justify-center text-white shadow-2xs">
            <WalletCards className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-black tracking-tight text-[#15803D] flex items-center gap-1">
            <span>PBP</span>
            <span className="text-[#1C1917] font-bold">Journal</span>
          </span>
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
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap",
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
        <div className="h-4 w-px bg-[#E8E3D9] shrink-0" />

        {/* Khu vực Tài khoản / Đăng nhập */}
        <div className="relative">
          {user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-full bg-[#F4F1EA] hover:bg-[#E8E3D9] border border-[#E8E3D9] text-xs font-bold text-[#1C1917] transition-all"
                title={user.name || user.email}
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-5 h-5 rounded-full object-cover border border-[#E8E3D9]"
                  />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-[#15803D] text-white flex items-center justify-center text-[10px]">
                    <UserIcon className="w-3 h-3" />
                  </div>
                )}
                <span className="max-w-[80px] sm:max-w-[120px] truncate text-[11px]">
                  {user.name || user.email.split("@")[0]}
                </span>
              </button>

              {/* Dropdown Menu Đăng xuất */}
              {showDropdown && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-[#E8E3D9] rounded-2xl shadow-xl shadow-stone-900/10 p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-2 border-b border-[#F4F1EA]">
                    <p className="text-xs font-bold text-[#1C1917] truncate">{user.name}</p>
                    <p className="text-[10px] text-[#78716C] truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      logout();
                    }}
                    className="w-full mt-1 flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors text-left"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap",
                pathname === "/login"
                  ? "bg-[#15803D] text-white shadow-xs shadow-emerald-800/25"
                  : "bg-[#DCFCE7] hover:bg-[#BBF7D0] text-[#15803D] border border-[#86EFAC]"
              )}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Đăng nhập</span>
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
