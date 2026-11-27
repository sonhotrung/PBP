import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding MongoDB database...");

  // 1. Clear existing data
  await prisma.transaction.deleteMany();
  await prisma.budget.deleteMany();
  await prisma.category.deleteMany();
  await prisma.wallet.deleteMany();
  await prisma.user.deleteMany();

  console.log("🗑️  Cleared existing collections");

  // 2. Create demo user
  const hashedPassword = await bcrypt.hash("123456", 10);
  const user = await prisma.user.create({
    data: {
      email: "demo@pbp.vn",
      password: hashedPassword,
      name: "Sơn Hồ",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
  });

  console.log(`👤 Created Demo User: ${user.email} (Password: 123456)`);

  // 3. Create wallets
  const walletBank = await prisma.wallet.create({
    data: {
      name: "Tài khoản Ngân hàng (Vietcombank)",
      type: "BANK",
      balance: 28500000,
      currency: "VND",
      color: "#2563EB",
      userId: user.id,
    },
  });

  const walletCash = await prisma.wallet.create({
    data: {
      name: "Tiền mặt (Ví cá nhân)",
      type: "CASH",
      balance: 4250000,
      currency: "VND",
      color: "#10B981",
      userId: user.id,
    },
  });

  console.log("💳 Created wallets");

  // 4. Create categories
  const catFood = await prisma.category.create({ data: { name: "Ăn uống & Cà phê", type: "EXPENSE", icon: "Utensils", color: "#F59E0B" } });
  const catShopping = await prisma.category.create({ data: { name: "Mua sắm & Đồ dùng", type: "EXPENSE", icon: "ShoppingBag", color: "#EC4899" } });
  const catBills = await prisma.category.create({ data: { name: "Tiền nhà & Hóa đơn", type: "EXPENSE", icon: "Home", color: "#8B5CF6" } });
  const catTransport = await prisma.category.create({ data: { name: "Di chuyển & Xăng xe", type: "EXPENSE", icon: "Car", color: "#06B6D4" } });
  const catEntertainment = await prisma.category.create({ data: { name: "Giải trí & Du lịch", type: "EXPENSE", icon: "Film", color: "#EF4444" } });
  const catSalary = await prisma.category.create({ data: { name: "Lương hàng tháng", type: "INCOME", icon: "Briefcase", color: "#10B981" } });
  const catBonus = await prisma.category.create({ data: { name: "Thưởng & Freelance", type: "INCOME", icon: "TrendingUp", color: "#3B82F6" } });
  const catTransfer = await prisma.category.create({ data: { name: "Chuyển tiền nội bộ", type: "TRANSFER", icon: "ArrowRightLeft", color: "#6B7280" } });

  console.log("🏷️  Created categories");

  // 5. Create budgets for month=11, year=2026
  await prisma.budget.createMany({
    data: [
      { categoryId: catFood.id, amount: 4500000, month: 11, year: 2026, userId: user.id },
      { categoryId: catShopping.id, amount: 2500000, month: 11, year: 2026, userId: user.id },
      { categoryId: catTransport.id, amount: 800000, month: 11, year: 2026, userId: user.id },
      { categoryId: catEntertainment.id, amount: 1000000, month: 11, year: 2026, userId: user.id },
    ],
  });

  console.log("📊 Created budgets");

  // 6. Create transactions for October & November 2026
  await prisma.transaction.createMany({
    data: [
      // October 2026
      { amount: 25000000, type: "INCOME", description: "Nhận lương tháng 10 công ty", date: new Date("2026-10-05"), walletId: walletBank.id, categoryId: catSalary.id, userId: user.id },
      { amount: 3000000, type: "TRANSFER", description: "Rút tiền mặt chi tiêu tiêu dùng", date: new Date("2026-10-06"), walletId: walletBank.id, toWalletId: walletCash.id, categoryId: catTransfer.id, userId: user.id },
      { amount: 4500000, type: "EXPENSE", description: "Tiền thuê trọ + điện nước tháng 10", date: new Date("2026-10-07"), walletId: walletBank.id, categoryId: catBills.id, userId: user.id },
      { amount: 45000, type: "EXPENSE", description: "Ăn phở sáng và cà phê", date: new Date("2026-10-08"), walletId: walletCash.id, categoryId: catFood.id, userId: user.id },
      { amount: 80000, type: "EXPENSE", description: "Đổ xăng xe máy", date: new Date("2026-10-09"), walletId: walletCash.id, categoryId: catTransport.id, userId: user.id },
      { amount: 520000, type: "EXPENSE", description: "Đi siêu thị WinMart mua nhu yếu phẩm", date: new Date("2026-10-10"), walletId: walletBank.id, categoryId: catFood.id, userId: user.id },
      { amount: 350000, type: "EXPENSE", description: "Ăn tối lẩu liên hoan cùng đồng nghiệp", date: new Date("2026-10-12"), walletId: walletBank.id, categoryId: catFood.id, userId: user.id },
      { amount: 850000, type: "EXPENSE", description: "Mua áo sơ mi và quần tây", date: new Date("2026-10-14"), walletId: walletBank.id, categoryId: catShopping.id, userId: user.id },
      { amount: 220000, type: "EXPENSE", description: "Xem phim rạp CGV cuối tuần", date: new Date("2026-10-17"), walletId: walletBank.id, categoryId: catEntertainment.id, userId: user.id },
      { amount: 5000000, type: "INCOME", description: "Thù lao dự án Freelance Landing Page", date: new Date("2026-10-18"), walletId: walletBank.id, categoryId: catBonus.id, userId: user.id },
      { amount: 65000, type: "EXPENSE", description: "Cơm trưa văn phòng", date: new Date("2026-10-20"), walletId: walletCash.id, categoryId: catFood.id, userId: user.id },
      { amount: 250000, type: "EXPENSE", description: "Tiền mạng Internet FPT", date: new Date("2026-10-22"), walletId: walletBank.id, categoryId: catBills.id, userId: user.id },
      { amount: 90000, type: "EXPENSE", description: "Thay nhớt xe máy định kỳ", date: new Date("2026-10-24"), walletId: walletCash.id, categoryId: catTransport.id, userId: user.id },
      { amount: 420000, type: "EXPENSE", description: "Mua tai nghe bluetooth trên Shopee", date: new Date("2026-10-25"), walletId: walletBank.id, categoryId: catShopping.id, userId: user.id },
      { amount: 55000, type: "EXPENSE", description: "Trà sữa cùng bạn bè", date: new Date("2026-10-27"), walletId: walletCash.id, categoryId: catFood.id, userId: user.id },
      { amount: 150000, type: "EXPENSE", description: "Nạp tiền điện thoại Viettel", date: new Date("2026-10-28"), walletId: walletBank.id, categoryId: catBills.id, userId: user.id },
      { amount: 1200000, type: "EXPENSE", description: "Mua giày thể thao chạy bộ", date: new Date("2026-10-29"), walletId: walletBank.id, categoryId: catShopping.id, userId: user.id },
      { amount: 70000, type: "EXPENSE", description: "Bún chả trưa văn phòng", date: new Date("2026-10-31"), walletId: walletCash.id, categoryId: catFood.id, userId: user.id },

      // November 2026
      { amount: 25000000, type: "INCOME", description: "Lương tháng 11 chuyển khoản", date: new Date("2026-11-05"), walletId: walletBank.id, categoryId: catSalary.id, userId: user.id },
      { amount: 2000000, type: "TRANSFER", description: "Rút tiền mặt tiêu vặt tuần 1", date: new Date("2026-11-05"), walletId: walletBank.id, toWalletId: walletCash.id, categoryId: catTransfer.id, userId: user.id },
      { amount: 4500000, type: "EXPENSE", description: "Thanh toán tiền nhà tháng 11", date: new Date("2026-11-06"), walletId: walletBank.id, categoryId: catBills.id, userId: user.id },
      { amount: 60000, type: "EXPENSE", description: "Ăn sáng bánh mì chảo + sữa tươi", date: new Date("2026-11-07"), walletId: walletCash.id, categoryId: catFood.id, userId: user.id },
      { amount: 90000, type: "EXPENSE", description: "Đổ đầy bình xăng xe", date: new Date("2026-11-07"), walletId: walletCash.id, categoryId: catTransport.id, userId: user.id },
      { amount: 680000, type: "EXPENSE", description: "Mua đồ ăn tuần tại siêu thị Co.opmart", date: new Date("2026-11-08"), walletId: walletBank.id, categoryId: catFood.id, userId: user.id },
      { amount: 3200000, type: "INCOME", description: "Thưởng KPI xuất sắc quý", date: new Date("2026-11-09"), walletId: walletBank.id, categoryId: catBonus.id, userId: user.id },
      { amount: 1450000, type: "EXPENSE", description: "Đồ gia dụng nhà bếp và nồi chiên", date: new Date("2026-11-09"), walletId: walletBank.id, categoryId: catShopping.id, userId: user.id },
      { amount: 45000, type: "EXPENSE", description: "Cà phê muối sáng", date: new Date("2026-11-10"), walletId: walletCash.id, categoryId: catFood.id, userId: user.id },
      { amount: 250000, type: "EXPENSE", description: "Cước Internet cáp quang tháng 11", date: new Date("2026-11-10"), walletId: walletBank.id, categoryId: catBills.id, userId: user.id },
      { amount: 85000, type: "EXPENSE", description: "Cơm trưa bò xào + nước chanh", date: new Date("2026-11-11"), walletId: walletCash.id, categoryId: catFood.id, userId: user.id },
      { amount: 380000, type: "EXPENSE", description: "Vé hòa nhạc acoustic cuối tuần", date: new Date("2026-11-11"), walletId: walletBank.id, categoryId: catEntertainment.id, userId: user.id },
      { amount: 500000, type: "EXPENSE", description: "Quà sinh nhật bạn thân", date: new Date("2026-11-12"), walletId: walletBank.id, categoryId: catShopping.id, userId: user.id },
      { amount: 50000, type: "EXPENSE", description: "Bánh cuốn nóng buổi sáng", date: new Date("2026-11-12"), walletId: walletCash.id, categoryId: catFood.id, userId: user.id },
      { amount: 1500000, type: "TRANSFER", description: "Chuyển tiền tiết kiệm từ Tiền mặt vào Ngân hàng", date: new Date("2026-11-12"), walletId: walletCash.id, toWalletId: walletBank.id, categoryId: catTransfer.id, userId: user.id },
      { amount: 75000, type: "EXPENSE", description: "Cơm tấm sườn bì chả", date: new Date("2026-11-13"), walletId: walletCash.id, categoryId: catFood.id, userId: user.id },
      { amount: 120000, type: "EXPENSE", description: "Rửa xe máy + bảo dưỡng xích xe", date: new Date("2026-11-13"), walletId: walletCash.id, categoryId: catTransport.id, userId: user.id },
      { amount: 290000, type: "EXPENSE", description: "Sách chuyên ngành lập trình Web", date: new Date("2026-11-13"), walletId: walletBank.id, categoryId: catShopping.id, userId: user.id },
    ],
  });

  console.log("💸 Created 36 transactions");
  console.log("✅ MongoDB database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
