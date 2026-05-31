import type { ReactNode } from "react";

const variantClasses = {
  gold: "border-gold-400/40 bg-gold-400/10 text-gold-700",
  emerald: "border-emerald-600/20 bg-emerald-600/10 text-emerald-700",
  danger: "border-danger-500/20 bg-danger-100 text-danger-500",
  warning: "border-warning-500/20 bg-warning-100 text-warning-500",
  success: "border-success-500/20 bg-success-100 text-success-500",
  info: "border-info-500/20 bg-info-100 text-info-500",
  neutral: "border-ivory-200 bg-white text-muted-500"
} as const;

export function Badge({
  children,
  variant = "neutral",
  size = "sm",
  dot = false,
  className = ""
}: {
  children: ReactNode;
  variant?: keyof typeof variantClasses;
  size?: "sm" | "md";
  dot?: boolean;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border font-medium ${
        size === "sm" ? "px-2.5 py-1 text-xs" : "px-3 py-1.5 text-sm"
      } ${variantClasses[variant]} ${className}`}
    >
      {dot ? <span className="h-2 w-2 rounded-full bg-current" /> : null}
      {children}
    </span>
  );
}
