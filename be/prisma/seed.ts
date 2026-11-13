import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // 1. Clear existing data
  await prisma.transaction.deleteMany();
  await prisma.budget.deleteMany();
  await prisma.category.deleteMany();
  await prisma.wallet.deleteMany();

  console.log("🗑️  Cleared existing data");

  // 2. Create wallets
  await prisma.wallet.createMany({
    data: [
      {
        id: "wallet-bank-01",
        name: "Tài khoản Ngân hàng (Vietcombank)",
        type: "BANK",
        balance: 28500000,
        currency: "VND",
        color: "#2563EB",
      },
      {
        id: "wallet-cash-02",
        name: "Tiền mặt (Ví cá nhân)",
        type: "CASH",
        balance: 4250000,
        currency: "VND",
        color: "#10B981",
      },
    ],
  });

  console.log("💳 Created wallets");

  // 3. Create categories
  await prisma.category.createMany({
    data: [
      { id: "cat-food", name: "Ăn uống & Cà phê", type: "EXPENSE", icon: "Utensils", color: "#F59E0B" },
      { id: "cat-shopping", name: "Mua sắm & Đồ dùng", type: "EXPENSE", icon: "ShoppingBag", color: "#EC4899" },
      { id: "cat-bills", name: "Tiền nhà & Hóa đơn", type: "EXPENSE", icon: "Home", color: "#8B5CF6" },
      { id: "cat-transport", name: "Di chuyển & Xăng xe", type: "EXPENSE", icon: "Car", color: "#06B6D4" },
      { id: "cat-entertainment", name: "Giải trí & Du lịch", type: "EXPENSE", icon: "Film", color: "#EF4444" },
      { id: "cat-salary", name: "Lương hàng tháng", type: "INCOME", icon: "Briefcase", color: "#10B981" },
      { id: "cat-bonus", name: "Thưởng & Freelance", type: "INCOME", icon: "TrendingUp", color: "#3B82F6" },
      { id: "cat-transfer", name: "Chuyển tiền nội bộ", type: "TRANSFER", icon: "ArrowRightLeft", color: "#6B7280" },
    ],
  });

  console.log("🏷️  Created categories");

  // 4. Create budgets for month=11, year=2026
  await prisma.budget.createMany({
    data: [
      { categoryId: "cat-food", amount: 4500000, month: 11, year: 2026 },
      { categoryId: "cat-shopping", amount: 2500000, month: 11, year: 2026 },
      { categoryId: "cat-transport", amount: 800000, month: 11, year: 2026 },
      { categoryId: "cat-entertainment", amount: 1000000, month: 11, year: 2026 },
    ],
  });

  console.log("📊 Created budgets");

  // 5. Create all 36 transactions
  await prisma.transaction.createMany({
    skipDuplicates: true,
    data: [
      // October 2026
      { id: "tx-10-01", amount: 25000000, type: "INCOME", description: "Nhận lương tháng 10 công ty", date: new Date("2026-10-05"), walletId: "wallet-bank-01", categoryId: "cat-salary" },
      { id: "tx-10-02", amount: 3000000, type: "TRANSFER", description: "Rút tiền mặt chi tiêu tiêu dùng", date: new Date("2026-10-06"), walletId: "wallet-bank-01", toWalletId: "wallet-cash-02", categoryId: "cat-transfer" },
      { id: "tx-10-03", amount: 4500000, type: "EXPENSE", description: "Tiền thuê trọ + điện nước tháng 10", date: new Date("2026-10-07"), walletId: "wallet-bank-01", categoryId: "cat-bills" },
      { id: "tx-10-04", amount: 45000, type: "EXPENSE", description: "Ăn phở sáng và cà phê", date: new Date("2026-10-08"), walletId: "wallet-cash-02", categoryId: "cat-food" },
      { id: "tx-10-05", amount: 80000, type: "EXPENSE", description: "Đổ xăng xe máy", date: new Date("2026-10-09"), walletId: "wallet-cash-02", categoryId: "cat-transport" },
      { id: "tx-10-06", amount: 520000, type: "EXPENSE", description: "Đi siêu thị WinMart mua nhu yếu phẩm", date: new Date("2026-10-10"), walletId: "wallet-bank-01", categoryId: "cat-food" },
      { id: "tx-10-07", amount: 350000, type: "EXPENSE", description: "Ăn tối lẩu liên hoan cùng đồng nghiệp", date: new Date("2026-10-12"), walletId: "wallet-bank-01", categoryId: "cat-food" },
      { id: "tx-10-08", amount: 850000, type: "EXPENSE", description: "Mua áo sơ mi và quần tây", date: new Date("2026-10-14"), walletId: "wallet-bank-01", categoryId: "cat-shopping" },
      { id: "tx-10-09", amount: 220000, type: "EXPENSE", description: "Xem phim rạp CGV cuối tuần", date: new Date("2026-10-17"), walletId: "wallet-bank-01", categoryId: "cat-entertainment" },
      { id: "tx-10-10", amount: 5000000, type: "INCOME", description: "Thù lao dự án Freelance Landing Page", date: new Date("2026-10-18"), walletId: "wallet-bank-01", categoryId: "cat-bonus" },
      { id: "tx-10-11", amount: 65000, type: "EXPENSE", description: "Cơm trưa văn phòng", date: new Date("2026-10-20"), walletId: "wallet-cash-02", categoryId: "cat-food" },
      { id: "tx-10-12", amount: 250000, type: "EXPENSE", description: "Tiền mạng Internet FPT", date: new Date("2026-10-22"), walletId: "wallet-bank-01", categoryId: "cat-bills" },
      { id: "tx-10-13", amount: 90000, type: "EXPENSE", description: "Thay nhớt xe máy định kỳ", date: new Date("2026-10-24"), walletId: "wallet-cash-02", categoryId: "cat-transport" },
      { id: "tx-10-14", amount: 420000, type: "EXPENSE", description: "Mua tai nghe bluetooth trên Shopee", date: new Date("2026-10-25"), walletId: "wallet-bank-01", categoryId: "cat-shopping" },
      { id: "tx-10-15", amount: 55000, type: "EXPENSE", description: "Trà sữa cùng bạn bè", date: new Date("2026-10-27"), walletId: "wallet-cash-02", categoryId: "cat-food" },
      { id: "tx-10-16", amount: 150000, type: "EXPENSE", description: "Nạp tiền điện thoại Viettel", date: new Date("2026-10-28"), walletId: "wallet-bank-01", categoryId: "cat-bills" },
      { id: "tx-10-17", amount: 1200000, type: "EXPENSE", description: "Mua giày thể thao chạy bộ", date: new Date("2026-10-29"), walletId: "wallet-bank-01", categoryId: "cat-shopping" },
      { id: "tx-10-18", amount: 70000, type: "EXPENSE", description: "Bún chả trưa văn phòng", date: new Date("2026-10-31"), walletId: "wallet-cash-02", categoryId: "cat-food" },
      // November 2026
      { id: "tx-11-01", amount: 25000000, type: "INCOME", description: "Lương tháng 11 chuyển khoản", date: new Date("2026-11-05"), walletId: "wallet-bank-01", categoryId: "cat-salary" },
      { id: "tx-11-02", amount: 2000000, type: "TRANSFER", description: "Rút tiền mặt tiêu vặt tuần 1", date: new Date("2026-11-05"), walletId: "wallet-bank-01", toWalletId: "wallet-cash-02", categoryId: "cat-transfer" },
      { id: "tx-11-03", amount: 4500000, type: "EXPENSE", description: "Thanh toán tiền nhà tháng 11", date: new Date("2026-11-06"), walletId: "wallet-bank-01", categoryId: "cat-bills" },
      { id: "tx-11-04", amount: 60000, type: "EXPENSE", description: "Ăn sáng bánh mì chảo + sữa tươi", date: new Date("2026-11-07"), walletId: "wallet-cash-02", categoryId: "cat-food" },
      { id: "tx-11-05", amount: 90000, type: "EXPENSE", description: "Đổ đầy bình xăng xe", date: new Date("2026-11-07"), walletId: "wallet-cash-02", categoryId: "cat-transport" },
      { id: "tx-11-06", amount: 680000, type: "EXPENSE", description: "Mua đồ ăn tuần tại siêu thị Co.opmart", date: new Date("2026-11-08"), walletId: "wallet-bank-01", categoryId: "cat-food" },
      { id: "tx-11-07", amount: 3200000, type: "INCOME", description: "Thưởng KPI xuất sắc quý", date: new Date("2026-11-09"), walletId: "wallet-bank-01", categoryId: "cat-bonus" },
      { id: "tx-11-08", amount: 1450000, type: "EXPENSE", description: "Đồ gia dụng nhà bếp và nồi chiên", date: new Date("2026-11-09"), walletId: "wallet-bank-01", categoryId: "cat-shopping" },
      { id: "tx-11-09", amount: 45000, type: "EXPENSE", description: "Cà phê muối sáng", date: new Date("2026-11-10"), walletId: "wallet-cash-02", categoryId: "cat-food" },
      { id: "tx-11-10", amount: 250000, type: "EXPENSE", description: "Cước Internet cáp quang tháng 11", date: new Date("2026-11-10"), walletId: "wallet-bank-01", categoryId: "cat-bills" },
      { id: "tx-11-11", amount: 85000, type: "EXPENSE", description: "Cơm trưa bò xào + nước chanh", date: new Date("2026-11-11"), walletId: "wallet-cash-02", categoryId: "cat-food" },
      { id: "tx-11-12", amount: 380000, type: "EXPENSE", description: "Vé hòa nhạc acoustic cuối tuần", date: new Date("2026-11-11"), walletId: "wallet-bank-01", categoryId: "cat-entertainment" },
      { id: "tx-11-13", amount: 500000, type: "EXPENSE", description: "Quà sinh nhật bạn thân", date: new Date("2026-11-12"), walletId: "wallet-bank-01", categoryId: "cat-shopping" },
      { id: "tx-11-14", amount: 50000, type: "EXPENSE", description: "Bánh cuốn nóng buổi sáng", date: new Date("2026-11-12"), walletId: "wallet-cash-02", categoryId: "cat-food" },
      { id: "tx-11-15", amount: 1500000, type: "TRANSFER", description: "Chuyển tiền tiết kiệm từ Tiền mặt vào Ngân hàng", date: new Date("2026-11-12"), walletId: "wallet-cash-02", toWalletId: "wallet-bank-01", categoryId: "cat-transfer" },
      { id: "tx-11-16", amount: 75000, type: "EXPENSE", description: "Cơm tấm sườn bì chả", date: new Date("2026-11-13"), walletId: "wallet-cash-02", categoryId: "cat-food" },
      { id: "tx-11-17", amount: 120000, type: "EXPENSE", description: "Rửa xe máy + bảo dưỡng xích xe", date: new Date("2026-11-13"), walletId: "wallet-cash-02", categoryId: "cat-transport" },
      { id: "tx-11-18", amount: 290000, type: "EXPENSE", description: "Sách chuyên ngành lập trình Web", date: new Date("2026-11-13"), walletId: "wallet-bank-01", categoryId: "cat-shopping" },
    ],
  });

  console.log("💸 Created 36 transactions");
  console.log("✅ Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
