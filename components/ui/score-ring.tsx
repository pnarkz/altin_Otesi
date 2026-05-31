import { CircularProgress } from "@/components/ui/progress";

export function ScoreRing({ value, label }: { value: number; label: string }) {
  return <CircularProgress value={value} label={label} />;
}
