import { cn } from "@/lib/utils";

interface BadgeProps {
  type: "INCOME" | "EXPENSE" | "TRANSFER";
  className?: string;
}

const typeConfig = {
  INCOME: {
    label: "Thu nhập",
    className: "bg-emerald-100 text-emerald-700",
  },
  EXPENSE: {
    label: "Chi tiêu",
    className: "bg-red-100 text-red-700",
  },
  TRANSFER: {
    label: "Chuyển khoản",
    className: "bg-blue-100 text-blue-700",
  },
};

export default function Badge({ type, className }: BadgeProps) {
  const config = typeConfig[type];
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
