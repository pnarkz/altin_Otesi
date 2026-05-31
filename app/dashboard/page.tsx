"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Activity,
  ArrowRight,
  BookOpen,
  LayoutDashboard,
  Package,
  PiggyBank,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { DemoStarter } from "@/components/demo/demo-starter";
import { useAppState } from "@/components/providers/app-state-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { Toast } from "@/components/ui/toast";

const actionCards = [
  {
    title: "Dolandırıcılık mesajı analiz et",
    description: "Şüpheli mesajı veya linki birkaç saniyede kontrol et.",
    href: "/scam-shield",
    icon: ShieldAlert,
    tone: "danger",
  },
  {
    title: "Üretim gelirini hesapla",
    description: "Net kârı, saatlik kazancı ve ayrılabilecek tutarı gör.",
    href: "/producer",
    icon: Package,
    tone: "emerald",
  },
  {
    title: "Altınİkiz yol haritana bak",
    description: "Profilini ve önerilen ilk adımları tek ekranda aç.",
    href: "/twin",
    icon: Activity,
    tone: "gold",
  },
  {
    title: "Kumbara hedefini takip et",
    description: "Küçük hedefleri görünür kıl ve ilerlemeyi takip et.",
    href: "/savings",
    icon: PiggyBank,
    tone: "neutral",
  },
];

export default function DashboardPage() {
  const { result } = useAppState();
  const [toastOpen, setToastOpen] = useState(false);

  const profileName = result?.profile?.name ?? "Evden Üreten Başlangıç";
  const score = Math.round(result?.overallScore ?? 38);
  const primaryNeed =
    result?.profile.primaryNeed ?? "Üretim gelirini görünür hale getirmek";

  const weeklyTasks = useMemo(
    () =>
      result?.profile.weeklyTasks?.slice(0, 3) ?? [
        {
          title: "Şüpheli mesajı kontrol et",
          detail: "Bir mesajı Kalkan’da analiz ederek risk dilini tanı.",
          href: "/scam-shield",
        },
        {
          title: "Ürün kârını hesapla",
          detail: "Producer modülünde tek ürün üzerinden net tablo çıkar.",
          href: "/producer",
        },
        {
          title: "Acil durum hedefini güncelle",
          detail: "Kumbara ekranında küçük hedef ilerlemesini gözden geçir.",
          href: "/savings",
        },
      ],
    [result?.profile.weeklyTasks],
  );

  return (
    <AppShell
      title="Genel Bakış"
      description="Bugünün odağını seç, riski kontrol et ve ilerlemeni tek ekranda izle."
      eyebrow="Dashboard"
      icon={<LayoutDashboard className="h-5 w-5" />}
      ethicNotice="Tüm finansal bilgileriniz cihazınızda kalır. AltınÖtesi yatırım tavsiyesi vermez."
    >
      {!result ? (
        <Card variant="premium">
          <CardContent className="flex flex-col gap-4 py-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <Badge variant="gold">Demo verisi hazır</Badge>
              <p className="text-lg font-medium text-ink-900">
                Test çözmeden tam demo akışını başlatabilirsin.
              </p>
              <p className="text-sm text-muted-500">
                Ayşe Hanım profiliyle Twin, Kalkan, Producer ve Akademi akışı açılır.
              </p>
            </div>
            <DemoStarter />
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <Card variant="premium">
          <CardHeader className="space-y-2.5">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="emerald">Profil</Badge>
              <Badge variant="gold">{profileName}</Badge>
            </div>
            <div className="space-y-1.5">
              <CardTitle className="text-xl font-semibold tracking-tight text-ink-900 md:text-[1.7rem]">
                Bu haftaki odak
              </CardTitle>
              <CardDescription className="text-sm text-ink-700 md:text-[15px]">
                {primaryNeed}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl border border-emerald-600/20 bg-white/80 px-4 py-4">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-500">Profil tonu</p>
              <p className="mt-2 text-base font-medium text-ink-900">
                Sade, destekleyici ve adım adım ilerleyen bir akış
              </p>
            </div>
            <div className="rounded-2xl border border-ivory-200 bg-white/80 px-4 py-4">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-500">Öncelik</p>
              <p className="mt-2 text-base font-medium text-ink-900">
                Üretim gelirini görünür hale getir, sonra riskli mesajları ele
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Badge variant="neutral">Bu hafta</Badge>
            <CardTitle className="text-lg font-semibold text-ink-900 md:text-xl">
              Hızlı özet
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <div className="rounded-2xl border border-gold-400/30 bg-gold-400/10 px-4 py-4">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-500">Skor</p>
              <p className="mt-2 text-2xl font-semibold text-burgundy">{score}/100</p>
            </div>
            <div className="rounded-2xl border border-ivory-200 bg-ivory-50 px-4 py-4">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-500">Bu hafta</p>
              <p className="mt-2 text-sm text-ink-700">3 kısa adımla ilerlemeyi canlı tut.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="AltınÖtesi Skoru" value={String(score)} delta="+5 bu hafta" tone="gold" />
        <StatCard label="Tamamlanan Görev" value="2/5" delta="Haftalık ritim" tone="emerald" />
        <StatCard label="Analiz Edilen Mesaj" value="0" delta="İlk analiz bekliyor" tone="info" />
        <StatCard label="Açık Hedef" value="1" delta="Acil durum kumbarası" tone="neutral" />
      </div>

      <section className="space-y-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted-500">
            4 ana aksiyon
          </p>
          <h2 className="text-xl font-semibold tracking-tight text-ink-900">
            Bugün ne yapmak istersin?
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {actionCards.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.title} variant="elevated">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="rounded-2xl bg-emerald-600/10 p-3 text-emerald-700">
                      <Icon className="h-6 w-6" />
                    </div>
                    <Badge
                      variant={
                        item.tone === "danger"
                          ? "danger"
                          : item.tone === "gold"
                            ? "gold"
                            : item.tone === "emerald"
                              ? "emerald"
                              : "neutral"
                      }
                    >
                      Açık
                    </Badge>
                  </div>
                  <CardTitle className="text-lg text-ink-900">{item.title}</CardTitle>
                  <CardDescription className="text-sm text-ink-700">
                    {item.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href={item.href}>
                    <Button variant="ghost" iconRight={<ArrowRight className="h-4 w-4" />}>
                      Aç
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Haftalık yol haritan</CardTitle>
            <CardDescription>Kısa, net ve uygulanabilir üç adım.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {weeklyTasks.map((task, index) => (
              <div
                key={task.title}
                className="rounded-2xl border border-ivory-200 bg-white px-4 py-4"
              >
                <div className="mb-2 flex items-center justify-between">
                  <Badge variant="neutral" size="sm">
                    Adım {index + 1}
                  </Badge>
                  {task.href ? (
                    <Link href={task.href} className="text-sm font-medium text-burgundy">
                      Aç
                    </Link>
                  ) : null}
                </div>
                <p className="text-base text-ink-900">{task.title}</p>
                <p className="mt-2 text-sm text-muted-500">{task.detail}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 text-gold-600">
                <BookOpen className="h-5 w-5" />
                <CardTitle>Akademi önerileri</CardTitle>
              </div>
              <CardDescription>Profiline göre iki kısa ders öne çıktı.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2">
              {["Net kâr nasıl hesaplanır?", "Garanti kazanç neden risklidir?"].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-ivory-200 bg-ivory-50 px-4 py-4"
                >
                  <p className="text-sm font-medium text-ink-900">{item}</p>
                  <p className="mt-2 text-sm text-muted-500">4 dk • Başlangıç</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Simülasyon önerisi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-ink-700">
                  500 TL ile acil durum kararı senaryosu bugünkü profilin için iyi bir pratik.
                </p>
                <Link href="/simulation">
                  <Button variant="ghost">Demo senaryoyu aç</Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Kumbara ilerlemesi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-ink-700">
                  Acil Durum Param hedefinde ilk adımı görünür hale getir.
                </p>
                <Link href="/savings">
                  <Button variant="ghost">Hedef kartlarına git</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Card variant="premium">
        <CardContent className="flex flex-col gap-4 py-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-gold-600">
              <Sparkles className="h-5 w-5" />
              <p className="text-sm font-medium uppercase tracking-[0.18em]">Sosyal etki</p>
            </div>
            <p className="text-base text-ink-700">
              Bireysel güveni artırırken kurumlara anonim sosyal etki görünürlüğü sunar.
            </p>
          </div>
          <Link href="/institution?demo=true">
            <Button variant="secondary" iconRight={<ArrowRight className="h-4 w-4" />}>
              Kurum Paneli
            </Button>
          </Link>
        </CardContent>
      </Card>

      <Toast
        open={toastOpen}
        onClose={() => setToastOpen(false)}
        tone="info"
        title="Yakında"
        description="Bu modül yakında demo’da etkin olacak."
      />
    </AppShell>
  );
}
