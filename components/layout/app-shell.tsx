"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { Lock, ShieldAlert } from "lucide-react";
import { useAppState } from "@/components/providers/app-state-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageFrame } from "@/components/ui/page-frame";
import { AuthRole } from "@/types";

export function AppShell({
  eyebrow,
  title,
  description,
  aside,
  children,
  icon,
  breadcrumb,
  ethicNotice,
  requiredRole,
}: {
  eyebrow: string;
  title: string;
  description: string;
  aside?: ReactNode;
  children: ReactNode;
  icon?: ReactNode;
  breadcrumb?: string;
  ethicNotice?: string;
  requiredRole?: AuthRole;
}) {
  const { authSession, isReady } = useAppState();

  if (!isReady) {
    return null;
  }

  if (!authSession) {
    return (
      <div className="grid min-h-screen place-items-center bg-gradient-to-br from-cream via-creamSoft to-ivory-50 px-4">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-burgundy" />
              Giris gerekli
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-500">
              Bu ekrani gormek icin once bireysel veya kurumsal hesabinla giris yap.
            </p>
            <Link href="/">
              <Button>Giris ekranina don</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (requiredRole && authSession.role !== requiredRole) {
    return (
      <div className="grid min-h-screen place-items-center bg-gradient-to-br from-cream via-creamSoft to-ivory-50 px-4">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-burgundy" />
              Yetki uyusmuyor
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-500">
              Bu ekran yalnizca {requiredRole === "corporate" ? "kurumsal" : "bireysel"} oturum icin acik.
            </p>
            <Link href="/dashboard">
              <Button>Uygulamaya don</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <PageFrame
      eyebrow={eyebrow}
      title={title}
      description={description}
      aside={aside}
      icon={icon}
      breadcrumb={breadcrumb}
      ethicNotice={ethicNotice ?? "AltınÖtesi yatırım tavsiyesi vermez."}
    >
      {children}
    </PageFrame>
  );
}
