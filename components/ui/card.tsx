import type { HTMLAttributes, ReactNode } from "react";

export function Card({
  variant = "default",
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement> & { variant?: "default" | "premium" | "elevated" }) {
  const baseClass =
    variant === "premium" ? "card-premium" : variant === "elevated" ? "card-elevated" : "card";

  return <div {...props} className={`${baseClass} ${className}`} />;
}

export function CardHeader({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={`mb-5 space-y-2 ${className}`} />;
}

export function CardTitle({ className = "", ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 {...props} className={`text-xl font-semibold leading-snug text-ink-900 ${className}`} />;
}

export function CardDescription({ className = "", ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p {...props} className={`text-sm leading-relaxed text-muted-500 ${className}`} />;
}

export function CardContent({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={className} />;
}

export function CardFooter({ className = "", children }: { className?: string; children: ReactNode }) {
  return <div className={`mt-6 flex flex-wrap items-center gap-3 ${className}`}>{children}</div>;
}
