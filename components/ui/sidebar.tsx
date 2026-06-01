"use client";

import type { ComponentType } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  BadgeInfo,
  BookOpen,
  BrainCircuit,
  ClipboardCheck,
  GraduationCap,
  LayoutDashboard,
  Menu,
  Package,
  PiggyBank,
  Settings2,
  ShieldAlert,
  Sparkles,
  Target,
  WalletCards,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

type NavItem = {
  label: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
  badge?: string;
};

const primaryItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Başlangıç Testi", href: "/test", icon: ClipboardCheck },
  { label: "Skor Sonucu", href: "/result", icon: Target },
  { label: "Altınİkiz", href: "/twin", icon: Activity },
  { label: "Kumbara", href: "/savings", icon: PiggyBank, badge: "Demo" },
  { label: "Akademi", href: "/academy", icon: GraduationCap, badge: "Demo" },
  { label: "Simülasyon", href: "/simulation", icon: WalletCards, badge: "Demo" },
  { label: "Dolandırıcılık Kalkanı", href: "/scam-shield", icon: ShieldAlert },
  { label: "Evden Üreten Kadın", href: "/producer", icon: Package },
  { label: "AI Koç", href: "/coach", icon: BrainCircuit },
  { label: "Profil ve AI", href: "/profile", icon: Settings2 },
  { label: "Kurum Paneli", href: "/institution?demo=true", icon: BookOpen, badge: "Demo" },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-ivory-200 px-5 py-5">
        <Link href="/dashboard" className="block" onClick={onNavigate}>
          <div className="flex items-center gap-3">
            <div className="overflow-hidden rounded-2xl border border-gold-400/30 bg-white shadow-sm">
              <Image
                src="/altinotesi-logo.svg"
                alt="AltınÖtesi logosu"
                width={56}
                height={56}
                className="h-14 w-14 object-cover"
                priority
              />
            </div>
            <div>
              <p className="text-[1.75rem] font-semibold tracking-tight text-burgundy">AltınÖtesi</p>
              <p className="mt-1 text-sm text-muted-500">Finansal güçlenme platformu</p>
            </div>
          </div>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="mb-4 flex items-center justify-between rounded-2xl border border-gold-400/30 bg-gold-400/10 px-3 py-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-gold-600" />
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-gold-700">
              Demo modu
            </span>
          </div>
          <Badge variant="gold" size="sm">
            Aktif
          </Badge>
        </div>

        <div className="space-y-1.5">
          {primaryItems.map((item) => {
            const Icon = item.icon;
            const active =
              pathname === item.href ||
              (item.href.includes("?") ? item.href.startsWith(pathname) : pathname.startsWith(item.href));

            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={onNavigate}
                className={[
                  "flex items-center justify-between rounded-2xl border px-4 py-3 transition-all duration-200",
                  active
                    ? "border-burgundy/25 bg-burgundy/10 text-burgundy shadow-sm"
                    : "border-transparent text-ink-800 hover:border-gold-400/30 hover:bg-white/80",
                ].join(" ")}
              >
                <span className="flex items-center gap-3">
                  <Icon className={active ? "h-5 w-5 text-burgundy" : "h-5 w-5 text-emerald-700"} />
                  <span className="text-base font-medium">{item.label}</span>
                </span>
                {item.badge ? (
                  <Badge variant="neutral" size="sm">
                    {item.badge}
                  </Badge>
                ) : null}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="border-t border-ivory-200 px-4 py-4">
        <div className="rounded-2xl border border-ivory-200 bg-white/70 px-3 py-3">
          <div className="flex items-start gap-2">
            <BadgeInfo className="mt-0.5 h-4 w-4 text-muted-500" />
            <p className="text-sm leading-relaxed text-muted-500">
              AltınÖtesi yatırım tavsiyesi vermez. Bu ekranlar eğitim ve farkındalık içindir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function MobileSidebarTrigger() {
  return (
    <label
      htmlFor="mobile-sidebar-state"
      className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-ivory-200 bg-white px-3 py-2 text-sm font-medium text-ink-800 shadow-sm md:hidden"
    >
      <Menu className="h-4 w-4 text-burgundy" />
      Menü
    </label>
  );
}

export function Sidebar() {
  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-ivory-200 bg-creamSoft/95 backdrop-blur md:block">
        <SidebarContent />
      </aside>

      <input id="mobile-sidebar-state" type="checkbox" className="peer sr-only md:hidden" />
      <div className="pointer-events-none fixed inset-0 z-40 bg-ink-900/30 opacity-0 transition-opacity peer-checked:pointer-events-auto peer-checked:opacity-100 md:hidden" />
      <aside className="fixed inset-y-0 left-0 z-50 w-[86vw] max-w-[320px] -translate-x-full border-r border-ivory-200 bg-creamSoft shadow-2xl transition-transform peer-checked:translate-x-0 md:hidden">
        <div className="flex items-center justify-between border-b border-ivory-200 px-4 py-4">
          <div>
            <p className="text-lg font-semibold text-burgundy">AltınÖtesi</p>
            <p className="text-sm text-muted-500">Menü</p>
          </div>
          <label
            htmlFor="mobile-sidebar-state"
            className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-ivory-200 bg-white p-2 text-ink-800"
          >
            <X className="h-4 w-4" />
          </label>
        </div>
        <SidebarContent onNavigate={() => {}} />
      </aside>
    </>
  );
}
