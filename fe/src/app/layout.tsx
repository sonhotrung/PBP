import type { Metadata } from "next";
import "./globals.css";
import FloatingNavbar from "@/components/layout/FloatingNavbar";
import FallingLeaves from "@/components/ui/FallingLeaves";

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
      <body className="bg-[#FAF7F2] text-[#1C1917] antialiased selection:bg-[#DCFCE7] selection:text-[#14532D]">
        <div className="min-h-screen flex flex-col bg-[#FAF7F2] relative">
          {/* Hiệu ứng lá rơi nhẹ nhàng ở nền */}
          <FallingLeaves />

          {/* Floating Pill Island Navigation */}
          <FloatingNavbar />

          {/* Main Workspace */}
          <main className="flex-1 pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full relative z-10">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
