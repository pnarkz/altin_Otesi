"use client";

import Link from "next/link";
import {
  Activity,
  ArrowRight,
  ClipboardCheck,
  Package,
  ShieldAlert,
  Sparkles,
  Target,
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { DemoStarter } from "@/components/demo/demo-starter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const promises = [
  {
    title: "Kendi adına hedef oluştur",
    description: "Küçük hedefleri görünür kıl ve ritim kur.",
    icon: Target,
    href: "/savings",
  },
  {
    title: "Riskli mesajları kontrol et",
    description: "Şüpheli dil ve bağlantıları saniyeler içinde ayırt et.",
    icon: ShieldAlert,
    href: "/scam-shield",
  },
  {
    title: "Üretim gelirini görünür kıl",
    description: "Net kârı, gideri ve ayrılabilecek tutarı net gör.",
    icon: Package,
    href: "/producer",
  },
];

const modules = [
  {
    title: "AltınÖtesi Skoru",
    description: "Başlangıç noktanı netleştirir.",
    href: "/test",
    icon: ClipboardCheck,
  },
  {
    title: "Altınİkiz",
    description: "Profilini ve ilk odaklarını tek ekranda toplar.",
    href: "/twin",
    icon: Activity,
  },
  {
    title: "Dolandırıcılık Kalkanı",
    description: "Mesaj ve bağlantı riskini sade biçimde gösterir.",
    href: "/scam-shield",
    icon: ShieldAlert,
  },
  {
    title: "Evden Üreten Kadın",
    description: "Üretim emeğini net tabloya dönüştürür.",
    href: "/producer",
    icon: Package,
  },
];

const steps = [
  "Kısa tanıma akışını tamamla.",
  "Skorunu ve profilini gör.",
  "Altınİkiz ile ilk görevlerini seç.",
  "Kalkan, kumbara ve üretim modülleriyle ilerle.",
];

export default function LandingPage() {
  return (
    <AppShell
      title="AltınÖtesi"
      description="Kadınların ev ekonomisini, üretimini ve finansal güvenini güçlendiren sosyal FinTech platformu."
      eyebrow="BİGE Hackathon 2026 — Sosyal FinTech"
      ethicNotice="AltınÖtesi yatırım tavsiyesi vermez. Tüm deneyim eğitim, farkındalık ve finansal güven amaçlıdır."
    >
      <div className="grid gap-6 xl:grid-cols-12">
        <Card variant="premium" className="xl:col-span-7">
          <CardHeader className="gap-5">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="gold">BİGE Hackathon 2026</Badge>
              <Badge variant="emerald">Sosyal FinTech</Badge>
            </div>
            <div className="space-y-5">
              <h1 className="text-4xl font-semibold tracking-tight text-ink-900 md:text-5xl">
                Altın<span className="text-gold-500">Ötesi</span>
              </h1>
              <p className="max-w-3xl text-lg leading-relaxed text-ink-700">
                Kadınlar zaten ev ekonomisini yönetiyor. Eksik olan, bu becerinin kendi
                adına finansal güvene dönüşmesi.
              </p>
            </div>
            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <Link href="/test">
                <Button size="lg" iconRight={<ArrowRight className="h-4 w-4" />}>
                  Teste başla
                </Button>
              </Link>
              <DemoStarter />
              <a href="#nasil-calisir">
                <Button variant="ghost" size="lg">
                  Nasıl çalışır?
                </Button>
              </a>
            </div>
          </CardHeader>
        </Card>

        <Card variant="elevated" className="xl:col-span-5">
          <CardHeader>
            <Badge variant="neutral">Bugün ne yapabilirsin?</Badge>
            <CardTitle className="text-2xl font-semibold text-ink-900">
              Üç net başlangıç
            </CardTitle>
            <CardDescription className="text-base text-ink-700">
              Hedefini seç, riskli mesajı kontrol et, üretim gelirini görünür kıl.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {promises.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className="flex items-start gap-4 rounded-2xl border border-ivory-200 bg-white/80 p-4 transition-transform duration-200 hover:-translate-y-0.5"
                >
                  <div className="rounded-2xl bg-emerald-600/10 p-3 text-emerald-700">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium text-ink-900">{item.title}</p>
                    <p className="text-sm text-muted-500">{item.description}</p>
                  </div>
                </Link>
              );
            })}
          </CardContent>
        </Card>
      </div>

      <section className="space-y-5">
        <div className="space-y-2">
          <Badge variant="gold">Platformun kalbi</Badge>
          <h2 className="text-2xl font-semibold tracking-tight text-ink-900 md:text-3xl">
            Dört modül, tek yolculuk
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {modules.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.title} variant="elevated" className="group">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="rounded-2xl bg-gold-400/15 p-3 text-gold-600">
                      <Icon className="h-6 w-6" />
                    </div>
                    <Badge variant="neutral">Canlı</Badge>
                  </div>
                  <CardTitle className="text-xl font-semibold text-ink-900">
                    {item.title}
                  </CardTitle>
                  <CardDescription className="text-base text-ink-700">
                    {item.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link
                    href={item.href}
                    className="inline-flex items-center gap-2 text-sm font-medium text-emerald-700 transition-transform duration-200 group-hover:translate-x-1"
                  >
                    Modüle git <ArrowRight className="h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section id="nasil-calisir" className="space-y-5">
        <div className="space-y-2">
          <Badge variant="emerald">Nasıl çalışır?</Badge>
          <h2 className="text-2xl font-semibold tracking-tight text-ink-900 md:text-3xl">
            Dört adımda ilk ritmini kur
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {steps.map((step, index) => (
            <Card key={step}>
              <CardContent className="space-y-4 pt-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-burgundy/10 text-sm font-semibold text-burgundy">
                    {index + 1}
                  </div>
                  <div className="h-px flex-1 bg-gold-400/40" />
                </div>
                <p className="text-sm text-ink-700">{step}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <Card variant="premium" className="text-center">
          <CardContent className="space-y-5 py-10">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold-400/15 text-gold-600">
              <Sparkles className="h-7 w-7" />
            </div>
            <div className="space-y-3">
              <h2 className="text-2xl font-semibold tracking-tight text-ink-900 md:text-3xl">
                Etik vaat
              </h2>
              <p className="mx-auto max-w-3xl text-lg leading-relaxed text-ink-700">
                Kadına neye yatırım yapacağını söylemiyoruz. Finansal karar verirken neye
                baktığını anlayabilecek özgüveni kazandırıyoruz.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="rounded-[24px] border border-ivory-200 bg-white/75 p-6">
        <p className="text-sm text-muted-500">
          Neden önemli? Türkiye’de kadınların ekonomik hayata katılımı ve finansal güvenliği
          hâlâ kritik bir sosyal etki alanı.
        </p>
      </section>
    </AppShell>
  );
}
