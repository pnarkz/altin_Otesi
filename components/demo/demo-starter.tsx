"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAppState } from "@/components/providers/app-state-provider";
import { createDemoResult } from "@/lib/demo";

export function DemoStarter({
  redirectTo = "/dashboard",
  variant = "secondary",
}: {
  redirectTo?: "/dashboard" | "/twin";
  variant?: "primary" | "secondary";
}) {
  const router = useRouter();
  const { setResult } = useAppState();

  const handleClick = () => {
    setResult(createDemoResult());
    router.push(redirectTo);
  };

  return (
    <Button
      type="button"
      onClick={handleClick}
      variant={variant === "primary" ? "primary" : "secondary"}
      size="lg"
    >
      Hazir profili yukle
    </Button>
  );
}
