"use client";

import { useEffect, useMemo, useState } from "react";
import { ShieldAlert } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { useAppState } from "@/components/providers/app-state-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RiskBadge } from "@/components/ui/risk-badge";
import { Textarea } from "@/components/ui/textarea";
import { Toast } from "@/components/ui/toast";
import { buildLocalScamCommentary, requestAiResponse } from "@/lib/ai";
import { analyzeScamMessage } from "@/lib/scam";
import { loadScamHistory, saveScamHistory } from "@/lib/storage";
import { ScamAiCommentary, ScamAnalysis } from "@/types";

const individualSamples = [
  {
    title: "Sahte banka mesaji",
    text: "Halkbank yatirim firsati! 10.000 TL yatir, 1 ayda 18.000 TL al. Garanti kazanc. Bugun son firsat. IBAN'a gonder, kimseye soyleme. Basvuru: halkbank-firsat.com",
  },
  {
    title: "Sahte yatirim firsati",
    text: "Sadece sana ozel firsat. %100 getiri saglayan yeni sistem icin hemen hesap numarasina odeme yap. Lisans detayini sonra paylasacagiz.",
  },
  {
    title: "Sahte kargo bildirimi",
    text: "Paketiniz beklemede. Teslim icin dogrulama kodunuzu ve kart bilgilerinizi bu baglantiya girin: kargo-destek.click",
  },
];

const corporateSamples = [
  {
    title: "Sahte IT sifre yenileme",
    text: "BT ekibinden acil bildirim: hesabiniz askiya alinmamak icin sifrenizi hemen yenileyin. Kurumsal dogrulama kodunuzu ve kullanici sifrenizi bu baglantiya girin: abankasi-security.click",
  },
  {
    title: "Sahte yonetici para talebi",
    text: "Genel mudur adina yaziyorum. Toplantiya giriyorum, bu IBAN'a hemen 85.000 TL gonderin. Onayi sonra ERP'de aciklariz. Kimseye soylemeyin.",
  },
  {
    title: "Sahte IK belge talebi",
    text: "IK biriminden son hatirlatma. Maas zammi listesi icin kimlik karti, dogum tarihi ve mobil bankacilik onay kodunuzu iletin.",
  },
];

export default function ScamShieldPage() {
  const { aiSettings, authSession, result } = useAppState();
  const isCorporate = authSession?.role === "corporate";
  const samples = useMemo(
    () => (isCorporate ? corporateSamples : individualSamples),
    [isCorporate],
  );
  const [message, setMessage] = useState(individualSamples[0].text);
  const [analysis, setAnalysis] = useState<ScamAnalysis | null>(null);
  const [aiCommentary, setAiCommentary] = useState<ScamAiCommentary | null>(null);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [toast, setToast] = useState<{
    title: string;
    description?: string;
    tone: "success" | "error" | "warning" | "info";
  } | null>(null);

  const length = message.trim().length;
  const livePreview = useMemo(() => (analysis ? analysis : null), [analysis]);

  useEffect(() => {
    setMessage(samples[0].text);
    setAnalysis(null);
    setAiCommentary(null);
  }, [samples]);

  const handleAnalyze = async () => {
    if (length < 10) {
      setToast({
        title: "Mesaj cok kisa",
        description: "Daha uzun bir mesaj yapistir.",
        tone: "warning",
      });
      return;
    }

    setLoading(true);
    setAiCommentary(null);

    const nextAnalysis = analyzeScamMessage(message);
    const nextHistory = [
      {
        id: `scam-${Date.now()}`,
        level: nextAnalysis.level,
        overallRiskScore: nextAnalysis.overallRiskScore,
        signalCount: nextAnalysis.signals.length,
        hasUrl: nextAnalysis.urlAnalyses.length > 0,
        createdAt: new Date().toISOString(),
      },
      ...loadScamHistory(),
    ].slice(0, 50);

    saveScamHistory(nextHistory);
    setAnalysis(nextAnalysis);
    setLoading(false);

    try {
      setAiLoading(true);

      if (aiSettings?.apiKey) {
        setAiCommentary(
          await requestAiResponse("scam", aiSettings, {
            message,
            analysis: nextAnalysis,
            result,
            viewerRole: isCorporate ? "corporate" : "individual",
            organizationName: authSession?.organizationName,
          }),
        );
      } else {
        setAiCommentary(
          buildLocalScamCommentary({
            message,
            analysis: nextAnalysis,
            result,
            viewerRole: isCorporate ? "corporate" : "individual",
            organizationName: authSession?.organizationName,
          }),
        );
      }
    } catch (error) {
      setAiCommentary(
        buildLocalScamCommentary({
          message,
          analysis: nextAnalysis,
          result,
          viewerRole: isCorporate ? "corporate" : "individual",
          organizationName: authSession?.organizationName,
        }),
      );
      setToast({
        title: "AI yorumu yerel moda dustu",
        description:
          error instanceof Error
            ? error.message
            : "OpenAI baglantisi kurulamadi, yerel yorum kullanildi.",
        tone: "warning",
      });
    } finally {
      setAiLoading(false);
    }
  };

  const handleClear = () => {
    setMessage("");
    setAnalysis(null);
    setAiCommentary(null);
  };

  return (
    <AppShell
      eyebrow={isCorporate ? "Kurumsal Kalkan" : "Dolandiricilik Kalkani"}
      title={isCorporate ? "Kurumsal phishing ve scam incelemesi" : "Supheli mesajlari guvenle incele"}
      description={
        isCorporate
          ? "Calisanlara gelen supheli mesajlari kurumsal gozle oku. Risk skoru kural bazlidir, yorum katmani AI ile zenginlesebilir."
          : "Mesaj ve baglanti risklerini birlikte oku. Risk skoru kural bazlidir, yorum katmani AI ile zenginlesebilir."
      }
      breadcrumb="Anasayfa → Dolandiricilik Kalkani"
      icon={<ShieldAlert className="h-5 w-5" />}
      ethicNotice="Bu sistem teshis koymaz, risk isareti verir. Son karar her zaman kullaniciya aittir."
      aside={
        <Card>
          <CardHeader>
            <CardTitle>Bilgi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-relaxed text-muted-500">
            <div>
              {aiSettings?.apiKey ? (
                <Badge variant="emerald">OpenAI yorum aktif</Badge>
              ) : (
                <Badge variant="neutral">Yerel yorum aktif</Badge>
              )}
            </div>
            <p>
              {isCorporate
                ? "Supheli durumda kurumun resmi BT, IK veya guvenlik kanalindan dogrulama yap."
                : "Supheli durumlarda resmi banka kanali veya 155 uzerinden dogrulama yap."}
            </p>
            <p>Metin dili ve baglanti riski birlikte okunmalidir.</p>
          </CardContent>
        </Card>
      }
    >
      <section className="grid gap-6 xl:grid-cols-2">
        <Card variant="premium">
          <CardHeader>
            <CardTitle>{isCorporate ? "Supheli kurumsal mesaji yapistir" : "Supheli mesaji yapistir"}</CardTitle>
            <CardDescription>Istersen hazir bir ornekle basla.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <Textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              className="min-h-[240px] resize-y"
            />
            <div className="flex items-center justify-between text-sm text-muted-500">
              <span>Mesaj uzunlugu</span>
              <span>{length} karakter</span>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => void handleAnalyze()} loading={loading} size="lg">
                Analiz et
              </Button>
              <Button variant="ghost" onClick={handleClear} size="lg">
                Temizle
              </Button>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {samples.map((sample) => (
                <button
                  key={sample.title}
                  type="button"
                  onClick={() => setMessage(sample.text)}
                  className="rounded-2xl border border-ivory-200 bg-white p-4 text-left transition hover:border-gold-400 hover:bg-ivory-50"
                >
                  <p className="text-sm font-medium text-ink-900">{sample.title}</p>
                  <p className="mt-2 text-sm text-muted-500">Ornek mesaji doldur</p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {!livePreview ? (
          <Card>
            <CardHeader>
              <CardTitle>Henuz analiz yok</CardTitle>
              <CardDescription>Sonuclar burada gorunecek.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3 xl:grid-cols-1">
              {samples.map((sample) => (
                <div
                  key={sample.title}
                  className="rounded-2xl border border-ivory-200 bg-ivory-50 p-4"
                >
                  <p className="text-sm font-medium text-ink-900">{sample.title}</p>
                  <p className="mt-2 text-sm text-muted-500">{sample.text.slice(0, 90)}...</p>
                </div>
              ))}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card variant="premium">
              <CardHeader>
                <CardTitle>Risk ozeti</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <RiskBadge level={livePreview.level} />
                  <p className="text-3xl font-medium text-burgundy">
                    {livePreview.overallRiskScore}/100
                  </p>
                </div>
                <p className="text-base text-ink-700">
                  {livePreview.signals.length} risk sinyali tespit edildi.
                </p>
                <p className="text-sm text-muted-500">{livePreview.summary}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Metin icerigi analizi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {livePreview.signals.map((signal) => (
                  <div
                    key={signal}
                    className="rounded-2xl border border-ivory-200 bg-white px-4 py-3"
                  >
                    <p className="text-sm font-medium text-ink-900">× {signal}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Baglanti risk modeli</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {livePreview.urlAnalyses.length > 0 ? (
                  livePreview.urlAnalyses.map((item) => (
                    <div
                      key={item.originalUrl}
                      className="rounded-2xl border border-ivory-200 bg-ivory-50 p-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="text-base font-medium text-ink-900">{item.domain}</p>
                          <p className="mt-1 text-sm text-muted-500">{item.originalUrl}</p>
                        </div>
                        <RiskBadge level={item.riskLevel} />
                      </div>
                      <p className="mt-3 text-sm text-muted-500">Risk skoru: {item.riskScore}/100</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {item.features.map((feature) => (
                          <Badge key={feature} variant="neutral">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                      <p className="mt-4 text-sm text-ink-700">{item.explanation}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-500">
                    Mesajda baglanti bulunmadi. Analiz yalnizca metin sinyallerine gore yapildi.
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between gap-3">
                  <CardTitle>AI yorumu</CardTitle>
                  {aiLoading ? <Badge variant="neutral">Yorum hazirlaniyor</Badge> : null}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {aiCommentary ? (
                  <>
                    <p className="rounded-2xl border border-ivory-200 bg-ivory-50 p-4 text-sm leading-relaxed text-ink-700">
                      {aiCommentary.explanation}
                    </p>
                    <div className="space-y-2">
                      {aiCommentary.nextSteps.map((step) => (
                        <div
                          key={step}
                          className="rounded-2xl border border-ivory-200 bg-white px-4 py-3 text-sm text-ink-700"
                        >
                          {step}
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-muted-500">
                    Analizden sonra kural bazli sonuc ustune sade yorum burada gosterilir.
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Guvenli cevap onerisi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="rounded-2xl border border-ivory-200 bg-ivory-50 p-4 text-sm leading-relaxed text-ink-700">
                  {aiCommentary?.safeReply ?? livePreview.safeReply}
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      void navigator.clipboard.writeText(
                        aiCommentary?.safeReply ?? livePreview.safeReply,
                      );
                      setToast({
                        title: "Kopyalandi",
                        description: "Guvenli cevap panoya alindi.",
                        tone: "success",
                      });
                    }}
                  >
                    Kopyala
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() =>
                      setToast({
                        title: "Yakinina uyari gonder",
                        description:
                          "Bu ozellik demo surumunde yakinda etkin olacak.",
                        tone: "info",
                      })
                    }
                  >
                    Yakinima Uyari Gonder
                  </Button>
                  <Button variant="ghost" onClick={handleClear}>
                    Yeni analiz
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </section>

      <Toast
        open={Boolean(toast)}
        title={toast?.title ?? ""}
        description={toast?.description}
        tone={toast?.tone ?? "info"}
        onClose={() => setToast(null)}
      />
    </AppShell>
  );
}
