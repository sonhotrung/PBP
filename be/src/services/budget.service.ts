import { prisma } from "../config/database";
import { UpsertBudgetData, BudgetStatus, SpendingForecast } from "../types";

export class BudgetService {
  static async getAll(month: number, year: number) {
    return prisma.budget.findMany({
      where: { month, year },
      include: { category: true },
      orderBy: { createdAt: "asc" },
    });
  }

  static async upsert(data: UpsertBudgetData) {
    return prisma.budget.upsert({
      where: {
        categoryId_month_year: {
          categoryId: data.categoryId,
          month: data.month,
          year: data.year,
        },
      },
      update: { amount: data.amount },
      create: {
        categoryId: data.categoryId,
        amount: data.amount,
        month: data.month,
        year: data.year,
      },
      include: { category: true },
    });
  }

  static async delete(id: string) {
    return prisma.budget.delete({ where: { id } });
  }

  static async getBudgetStatus(month: number, year: number): Promise<BudgetStatus[]> {
    const budgets = await prisma.budget.findMany({
      where: { month, year },
      include: { category: true },
    });

    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 1);

    const statuses: BudgetStatus[] = [];

    for (const budget of budgets) {
      const transactions = await prisma.transaction.findMany({
        where: {
          type: "EXPENSE",
          categoryId: budget.categoryId,
          date: { gte: start, lt: end },
        },
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

  static async getSpendingForecast(month: number, year: number): Promise<SpendingForecast> {
    const now = new Date();
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 1);
    const daysInMonth = new Date(year, month, 0).getDate();

    // Days passed: at least 1
    const isCurrentMonth = now.getFullYear() === year && now.getMonth() + 1 === month;
    const daysPassed = isCurrentMonth ? Math.max(1, now.getDate()) : daysInMonth;
    const daysRemaining = Math.max(0, daysInMonth - daysPassed);

    const transactions = await prisma.transaction.findMany({
      where: { type: "EXPENSE", date: { gte: start, lt: end } },
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
