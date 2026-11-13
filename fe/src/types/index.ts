export interface Wallet {
  id: string;
  name: string;
  type: string;
  balance: number;
  currency: string;
  color?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  type: "INCOME" | "EXPENSE" | "TRANSFER";
  icon: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  amount: number;
  type: "INCOME" | "EXPENSE" | "TRANSFER";
  description?: string;
  date: string;
  createdAt: string;
  updatedAt: string;
  walletId: string;
  wallet?: Wallet;
  toWalletId?: string;
  toWallet?: Wallet;
  categoryId?: string;
  category?: Category;
}

export interface Budget {
  id: string;
  amount: number;
  month: number;
  year: number;
  createdAt: string;
  updatedAt: string;
  categoryId: string;
  category?: Category;
}

export interface BudgetStatus {
  budgetId: string;
  categoryId: string;
  categoryName: string;
  categoryIcon: string;
  budgetAmount: number;
  spentAmount: number;
  remainingAmount: number;
  percentage: number;
  status: "OK" | "WARNING" | "DANGER" | "EXCEEDED";
}

export interface SpendingForecast {
  currentSpent: number;
  projectedTotal: number;
  avgPerDay: number;
  daysRemaining: number;
  daysElapsed: number;
  totalDays: number;
  month: number;
  year: number;
}

export interface MonthlyStats {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  month: number;
  year: number;
  transactionCount: number;
}

export interface CategoryStat {
  categoryId: string;
  categoryName: string;
  categoryIcon: string;
  categoryColor: string;
  total: number;
  count: number;
  percentage: number;
}

export interface CreateTransactionDTO {
  amount: number;
  type: "INCOME" | "EXPENSE" | "TRANSFER";
  description?: string;
  date?: string;
  walletId: string;
  categoryId?: string;
  toWalletId?: string;
}

export interface TransferDTO {
  amount: number;
  fromWalletId: string;
  toWalletId: string;
  description?: string;
  date?: string;
}

export interface CreateBudgetDTO {
  categoryId: string;
  amount: number;
  month: number;
  year: number;
}
