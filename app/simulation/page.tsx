"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AlertTriangle, ArrowRight, CheckCircle2, Info, Shield, ShieldCheck } from "lucide-react";
import { Beaker } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { useAppState } from "@/components/providers/app-state-provider";
import { simulations } from "@/lib/simulations";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

function getOptionIcon(optionId: string) {
  if (optionId === "a") return ShieldCheck;
  if (optionId === "b") return Info;
  if (optionId === "c") return AlertTriangle;
  return Shield;
}

export default function SimulationPage() {
  const { result } = useAppState();
  const [selectedScenarioId, setSelectedScenarioId] = useState(simulations[0].id);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);

  const scenario = useMemo(
    () => simulations.find((item) => item.id === selectedScenarioId) ?? simulations[0],
    [selectedScenarioId],
  );

  const selectedOption = scenario.options.find((item) => item.id === selectedOptionId) ?? null;
  const recommendationReason =
    result?.profile.primaryNeed ?? "Karar verirken önce ihtiyaç, risk ve süre filtresi kurmak.";
  const otherOptions = scenario.alternativeReviews.filter((item) => item.id !== selectedOptionId);

  const resetScenario = (scenarioId: string) => {
    setSelectedScenarioId(scenarioId);
    setStep(1);
    setSelectedOptionId(null);
  };

  return (
    <AppShell
      eyebrow="Simülasyon"
      title="Simülasyon Laboratuvarı"
      description="Gerçek para riske atmadan karar verme mantığını gör."
      breadcrumb="Anasayfa → Simülasyon"
      icon={<Beaker className="h-5 w-5" />}
      ethicNotice="Simülasyon ekranı eğitim ve farkındalık içindir. Yatırım tavsiyesi vermez."
    >
      <section className="space-y-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-muted-500">
            Senaryo seçici
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-ink-900">
            Bugün açabileceğin 3 senaryo
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {simulations.map((item) => (
            <button key={item.id} type="button" className="text-left" onClick={() => resetScenario(item.id)}>
              <Card className={`h-full ${selectedScenarioId === item.id ? "border-gold-400" : ""}`}>
                <CardContent className="space-y-4 pt-6">
                  <div className="flex items-center justify-between gap-3">
                    <Badge variant="gold">Ornek senaryo</Badge>
                    <Badge variant="neutral">{item.duration}</Badge>
                  </div>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                  <p className="text-sm text-muted-500">{item.purpose}</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="emerald">{item.profileHint}</Badge>
                  </div>
                  <div className="rounded-2xl border border-ivory-200 bg-ivory-50 px-4 py-3 text-sm text-burgundy">
                    Ornek senaryo
                  </div>
                </CardContent>
              </Card>
            </button>
          ))}
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card variant="premium">
          <CardHeader>
            <CardTitle>{scenario.title}</CardTitle>
            <CardDescription>{scenario.reason}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex gap-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className={`rounded-full px-4 py-2 text-sm font-medium ${
                    step === item
                      ? "bg-burgundy text-white"
                      : "border border-ivory-200 bg-white text-muted-500"
                  }`}
                >
                  Adım {item}
                </div>
              ))}
            </div>

            {step === 1 ? (
              <div className="space-y-4">
                <p className="text-base leading-relaxed text-ink-700">{scenario.intro}</p>
                <Button onClick={() => setStep(2)}>Devam et</Button>
              </div>
            ) : null}

            {step === 2 ? (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-500">Karar anı</p>
                  <h3 className="mt-2 text-xl font-medium text-ink-900">
                    Bu durumda en yakın yaklaşımın hangisi olurdu?
                  </h3>
                </div>
                <div className="grid gap-3">
                  {scenario.options.map((option) => {
                    const Icon = getOptionIcon(option.id);
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setSelectedOptionId(option.id)}
                        className={`rounded-2xl border px-4 py-4 text-left transition ${
                          selectedOptionId === option.id
                            ? "border-gold-400 bg-gold-400/10"
                            : "border-ivory-200 bg-white hover:border-gold-400"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="rounded-2xl bg-ivory-50 p-3 text-burgundy">
                            <Icon className="h-5 w-5" />
                          </div>
                          <p className="text-base font-medium text-ink-900">{option.text}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
                <Button onClick={() => setStep(3)} disabled={!selectedOptionId}>
                  Seçimimi yaptım
                </Button>
              </div>
            ) : null}

            {step === 3 && selectedOption ? (
              <div className="space-y-6">
                <div className="rounded-2xl border border-ivory-200 bg-white p-4">
                  <p className="text-sm text-muted-500">Senin seçimin</p>
                  <p className="mt-2 text-lg font-medium text-ink-900">{selectedOption.text}</p>
                </div>

                <div className="rounded-2xl border border-success-500/20 bg-success-100 p-4">
                  <p className="text-sm font-medium text-emerald-700">Bu seçimin avantajları</p>
                  <ul className="mt-3 space-y-2 text-sm text-ink-700">
                    {selectedOption.pros.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl border border-warning-500/20 bg-warning-100 p-4">
                  <p className="text-sm font-medium text-warning-500">Dikkat edilmesi gerekenler</p>
                  <ul className="mt-3 space-y-2 text-sm text-ink-700">
                    {selectedOption.cons.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl border border-info-500/20 bg-info-100 p-4">
                  <p className="text-sm font-medium text-info-500">Bu kararı verirken bakılan kriterler</p>
                  <div className="mt-3 space-y-3">
                    {scenario.criteria.map((item) => (
                      <div key={item.title} className="rounded-2xl border border-white/70 bg-white px-4 py-3">
                        <p className="text-sm font-medium text-ink-900">{item.title}</p>
                        <p className="mt-1 text-sm text-muted-500">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <details className="rounded-2xl border border-ivory-200 bg-white p-4">
                  <summary className="cursor-pointer text-sm font-medium text-burgundy">
                    Diğer seçenekleri de gör
                  </summary>
                  <div className="mt-4 grid gap-3">
                    {otherOptions.map((item) => (
                      <div key={item.id} className="rounded-2xl border border-ivory-200 bg-ivory-50 px-4 py-3">
                        <p className="text-sm font-medium text-ink-900">{item.title}</p>
                        <p className="mt-2 text-sm text-muted-500">{item.summary}</p>
                      </div>
                    ))}
                  </div>
                </details>

                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="secondary"
                    onClick={() =>
                      resetScenario(
                        simulations[
                          (simulations.findIndex((item) => item.id === scenario.id) + 1) %
                            simulations.length
                        ].id,
                      )
                    }
                  >
                    Başka Senaryo Dene
                  </Button>
                  <Link href="/twin">
                    <Button variant="ghost" iconRight={<ArrowRight className="h-4 w-4" />}>
                      Profilime Dön
                    </Button>
                  </Link>
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Altınİkiz neden bunu öneriyor?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-ink-700">
            <p>{recommendationReason}</p>
            <p>
              Bu ekran ürün seçtirmez; karar verirken hangi filtrelerin önce gelmesi gerektiğini görünür kılar.
            </p>
            <div className="rounded-2xl border border-ivory-200 bg-ivory-50 p-4">
              <p className="font-medium text-ink-900">Bu senaryoda öğreneceğin kavramlar</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {scenario.concepts.map((item) => (
                  <Badge key={item} variant="gold">
                    {item}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
