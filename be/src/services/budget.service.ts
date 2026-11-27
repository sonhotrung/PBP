import { prisma } from "../config/database";
import { UpsertBudgetData, BudgetStatus, SpendingForecast } from "../types";

async function getEffectiveUserId(userId?: string): Promise<string | null> {
  if (userId) return userId;
  const demoUser = await prisma.user.findUnique({ where: { email: "demo@pbp.vn" } });
  return demoUser?.id ?? null;
}

export class BudgetService {
  static async getAll(month: number, year: number, userId?: string) {
    const effectiveUserId = await getEffectiveUserId(userId);
    const where: Record<string, unknown> = { month, year };
    if (effectiveUserId) where.userId = effectiveUserId;

    return prisma.budget.findMany({
      where,
      include: { category: true },
      orderBy: { createdAt: "asc" },
    });
  }

  static async upsert(data: UpsertBudgetData, userId?: string) {
    const effectiveUserId = await getEffectiveUserId(userId);

    const existing = await prisma.budget.findFirst({
      where: {
        categoryId: data.categoryId,
        month: data.month,
        year: data.year,
        ...(effectiveUserId ? { userId: effectiveUserId } : {}),
      },
    });

    if (existing) {
      return prisma.budget.update({
        where: { id: existing.id },
        data: { amount: data.amount },
        include: { category: true },
      });
    }

    return prisma.budget.create({
      data: {
        categoryId: data.categoryId,
        amount: data.amount,
        month: data.month,
        year: data.year,
        userId: effectiveUserId,
      },
      include: { category: true },
    });
  }

  static async delete(id: string) {
    return prisma.budget.delete({ where: { id } });
  }

  static async getBudgetStatus(month: number, year: number, userId?: string): Promise<BudgetStatus[]> {
    const effectiveUserId = await getEffectiveUserId(userId);
    const whereBudget: Record<string, unknown> = { month, year };
    if (effectiveUserId) whereBudget.userId = effectiveUserId;

    const budgets = await prisma.budget.findMany({
      where: whereBudget,
      include: { category: true },
    });

    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 1);

    const statuses: BudgetStatus[] = [];

    for (const budget of budgets) {
      const whereTx: Record<string, unknown> = {
        type: "EXPENSE",
        categoryId: budget.categoryId,
        date: { gte: start, lt: end },
      };
      if (effectiveUserId) whereTx.userId = effectiveUserId;

      const transactions = await prisma.transaction.findMany({
        where: whereTx,
        select: { amount: true },
      });

      const spent = transactions.reduce((s, t) => s + t.amount, 0);
      const remaining = budget.amount - spent;
      const percentage = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;

      statuses.push({
        id: budget.id,
        amount: budget.amount,
        month: budget.month,
        year: budget.year,
        categoryId: budget.categoryId,
        categoryName: budget.category.name,
        categoryColor: budget.category.color,
        categoryIcon: budget.category.icon,
        spent,
        remaining,
        percentage: Math.round(percentage * 100) / 100,
        isOverBudget: spent > budget.amount,
      });
    }

    return statuses;
  }

  static async getSpendingForecast(month: number, year: number, userId?: string): Promise<SpendingForecast> {
    const effectiveUserId = await getEffectiveUserId(userId);
    const now = new Date();
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 1);
    const daysInMonth = new Date(year, month, 0).getDate();

    const isCurrentMonth = now.getFullYear() === year && now.getMonth() + 1 === month;
    const daysPassed = isCurrentMonth ? Math.max(1, now.getDate()) : daysInMonth;
    const daysRemaining = Math.max(0, daysInMonth - daysPassed);

    const where: Record<string, unknown> = {
      type: "EXPENSE",
      date: { gte: start, lt: end },
    };
    if (effectiveUserId) where.userId = effectiveUserId;

    const transactions = await prisma.transaction.findMany({
      where,
      select: { amount: true },
    });

    const currentSpending = transactions.reduce((s, t) => s + t.amount, 0);
    const dailyAverage = daysPassed > 0 ? currentSpending / daysPassed : 0;
    const projectedSpending = dailyAverage * daysInMonth;

    return {
      currentSpending,
      projectedSpending: Math.round(projectedSpending),
      daysInMonth,
      daysPassed,
      daysRemaining,
      dailyAverage: Math.round(dailyAverage),
    };
  }
}
