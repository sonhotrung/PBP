import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date));
}

export function formatDateShort(date: string | Date): string {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
  }).format(new Date(date));
}

export function getTransactionColor(type: string): string {
  if (type === "INCOME") return "text-emerald-600";
  if (type === "EXPENSE") return "text-red-500";
  return "text-blue-500";
}

export function getTransactionSign(type: string): string {
  if (type === "INCOME") return "+";
  if (type === "EXPENSE") return "-";
  return "↔";
}

export function getDaysInMonth(month: number, year: number): number {
  return new Date(year, month, 0).getDate();
}
