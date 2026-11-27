"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  WalletCards,
  Mail,
  Lock,
  User,
  ArrowRight,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { login, register, user } = useAuth();
  const router = useRouter();

  // Nếu đã đăng nhập thì gợi ý về dashboard
  if (user) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white border border-[#E8E3D9] rounded-3xl shadow-xl shadow-stone-900/5 text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-[#DCFCE7] text-[#15803D] flex items-center justify-center mb-4 shadow-sm">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-black text-[#1C1917] tracking-tight mb-2">
          Bạn đã đăng nhập!
        </h2>
        <p className="text-xs text-[#78716C] mb-6">
          Đang đăng nhập với tài khoản <strong className="text-[#15803D]">{user.email}</strong>.
        </p>
        <button
          onClick={() => router.push("/dashboard")}
          className="w-full py-3 px-4 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white text-xs font-bold shadow-md shadow-emerald-800/15 transition-all flex items-center justify-center gap-2"
        >
          <span>Vào Bảng Nhật Ký</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      if (isLogin) {
        await login({ email, password });
      } else {
        if (!name.trim()) {
          throw new Error("Vui lòng nhập họ và tên của bạn.");
        }
        await register({ email, password, name });
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Đã xảy ra lỗi không mong muốn. Vui lòng thử lại.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleFillDemo = () => {
    setIsLogin(true);
    setEmail("demo@pbp.vn");
    setPassword("123456");
    setError(null);
  };

  return (
    <div className="max-w-md mx-auto my-6 sm:my-10">
      {/* Thẻ Box chính phong cách Tạp chí Tài chính */}
      <div className="bg-white border border-[#E8E3D9] rounded-3xl shadow-xl shadow-stone-900/5 p-6 sm:p-8 transition-all">
        {/* Header Logo */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#15803D] text-white shadow-md shadow-emerald-800/15 mb-3">
            <WalletCards className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-[#1C1917] tracking-tight">
            PBP <span className="text-[#15803D]">Journal</span>
          </h1>
          <p className="text-xs text-[#78716C] mt-1 font-medium">
            Sổ cái tài chính cá nhân & nhật ký chi tiêu thông minh
          </p>
        </div>

        {/* Chuyển đổi Tab Đăng nhập / Đăng ký */}
        <div className="flex p-1 bg-[#F4F1EA] rounded-2xl border border-[#E8E3D9] mb-6">
          <button
            type="button"
            onClick={() => {
              setIsLogin(true);
              setError(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              isLogin
                ? "bg-white text-[#15803D] shadow-xs"
                : "text-[#78716C] hover:text-[#1C1917]"
            }`}
          >
            Đăng nhập
          </button>
          <button
            type="button"
            onClick={() => {
              setIsLogin(false);
              setError(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              !isLogin
                ? "bg-white text-[#15803D] shadow-xs"
                : "text-[#78716C] hover:text-[#1C1917]"
            }`}
          >
            Đăng ký tài khoản
          </button>
        </div>

        {/* Thông báo lỗi nếu có */}
        {error && (
          <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2.5 text-xs text-rose-700 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <span className="leading-relaxed font-medium">{error}</span>
          </div>
        )}

        {/* Form nhập liệu */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-bold text-[#44403C] mb-1.5 uppercase tracking-wider">
                Họ và tên
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8A29E]" />
                <input
                  type="text"
                  required={!isLogin}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ví dụ: Sơn Hồ"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#FAF7F2] border border-[#E8E3D9] rounded-xl text-xs font-medium text-[#1C1917] focus:outline-none focus:border-[#15803D] focus:bg-white transition-all placeholder:text-[#A8A29E]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-[#44403C] mb-1.5 uppercase tracking-wider">
              Địa chỉ Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8A29E]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-[#FAF7F2] border border-[#E8E3D9] rounded-xl text-xs font-medium text-[#1C1917] focus:outline-none focus:border-[#15803D] focus:bg-white transition-all placeholder:text-[#A8A29E]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#44403C] mb-1.5 uppercase tracking-wider">
              Mật khẩu {isLogin ? "" : "(tối thiểu 6 ký tự)"}
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8A29E]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-[#FAF7F2] border border-[#E8E3D9] rounded-xl text-xs font-medium text-[#1C1917] focus:outline-none focus:border-[#15803D] focus:bg-white transition-all placeholder:text-[#A8A29E]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-[#15803D] hover:bg-[#166534] disabled:opacity-70 text-white text-xs font-bold shadow-md shadow-emerald-800/15 transition-all flex items-center justify-center gap-2"
          >
            {submitting ? (
              <span>Đang xử lý...</span>
            ) : (
              <>
                <span>{isLogin ? "Đăng nhập vào sổ nhật ký" : "Hoàn tất đăng ký"}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Nút bấm điền thử nhanh tài khoản Demo MongoDB */}
        <div className="mt-6 pt-5 border-t border-[#F4F1EA] text-center">
          <p className="text-[11px] text-[#A8A29E] mb-2 font-medium">
            Muốn xem thử dữ liệu 36 giao dịch mẫu đã nạp trong MongoDB?
          </p>
          <button
            type="button"
            onClick={handleFillDemo}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#DCFCE7] hover:bg-[#BBF7D0] border border-[#86EFAC] text-[11px] font-bold text-[#15803D] transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Điền tài khoản Demo (demo@pbp.vn / 123456)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
