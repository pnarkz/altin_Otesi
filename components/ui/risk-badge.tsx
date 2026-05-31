import { Badge } from "@/components/ui/badge";
import { UrlRiskLevel } from "@/types";

export function RiskBadge({ level }: { level: UrlRiskLevel }) {
  if (level === "Düşük") {
    return <Badge variant="success" dot>Düşük Risk</Badge>;
  }
  if (level === "Orta") {
    return <Badge variant="warning" dot>Orta Risk</Badge>;
  }
  if (level === "Yüksek") {
    return <Badge variant="warning" dot>Yüksek Risk</Badge>;
  }
  return <Badge variant="danger" dot>Kritik Risk</Badge>;
}
