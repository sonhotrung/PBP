export type TransactionType = "INCOME" | "EXPENSE" | "TRANSFER";
export type CategoryType = "INCOME" | "EXPENSE" | "TRANSFER";

export interface Wallet {
  id: string;
  name: string;
  type: string;
  balance: number;
  currency: string;
  color?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  type: CategoryType;
  icon: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  description?: string | null;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
  walletId: string;
  wallet?: Pick<Wallet, "id" | "name" | "color">;
  toWalletId?: string | null;
  toWallet?: Pick<Wallet, "id" | "name" | "color"> | null;
  categoryId?: string | null;
  category?: Pick<Category, "id" | "name" | "icon" | "color" | "type"> | null;
}

export interface Budget {
  id: string;
  amount: number;
  month: number;
  year: number;
  createdAt: Date;
  updatedAt: Date;
  categoryId: string;
  category?: Category;
}

export interface MonthlyStats {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  transactionCount: number;
}

export interface CategorySpending {
  categoryId: string;
  categoryName: string;
  categoryColor: string;
  categoryIcon: string;
  total: number;
}

export interface BudgetStatus {
  id: string;
  amount: number;
  month: number;
  year: number;
  categoryId: string;
  categoryName: string;
  categoryColor: string;
  categoryIcon: string;
  spent: number;
  remaining: number;
  percentage: number;
  isOverBudget: boolean;
}

export interface SpendingForecast {
  currentSpending: number;
  projectedSpending: number;
  daysInMonth: number;
  daysPassed: number;
  daysRemaining: number;
  dailyAverage: number;
}

export interface CreateTransactionData {
  amount: number;
  type: TransactionType;
  description?: string;
  date?: string | Date;
  walletId: string;
  toWalletId?: string;
  categoryId?: string;
}

export interface TransactionFilters {
  month?: number;
  year?: number;
  type?: TransactionType;
  walletId?: string;
  categoryId?: string;
}

export interface UpsertBudgetData {
  categoryId: string;
  amount: number;
  month: number;
  year: number;
}
