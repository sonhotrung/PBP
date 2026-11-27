"use client";

import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isLoginPage = pathname === "/login";

  useEffect(() => {
    if (isLoading) return;

    if (!user && !isLoginPage) {
      router.replace("/login");
    } else if (user && isLoginPage) {
      router.replace("/dashboard");
    }
  }, [user, isLoading, isLoginPage, router]);

  // Đang kiểm tra token phiên làm việc lúc vừa mở trang
  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3">
        <div className="w-9 h-9 rounded-full border-3 border-[#15803D] border-t-transparent animate-spin" />
        <p className="text-xs font-semibold text-[#78716C] animate-pulse">
          Đang xác thực phiên đăng nhập...
        </p>
      </div>
    );
  }

  // Chưa đăng nhập và đang cố vào trang bên trong -> Chặn hiển thị nội dung, đợi redirect về /login
  if (!user && !isLoginPage) {
    return null;
  }

  // Đã đăng nhập và đang ở trang login -> Chặn hiển thị form login, đợi chuyển về /dashboard
  if (user && isLoginPage) {
    return null;
  }

  return <>{children}</>;
}
