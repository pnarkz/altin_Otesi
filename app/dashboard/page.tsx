"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowRight,
  BookOpen,
  BrainCircuit,
  Building2,
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
import {
  loadAcademyProgress,
  loadProducerHistory,
  loadSavingsState,
  loadScamHistory,
  loadTwinProgress,
} from "@/lib/storage";

const individualActionCards = [
  {
    title: "Dolandiricilik mesaji analiz et",
    description: "Supheli mesaji veya linki birkac saniyede kontrol et.",
    href: "/scam-shield",
    icon: ShieldAlert,
    tone: "danger",
  },
  {
    title: "Uretim gelirini hesapla",
    description: "Net kari, saatlik kazanci ve ayrilabilecek tutari gor.",
    href: "/producer",
    icon: Package,
    tone: "emerald",
  },
  {
    title: "AltinIkiz yol haritana bak",
    description: "Profilini ve onerilen ilk adimlari tek ekranda ac.",
    href: "/twin",
    icon: Activity,
    tone: "gold",
  },
  {
    title: "Kumbara hedefini takip et",
    description: "Kucuk hedefleri gorunur kil ve ilerlemeyi takip et.",
    href: "/savings",
    icon: PiggyBank,
    tone: "neutral",
  },
];

const corporateActionCards = [
  {
    title: "Kurum panelini ac",
    description: "Kurum bilgileri, anonim istatistikler ve sosyal etkiyi gor.",
    href: "/institution?demo=true",
    icon: Building2,
    tone: "gold",
  },
  {
    title: "Kurumsal AltinIkiz",
    description: "Calisan gelisim ritmini ve gorev tamamlama etkisini izle.",
    href: "/twin",
    icon: Activity,
    tone: "emerald",
  },
  {
    title: "Kurumsal AI Koc",
    description: "Egitim kurgusu, adaptasyon ve farkindalik dili icin yorum al.",
    href: "/coach",
    icon: BrainCircuit,
    tone: "neutral",
  },
  {
    title: "Kurumsal Kalkan",
    description: "Phishing ve scam farkindaligi mesajlarini kurumsal gozle degerlendir.",
    href: "/scam-shield",
    icon: ShieldAlert,
    tone: "danger",
  },
];

export default function DashboardPage() {
  const { authSession, result } = useAppState();
  const [academyCount, setAcademyCount] = useState(0);
  const [goalCount, setGoalCount] = useState(0);
  const [scamChecks, setScamChecks] = useState(0);
  const [producerRuns, setProducerRuns] = useState(0);
  const [twinTasks, setTwinTasks] = useState(0);

  useEffect(() => {
    setAcademyCount(loadAcademyProgress()?.completedLessonIds.length ?? 0);
    setGoalCount(loadSavingsState()?.goals.length ?? 0);
    setScamChecks(loadScamHistory().length);
    setProducerRuns(loadProducerHistory().length);
    setTwinTasks(loadTwinProgress()?.completedTaskKeys.length ?? 0);
  }, []);

  const isCorporate = authSession?.role === "corporate";
  const profileName = result?.profile?.name ?? "Evden Ureten Baslangic";
  const score = Math.round(result?.overallScore ?? 38);
  const primaryNeed = result?.profile.primaryNeed ?? "Uretim gelirini gorunur hale getirmek";

  const individualWeeklyTasks = useMemo(
    () =>
      result?.profile.weeklyTasks?.slice(0, 3) ?? [
        {
          title: "Supheli mesaji kontrol et",
          detail: "Bir mesaji Kalkan'da analiz ederek risk dilini tani.",
          href: "/scam-shield",
        },
        {
          title: "Urun karini hesapla",
          detail: "Producer modulu uzerinden net tablo cikar.",
          href: "/producer",
        },
        {
          title: "Acil durum hedefini guncelle",
          detail: "Kumbara ekraninda kucuk hedef ilerlemesini gozden gecir.",
          href: "/savings",
        },
      ],
    [result?.profile.weeklyTasks],
  );

  const corporateWeeklyTasks = [
    {
      title: "Calisan farkindalik ritmini kontrol et",
      detail: "Kurum panelinde son tamamlanan ders ve scam analizi trendini oku.",
      href: "/institution?demo=true",
    },
    {
      title: "Kurumsal AI Koc'tan mesaj dili al",
      detail: "Calisana yonelik yeni haftalik farkindalik metnini kurgula.",
      href: "/coach",
    },
    {
      title: "Kurumsal Kalkan ile yeni ornek phishing metni incele",
      detail: "Kurumsal risk dilini sade ama eyleme donuk bicimde acikla.",
      href: "/scam-shield",
    },
  ];

  const employeeCount = 42;
  const completionRate = Math.min(96, 58 + academyCount * 4 + twinTasks * 2);
  const awarenessScore = Math.min(94, 51 + scamChecks * 5);
  const engagementScore = Math.min(91, 49 + academyCount * 3 + scamChecks * 2 + twinTasks * 2);

  return (
    <AppShell
      title={isCorporate ? "Kurumsal Genel Bakis" : "Genel Bakis"}
      description={
        isCorporate
          ? "Kurum bilgileri, calisan gelisimi ve kurumsal risk farkindaligini tek ekranda izle."
          : "Bugunun odagini sec, riski kontrol et ve ilerlemeni tek ekranda izle."
      }
      eyebrow={isCorporate ? "Kurumsal Dashboard" : "Dashboard"}
      icon={<LayoutDashboard className="h-5 w-5" />}
      ethicNotice="AltinOtesi yatirim tavsiyesi vermez. Bu yuzey egitim, farkindalik ve sosyal etki icindir."
    >
      {!isCorporate && !result ? (
        <Card variant="premium">
          <CardContent className="flex flex-col gap-4 py-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <Badge variant="gold">Hazir profil</Badge>
              <p className="text-lg font-medium text-ink-900">
                Test cozmeye gerek kalmadan ornek profil ile akisa gecabilirsin.
              </p>
              <p className="text-sm text-muted-500">
                Hazir profil yuklendiginde Twin, Kalkan, Producer ve Akademi akisi acilir.
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
              <Badge variant="emerald">{isCorporate ? "Kurum" : "Profil"}</Badge>
              <Badge variant="gold">
                {isCorporate ? authSession?.organizationName ?? "A Bankasi" : profileName}
              </Badge>
            </div>
            <div className="space-y-1.5">
              <CardTitle className="text-xl font-semibold tracking-tight text-ink-900 md:text-[1.7rem]">
                {isCorporate ? "Bu haftaki kurumsal odak" : "Bu haftaki odak"}
              </CardTitle>
              <CardDescription className="text-sm text-ink-700 md:text-[15px]">
                {isCorporate
                  ? "Calisan gelisimi, scam farkindaligi ve kurum ici guven dili."
                  : primaryNeed}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl border border-emerald-600/20 bg-white/80 px-4 py-4">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-500">
                {isCorporate ? "Kurum notu" : "Profil tonu"}
              </p>
              <p className="mt-2 text-base font-medium text-ink-900">
                {isCorporate
                  ? "A Bankasi pilotunda cihazdaki canli demo verileri kurumsal gorunume yansitiliyor."
                  : "Sade, destekleyici ve adim adim ilerleyen bir akis"}
              </p>
            </div>
            <div className="rounded-2xl border border-ivory-200 bg-white/80 px-4 py-4">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-500">Oncelik</p>
              <p className="mt-2 text-base font-medium text-ink-900">
                {isCorporate
                  ? "Calisan ritmini guclendir, sonra farkindalik mesajlarini kurumsal dilde yayginlastir."
                  : "Uretim gelirini gorunur hale getir, sonra riskli mesajlari ele"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Badge variant="neutral">Bu hafta</Badge>
            <CardTitle className="text-lg font-semibold text-ink-900 md:text-xl">
              Hizli ozet
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <div className="rounded-2xl border border-gold-400/30 bg-gold-400/10 px-4 py-4">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-500">
                {isCorporate ? "Gelisim endeksi" : "Skor"}
              </p>
              <p className="mt-2 text-2xl font-semibold text-burgundy">
                {isCorporate ? `${engagementScore}/100` : `${score}/100`}
              </p>
            </div>
            <div className="rounded-2xl border border-ivory-200 bg-ivory-50 px-4 py-4">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-500">Bu hafta</p>
              <p className="mt-2 text-sm text-ink-700">
                {isCorporate
                  ? "Kurum paneli, AI Koc ve Kalkan birlikte calisanlarin risk farkindaligini destekler."
                  : "3 kisa adimla ilerlemeyi canli tut."}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {isCorporate ? (
          <>
            <StatCard label="Aktif Calisan" value={String(employeeCount)} delta="Pilot kurum" tone="gold" />
            <StatCard label="Egitim Tamamlama" value={`%${completionRate}`} delta="Kurumsal AltinIkiz" tone="emerald" />
            <StatCard label="Scam Inceleme" value={String(scamChecks)} delta="Kurumsal Kalkan" tone="info" />
            <StatCard label="Farkindalik Endeksi" value={`${awarenessScore}/100`} delta="AI Koc + Kalkan" tone="neutral" />
          </>
        ) : (
          <>
            <StatCard label="AltinOtesi Skoru" value={String(score)} delta="+5 bu hafta" tone="gold" />
            <StatCard label="Tamamlanan Gorev" value={`${twinTasks}/5`} delta="Haftalik ritim" tone="emerald" />
            <StatCard label="Analiz Edilen Mesaj" value={String(scamChecks)} delta="Canli takip" tone="info" />
            <StatCard label="Acik Hedef" value={String(goalCount)} delta="Kumbara ilerlemesi" tone="neutral" />
          </>
        )}
      </div>

      <section className="space-y-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted-500">
            {isCorporate ? "4 kurumsal aksiyon" : "4 ana aksiyon"}
          </p>
          <h2 className="text-xl font-semibold tracking-tight text-ink-900">
            {isCorporate ? "Kurum bugun ne yapmak istiyor?" : "Bugun ne yapmak istersin?"}
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {(isCorporate ? corporateActionCards : individualActionCards).map((item) => {
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
                      Acik
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
                      Ac
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
            <CardTitle>{isCorporate ? "Haftalik kurumsal yol haritasi" : "Haftalik yol haritan"}</CardTitle>
            <CardDescription>
              {isCorporate ? "Kisa, net ve uygulanabilir uc kurumsal adim." : "Kisa, net ve uygulanabilir uc adim."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {(isCorporate ? corporateWeeklyTasks : individualWeeklyTasks).map((task, index) => (
              <div
                key={task.title}
                className="rounded-2xl border border-ivory-200 bg-white px-4 py-4"
              >
                <div className="mb-2 flex items-center justify-between">
                  <Badge variant="neutral" size="sm">
                    Adim {index + 1}
                  </Badge>
                  {task.href ? (
                    <Link href={task.href} className="text-sm font-medium text-burgundy">
                      Ac
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
                <CardTitle>{isCorporate ? "Kurumsal akis onerileri" : "Akademi onerileri"}</CardTitle>
              </div>
              <CardDescription>
                {isCorporate
                  ? "Calisan gelisimi ve phishing farkindaligi icin iki kisa alan one cikti."
                  : "Profiline gore iki kisa ders one cikti."}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2">
              {(isCorporate
                ? ["Calisan risk farkindaligi dili", "Phishing bildirimi nasil yazilir?"]
                : ["Net kar nasil hesaplanir?", "Garanti kazanc neden risklidir?"]
              ).map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-ivory-200 bg-ivory-50 px-4 py-4"
                >
                  <p className="text-sm font-medium text-ink-900">{item}</p>
                  <p className="mt-2 text-sm text-muted-500">4 dk • Baslangic</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>{isCorporate ? "Kurum bilgisi" : "Simulasyon onerisi"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-ink-700">
                  {isCorporate
                    ? `${authSession?.organizationName ?? "A Bankasi"} pilotunda ${employeeCount} aktif calisan ve ${completionRate}% egitim tamamlama gorunuyor.`
                    : "500 TL ile acil durum karari senaryosu bugunku profilin icin iyi bir pratik."}
                </p>
                <Link href={isCorporate ? "/institution?demo=true" : "/simulation"}>
                  <Button variant="ghost">{isCorporate ? "Kurum paneline git" : "Ornek senaryoyu ac"}</Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{isCorporate ? "Calisan gelisimi" : "Kumbara ilerlemesi"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-ink-700">
                  {isCorporate
                    ? `${academyCount} ders tamamlama ve ${twinTasks} gorev isareti bu cihazin kurumsal demo akisini besliyor.`
                    : "Acil Durum Param hedefinde ilk adimi gorunur hale getir."}
                </p>
                <Link href={isCorporate ? "/twin" : "/savings"}>
                  <Button variant="ghost">{isCorporate ? "Kurumsal AltinIkiz'e git" : "Hedef kartlarina git"}</Button>
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
              <p className="text-sm font-medium uppercase tracking-[0.18em]">
                {isCorporate ? "Kurumsal etki" : "Sosyal etki"}
              </p>
            </div>
            <p className="text-base text-ink-700">
              {isCorporate
                ? "Kurumsal yuzey, calisan gelisimini ve risk farkindaligini anonim metriklerle gorunur kilar."
                : "Bireysel guveni artirirken kurumlara anonim sosyal etki gorunurlugu sunar."}
            </p>
          </div>
          <Link href="/institution?demo=true">
            <Button variant="secondary" iconRight={<ArrowRight className="h-4 w-4" />}>
              {isCorporate ? "Kurum Paneli" : "Kurum Paneli"}
            </Button>
          </Link>
        </CardContent>
      </Card>
    </AppShell>
  );
}
