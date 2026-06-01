"use client";

import { useEffect, useMemo, useState } from "react";
import { Award, BookOpen, Crown, Lock, Shield, Sparkles, Star } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { useAppState } from "@/components/providers/app-state-provider";
import {
  academyLessons,
  type AcademyLesson,
  type AcademyLessonStatus,
} from "@/lib/academy";
import { loadAcademyProgress, saveAcademyProgress } from "@/lib/storage";
import { AcademyProgress } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Toast } from "@/components/ui/toast";

const weekMeta = [
  { week: 1 as const, label: "Hafta 1", title: "Temel" },
  { week: 2 as const, label: "Hafta 2", title: "Hedef" },
  { week: 3 as const, label: "Hafta 3", title: "Kalkan" },
  { week: 4 as const, label: "Hafta 4", title: "İleri" },
];

const defaultAcademyProgress: AcademyProgress = {
  completedLessonIds: ["lesson-1", "lesson-2"],
  updatedAt: new Date().toISOString(),
};

type LessonView = AcademyLesson & {
  status: AcademyLessonStatus;
  recommended: boolean;
};

function normalizeTitle(value: string) {
  return value.toLocaleLowerCase("tr-TR").trim();
}

function getStatusLabel(status: AcademyLessonStatus) {
  if (status === "completed") return "Tamamlandı";
  if (status === "recommended") return "Önerildi";
  if (status === "in-progress") return "Devam Ediyor";
  return "Kilitli";
}

function getStatusVariant(status: AcademyLessonStatus) {
  if (status === "completed") return "success" as const;
  if (status === "recommended") return "gold" as const;
  if (status === "in-progress") return "info" as const;
  return "neutral" as const;
}

function buildLessonViews(
  completedLessonIds: string[],
  learningPath: string[],
): LessonView[] {
  const completedSet = new Set(completedLessonIds);
  const firstIncompleteIndex = academyLessons.findIndex((lesson) => !completedSet.has(lesson.id));
  const recommendedTitles = new Set(learningPath.map(normalizeTitle));

  return academyLessons.map((lesson, index) => {
    let status: AcademyLessonStatus = "locked";

    if (completedSet.has(lesson.id)) {
      status = "completed";
    } else if (firstIncompleteIndex === -1) {
      status = "completed";
    } else if (index === firstIncompleteIndex) {
      status = "in-progress";
    } else if (index > firstIncompleteIndex && index <= firstIncompleteIndex + 3) {
      status = "recommended";
    }

    return {
      ...lesson,
      status,
      recommended:
        recommendedTitles.has(normalizeTitle(lesson.title)) ||
        status === "recommended" ||
        status === "in-progress",
    };
  });
}

export default function AcademyPage() {
  const { result } = useAppState();
  const [selectedWeek, setSelectedWeek] = useState<1 | 2 | 3 | 4>(1);
  const [selectedLessonId, setSelectedLessonId] = useState<string>(academyLessons[0].id);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [academyProgress, setAcademyProgress] = useState<AcademyProgress>(defaultAcademyProgress);
  const [isReady, setIsReady] = useState(false);
  const [toast, setToast] = useState<{
    title: string;
    description?: string;
    tone: "success" | "error" | "warning" | "info";
  } | null>(null);

  useEffect(() => {
    const saved = loadAcademyProgress();
    if (saved?.completedLessonIds?.length) {
      setAcademyProgress(saved);
    } else {
      saveAcademyProgress(defaultAcademyProgress);
    }
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) return;
    saveAcademyProgress(academyProgress);
  }, [academyProgress, isReady]);

  const profileName = result?.profile.name ?? "Evden Üreten Başlangıç";
  const learningPath = useMemo(
    () =>
      result?.profile.learningPath ?? [
        "Net kâr nasıl hesaplanır?",
        "Acil durum fonu neden önemlidir?",
        "Garanti kazanç mesajları nasıl anlaşılır?",
        "Küçük hedef kumbarası nasıl açılır?",
      ],
    [result?.profile.learningPath],
  );

  const lessonViews = useMemo(
    () => buildLessonViews(academyProgress.completedLessonIds, learningPath),
    [academyProgress.completedLessonIds, learningPath],
  );

  const totalCompleted = lessonViews.filter((lesson) => lesson.status === "completed").length;
  const totalRecommended = lessonViews.filter(
    (lesson) => lesson.status === "recommended" || lesson.status === "in-progress",
  ).length;
  const totalDuration = academyLessons.reduce((sum, lesson) => sum + lesson.duration, 0);
  const overallProgress = Math.round((totalCompleted / academyLessons.length) * 100);
  const visibleLessons = lessonViews.filter((lesson) => lesson.week === selectedWeek);
  const selectedLesson =
    visibleLessons.find((lesson) => lesson.id === selectedLessonId && lesson.status !== "locked") ??
    visibleLessons.find((lesson) => lesson.status !== "locked") ??
    null;

  const answeredQuizCount = selectedLesson
    ? selectedLesson.quiz.filter((question) => typeof quizAnswers[question.id] === "number").length
    : 0;

  const weekSummaries = weekMeta.map((item) => {
    const lessons = lessonViews.filter((lesson) => lesson.week === item.week);
    const completed = lessons.filter((lesson) => lesson.status === "completed").length;
    return {
      ...item,
      count: lessons.length,
      completed,
      progress: Math.round((completed / lessons.length) * 100),
    };
  });

  const badges = [
    { title: "İlk Adım", helper: "İlk dersi tamamla", icon: Award, earned: totalCompleted >= 1 },
    {
      title: "Hedefçi",
      helper: "Hafta 2'yi tamamla",
      icon: Star,
      earned: weekSummaries.find((item) => item.week === 2)?.progress === 100,
    },
    {
      title: "Kalkan Sahibi",
      helper: "Hafta 3'ü tamamla",
      icon: Shield,
      earned: weekSummaries.find((item) => item.week === 3)?.progress === 100,
    },
    {
      title: "Bilge",
      helper: "Tüm dersleri tamamla",
      icon: Crown,
      earned: totalCompleted === academyLessons.length,
    },
  ];
  const activeBadge = badges.filter((badge) => badge.earned).at(-1)?.title ?? "Hazırlanıyor";

  const nextOpenLesson = lessonViews.find((lesson) => lesson.status !== "completed");

  const markLessonCompleted = (lessonId: string) => {
    if (academyProgress.completedLessonIds.includes(lessonId)) {
      setToast({
        title: "Ders zaten tamamlanmış",
        description: "İlerleme kaydın korunuyor.",
        tone: "info",
      });
      return;
    }

    const nextCompletedIds = [...academyProgress.completedLessonIds, lessonId].sort((a, b) => {
      const left = academyLessons.findIndex((lesson) => lesson.id === a);
      const right = academyLessons.findIndex((lesson) => lesson.id === b);
      return left - right;
    });

    setAcademyProgress({
      completedLessonIds: nextCompletedIds,
      updatedAt: new Date().toISOString(),
    });

    const nextLesson = academyLessons.find((lesson) => !nextCompletedIds.includes(lesson.id));
    if (nextLesson) {
      setSelectedWeek(nextLesson.week);
      setSelectedLessonId(nextLesson.id);
    }

    setToast({
      title: "Ders tamamlandı",
      description: "İlerleme ve rozet görünümü güncellendi.",
      tone: "success",
    });
  };

  if (!isReady) return null;

  return (
    <AppShell
      eyebrow="Akademi"
      title="Senin için hazırlanan yolculuk"
      description="Altınİkiz profiline göre kısa dersler, mini quizler ve kalıcı bir ilerleme akışı."
      breadcrumb="Anasayfa → Akademi"
      icon={<BookOpen className="h-5 w-5" />}
      ethicNotice="Bu yol haritası Altınİkiz profiline göre önerildi. Yatırım tavsiyesi değildir."
      aside={
        <Card>
          <CardHeader>
            <CardTitle>Kişiselleştirme</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Badge variant="gold">{profileName}</Badge>
            <p className="text-sm text-muted-500">
              Tamamlanan dersler cihazında saklanır ve kurum paneline yalnızca anonim toplam olarak yansır.
            </p>
          </CardContent>
        </Card>
      }
    >
      <Card variant="premium">
        <CardContent className="space-y-6 py-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-gold-600">
              <Sparkles className="h-5 w-5" />
              <p className="text-sm font-medium uppercase tracking-[0.18em]">
                Altınİkiz profiline göre kişiselleştirildi
              </p>
            </div>
            <h2 className="text-2xl font-semibold tracking-tight text-ink-900">
              Senin için hazırlanan yolculuk
            </h2>
            <p className="text-base text-ink-700">
              %{overallProgress} tamamlandı ({totalCompleted}/{academyLessons.length} ders)
            </p>
            <Progress value={overallProgress} />
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Card>
              <CardContent className="space-y-2 pt-6">
                <p className="text-sm text-muted-500">Toplam Ders</p>
                <p className="text-3xl font-medium text-burgundy">{academyLessons.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="space-y-2 pt-6">
                <p className="text-sm text-muted-500">Tamamlanan</p>
                <p className="text-3xl font-medium text-emerald-700">{totalCompleted}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="space-y-2 pt-6">
                <p className="text-sm text-muted-500">Açık Ders</p>
                <p className="text-3xl font-medium text-gold-600">{totalRecommended}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="space-y-2 pt-6">
                <p className="text-sm text-muted-500">Aktif Rozet</p>
                <p className="text-2xl font-medium text-ink-900">{activeBadge}</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-ivory-200 bg-white p-4">
              <p className="text-sm text-muted-500">İlerleme</p>
              <p className="mt-2 text-lg font-medium text-ink-900">
                {totalCompleted} / {academyLessons.length} ders
              </p>
            </div>
            <div className="rounded-2xl border border-ivory-200 bg-white p-4">
              <p className="text-sm text-muted-500">Toplam süre</p>
              <p className="mt-2 text-lg font-medium text-ink-900">~{totalDuration} dk</p>
            </div>
            <div className="rounded-2xl border border-ivory-200 bg-white p-4">
              <p className="text-sm text-muted-500">Sıradaki odak</p>
              <p className="mt-2 text-lg font-medium text-ink-900">
                {nextOpenLesson?.title ?? "Program tamamlandı"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>4 haftalık yol haritası</CardTitle>
          <CardDescription>Hafta sekmesine tıkla, o bölümün açık derslerini gör.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {weekSummaries.map((item) => (
            <button
              key={item.week}
              type="button"
              onClick={() => setSelectedWeek(item.week)}
              className={`rounded-2xl border px-4 py-4 text-left transition ${
                selectedWeek === item.week
                  ? "border-gold-400 bg-gold-400/10 shadow-soft"
                  : "border-ivory-200 bg-white hover:border-gold-400"
              }`}
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-burgundy">{item.label}</p>
                <span className="text-xs text-muted-500">
                  {item.completed}/{item.count}
                </span>
              </div>
              <p className="mt-2 text-base font-medium text-ink-900">{item.title}</p>
              <p className="mt-2 text-sm text-muted-500">{item.count} ders</p>
              <div className="mt-3">
                <Progress value={item.progress} />
              </div>
            </button>
          ))}
        </CardContent>
      </Card>

      <Card variant="premium">
        <CardHeader>
          <CardTitle>Altınİkiz’e göre önerilen yol</CardTitle>
          <CardDescription>Bugün öne çıkan 4 kısa içerik</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {learningPath.slice(0, 4).map((item, index) => (
            <div
              key={item}
              className="flex items-center gap-3 rounded-2xl border border-ivory-200 bg-white px-4 py-4"
            >
              <span className="grid h-8 w-8 place-items-center rounded-full bg-burgundy/10 text-sm font-medium text-burgundy">
                {index + 1}
              </span>
              <p className="text-sm text-ink-700">{item}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <section className="space-y-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted-500">
            Ders kartları
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-ink-900">
            {weekSummaries.find((item) => item.week === selectedWeek)?.label}:{" "}
            {weekSummaries.find((item) => item.week === selectedWeek)?.title}
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {visibleLessons.map((lesson) => (
            <button
              key={lesson.id}
              type="button"
              onClick={() => lesson.status !== "locked" && setSelectedLessonId(lesson.id)}
              className="text-left"
              disabled={lesson.status === "locked"}
            >
              <Card
                className={`h-full ${lesson.status !== "locked" ? "hover:-translate-y-0.5" : "opacity-80"}`}
              >
                <CardContent className="space-y-4 pt-6">
                  <div className="flex items-center justify-between gap-3">
                    <Badge variant={getStatusVariant(lesson.status)}>
                      {getStatusLabel(lesson.status)}
                    </Badge>
                    {lesson.status === "locked" ? (
                      <Lock className="h-4 w-4 text-muted-400" />
                    ) : null}
                  </div>
                  <div className="space-y-2">
                    <CardTitle className="text-lg">{lesson.title}</CardTitle>
                    <p className="text-sm text-muted-500">{lesson.description}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs text-muted-500">
                    <span>{lesson.duration} dk</span>
                    <span>•</span>
                    <span>{lesson.level}</span>
                    <span>•</span>
                    <span>{lesson.type}</span>
                  </div>
                  {lesson.recommended ? (
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="gold">Altınİkiz öneriyor</Badge>
                    </div>
                  ) : null}
                  <div className="rounded-2xl border border-ivory-200 bg-ivory-50 px-4 py-3 text-sm text-burgundy">
                    {lesson.status === "locked" ? "Ders kilitli" : "Dersi aç →"}
                  </div>
                </CardContent>
              </Card>
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted-500">
            Tüm program
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-ink-900">
            12 dersin tamamı
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {lessonViews.map((lesson) => (
            <div key={lesson.id} className="rounded-2xl border border-ivory-200 bg-white px-4 py-4">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-medium text-muted-500">Hafta {lesson.week}</span>
                <Badge variant={getStatusVariant(lesson.status)} size="sm">
                  {getStatusLabel(lesson.status)}
                </Badge>
              </div>
              <p className="mt-3 text-sm font-medium text-ink-900">{lesson.title}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Card>
          <CardHeader>
            <CardTitle>Rozetler</CardTitle>
            <CardDescription>Kısa kazanımları görünür tut.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            {badges.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className={`rounded-2xl border px-4 py-4 ${
                    item.earned
                      ? "border-gold-400/30 bg-gold-400/10 text-burgundy"
                      : "border-ivory-200 bg-white text-muted-500"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-white/80 p-3">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{item.title}</p>
                      <p className="mt-1 text-xs">{item.earned ? "Kazanıldı" : "Kazanılacak"}</p>
                    </div>
                  </div>
                  <p className="mt-3 text-xs">{item.helper}</p>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {selectedLesson ? (
          <Card variant="premium">
            <CardHeader>
              <CardTitle>{selectedLesson.title}</CardTitle>
              <CardDescription>
                {selectedLesson.duration} dk • {selectedLesson.level} • {selectedLesson.type}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-3 text-sm leading-relaxed text-ink-700">
                {selectedLesson.content.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>

              <div className="rounded-2xl border border-gold-400/30 bg-white p-4">
                <p className="text-sm font-medium text-burgundy">Bunu hatırla</p>
                <p className="mt-2 text-sm text-ink-700">{selectedLesson.takeaway}</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-base font-medium text-ink-900">Mini quiz</p>
                  <Badge variant="neutral">
                    {answeredQuizCount}/{selectedLesson.quiz.length}
                  </Badge>
                </div>

                {selectedLesson.quiz.map((question) => {
                  const selected = quizAnswers[question.id];
                  return (
                    <div key={question.id} className="rounded-2xl border border-ivory-200 bg-white p-4">
                      <p className="text-sm font-medium text-ink-900">{question.prompt}</p>
                      <div className="mt-3 grid gap-2">
                        {question.options.map((option, index) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() =>
                              setQuizAnswers((current) => ({ ...current, [question.id]: index }))
                            }
                            className={`rounded-2xl border px-3 py-3 text-left text-sm transition ${
                              selected === index
                                ? "border-gold-400 bg-gold-400/10"
                                : "border-ivory-200 bg-ivory-50 hover:border-gold-400"
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                      {typeof selected === "number" ? (
                        <p
                          className={`mt-3 text-sm ${
                            selected === question.correctIndex
                              ? "text-emerald-700"
                              : "text-warning-500"
                          }`}
                        >
                          {question.explanation}
                        </p>
                      ) : null}
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={() => markLessonCompleted(selectedLesson.id)}
                  disabled={selectedLesson.status === "completed"}
                >
                  {selectedLesson.status === "completed" ? "Tamamlandı" : "Bu dersi tamamladım"}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    const openLessons = lessonViews.filter((lesson) => lesson.status !== "locked");
                    const currentIndex = openLessons.findIndex((lesson) => lesson.id === selectedLesson.id);
                    const nextLesson = openLessons[currentIndex + 1];
                    if (nextLesson) {
                      setSelectedWeek(nextLesson.week);
                      setSelectedLessonId(nextLesson.id);
                    }
                  }}
                >
                  Sonraki ders
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card variant="premium">
            <CardHeader>
              <CardTitle>Bu haftanın dersleri henüz açılmadı</CardTitle>
              <CardDescription>Önce önceki haftanın açık derslerini tamamla.</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-500">
              Açık durumdaki dersler tamamlandıkça bu haftanın içerikleri otomatik olarak erişilebilir hale gelir.
            </CardContent>
          </Card>
        )}
      </div>

      <Card variant="premium">
        <CardContent className="space-y-4 py-6">
          <div className="flex items-center gap-2 text-gold-600">
            <Sparkles className="h-5 w-5" />
            <p className="text-sm font-medium uppercase tracking-[0.18em]">
              İlerleme notu
            </p>
          </div>
          <p className="text-base text-ink-700">
            Tamamlanan dersler, rozetler ve açık içerikler cihazında saklanır. Böylece sonraki açılışta aynı
            yerden devam edebilirsin.
          </p>
        </CardContent>
      </Card>

      <Toast
        open={Boolean(toast)}
        onClose={() => setToast(null)}
        title={toast?.title ?? ""}
        description={toast?.description}
        tone={toast?.tone ?? "info"}
      />
    </AppShell>
  );
}
