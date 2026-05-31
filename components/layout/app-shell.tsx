"use client";

import type { ReactNode } from "react";
import { PageFrame } from "@/components/ui/page-frame";

export function AppShell({
  eyebrow,
  title,
  description,
  aside,
  children,
  icon,
  breadcrumb,
  ethicNotice
}: {
  eyebrow: string;
  title: string;
  description: string;
  aside?: ReactNode;
  children: ReactNode;
  icon?: ReactNode;
  breadcrumb?: string;
  ethicNotice?: string;
}) {
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
