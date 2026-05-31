"use client";

import type { ReactNode } from "react";
import { EthicNotice } from "@/components/ui/ethic-notice";
import { MobileSidebarTrigger, Sidebar } from "@/components/ui/sidebar";

type PageFrameProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  breadcrumb?: string;
  icon?: ReactNode;
  aside?: ReactNode;
  ethicNotice?: string;
  children: ReactNode;
};

export function PageFrame({
  eyebrow,
  title,
  description,
  breadcrumb,
  icon,
  aside,
  ethicNotice,
  children,
}: PageFrameProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-creamSoft to-ivory-50 text-ink-900">
      <Sidebar />

      <div className="min-h-screen md:pl-72">
        <div className="mx-auto flex min-h-screen w-full max-w-[1400px] flex-col">
          <div className="border-b border-ivory-200/80 bg-creamSoft/80 px-4 py-2.5 backdrop-blur-sm md:hidden">
            <MobileSidebarTrigger />
          </div>

          <header className="border-b border-ivory-200/80 px-4 py-3 md:px-6 md:py-3">
            <div className="space-y-3">
              {eyebrow ? (
                <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-500">
                  {eyebrow}
                </p>
              ) : null}

              <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
                <div className="min-w-0 space-y-2">
                  {breadcrumb ? <p className="text-sm text-muted-500">{breadcrumb}</p> : null}
                  <div className="flex items-start gap-3">
                    {icon ? (
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-gold-400/30 bg-gold-400/10 text-burgundy">
                        {icon}
                      </div>
                    ) : null}

                    <div className="min-w-0 space-y-1">
                      <h1 className="text-xl font-semibold tracking-tight text-ink-900 md:text-[1.8rem]">
                        {title}
                      </h1>
                      {description ? (
                        <p className="max-w-3xl text-sm leading-relaxed text-ink-700">
                          {description}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </div>

                {aside ? <div className="w-full xl:max-w-sm">{aside}</div> : null}
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-4 md:px-6 md:py-5">
            <div className="space-y-4">{children}</div>
          </main>

          {ethicNotice ? (
            <footer className="px-4 pb-6 md:px-6">
              <EthicNotice>{ethicNotice}</EthicNotice>
            </footer>
          ) : null}
        </div>
      </div>
    </div>
  );
}
