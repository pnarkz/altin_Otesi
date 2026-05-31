"use client";

import { useMemo, useState } from "react";
import { Award, BookOpen, Crown, Lock, Shield, Sparkles, Star } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { useAppState } from "@/components/providers/app-state-provider";
import { academyLessons, type AcademyLesson } from "@/lib/academy";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Toast } from "@/components/ui/toast";

const weekMeta = [
  { week: 1 as const, label: "Hafta 1", title: "Temel", progress: 50, count: 4, completed: "2/4" },
  { week: 2 as const, label: "Hafta 2", title: "Hedef", progress: 0, count: 3, completed: "0/3" },
  { week: 3 as const, label: "Hafta 3", title: "Kalkan", progress: 0, count: 3, completed: "0/3" },
  { week: 4 as const, label: "Hafta 4", title: "İleri", progress: 0, count: 2, completed: "0/2" },
];

const badgeMeta = [
  { title: "İlk Adım", helper: "İlk dersi tamamla", icon: Award, earned: true },
  { title: "Hedefçi", helper: "Hafta 2’yi bitir", icon: Star, earned: false },
  { title: "Kalkan Sahibi", helper: "Hafta 3’ü bitir", icon: Shield, earned: false },
  { title: "Bilge", helper: "Tüm dersleri bitir", icon: Crown, earned: false },
];

function getStatusLabel(status: AcademyLesson["status"]) {
  if (status === "completed") return "Tamamlandı";
  if (status === "recommended") return "Önerildi";
  if (status === "in-progress") return "Devam Ediyor";
  return "Kilitli";
}

function getStatusVariant(status: AcademyLesson["status"]) {
  if (status === "completed") return "success" as const;
  if (status === "recommended") return "gold" as const;
  if (status === "in-progress") return "info" as const;
  return "neutral" as const;
}

export default function AcademyPage() {
  const { result } = useAppState();
  const [selectedWeek, setSelectedWeek] = useState<1 | 2 | 3 | 4>(1);
  const [selectedLesson, setSelectedLesson] = useState<AcademyLesson | null>(academyLessons[0]);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [toast, setToast] = useState<{
    title: string;
    description?: string;
    tone: "success" | "error" | "warning" | "info";
  } | null>(null);

  const profileName = result?.profile.name ?? "Evden Üreten Başlangıç";
  const learningPath = result?.profile.learningPath ?? [
    "Net kâr nasıl hesaplanır?",
    "Acil durum fonu neden önemlidir?",
    "Garanti kazanç mesajları nasıl anlaşılır?",
    "Küçük hedef kumbarası nasıl açılır?",
  ];

  const visibleLessons = useMemo(
    () => academyLessons.filter((lesson) => lesson.week === selectedWeek),
    [selectedWeek],
  );

  const totalDuration = useMemo(
    () => academyLessons.reduce((sum, lesson) => sum + lesson.duration, 0),
    [],
  );

  const totalCompleted = useMemo(
    () => academyLessons.filter((lesson) => lesson.status === "completed").length,
    [],
  );

  const totalRecommended = useMemo(
    () =>
      academyLessons.filter(
        (lesson) => lesson.status === "recommended" || lesson.status === "in-progress",
      ).length,
    [],
  );

  const answeredQuizCount = selectedLesson
    ? selectedLesson.quiz.filter((question) => typeof quizAnswers[question.id] === "number").length
    : 0;

  const placeholders = Math.max(0, 3 - visibleLessons.length);

  return (
    <AppShell
      eyebrow="Akademi"
      title="Senin için hazırlanan yolculuk"
      description="Altınİkiz profiline göre kısa dersler, mini quizler ve net bir ilerleme akışı."
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
              Öneriler profil, hedef ve öğrenme tercihiyle şekillenir.
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
            <p className="text-base text-ink-700">%25 tamamlandı (3/12 ders)</p>
            <Progress value={25} />
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
                <p className="text-sm text-muted-500">Önerilen</p>
                <p className="text-3xl font-medium text-gold-600">{totalRecommended}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="space-y-2 pt-6">
                <p className="text-sm text-muted-500">Rozet</p>
                <p className="text-3xl font-medium text-ink-900">1 / 4</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-ivory-200 bg-white p-4">
              <p className="text-sm text-muted-500">İlerleme</p>
              <p className="mt-2 text-lg font-medium text-ink-900">3 / 12 ders</p>
            </div>
            <div className="rounded-2xl border border-ivory-200 bg-white p-4">
              <p className="text-sm text-muted-500">Toplam süre</p>
              <p className="mt-2 text-lg font-medium text-ink-900">~{totalDuration} dk</p>
            </div>
            <div className="rounded-2xl border border-ivory-200 bg-white p-4">
              <p className="text-sm text-muted-500">Aktif rozet</p>
              <p className="mt-2 text-lg font-medium text-ink-900">İlk Adım</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>4 haftalık yol haritası</CardTitle>
          <CardDescription>Hafta sekmesine tıkla, o bölümün derslerini aç.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {weekMeta.map((item) => (
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
                <span className="text-xs text-muted-500">{item.completed}</span>
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
            {weekMeta.find((item) => item.week === selectedWeek)?.label}:{" "}
            {weekMeta.find((item) => item.week === selectedWeek)?.title}
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {visibleLessons.map((lesson) => (
            <button
              key={lesson.id}
              type="button"
              onClick={() => setSelectedLesson(lesson)}
              className="text-left"
            >
              <Card className="h-full hover:-translate-y-0.5">
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
                    <span>⏱️ {lesson.duration} dk</span>
                    <span>•</span>
                    <span>🎯 {lesson.level}</span>
                    <span>•</span>
                    <span>📝 {lesson.type}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {lesson.recommended ? <Badge variant="gold">Altınİkiz Öneriyor</Badge> : null}
                  </div>
                  <div className="rounded-2xl border border-ivory-200 bg-ivory-50 px-4 py-3 text-sm text-burgundy">
                    Dersi Aç →
                  </div>
                </CardContent>
              </Card>
            </button>
          ))}
          {Array.from({ length: placeholders }).map((_, index) => (
            <Card key={`placeholder-${index}`} className="h-full border-dashed">
              <CardContent className="space-y-4 pt-6">
                <div className="flex items-center justify-between gap-3">
                  <Badge variant="neutral">Kilitli</Badge>
                  <Lock className="h-4 w-4 text-muted-400" />
                </div>
                <div className="space-y-2">
                  <CardTitle className="text-lg">Daha Fazla Ders Yakında</CardTitle>
                  <p className="text-sm text-muted-500">
                    Yol haritan ilerledikçe yeni içerikler bu alanda açılacak.
                  </p>
                </div>
              </CardContent>
            </Card>
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
          {academyLessons.map((lesson) => (
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
            {badgeMeta.map((item) => {
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
                      <p className="mt-1 text-xs">
                        {item.earned ? "Kazanıldı" : "Kazanılacak"}
                      </p>
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
                            selected === question.correctIndex ? "text-emerald-700" : "text-warning-500"
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
                  onClick={() =>
                    setToast({
                      title: "Ders tamamlandı",
                      description: "İlerleme ve rozet görünümü demo modunda güncellendi.",
                      tone: "success",
                    })
                  }
                >
                  Bu dersi tamamladım
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    const currentIndex = visibleLessons.findIndex((item) => item.id === selectedLesson.id);
                    const nextLesson = visibleLessons[currentIndex + 1];
                    if (nextLesson) setSelectedLesson(nextLesson);
                  }}
                >
                  Sonraki ders
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : null}
      </div>

      <Card variant="premium">
        <CardContent className="space-y-4 py-6">
          <div className="flex items-center gap-2 text-gold-600">
            <Sparkles className="h-5 w-5" />
            <p className="text-sm font-medium uppercase tracking-[0.18em]">
              Daha fazla içerik yolda
            </p>
          </div>
          <p className="text-base text-ink-700">
            AltınÖtesi Akademi her hafta yeni dersler ve simülasyonlarla zenginleşiyor. Şu an temel programı görüyorsun. İleri seviye, kooperatif ve evden üretim modülleri yakında eklenecek.
          </p>
          <Button
            variant="secondary"
            onClick={() =>
              setToast({
                title: "Bildirimler demo modunda",
                description: "Bu akış MVP içinde görsel olarak sunulur.",
                tone: "info",
              })
            }
          >
            Bildirimleri Aç
          </Button>
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
