import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

const variantClasses = {
  primary: "bg-emerald-600 text-white hover:bg-emerald-700 disabled:bg-emerald-300 shadow-xs",
  secondary: "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 disabled:bg-slate-100",
  danger: "bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300",
  ghost: "bg-transparent text-slate-600 hover:bg-emerald-50 hover:text-emerald-800 disabled:opacity-50",
  outline: "border border-emerald-200 bg-white text-emerald-800 hover:bg-emerald-50/50 disabled:opacity-50",
};

const sizeClasses = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

export default function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors disabled:cursor-not-allowed",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
