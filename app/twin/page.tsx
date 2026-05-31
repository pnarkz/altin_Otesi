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
import { buildTwinDimensions } from "@/lib/twin";
import { LayerScores, Profile, TestResult, TwinDimension, TwinSnapshot, UserContext } from "@/types";

const sparkline = [
  { day: "Pzt", value: 31 },
  { day: "Sal", value: 33 },
  { day: "Çar", value: 35 },
  { day: "Per", value: 36 },
  { day: "Cum", value: 38 },
];

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

function LoadingState() {
  return (
    <Card>
      <CardContent className="py-10 text-center text-sm text-muted-500">
        Profil hazırlanıyor...
      </CardContent>
    </Card>
  );
}

function EmptyState() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Henüz profil verisi yok</CardTitle>
        <CardDescription>Önce testi tamamla veya demo verisiyle başla.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-3">
        <Link href="/test">
          <Button>Teste başla</Button>
        </Link>
        <Link href="/dashboard">
          <Button variant="ghost">Dashboard’a dön</Button>
        </Link>
      </CardContent>
    </Card>
  );
}

export default function TwinPage() {
  const { result, isReady } = useAppState();
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const safeResult = useMemo(() => buildSafeResult(result), [result]);
  const isLegacyProfile = Boolean(result && !result?.userContext);

  const chartData = safeResult
    ? buildTwinDimensions(safeResult.scores, safeResult.twinDimensions)
    : DEFAULT_TWIN_DIMENSIONS;
  const tasks =
    safeResult?.profile.weeklyTasks?.length
      ? safeResult.profile.weeklyTasks
      : DEFAULT_PROFILE.weeklyTasks;
  const learningPath =
    safeResult?.profile.learningPath?.length
      ? safeResult.profile.learningPath
      : DEFAULT_PROFILE.learningPath;

  if (!isHydrated || !isReady) {
    return (
      <AppShell
        eyebrow="Altınİkiz"
        title="Finansal güçlenme profilin"
        description="Profilin hazırlanıyor."
        breadcrumb="Anasayfa → Altınİkiz"
        icon={<Activity className="h-5 w-5" />}
        ethicNotice="Altınİkiz profili sana özel öneriler sunar ama yatırım kararı içermez."
      >
        <LoadingState />
      </AppShell>
    );
  }

  return (
    <AppShell
      eyebrow="Altınİkiz"
      title="Finansal güçlenme profilin"
      description="Profilini, öğrenme ritmini ve ilk odak alanlarını tek ekranda gör."
      breadcrumb="Anasayfa → Altınİkiz"
      icon={<Activity className="h-5 w-5" />}
      ethicNotice="Altınİkiz profili sana özel öneriler sunar ama yatırım kararı içermez."
      aside={
        <Card>
          <CardHeader>
            <CardTitle>Profil özeti</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-3xl font-medium text-burgundy">
              {safeResult ? `${Math.round(safeResult.overallScore)}/100` : "--"}
            </p>
            {safeResult ? <Badge variant="gold">{safeResult.profile.name}</Badge> : null}
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
                Profil verin eski formatta görünüyor. Ekran demo uyumlu varsayılanlarla açıldı;
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
                  <p className="text-sm text-muted-500">Kullanıcı</p>
                  <h2 className="text-3xl font-medium text-ink-900">
                    {safeResult.userName ?? "Misafir"}
                  </h2>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <Badge variant="gold" size="md">
                      {safeResult.profile.name}
                    </Badge>
                    <Badge variant="emerald" size="md">
                      AltınÖtesi Skoru: {Math.round(safeResult.overallScore)}/100
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="card rounded-2xl p-5">
                <p className="text-sm text-muted-500">Skor görünümü</p>
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
                <CardTitle>Kişisel özet</CardTitle>
                <CardDescription>{safeResult.profile.shortSummary}</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-ivory-200 bg-ivory-50 p-4">
                  <p className="text-sm text-muted-500">Öğrenme tercihi</p>
                  <p className="mt-2 text-base font-medium text-ink-900">
                    {safeResult.userContext?.learningPreference ?? "Örnek senaryolarla öğrenme"}
                  </p>
                </div>
                <div className="rounded-2xl border border-ivory-200 bg-ivory-50 p-4">
                  <p className="text-sm text-muted-500">Haftalık zaman</p>
                  <p className="mt-2 text-base font-medium text-ink-900">
                    {safeResult.userContext?.weeklyTimeCommitment ?? "10 dk"}
                  </p>
                </div>
                <div className="rounded-2xl border border-ivory-200 bg-ivory-50 p-4">
                  <p className="text-sm text-muted-500">Önerilen ton</p>
                  <p className="mt-2 text-base font-medium text-ink-900">
                    {safeResult.profile.recommendedTone}
                  </p>
                </div>
                <div className="rounded-2xl border border-ivory-200 bg-ivory-50 p-4">
                  <p className="text-sm text-muted-500">Birincil ihtiyaç</p>
                  <p className="mt-2 text-base font-medium text-ink-900">
                    {safeResult.profile.primaryNeed}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Modül öncelik sırası</CardTitle>
                <CardDescription>İlk odak bu sıraya göre önerilir.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {safeResult.profile.modulePriority.map((item, index) => (
                  <div
                    key={item}
                    className="flex items-center justify-between rounded-2xl border border-ivory-200 bg-white px-4 py-3"
                  >
                    <span className="text-sm text-muted-500">#{index + 1}</span>
                    <span className="text-base font-medium text-ink-900">{item}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <Card variant="premium">
              <CardHeader>
                <CardTitle>Senin finansal profilin</CardTitle>
                <CardDescription>5 boyutlu görünüm</CardDescription>
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
                <CardTitle>Bu hafta için görevlerin</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {tasks.map((task, index) => {
                  const done = completedTasks.includes(task.title);
                  return (
                    <div
                      key={task.title}
                      className="rounded-2xl border border-ivory-200 bg-ivory-50 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm text-muted-500">Görev {index + 1}</p>
                          <h3 className="mt-2 text-lg font-medium text-ink-900">
                            {task.title}
                          </h3>
                          <p className="mt-2 text-sm leading-relaxed text-muted-500">
                            {task.detail}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setCompletedTasks((current) =>
                              done
                                ? current.filter((item) => item !== task.title)
                                : [...current, task.title],
                            )
                          }
                          className={`grid h-8 w-8 place-items-center rounded-full border ${
                            done
                              ? "border-success-500 bg-success-100 text-success-500"
                              : "border-ivory-200 bg-white text-muted-400"
                          }`}
                        >
                          ✓
                        </button>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-3">
                        {task.href ? (
                          <Link
                            href={task.href}
                            className="inline-flex items-center gap-2 text-sm font-medium text-burgundy"
                          >
                            Göreve git <ChevronRight className="h-4 w-4" />
                          </Link>
                        ) : null}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setCompletedTasks((current) =>
                              done
                                ? current.filter((item) => item !== task.title)
                                : [...current, task.title],
                            )
                          }
                        >
                          {done ? "İşareti kaldır" : "Tamamlandı olarak işaretle"}
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
                <CardTitle>Önerilen yolculuk</CardTitle>
                <CardDescription>Ders kartları ve kısa öğrenme adımları</CardDescription>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <div className="flex min-w-max gap-4 pb-2">
                  {learningPath.map((item, index) => {
                    const locked = index >= 2;
                    return (
                      <Link key={item} href="/academy" className="w-[260px] shrink-0">
                        <Card className="h-full">
                          <CardContent className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-ivory-100 text-burgundy">
                                <Sparkles className="h-4 w-4" />
                              </div>
                              {locked ? (
                                <Lock className="h-4 w-4 text-muted-400" />
                              ) : (
                                <Badge variant="success">Açık</Badge>
                              )}
                            </div>
                            <CardTitle className="text-lg">{item}</CardTitle>
                            <p className="text-sm text-muted-500">5 dk</p>
                          </CardContent>
                        </Card>
                      </Link>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Neden böyle önerildi?</CardTitle>
                <CardDescription>Kısa bağlam özeti</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-2xl border border-ivory-200 bg-ivory-50 p-4">
                  <p className="text-sm text-muted-500">Motivasyon</p>
                  <p className="mt-2 text-base font-medium text-ink-900">
                    {safeResult.userContext?.mainMotivation ?? "Finansal özgüven kazanmak"}
                  </p>
                </div>
                <div className="rounded-2xl border border-ivory-200 bg-ivory-50 p-4">
                  <p className="text-sm text-muted-500">Ana engel</p>
                  <p className="mt-2 text-base font-medium text-ink-900">
                    {safeResult.userContext?.mainBarrier ?? "Nereden başlayacağını bilememek"}
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
