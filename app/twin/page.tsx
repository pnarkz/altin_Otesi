"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Activity, ChevronRight, Lock, Sparkles } from "lucide-react";
import {
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppState } from "@/components/providers/app-state-provider";
import { createDemoResult } from "@/lib/demo";
import { defaultUserContext } from "@/lib/onboarding";
import {
  loadAcademyProgress,
  loadProducerHistory,
  loadSavingsState,
  loadScamHistory,
  loadTwinProgress,
  saveTwinProgress,
} from "@/lib/storage";
import { buildTwinDimensions } from "@/lib/twin";
import {
  AcademyProgress,
  LayerScores,
  ProducerRecord,
  Profile,
  ScamCheckRecord,
  SavingsState,
  TaskItem,
  TestResult,
  TwinDimension,
  TwinSnapshot,
  TwinProgress,
  UserContext,
} from "@/types";

const defaultDemo = createDemoResult();

const DEFAULT_SCORES: LayerScores = defaultDemo.scores;
const DEFAULT_PROFILE: Profile = defaultDemo.profile;
const DEFAULT_USER_CONTEXT: UserContext = defaultUserContext;
const DEFAULT_TWIN_DIMENSIONS: TwinDimension[] =
  defaultDemo.twinDimensions ?? buildTwinDimensions(DEFAULT_SCORES);
const DEFAULT_TWIN: TwinSnapshot =
  defaultDemo.twin ?? {
    dimensions: {
      financialKnowledge: 42,
      riskAwareness: 58,
      microSaving: 25,
      scamAwareness: 70,
      homeProductionManagement: 35,
    },
    tasks: [],
    learningPath: [],
  };

function isProfileObject(value: unknown): value is Profile {
  return Boolean(
    value &&
      typeof value === "object" &&
      "name" in value &&
      "shortSummary" in value &&
      "weeklyTasks" in value,
  );
}

function isUserContextObject(value: unknown): value is Partial<UserContext> {
  return Boolean(value && typeof value === "object");
}

function buildSafeUserContext(value: unknown): UserContext {
  const incoming = isUserContextObject(value) ? value : {};
  return {
    ...DEFAULT_USER_CONTEXT,
    ...incoming,
    budgetRole:
      Array.isArray(incoming.budgetRole) && incoming.budgetRole.length > 0
        ? incoming.budgetRole
        : DEFAULT_USER_CONTEXT.budgetRole,
    personalGoal:
      Array.isArray(incoming.personalGoal) && incoming.personalGoal.length > 0
        ? incoming.personalGoal
        : DEFAULT_USER_CONTEXT.personalGoal,
  };
}

function buildSafeResult(raw: TestResult | null) {
  if (!raw) return null;

  const profile = isProfileObject(raw.profile) ? raw.profile : DEFAULT_PROFILE;
  const scores = raw.scores ?? DEFAULT_SCORES;
  const userContext = buildSafeUserContext(raw.userContext);
  const twinDimensions =
    Array.isArray(raw.twinDimensions) && raw.twinDimensions.length > 0
      ? raw.twinDimensions
      : DEFAULT_TWIN_DIMENSIONS;
  const twin = raw.twin ?? DEFAULT_TWIN;

  return {
    userName: raw.userName ?? defaultDemo.userName ?? "Misafir",
    overallScore:
      typeof raw.overallScore === "number" ? raw.overallScore : defaultDemo.overallScore,
    profile,
    scores,
    userContext,
    twin,
    twinDimensions,
  };
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function buildTaskKey(task: TaskItem) {
  const normalizedTitle = task.title
    .toLocaleLowerCase("tr-TR")
    .replaceAll(" ", "-")
    .replaceAll("/", "-")
    .replaceAll("?", "")
    .replaceAll("ı", "i");

  return `${task.href ?? "manual"}:${normalizedTitle}`;
}

function LoadingState() {
  return (
    <Card>
      <CardContent className="py-10 text-center text-sm text-muted-500">
        Profil hazirlaniyor...
      </CardContent>
    </Card>
  );
}

function EmptyState() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Henuz profil verisi yok</CardTitle>
        <CardDescription>Once testi tamamla veya demo verisiyle basla.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-3">
        <Link href="/test">
          <Button>Teste basla</Button>
        </Link>
        <Link href="/dashboard">
          <Button variant="ghost">Dashboard ekranina don</Button>
        </Link>
      </CardContent>
    </Card>
  );
}

export default function TwinPage() {
  const { authSession, result, isReady } = useAppState();
  const isCorporate = authSession?.role === "corporate";
  const [academyProgress, setAcademyProgress] = useState<AcademyProgress | null>(null);
  const [savingsState, setSavingsState] = useState<SavingsState | null>(null);
  const [scamHistory, setScamHistory] = useState<ScamCheckRecord[]>([]);
  const [producerHistory, setProducerHistory] = useState<ProducerRecord[]>([]);
  const [twinProgress, setTwinProgress] = useState<TwinProgress>({
    completedTaskKeys: [],
    updatedAt: new Date().toISOString(),
  });
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setAcademyProgress(loadAcademyProgress());
    setSavingsState(loadSavingsState());
    setScamHistory(loadScamHistory());
    setProducerHistory(loadProducerHistory());
    setTwinProgress(
      loadTwinProgress() ?? {
        completedTaskKeys: [],
        updatedAt: new Date().toISOString(),
      },
    );
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    saveTwinProgress(twinProgress);
  }, [isHydrated, twinProgress]);

  const safeResult = useMemo(() => buildSafeResult(result), [result]);
  const isLegacyProfile = Boolean(result && !result?.userContext);

  const tasks = useMemo(
    () =>
      isCorporate
        ? [
            {
              title: "Calisan ders tamamlama ritmini incele",
              detail: "Akademi ve gorev hareketlerini kurum acisindan oku.",
              href: "/institution?demo=true",
            },
            {
              title: "Scam farkindaligi gelisimini kontrol et",
              detail: "Kurumsal Kalkan analizlerinin artik artip artmadigina bak.",
              href: "/scam-shield",
            },
            {
              title: "Kurumsal AI Koc ile yeni haftalik mesaj dilini hazirla",
              detail: "Calisanlara gidecek yeni farkindalik tonunu belirle.",
              href: "/coach",
            },
          ]
        : safeResult?.profile.weeklyTasks?.length
          ? safeResult.profile.weeklyTasks
          : DEFAULT_PROFILE.weeklyTasks,
    [isCorporate, safeResult?.profile.weeklyTasks],
  );
  const learningPath = useMemo(
    () =>
      isCorporate
        ? [
            "Calisan risk farkindaligi",
            "Kurumsal scam dili",
            "Anonim gelisim takibi",
            "Bildirim ritmi tasarimi",
          ]
        : safeResult?.profile.learningPath?.length
          ? safeResult.profile.learningPath
          : DEFAULT_PROFILE.learningPath,
    [isCorporate, safeResult?.profile.learningPath],
  );

  const completedLessons = academyProgress?.completedLessonIds.length ?? 0;
  const contributionCount = savingsState?.contributions.length ?? 0;
  const goalCount = savingsState?.goals.length ?? 0;
  const scamChecks = scamHistory.length;
  const producerRuns = producerHistory.length;
  const moduleActivityCount = [completedLessons, contributionCount, scamChecks, producerRuns].filter(
    (value) => value > 0,
  ).length;

  const growthBoost = clamp(
    Math.round(completedLessons * 1.8 + contributionCount * 1.2 + scamChecks * 2.4 + producerRuns * 2),
    0,
    18,
  );
  const currentScore = clamp(Math.round((safeResult?.overallScore ?? 38) + growthBoost), 0, 100);
  const sparkline = useMemo(
    () => [
      { day: "Pzt", value: clamp(currentScore - 5, 0, 100) },
      { day: "Sal", value: clamp(currentScore - 4, 0, 100) },
      { day: "Car", value: clamp(currentScore - 3, 0, 100) },
      { day: "Per", value: clamp(currentScore - 1, 0, 100) },
      { day: "Cum", value: currentScore },
    ],
    [currentScore],
  );

  const chartData = useMemo(() => {
    const base = safeResult
      ? buildTwinDimensions(safeResult.scores, safeResult.twinDimensions)
      : DEFAULT_TWIN_DIMENSIONS;

    return base.map((item) => {
      if (item.name === "Finansal Bilgi") {
        return { ...item, value: clamp(item.value + completedLessons * 4, 0, 100) };
      }

      if (item.name === "Risk Farkındalığı") {
        return { ...item, value: clamp(item.value + scamChecks * 5, 0, 100) };
      }

      if (item.name === "Mikro-Birikim Davranışı") {
        return { ...item, value: clamp(item.value + goalCount * 3 + contributionCount * 2, 0, 100) };
      }

      if (item.name === "Dolandırıcılık Farkındalığı") {
        return { ...item, value: clamp(item.value + scamChecks * 4, 0, 100) };
      }

      if (item.name === "Evden Üretim Gelir Yönetimi") {
        return { ...item, value: clamp(item.value + producerRuns * 6, 0, 100) };
      }

      return item;
    });
  }, [
    completedLessons,
    contributionCount,
    goalCount,
    producerRuns,
    safeResult,
    scamChecks,
  ]);

  const autoCompletedTaskKeys = useMemo(() => {
    const keys = new Set<string>();

    tasks.forEach((task) => {
      const key = buildTaskKey(task);
      const href = task.href?.split("?")[0];

      if (href === "/producer" && producerRuns > 0) keys.add(key);
      if (href === "/savings" && (goalCount > 0 || contributionCount > 0)) keys.add(key);
      if (href === "/scam-shield" && scamChecks > 0) keys.add(key);
      if (href === "/academy" && completedLessons > 0) keys.add(key);
      if (href === "/dashboard" && Boolean(safeResult)) keys.add(key);
      if (href === "/institution" && moduleActivityCount >= 2) keys.add(key);
    });

    return keys;
  }, [
    completedLessons,
    contributionCount,
    goalCount,
    moduleActivityCount,
    producerRuns,
    safeResult,
    scamChecks,
    tasks,
  ]);

  const completedTaskCount = tasks.filter((task) => {
    const key = buildTaskKey(task);
    return (
      autoCompletedTaskKeys.has(key) || twinProgress.completedTaskKeys.includes(key)
    );
  }).length;

  const learningPathCards = learningPath.map((item, index) => {
    const completedByAcademy = index < completedLessons;
    const recommended = index === completedLessons;

    return {
      title: item,
      status: completedByAcademy
        ? "completed"
        : recommended
          ? "recommended"
          : "locked",
    } as const;
  });

  if (!isHydrated || !isReady) {
    return (
        <AppShell
        eyebrow={isCorporate ? "Kurumsal AltinIkiz" : "Altınİkiz"}
        title={isCorporate ? "Calisan gelisim gorunumu" : "Finansal guclenme profilin"}
        description="Profilin hazirlaniyor."
        breadcrumb="Anasayfa → Altınİkiz"
        icon={<Activity className="h-5 w-5" />}
        ethicNotice="Altınİkiz profili sana ozel oneriler sunar ama yatirim karari icermez."
      >
        <LoadingState />
      </AppShell>
    );
  }

  return (
    <AppShell
      eyebrow={isCorporate ? "Kurumsal AltinIkiz" : "Altınİkiz"}
      title={isCorporate ? "Calisan gelisim gorunumu" : "Finansal guclenme profilin"}
      description={
        isCorporate
          ? "Kurum icindeki calisan ritmini, scam farkindaligini ve gorev tamamlama etkisini tek ekranda gor."
          : "Profilini, ogrenme ritmini ve modullerdeki gercek ilerlemeyi tek ekranda gor."
      }
      breadcrumb="Anasayfa → Altınİkiz"
      icon={<Activity className="h-5 w-5" />}
      ethicNotice="Altınİkiz profili sana ozel oneriler sunar ama yatirim karari icermez."
      aside={
        <Card>
          <CardHeader>
            <CardTitle>{isCorporate ? "Kurum ozeti" : "Profil ozeti"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-3xl font-medium text-burgundy">{currentScore}/100</p>
            {safeResult ? <Badge variant="gold">{safeResult.profile.name}</Badge> : null}
            <p className="text-sm text-muted-500">
              {completedTaskCount}/{tasks.length} gorev tamamlandi
            </p>
          </CardContent>
        </Card>
      }
    >
      {!safeResult ? (
        <EmptyState />
      ) : (
        <div className="space-y-6">
          {isLegacyProfile ? (
            <Card className="border-warning-500/20 bg-warning-100/70">
              <CardContent className="py-4 text-sm text-ink-700">
                Profil verin eski formatta gorunuyor. Ekran demo uyumlu varsayilanlarla acildi;
                istersen demo verisiyle yenileyebilirsin.
              </CardContent>
            </Card>
          ) : null}

          <Card variant="premium">
            <CardContent className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="flex items-center gap-4">
                <div className="grid h-20 w-20 place-items-center rounded-full bg-burgundy text-2xl font-medium text-white">
                  {(safeResult.userName ?? "M").slice(0, 1)}
                </div>
                <div>
                  <p className="text-sm text-muted-500">Kullanici</p>
                  <h2 className="text-3xl font-medium text-ink-900">
                    {safeResult.userName ?? "Misafir"}
                  </h2>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <Badge variant="gold" size="md">
                      {safeResult.profile.name}
                    </Badge>
                    <Badge variant="emerald" size="md">
                      Guncel hareket skoru: {currentScore}/100
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="card rounded-2xl p-5">
                <p className="text-sm text-muted-500">Haftalik hareket</p>
                <div className="mt-4 h-24">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sparkline}>
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#B8860B"
                        strokeWidth={3}
                        dot={false}
                      />
                      <Tooltip />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
            <Card>
              <CardHeader>
                <CardTitle>{isCorporate ? "Kurumsal ozet" : "Kisisel ozet"}</CardTitle>
                <CardDescription>
                  {isCorporate
                    ? `${authSession?.organizationName ?? "A Bankasi"} icin kurum ici gelisim ritmi ve cihazdaki canli demo hareketleri bu yuzeye yansitiliyor.`
                    : safeResult.profile.shortSummary}
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-ivory-200 bg-ivory-50 p-4">
                  <p className="text-sm text-muted-500">Ogrenme tercihi</p>
                  <p className="mt-2 text-base font-medium text-ink-900">
                    {safeResult.userContext?.learningPreference ?? "Ornek senaryolarla ogrenme"}
                  </p>
                </div>
                <div className="rounded-2xl border border-ivory-200 bg-ivory-50 p-4">
                  <p className="text-sm text-muted-500">Haftalik zaman</p>
                  <p className="mt-2 text-base font-medium text-ink-900">
                    {safeResult.userContext?.weeklyTimeCommitment ?? "10 dk"}
                  </p>
                </div>
                <div className="rounded-2xl border border-ivory-200 bg-ivory-50 p-4">
                  <p className="text-sm text-muted-500">Onerilen ton</p>
                  <p className="mt-2 text-base font-medium text-ink-900">
                    {safeResult.profile.recommendedTone}
                  </p>
                </div>
                <div className="rounded-2xl border border-ivory-200 bg-ivory-50 p-4">
                  <p className="text-sm text-muted-500">Birincil ihtiyac</p>
                  <p className="mt-2 text-base font-medium text-ink-900">
                    {safeResult.profile.primaryNeed}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Canli ilerleme</CardTitle>
                <CardDescription>Modullerdeki hareketler profilini gunceller.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3">
                <div className="rounded-2xl border border-ivory-200 bg-white px-4 py-3">
                  <p className="text-sm text-muted-500">Akademi</p>
                  <p className="mt-2 text-lg font-medium text-ink-900">{completedLessons} ders tamamlandi</p>
                </div>
                <div className="rounded-2xl border border-ivory-200 bg-white px-4 py-3">
                  <p className="text-sm text-muted-500">Kumbara</p>
                  <p className="mt-2 text-lg font-medium text-ink-900">
                    {goalCount} hedef • {contributionCount} katki
                  </p>
                </div>
                <div className="rounded-2xl border border-ivory-200 bg-white px-4 py-3">
                  <p className="text-sm text-muted-500">Scam Shield</p>
                  <p className="mt-2 text-lg font-medium text-ink-900">{scamChecks} analiz</p>
                </div>
                <div className="rounded-2xl border border-ivory-200 bg-white px-4 py-3">
                  <p className="text-sm text-muted-500">Producer</p>
                  <p className="mt-2 text-lg font-medium text-ink-900">{producerRuns} kayitli hesap</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <Card variant="premium">
              <CardHeader>
                <CardTitle>Senin finansal profilin</CardTitle>
                <CardDescription>5 boyutlu guncel gorunum</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="h-[340px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={chartData}>
                      <PolarGrid stroke="#EBE2CC" />
                      <PolarAngleAxis dataKey="name" tick={{ fill: "#1A1A1A", fontSize: 12 }} />
                      <PolarRadiusAxis
                        angle={30}
                        domain={[0, 100]}
                        tick={{ fill: "#737373", fontSize: 11 }}
                      />
                      <Radar
                        name="Profil"
                        dataKey="value"
                        stroke="#B8860B"
                        fill="#D4A24C"
                        fillOpacity={0.22}
                        isAnimationActive
                      />
                      <Tooltip formatter={(value: number | string) => [`${value}`, "Skor"]} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  {chartData.map((item) => (
                    <div
                      key={item.name}
                      className="rounded-2xl border border-ivory-200 bg-white px-4 py-3"
                    >
                      <p className="text-sm text-muted-500">{item.name}</p>
                      <p className="mt-2 text-lg font-medium text-burgundy">{item.value}/100</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{isCorporate ? "Bu hafta icin kurumsal gorevlerin" : "Bu hafta icin gorevlerin"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {tasks.map((task, index) => {
                  const key = buildTaskKey(task);
                  const autoDone = autoCompletedTaskKeys.has(key);
                  const manualDone = twinProgress.completedTaskKeys.includes(key);
                  const done = autoDone || manualDone;

                  return (
                    <div
                      key={task.title}
                      className="rounded-2xl border border-ivory-200 bg-ivory-50 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm text-muted-500">Gorev {index + 1}</p>
                          <h3 className="mt-2 text-lg font-medium text-ink-900">{task.title}</h3>
                          <p className="mt-2 text-sm leading-relaxed text-muted-500">{task.detail}</p>
                        </div>
                        <div
                          className={`grid h-8 w-8 place-items-center rounded-full border ${
                            done
                              ? "border-success-500 bg-success-100 text-success-500"
                              : "border-ivory-200 bg-white text-muted-400"
                          }`}
                        >
                          ✓
                        </div>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-3">
                        {task.href ? (
                          <Link
                            href={task.href}
                            className="inline-flex items-center gap-2 text-sm font-medium text-burgundy"
                          >
                            Goreve git <ChevronRight className="h-4 w-4" />
                          </Link>
                        ) : null}
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={autoDone}
                          onClick={() =>
                            setTwinProgress((current) => {
                              const hasKey = current.completedTaskKeys.includes(key);
                              return {
                                completedTaskKeys: hasKey
                                  ? current.completedTaskKeys.filter((item) => item !== key)
                                  : [...current.completedTaskKeys, key],
                                updatedAt: new Date().toISOString(),
                              };
                            })
                          }
                        >
                          {autoDone
                            ? "Modul ilerlemesiyle tamamlandi"
                            : manualDone
                              ? "Isareti kaldir"
                              : "Tamamlandi olarak isaretle"}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </section>

          <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
            <Card>
              <CardHeader>
                <CardTitle>{isCorporate ? "Kurumsal yolculuk" : "Onerilen yolculuk"}</CardTitle>
                <CardDescription>
                  {isCorporate
                    ? "Kurumsal ders ve farkindalik kartlari ilerlemeye gore aciliyor."
                    : "Ders kartlari artik ilerlemeye gore aciliyor."}
                </CardDescription>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <div className="flex min-w-max gap-4 pb-2">
                  {learningPathCards.map((item) => (
                    <Link key={item.title} href="/academy" className="w-[260px] shrink-0">
                      <Card className="h-full">
                        <CardContent className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-ivory-100 text-burgundy">
                              <Sparkles className="h-4 w-4" />
                            </div>
                            {item.status === "locked" ? (
                              <Lock className="h-4 w-4 text-muted-400" />
                            ) : item.status === "completed" ? (
                              <Badge variant="success">Tamamlandi</Badge>
                            ) : (
                              <Badge variant="gold">Siradaki</Badge>
                            )}
                          </div>
                          <CardTitle className="text-lg">{item.title}</CardTitle>
                          <p className="text-sm text-muted-500">5 dk</p>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{isCorporate ? "Neden kurumsal olarak onerildi?" : "Neden boyle onerildi?"}</CardTitle>
                <CardDescription>Kisa baglam ozeti</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-2xl border border-ivory-200 bg-ivory-50 p-4">
                  <p className="text-sm text-muted-500">Motivasyon</p>
                  <p className="mt-2 text-base font-medium text-ink-900">
                    {safeResult.userContext?.mainMotivation ?? "Finansal ozguven kazanmak"}
                  </p>
                </div>
                <div className="rounded-2xl border border-ivory-200 bg-ivory-50 p-4">
                  <p className="text-sm text-muted-500">Ana engel</p>
                  <p className="mt-2 text-base font-medium text-ink-900">
                    {safeResult.userContext?.mainBarrier ?? "Nereden baslayacagini bilememek"}
                  </p>
                </div>
                <div className="rounded-2xl border border-ivory-200 bg-white p-4">
                  <p className="text-sm text-muted-500">Gercek hareket etkisi</p>
                  <p className="mt-2 text-base font-medium text-ink-900">
                    Bu hafta {moduleActivityCount} modulde veri olustu ve skor gorunumu buna gore
                    guncellendi.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </AppShell>
  );
}
