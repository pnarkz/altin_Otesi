import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AppStateProvider } from "@/components/providers/app-state-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "AltınÖtesi — Finansal Güçlenme Platformu",
  description:
    "Kadınların ev bütçesini, evden üretimini ve finansal güvenini güçlendiren AI destekli platform.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="tr">
      <body className="bg-ivory-50 text-ink-700 antialiased">
        <AppStateProvider>{children}</AppStateProvider>
      </body>
    </html>
  );
}
