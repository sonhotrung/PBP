import {
  Wallet,
  Category,
  Transaction,
  Budget,
  BudgetStatus,
  SpendingForecast,
  MonthlyStats,
  CategoryStat,
  CreateTransactionDTO,
  TransferDTO,
  CreateBudgetDTO,
} from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(error.message || "API Error");
  }
  return res.json();
}

export const api = {
  // Wallets
  getWallets: () => request<Wallet[]>("/api/wallets"),
  getTotalBalance: () => request<{ total: number }>("/api/wallets/total/balance"),

  // Transactions
  getTransactions: (params?: {
    month?: number;
    year?: number;
    walletId?: string;
    type?: string;
    limit?: number;
  }) => {
    const qs = new URLSearchParams(
      Object.entries(params || {})
        .filter(([, v]) => v != null)
        .map(([k, v]) => [k, String(v)])
    );
    return request<Transaction[]>(
      `/api/transactions${qs.toString() ? "?" + qs : ""}`
    );
  },
  createTransaction: (data: CreateTransactionDTO) =>
    request<Transaction>("/api/transactions", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  transferMoney: (data: TransferDTO) =>
    request<Transaction>("/api/transactions/transfer", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  deleteTransaction: (id: string) =>
    request<void>(`/api/transactions/${id}`, { method: "DELETE" }),
  getMonthlyStats: (month: number, year: number) =>
    request<MonthlyStats>(
      `/api/transactions/stats/monthly?month=${month}&year=${year}`
    ),
  getByCategory: (month: number, year: number) =>
    request<CategoryStat[]>(
      `/api/transactions/stats/by-category?month=${month}&year=${year}`
    ),

  // Categories
  getCategories: (type?: string) =>
    request<Category[]>(`/api/categories${type ? "?type=" + type : ""}`),

  // Budgets
  getBudgets: (month: number, year: number) =>
    request<Budget[]>(`/api/budgets?month=${month}&year=${year}`),
  getBudgetStatus: (month: number, year: number) =>
    request<BudgetStatus[]>(
      `/api/budgets/status?month=${month}&year=${year}`
    ),
  getSpendingForecast: (month?: number, year?: number) =>
    request<SpendingForecast>(
      `/api/budgets/forecast${month ? "?month=" + month + "&year=" + year : ""}`
    ),
  upsertBudget: (data: CreateBudgetDTO) =>
    request<Budget>("/api/budgets", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  deleteBudget: (id: string) =>
    request<void>(`/api/budgets/${id}`, { method: "DELETE" }),

  // Export
  exportCSV: (month?: number, year?: number) => {
    const qs = month ? `?month=${month}&year=${year}` : "";
    window.open(`${API_BASE}/api/export/csv${qs}`, "_blank");
  },
};
