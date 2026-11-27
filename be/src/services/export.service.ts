import { prisma } from "../config/database";

export class ExportService {
  static async generateCSV(month?: number, year?: number, userId?: string): Promise<string> {
    const where: Record<string, unknown> = {};
    if (userId) where.userId = userId;

    if (month && year) {
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 1);
      where.date = { gte: start, lt: end };
    } else if (year) {
      const start = new Date(year, 0, 1);
      const end = new Date(year + 1, 0, 1);
      where.date = { gte: start, lt: end };
    }

    const transactions = await prisma.transaction.findMany({
      where,
      include: {
        category: { select: { name: true } },
        wallet: { select: { name: true } },
      },
      orderBy: { date: "desc" },
    });

    const typeLabel = (type: string) => {
      if (type === "INCOME") return "Thu nhập";
      if (type === "EXPENSE") return "Chi tiêu";
      return "Chuyển khoản";
    };

    const formatDate = (d: Date) => d.toISOString().split("T")[0];

    const rows = transactions.map((tx) => {
      const date = formatDate(tx.date);
      const type = typeLabel(tx.type);
      const desc = `"${(tx.description ?? "").replace(/"/g, '""')}"`;
      const amount = tx.amount.toFixed(0);
      const category = tx.category?.name ?? "";
      const wallet = tx.wallet?.name ?? "";
      return [date, type, desc, amount, `"${category}"`, `"${wallet}"`].join(",");
    });

    const BOM = "\ufeff";
    const header = "Ngày,Loại,Mô tả,Số tiền,Danh mục,Ví";
    return BOM + header + "\n" + rows.join("\n");
  }
}
