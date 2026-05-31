import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function StatCard({
  label,
  value,
  delta,
  tone = "default"
}: {
  label: string;
  value: string;
  delta?: string;
  tone?: "default" | "gold" | "emerald" | "info" | "neutral";
}) {
  const accent =
    tone === "gold"
      ? "text-gold-600"
      : tone === "emerald"
        ? "text-emerald-700"
        : tone === "info"
          ? "text-info-500"
          : tone === "neutral"
            ? "text-ink-800"
            : "text-burgundy";

  return (
    <Card>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-500">{label}</p>
        <p className={`text-3xl font-medium ${accent}`}>{value}</p>
        {delta ? (
          <div className="inline-flex items-center gap-1 rounded-full bg-ivory-100 px-2.5 py-1 text-xs text-muted-500">
            {delta.startsWith("-") ? <ArrowDownRight className="h-3.5 w-3.5" /> : <ArrowUpRight className="h-3.5 w-3.5" />}
            {delta}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
