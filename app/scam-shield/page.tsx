"use client";

import { useMemo, useState } from "react";
import { ShieldAlert } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RiskBadge } from "@/components/ui/risk-badge";
import { Textarea } from "@/components/ui/textarea";
import { Toast } from "@/components/ui/toast";
import { analyzeScamMessage } from "@/lib/scam";
import { ScamAnalysis } from "@/types";

const samples = [
  {
    title: "Sahte banka mesajı",
    text: "Halkbank yatırım fırsatı! 10.000 TL yatır, 1 ayda 18.000 TL al. Garanti kazanç. Bugün son fırsat. IBAN'a gönder, kimseye söyleme. Başvuru: halkbank-firsat.com",
  },
  {
    title: "Sahte yatırım fırsatı",
    text: "Sadece sana özel fırsat. %100 getiri sağlayan yeni sistem için hemen hesap numarasına ödeme yap. Lisans detayını sonra paylaşacağız.",
  },
  {
    title: "Sahte kargo bildirimi",
    text: "Paketiniz beklemede. Teslim için doğrulama kodunuzu ve kart bilgilerinizi bu bağlantıya girin: kargo-destek.click",
  },
];

export default function ScamShieldPage() {
  const [message, setMessage] = useState(samples[0].text);
  const [analysis, setAnalysis] = useState<ScamAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{
    title: string;
    description?: string;
    tone: "success" | "error" | "warning" | "info";
  } | null>(null);

  const length = message.trim().length;
  const livePreview = useMemo(() => (analysis ? analysis : null), [analysis]);

  const handleAnalyze = () => {
    if (length < 10) {
      setToast({
        title: "Mesaj çok kısa",
        description: "Daha uzun bir mesaj yapıştır.",
        tone: "warning",
      });
      return;
    }

    setLoading(true);
    window.setTimeout(() => {
      setAnalysis(analyzeScamMessage(message));
      setLoading(false);
    }, 1000);
  };

  const handleClear = () => {
    setMessage("");
    setAnalysis(null);
  };

  return (
    <AppShell
      eyebrow="Dolandırıcılık Kalkanı"
      title="Şüpheli mesajları güvenle incele"
      description="Mesaj ve bağlantı risklerini birlikte oku. Bu ekran yatırım fırsatı değerlendirmez."
      breadcrumb="Anasayfa → Dolandırıcılık Kalkanı"
      icon={<ShieldAlert className="h-5 w-5" />}
      ethicNotice="Bu sistem teşhis koymaz, risk işareti verir. Son karar her zaman kullanıcıya aittir."
      aside={
        <Card>
          <CardHeader>
            <CardTitle>Bilgi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-relaxed text-muted-500">
            <p>Şüpheli durumlarda resmi banka kanalı veya 155 üzerinden doğrulama yap.</p>
            <p>Metin dili ve bağlantı riski birlikte okunmalıdır.</p>
          </CardContent>
        </Card>
      }
    >
      <section className="grid gap-6 xl:grid-cols-2">
        <Card variant="premium">
          <CardHeader>
            <CardTitle>Şüpheli mesajı yapıştır</CardTitle>
            <CardDescription>İstersen hazır bir örnekle başla.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <Textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              className="min-h-[240px] resize-y"
            />
            <div className="flex items-center justify-between text-sm text-muted-500">
              <span>Mesaj uzunluğu</span>
              <span>{length} karakter</span>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button onClick={handleAnalyze} loading={loading} size="lg">
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
                  <p className="mt-2 text-sm text-muted-500">Örnek mesajı doldur</p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {!livePreview ? (
          <Card>
            <CardHeader>
              <CardTitle>Henüz analiz yok</CardTitle>
              <CardDescription>Sonuçlar burada görünecek.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3 xl:grid-cols-1">
              {samples.map((sample) => (
                <div key={sample.title} className="rounded-2xl border border-ivory-200 bg-ivory-50 p-4">
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
                <CardTitle>Risk özeti</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <RiskBadge level={livePreview.level} />
                  <p className="text-3xl font-medium text-burgundy">
                    {livePreview.urlAnalyses.reduce((max, item) => Math.max(max, item.riskScore), 0)}/100
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
                <CardTitle>Metin içeriği analizi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {livePreview.signals.map((signal) => (
                  <div key={signal} className="rounded-2xl border border-ivory-200 bg-white px-4 py-3">
                    <p className="text-sm font-medium text-ink-900">✗ {signal}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Bağlantı risk modeli</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {livePreview.urlAnalyses.length > 0 ? (
                  livePreview.urlAnalyses.map((item) => (
                    <div key={item.originalUrl} className="rounded-2xl border border-ivory-200 bg-ivory-50 p-4">
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
                    Mesajda bağlantı bulunmadı. Analiz yalnızca metin sinyallerine göre yapıldı.
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sade açıklama</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-base leading-relaxed text-ink-700">
                  Bu mesaj birden fazla dolandırıcılık sinyali taşıyor. Resmi finans kurumları
                  lisans ve yetki bilgisi olmadan yatırım çağrısı yapmaz. “Garanti kazanç” ve
                  “bugün son fırsat” dili tipik baskı göstergeleridir.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Güvenli cevap önerisi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="rounded-2xl border border-ivory-200 bg-ivory-50 p-4 text-sm leading-relaxed text-ink-700">
                  Bu teklifi değerlendirmeden önce kurumunuzun lisans ve yetki bilgilerini
                  SPK’nın resmi sitesinden kontrol etmem gerekiyor.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      void navigator.clipboard.writeText(
                        "Bu teklifi değerlendirmeden önce kurumunuzun lisans ve yetki bilgilerini SPK’nın resmi sitesinden kontrol etmem gerekiyor.",
                      );
                      setToast({
                        title: "Kopyalandı",
                        description: "Güvenli cevap panoya alındı.",
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
                        title: "Yakınına uyarı gönder",
                        description: "Bu özellik demo sürümünde yakında etkin olacak.",
                        tone: "info",
                      })
                    }
                  >
                    Yakınıma Uyarı Gönder
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
