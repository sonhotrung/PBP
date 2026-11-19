import type { Metadata } from "next";
import "./globals.css";
import FloatingNavbar from "@/components/layout/FloatingNavbar";

export const metadata: Metadata = {
  title: "PBP Journal - Nhật ký Tài chính Cá nhân",
  description: "Ứng dụng theo dõi dòng tiền & quản lý chi tiêu cá nhân thông minh",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="bg-[#FBFBFA] text-slate-900 antialiased selection:bg-amber-100 selection:text-amber-900">
        <div className="min-h-screen flex flex-col">
          {/* Floating Pill Island Navigation */}
          <FloatingNavbar />

          {/* Main Workspace (Căn giữa thoáng đãng, không còn sidebar cố định) */}
          <main className="flex-1 pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
