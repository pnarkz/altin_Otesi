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
  LogOut,
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
import { useAppState } from "@/components/providers/app-state-provider";
import { Badge } from "@/components/ui/badge";

type NavItem = {
  label: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
  badge?: string;
};

const individualItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Baslangic Testi", href: "/test", icon: ClipboardCheck },
  { label: "Skor Sonucu", href: "/result", icon: Target },
  { label: "AltinIkiz", href: "/twin", icon: Activity },
  { label: "Kumbara", href: "/savings", icon: PiggyBank },
  { label: "Akademi", href: "/academy", icon: GraduationCap },
  { label: "Simulasyon", href: "/simulation", icon: WalletCards },
  { label: "Dolandiricilik Kalkani", href: "/scam-shield", icon: ShieldAlert },
  { label: "Evden Ureten Kadin", href: "/producer", icon: Package },
  { label: "AI Koc", href: "/coach", icon: BrainCircuit },
  { label: "Profil ve AI", href: "/profile", icon: Settings2 },
];

const corporateItems: NavItem[] = [
  { label: "Kurumsal Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Kurum Paneli", href: "/institution?demo=true", icon: BookOpen },
  { label: "Kurumsal AltinIkiz", href: "/twin", icon: Activity },
  { label: "Kurumsal AI Koc", href: "/coach", icon: BrainCircuit },
  { label: "Kurumsal Kalkan", href: "/scam-shield", icon: ShieldAlert },
  { label: "Profil ve AI", href: "/profile", icon: Settings2 },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { authSession, logout } = useAppState();
  const primaryItems = authSession?.role === "corporate" ? corporateItems : individualItems;

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-ivory-200 px-5 py-5">
        <Link href="/dashboard" className="block" onClick={onNavigate}>
          <div className="flex items-center gap-3">
            <div className="overflow-hidden rounded-2xl border border-gold-400/30 bg-white shadow-sm">
              <Image
                src="/login-logo.png"
                alt="AltinOtesi logosu"
                width={96}
                height={96}
                className="h-16 w-16 object-contain mix-blend-multiply"
                priority
              />
            </div>
            <div>
              <p className="text-[1.75rem] font-semibold tracking-tight text-burgundy">AltinOtesi</p>
              <p className="mt-1 text-sm text-muted-500">Bilgiyle birik, guvenle korun ve buyu</p>
            </div>
          </div>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="mb-4 flex items-center justify-between rounded-2xl border border-gold-400/30 bg-gold-400/10 px-3 py-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-gold-600" />
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-gold-700">
              {authSession?.role === "corporate" ? "Kurumsal oturum" : "Bireysel oturum"}
            </span>
          </div>
          <Badge variant={authSession?.role === "corporate" ? "emerald" : "gold"} size="sm">
            Aktif
          </Badge>
        </div>

        {authSession ? (
          <div className="mb-4 rounded-2xl border border-ivory-200 bg-white px-3 py-3">
            <p className="text-sm font-medium text-ink-900">
              {authSession.organizationName ?? authSession.displayName}
            </p>
            <p className="mt-1 text-xs uppercase tracking-[0.18em] text-muted-500">
              {authSession.role === "corporate" ? "Kurumsal hesap" : "Bireysel hesap"}
            </p>
          </div>
        ) : null}

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
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => {
              logout();
              window.location.href = "/";
            }}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-ivory-200 bg-white px-3 py-3 text-sm font-medium text-ink-800 transition hover:border-gold-400 hover:bg-ivory-50"
          >
            <LogOut className="h-4 w-4 text-burgundy" />
            Cikis yap
          </button>
          <div className="rounded-2xl border border-ivory-200 bg-white/70 px-3 py-3">
            <div className="flex items-start gap-2">
              <BadgeInfo className="mt-0.5 h-4 w-4 text-muted-500" />
              <p className="text-sm leading-relaxed text-muted-500">
                AltinOtesi yatirim tavsiyesi vermez. Bu ekranlar egitim ve farkindalik icindir.
              </p>
            </div>
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
      Menu
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
            <p className="text-lg font-semibold text-burgundy">AltinOtesi</p>
            <p className="text-sm text-muted-500">Menu</p>
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
