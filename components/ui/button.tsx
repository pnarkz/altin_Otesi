"use client";

import {
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "link";
type ButtonSize = "sm" | "md" | "lg";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-emerald-700 text-white hover:bg-emerald-600 focus-visible:ring-emerald-700",
  secondary:
    "bg-gold-500 text-white hover:bg-gold-600 focus-visible:ring-gold-500",
  ghost:
    "border border-ivory-200 bg-white text-ink-800 hover:bg-ivory-50 focus-visible:ring-ink-300",
  danger:
    "bg-danger-500 text-white hover:bg-danger-500/90 focus-visible:ring-danger-500",
  link: "bg-transparent text-burgundy hover:text-burgundy/80 hover:underline focus-visible:ring-burgundy",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-10 px-4 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
};

export function Button({
  type = "button",
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  className,
  children,
  iconLeft,
  iconRight,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={[
        "inline-flex items-center justify-center gap-2 rounded-2xl font-medium transition-all duration-200 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
        variantClasses[variant],
        sizeClasses[size],
        className ?? "",
      ].join(" ")}
      {...props}
    >
      {loading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        iconLeft
      )}
      <span>{children}</span>
      {!loading ? iconRight : null}
    </button>
  );
}
