"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Award } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { ResultGuard } from "@/components/result/result-guard";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAppState } from "@/components/providers/app-state-provider";

const colors = {
  knowledge: "bg-info-500",
  behavior: "bg-success-500",
  risk: "bg-danger-500",
  attitude: "bg-warning-500",
};

export default function ResultPage() {
  const { result } = useAppState();
  const [animatedScore, setAnimatedScore] = useState(0);
  const firstSteps =
    result?.profile.firstSteps ??
    result?.profile.weeklyTasks?.slice(0, 3).map((task) => task.title) ??
    [
      "Altınİkiz ekranında profilini incele",
      "Şüpheli bir mesajı Kalkan’da analiz et",
      "Evden üretim hesabında ilk ürününü gir",
    ];

  useEffect(() => {
    if (!result) return;
    const target = Math.round(result.overallScore);
    let current = 0;
    const step = Math.max(1, Math.floor(target / 30));
    const timer = window.setInterval(() => {
      current += step;
      if (current >= target) {
        setAnimatedScore(target);
        window.clearInterval(timer);
      } else {
        setAnimatedScore(current);
      }
    }, 35);

    return () => window.clearInterval(timer);
  }, [result]);

  return (
    <AppShell
      eyebrow="Skor Sonucu"
      title="AltınÖtesi Skoru"
      description="Başlangıç noktanı, ilk odağını ve bir sonraki adımı burada gör."
      breadcrumb="Anasayfa → Test → Sonuç"
      icon={<Award className="h-5 w-5" />}
      ethicNotice="AltınÖtesi yatırım tavsiyesi vermez. Bu test ve sonuç eğitim ve farkındalık amaçlıdır."
      aside={
        <Card variant="premium">
          <CardContent className="space-y-3 py-6">
            <p className="text-sm text-muted-500">Test tamamlandı</p>
            {result ? <Badge variant="gold">{result.profile.name}</Badge> : null}
            {result ? (
              <p className="text-sm leading-relaxed text-ink-700">{result.profile.shortSummary}</p>
            ) : null}
          </CardContent>
        </Card>
      }
    >
      <ResultGuard>
        {result ? (
          <div className="space-y-6">
            <Card variant="premium">
              <CardHeader>
                <CardTitle>Tebrikler</CardTitle>
                <CardDescription>{result.profile.description}</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6 lg:grid-cols-[0.55fr_1.45fr]">
                <div className="space-y-4">
                  <p className="text-6xl font-medium text-burgundy">{animatedScore}</p>
                  <Badge variant="gold" size="md">
                    {result.profile.name}
                  </Badge>
                </div>
                <div className="space-y-5">
                  {[
                    {
                      key: "knowledge",
                      label: "Bilgi",
                      value: result.scores.knowledge,
                      text: "Temel kavramları tanıma düzeyin.",
                    },
                    {
                      key: "behavior",
                      label: "Davranış",
                      value: result.scores.behavior,
                      text: "Senaryolarda verdiğin refleksler.",
                    },
                    {
                      key: "risk",
                      label: "Risk Farkındalığı",
                      value: result.scores.risk,
                      text: "Şüpheli sinyalleri ayırt etme gücün.",
                    },
                    {
                      key: "attitude",
                      label: "Tutum / Özgüven",
                      value: result.scores.attitude,
                      text: "Finansal karar alırken hissettiğin güven.",
                    },
                  ].map((item) => (
                    <div key={item.key} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-base font-medium text-ink-900">{item.label}</p>
                        <p className="text-sm text-muted-500">{item.value}/100</p>
                      </div>
                      <Progress
                        value={item.value}
                        indicatorClassName={colors[item.key as keyof typeof colors]}
                      />
                      <p className="text-sm text-muted-500">{item.text}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-5 xl:grid-cols-[1fr_1fr]">
              <Card>
                <CardHeader>
                  <CardTitle>Kişisel özet</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-base text-ink-700">{result.profile.shortSummary}</p>
                  <div className="rounded-2xl border border-ivory-200 bg-ivory-50 p-4">
                    <p className="text-sm text-muted-500">Birincil ihtiyaç</p>
                    <p className="mt-2 text-base font-medium text-ink-900">
                      {result.profile.primaryNeed}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-danger-500/15 bg-danger-100/60 p-4">
                    <p className="text-sm text-danger-500">Ana risk</p>
                    <p className="mt-2 text-base font-medium text-ink-900">
                      {result.profile.mainRisk}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>İlk 3 adımın</CardTitle>
                  <CardDescription>İlk odak: {result.profile.primaryNeed}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {firstSteps.map((step, index) => (
                    <div
                      key={step}
                      className="rounded-2xl border border-ivory-200 bg-white px-4 py-4"
                    >
                      <p className="text-sm text-muted-500">Adım {index + 1}</p>
                      <p className="mt-2 text-base text-ink-700">{step}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              <Link href="/twin">
                <Card className="h-full">
                  <CardContent className="space-y-3 pt-6">
                    <Badge variant="gold">Sıradaki adım</Badge>
                    <CardTitle>Altınİkiz’ini gör</CardTitle>
                    <CardDescription>Profilini ve yol haritanı tek ekranda aç.</CardDescription>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/scam-shield">
                <Card className="h-full">
                  <CardContent className="space-y-3 pt-6">
                    <Badge variant="danger">Koruma</Badge>
                    <CardTitle>Dolandırıcılık Kalkanı’nı dene</CardTitle>
                    <CardDescription>Şüpheli mesajları analiz ederek pratik yap.</CardDescription>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/producer">
                <Card className="h-full">
                  <CardContent className="space-y-3 pt-6">
                    <Badge variant="emerald">Üretim</Badge>
                    <CardTitle>Evden üretim hesabı</CardTitle>
                    <CardDescription>Gelir, gider ve net kârı ürün bazında gör.</CardDescription>
                  </CardContent>
                </Card>
              </Link>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Skoru nasıl okumalı?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-ink-700 md:text-base">
                <p>Bu skor bir başlangıç göstergesidir.</p>
                <p>Yatırım performansını ölçmez; kullanım arttıkça gelişebilir.</p>
              </CardContent>
            </Card>
          </div>
        ) : null}
      </ResultGuard>
    </AppShell>
  );
}
