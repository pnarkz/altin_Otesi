import type { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";

export function MetricCard({
  label,
  value,
  detail
}: {
  label: string;
  value: string;
  detail: ReactNode;
}) {
  return (
    <Card>
      <CardContent className="space-y-3">
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-2xl">{value}</CardTitle>
        <div className="text-sm leading-relaxed text-muted-500">{detail}</div>
      </CardContent>
    </Card>
  );
}
