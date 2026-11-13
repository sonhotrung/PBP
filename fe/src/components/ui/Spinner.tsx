import React from "react";

export default function Spinner({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <div className="flex items-center justify-center p-4">
      <div
        className={`animate-spin rounded-full border-2 border-slate-200 border-t-blue-600 ${className}`}
      />
    </div>
  );
}

