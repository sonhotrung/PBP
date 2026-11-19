import { prisma } from "../config/database";
import { TransactionType, CreateTransactionData, TransactionFilters, MonthlyStats, CategorySpending } from "../types";

const transactionInclude = {
  wallet: { select: { id: true, name: true, color: true } },
  toWallet: { select: { id: true, name: true, color: true } },
  category: { select: { id: true, name: true, icon: true, color: true, type: true } },
};

export class TransactionService {
  static async getAll(filters: TransactionFilters = {}) {
    const where: Record<string, unknown> = {};

    if (filters.type) where.type = filters.type;
    if (filters.walletId) where.walletId = filters.walletId;
    if (filters.categoryId) where.categoryId = filters.categoryId;

    if (filters.month && filters.year) {
      const start = new Date(filters.year, filters.month - 1, 1);
      const end = new Date(filters.year, filters.month, 1);
      where.date = { gte: start, lt: end };
    } else if (filters.year) {
      const start = new Date(filters.year, 0, 1);
      const end = new Date(filters.year + 1, 0, 1);
      where.date = { gte: start, lt: end };
    }

    return prisma.transaction.findMany({
      where,
      include: transactionInclude,
      orderBy: { date: "desc" },
    });
  }

  static async getById(id: string) {
    return prisma.transaction.findUnique({
      where: { id },
      include: transactionInclude,
    });
  }

  static async create(data: CreateTransactionData) {
    const wallet = await prisma.wallet.findUnique({ where: { id: data.walletId } });
    if (!wallet) throw new Error(`Wallet not found: ${data.walletId}`);

    const transaction = await prisma.transaction.create({
      data: {
        amount: data.amount,
        type: data.type as TransactionType,
        description: data.description,
        date: data.date ? new Date(data.date) : new Date(),
        walletId: data.walletId,
        toWalletId: data.toWalletId ?? null,
        categoryId: data.categoryId ?? null,
      },
      include: transactionInclude,
    });

    // Update wallet balance
    if (data.type === "INCOME") {
      await prisma.wallet.update({ where: { id: data.walletId }, data: { balance: { increment: data.amount } } });
    } else if (data.type === "EXPENSE") {
      await prisma.wallet.update({ where: { id: data.walletId }, data: { balance: { decrement: data.amount } } });
    }

    return transaction;
  }

  static async transfer(data: CreateTransactionData) {
    if (!data.toWalletId) throw new Error("toWalletId is required for transfers");

    const [transaction] = await prisma.$transaction([
      prisma.transaction.create({
        data: {
          amount: data.amount,
          type: "TRANSFER",
          description: data.description,
          date: data.date ? new Date(data.date) : new Date(),
          walletId: data.walletId,
          toWalletId: data.toWalletId,
          categoryId: data.categoryId ?? null,
        },
      }),
      prisma.wallet.update({ where: { id: data.walletId }, data: { balance: { decrement: data.amount } } }),
      prisma.wallet.update({ where: { id: data.toWalletId }, data: { balance: { increment: data.amount } } }),
    ]);

    return prisma.transaction.findUnique({ where: { id: transaction.id }, include: transactionInclude });
  }

  static async delete(id: string) {
    const transaction = await prisma.transaction.findUnique({ where: { id } });
    if (!transaction) throw new Error(`Transaction not found: ${id}`);

    // Reverse balance changes
    if (transaction.type === "INCOME") {
      await prisma.wallet.update({ where: { id: transaction.walletId }, data: { balance: { decrement: transaction.amount } } });
    } else if (transaction.type === "EXPENSE") {
      await prisma.wallet.update({ where: { id: transaction.walletId }, data: { balance: { increment: transaction.amount } } });
    } else if (transaction.type === "TRANSFER" && transaction.toWalletId) {
      await prisma.wallet.update({ where: { id: transaction.walletId }, data: { balance: { increment: transaction.amount } } });
      await prisma.wallet.update({ where: { id: transaction.toWalletId }, data: { balance: { decrement: transaction.amount } } });
    }

    return prisma.transaction.delete({ where: { id } });
  }

  static async getMonthlyStats(month: number, year: number): Promise<MonthlyStats> {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 1);

    const transactions = await prisma.transaction.findMany({
      where: { date: { gte: start, lt: end } },
      select: { amount: true, type: true },
    });

    const totalIncome = transactions.filter((t) => t.type === "INCOME").reduce((s, t) => s + t.amount, 0);
    const totalExpense = transactions.filter((t) => t.type === "EXPENSE").reduce((s, t) => s + t.amount, 0);

    return {
      totalIncome,
      totalExpense,
      netBalance: totalIncome - totalExpense,
      transactionCount: transactions.length,
    };
  }

  static async getByCategory(month: number, year: number): Promise<CategorySpending[]> {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 1);

    const transactions = await prisma.transaction.findMany({
      where: { type: "EXPENSE", date: { gte: start, lt: end }, categoryId: { not: null } },
      include: { category: { select: { id: true, name: true, color: true, icon: true } } },
    });

    const map = new Map<string, CategorySpending>();
    for (const tx of transactions) {
      if (!tx.categoryId || !tx.category) continue;
      const existing = map.get(tx.categoryId);
      if (existing) {
        existing.total += tx.amount;
      } else {
        map.set(tx.categoryId, {
          categoryId: tx.categoryId,
          categoryName: tx.category.name,
          categoryColor: tx.category.color,
          categoryIcon: tx.category.icon,
          total: tx.amount,
        });
      }
    }

    return Array.from(map.values()).sort((a, b) => b.total - a.total);
  }
}
