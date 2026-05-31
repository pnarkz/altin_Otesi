"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useAppState } from "@/components/providers/app-state-provider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function ResultGuard({ children }: { children: ReactNode }) {
  const { result, isReady } = useAppState();

  if (!isReady) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-sm text-muted-500">Veri hazırlanıyor...</CardContent>
      </Card>
    );
  }

  if (!result) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Önce testi tamamla</CardTitle>
          <CardDescription>Sonuç verisi yerel tarayıcı hafızasında saklanır ve testten sonra görünür olur.</CardDescription>
        </CardHeader>
        <CardContent>
          <Link
            href="/test"
            className="inline-flex h-11 items-center justify-center rounded-full border border-emerald-700 bg-emerald-700 px-5 text-sm font-medium text-white transition duration-200 hover:scale-[1.02] hover:bg-emerald-600"
          >
            Teste git
          </Link>
        </CardContent>
      </Card>
    );
  }

  return <>{children}</>;
}
