"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ClipboardCheck, Sparkles } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { useAppState } from "@/components/providers/app-state-provider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { buildTestResult } from "@/lib/scoring";
import { defaultUserContext, onboardingSteps } from "@/lib/onboarding";
import { questions } from "@/lib/questions";
import {
  clearTestProgress,
  loadTestProgress,
  saveTestProgress,
} from "@/lib/storage";
import { UserContext } from "@/types";

const journeySteps = [
  "Yaşam Bağlamı",
  "Gelir ve Bütçe Rolü",
  "Evden Üretim / Mikro Gelir",
  "Hedefler ve Motivasyon",
  "Risk ve Dolandırıcılık Deneyimi",
  "Dijital Finans Alışkanlığı",
  "Finansal Bilgi ve Davranış Testi",
  "Sonuç Oluşturma",
] as const;

const layerDetails = {
  knowledge: {
    title: "Bilgi",
    text: "Finansal kavramları ne kadar tanıdığın",
  },
  behavior: {
    title: "Davranış",
    text: "Senaryolardaki tepkilerin",
  },
  risk: {
    title: "Risk Farkındalığı",
    text: "Dolandırıcılık sinyallerini fark etme düzeyin",
  },
  attitude: {
    title: "Tutum / Özgüven",
    text: "Finansal kararlara yaklaşımın",
  },
} as const;

function isAnswered(value: unknown): boolean {
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "number") return true;
  if (typeof value === "string") return value.trim().length > 0;
  return false;
}

export default function TestPage() {
  const router = useRouter();
  const { setResult } = useAppState();
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [userContext, setUserContext] = useState<Partial<UserContext>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const saved = loadTestProgress();
    if (saved) {
      setAnswers(saved.answers ?? {});
      setCurrentQuestionIndex(Math.min(saved.currentIndex ?? 0, questions.length - 1));
      setUserContext(saved.userContext ?? {});
      setCurrentStep(Math.min(saved.onboardingStep ?? 0, journeySteps.length - 1));
    }
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) return;
    saveTestProgress({
      answers,
      currentIndex: currentQuestionIndex,
      userContext,
      onboardingStep: currentStep,
    });
  }, [answers, currentQuestionIndex, currentStep, isReady, userContext]);

  const onboardingStep = currentStep < 6 ? onboardingSteps[currentStep] : null;
  const currentQuestion = questions[currentQuestionIndex];
  const completedQuestionCount = Object.keys(answers).length;
  const scoreQuestionsComplete = questions.every(
    (question) => typeof answers[question.id] === "number",
  );

  const layerProgress = useMemo(
    () =>
      Object.entries(layerDetails).map(([key, value]) => {
        const layerQuestions = questions.filter((question) => question.layer === key);
        const answered = layerQuestions.filter(
          (question) => typeof answers[question.id] === "number",
        ).length;
        return {
          key,
          ...value,
          answered,
          total: layerQuestions.length,
        };
      }),
    [answers],
  );

  const onboardingAnsweredCount = useMemo(() => {
    return onboardingSteps.reduce((sum, step) => {
      return (
        sum +
        step.questions.filter((question) =>
          isAnswered(userContext[question.id as keyof UserContext]),
        ).length
      );
    }, 0);
  }, [userContext]);

  const totalOnboardingQuestions = onboardingSteps.reduce(
    (sum, step) => sum + step.questions.length,
    0,
  );

  const currentStepComplete = useMemo(() => {
    if (!onboardingStep) {
      if (currentStep === 6) return scoreQuestionsComplete;
      return true;
    }

    return onboardingStep.questions.every((question) =>
      isAnswered(userContext[question.id as keyof UserContext]),
    );
  }, [currentStep, onboardingStep, scoreQuestionsComplete, userContext]);

  const finalContext: UserContext = {
    ...defaultUserContext,
    ...userContext,
    budgetRole: userContext.budgetRole ?? defaultUserContext.budgetRole,
    personalGoal: userContext.personalGoal ?? defaultUserContext.personalGoal,
  };

  const handleSingleChange = (field: keyof UserContext, value: string | number) => {
    setUserContext((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleMultiToggle = (field: keyof UserContext, value: string) => {
    setUserContext((current) => {
      const currentValue = (current[field] as string[] | undefined) ?? [];
      const nextValue = currentValue.includes(value)
        ? currentValue.filter((item) => item !== value)
        : [...currentValue, value];

      return {
        ...current,
        [field]: nextValue,
      };
    });
  };

  const handleAnswerSelect = (score: number) => {
    setAnswers((current) => ({
      ...current,
      [currentQuestion.id]: score,
    }));
  };

  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep((value) => value + 1);
      return;
    }

    if (currentStep === 6) {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((value) => value + 1);
        return;
      }

      if (scoreQuestionsComplete) {
        setCurrentStep(7);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep === 7) {
      setCurrentStep(6);
      return;
    }

    if (currentStep === 6 && currentQuestionIndex > 0) {
      setCurrentQuestionIndex((value) => value - 1);
      return;
    }

    if (currentStep > 0) {
      setCurrentStep((value) => value - 1);
    }
  };

  const handleSubmit = () => {
    if (!scoreQuestionsComplete) return;

    setIsSubmitting(true);
    window.setTimeout(() => {
      setResult(buildTestResult(answers, finalContext));
      clearTestProgress();
      router.push("/result");
    }, 1500);
  };

  if (!isReady) return null;

  const currentLayer = currentQuestion?.layer ?? "knowledge";

  return (
    <AppShell
      eyebrow="Altınİkiz Tanıma Akışı"
      title="Tanıma ve Altınİkiz Oluşturma"
      description="Sadece finansal bilgi değil; yaşam bağlamın, hedeflerin ve dijital alışkanlıkların da başlangıç profilini şekillendirir."
      breadcrumb="Anasayfa → Tanıma Akışı"
      icon={<ClipboardCheck className="h-5 w-5" />}
      ethicNotice="AltınÖtesi yatırım tavsiyesi vermez. Bu akış eğitim, farkındalık ve kişiselleştirilmiş rehberlik amaçlıdır."
      aside={
        <Card className="sticky top-6">
          <CardHeader>
            <CardTitle>İlerleme</CardTitle>
            <CardDescription>
              Adım {currentStep + 1} / {journeySteps.length} — {journeySteps[currentStep]}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <Progress value={((currentStep + 1) / journeySteps.length) * 100} />
            <div className="space-y-3">
              {journeySteps.map((step, index) => (
                <div
                  key={step}
                  className={`rounded-2xl border px-4 py-3 text-sm ${
                    index === currentStep
                      ? "border-gold-400 bg-gold-400/10 text-ink-900"
                      : "border-ivory-200 bg-white text-muted-500"
                  }`}
                >
                  {step}
                </div>
              ))}
            </div>
            <div className="rounded-2xl border border-ivory-200 bg-ivory-50 p-4">
              <p className="text-sm font-medium text-ink-900">Tanıma tamamlanma</p>
              <p className="mt-2 text-sm text-muted-500">
                {onboardingAnsweredCount}/{totalOnboardingQuestions} kişisel soru
              </p>
              <div className="mt-3">
                <Progress
                  value={(onboardingAnsweredCount / totalOnboardingQuestions) * 100}
                />
              </div>
            </div>
            <div className="rounded-2xl border border-ivory-200 bg-ivory-50 p-4">
              <p className="text-sm font-medium text-ink-900">
                Skor testi tamamlanma
              </p>
              <p className="mt-2 text-sm text-muted-500">
                {completedQuestionCount}/{questions.length} soru
              </p>
              <div className="mt-3">
                <Progress value={(completedQuestionCount / questions.length) * 100} />
              </div>
            </div>
          </CardContent>
        </Card>
      }
    >
      <section className="space-y-4">
        <Card>
          <CardContent className="grid gap-3 px-0 py-0 md:grid-cols-2 xl:grid-cols-4">
            {layerProgress.map((item) => (
              <div
                key={item.key}
                className="rounded-2xl border border-ivory-200 bg-ivory-50 px-4 py-4"
              >
                <p className="text-sm font-medium text-ink-900">{item.title}</p>
                <p className="mt-1 text-xs text-muted-500">{item.text}</p>
                <p className="mt-3 text-sm font-medium text-burgundy">
                  {item.answered}/{item.total}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-4">
          {currentStep < 6 && onboardingStep ? (
            <Card variant="premium">
              <CardHeader>
                <div className="flex flex-wrap items-center gap-3">
                  <Badge variant="gold">
                    Adım {currentStep + 1} / {journeySteps.length}
                  </Badge>
                  <Badge variant="neutral">{onboardingStep.title}</Badge>
                </div>
                <CardTitle className="text-2xl font-semibold text-ink-900">
                  {onboardingStep.title}
                </CardTitle>
                <CardDescription className="text-base leading-relaxed text-ink-700">
                  {onboardingStep.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {onboardingStep.questions.map((question) => {
                  const value = userContext[question.id as keyof UserContext];
                  return (
                    <div key={question.id} className="space-y-3">
                      <div>
                        <h2 className="text-lg font-medium text-ink-900">
                          {question.prompt}
                        </h2>
                        {question.helper ? (
                          <p className="mt-1 text-sm text-muted-500">
                            {question.helper}
                          </p>
                        ) : null}
                      </div>

                      <div className="grid gap-3 md:grid-cols-2">
                        {question.options.map((option) => {
                          const active =
                            question.type === "multi"
                              ? ((value as string[] | undefined) ?? []).includes(
                                  String(option.value),
                                )
                              : value === option.value;

                          return (
                            <button
                              key={`${question.id}-${String(option.value)}`}
                              type="button"
                              onClick={() =>
                                question.type === "multi"
                                  ? handleMultiToggle(
                                      question.id as keyof UserContext,
                                      String(option.value),
                                    )
                                  : handleSingleChange(
                                      question.id as keyof UserContext,
                                      option.value,
                                    )
                              }
                              className={`rounded-2xl border px-4 py-4 text-left transition ${
                                active
                                  ? "border-gold-400 bg-gold-400/10 text-ink-900 shadow-soft"
                                  : "border-ivory-200 bg-white hover:border-gold-400 hover:bg-ivory-50"
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <span
                                  className={`mt-1 h-4 w-4 rounded-full border ${
                                    active
                                      ? "border-gold-500 bg-gold-500"
                                      : "border-muted-300"
                                  }`}
                                />
                                <p className="text-base leading-relaxed text-ink-800">
                                  {option.label}
                                </p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          ) : null}

          {currentStep === 6 ? (
            <Card variant="premium">
              <CardHeader>
                <div className="flex flex-wrap items-center gap-3">
                  <Badge variant="gold">Adım 7 / 8</Badge>
                  <Badge variant="neutral">{layerDetails[currentLayer].title}</Badge>
                </div>
                <CardTitle className="text-2xl font-semibold text-ink-900">
                  Finansal Bilgi ve Davranış Testi
                </CardTitle>
                <CardDescription className="text-base leading-relaxed text-ink-700">
                  Mevcut 4 katmanlı skor yapısı korunur. Bu bölüm AltınÖtesi Skoru’nu
                  üretir.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm text-muted-500">
                      Soru {currentQuestionIndex + 1} / {questions.length}
                    </p>
                    <h2 className="mt-2 text-2xl font-medium leading-snug text-ink-900">
                      {currentQuestion.prompt}
                    </h2>
                  </div>
                </div>

                {currentQuestion.helper ? (
                  <p className="text-sm text-muted-500">{currentQuestion.helper}</p>
                ) : null}

                <div className="grid gap-3">
                  {currentQuestion.choices.map((choice) => {
                    const active = answers[currentQuestion.id] === choice.score;
                    return (
                      <button
                        key={`${currentQuestion.id}-${choice.label}`}
                        type="button"
                        onClick={() => handleAnswerSelect(choice.score)}
                        className={`rounded-2xl border px-4 py-4 text-left transition ${
                          active
                            ? "border-gold-400 bg-gold-400/10 text-ink-900 shadow-soft"
                            : "border-ivory-200 bg-white hover:border-gold-400 hover:bg-ivory-50"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <span
                            className={`mt-1 h-4 w-4 rounded-full border ${
                              active
                                ? "border-gold-500 bg-gold-500"
                                : "border-muted-300"
                            }`}
                          />
                          <div>
                            <p className="text-base leading-relaxed text-ink-800">
                              {choice.label}
                            </p>
                            {choice.hint ? (
                              <p className="mt-1 text-sm text-muted-500">
                                {choice.hint}
                              </p>
                            ) : null}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ) : null}

          {currentStep === 7 ? (
            <Card variant="premium">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-gold-400/15 p-3 text-gold-600">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <Badge variant="gold">Adım 8 / 8</Badge>
                    <CardTitle className="mt-2 text-2xl font-semibold text-ink-900">
                      Altınİkiz’ini Oluştur
                    </CardTitle>
                  </div>
                </div>
                <CardDescription className="text-base leading-relaxed text-ink-700">
                  Tanıma cevapların ve skor testin birlikte işlenerek sana özel profil,
                  öncelik ve ilk görevler üretilecek.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-ivory-200 bg-white p-4">
                    <p className="text-sm text-muted-500">Beklenen ilk odak</p>
                    <p className="mt-2 text-base font-medium text-ink-900">
                      {finalContext.mainMotivation}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-ivory-200 bg-white p-4">
                    <p className="text-sm text-muted-500">Öğrenme tercihi</p>
                    <p className="mt-2 text-base font-medium text-ink-900">
                      {finalContext.learningPreference}
                    </p>
                  </div>
                </div>
                <div className="rounded-2xl border border-ivory-200 bg-ivory-50 p-4 text-sm leading-relaxed text-ink-700">
                  Bu aşamada sadece profilin oluşturulur. Uygulama yatırım tavsiyesi
                  vermez; kişisel farkındalık, güven ve öğrenme odaklı rehberlik sunar.
                </div>
              </CardContent>
            </Card>
          ) : null}

          <div className="flex flex-wrap items-center justify-between gap-3">
            <Button
              variant="ghost"
              onClick={handlePrevious}
              disabled={currentStep === 0 && currentQuestionIndex === 0}
            >
              Geri
            </Button>
            <div className="flex flex-wrap gap-3">
              {currentStep < 7 ? (
                <Button variant="secondary" onClick={handleNext} disabled={!currentStepComplete}>
                  {currentStep === 6 && currentQuestionIndex === questions.length - 1
                    ? "Sonuç Oluşturma Adımına Geç"
                    : "İleri"}
                </Button>
              ) : null}
              {currentStep === 7 ? (
                <Button
                  onClick={handleSubmit}
                  loading={isSubmitting}
                  disabled={!scoreQuestionsComplete}
                >
                  {isSubmitting ? "Altınİkiz Oluşturuluyor..." : "Altınİkizimi Oluştur"}
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
