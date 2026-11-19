import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

const variantClasses = {
  primary: "bg-[#15803D] text-white hover:bg-[#166534] disabled:bg-[#86EFAC] shadow-xs shadow-emerald-800/15",
  secondary: "bg-[#F4F1EA] text-[#44403C] hover:bg-[#E8E3D9] border border-[#E8E3D9] disabled:opacity-50",
  danger: "bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300",
  ghost: "bg-transparent text-[#57534E] hover:bg-[#F4F1EA] hover:text-[#1C1917] disabled:opacity-50",
  outline: "border border-[#E8E3D9] bg-white text-[#44403C] hover:bg-[#FAF7F2] hover:text-[#1C1917] disabled:opacity-50 shadow-2xs",
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
        "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all disabled:cursor-not-allowed",
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
