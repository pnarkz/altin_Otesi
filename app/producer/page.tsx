"use client";

import { useEffect, useMemo, useState } from "react";
import { Bot, Package } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { useAppState } from "@/components/providers/app-state-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MetricCard } from "@/components/ui/metric-card";
import { Toast } from "@/components/ui/toast";
import {
  buildLocalProducerCommentary,
  ProducerAiPayload,
  requestAiResponse,
} from "@/lib/ai";
import { formatCurrency } from "@/lib/format";
import { calculateProducerSummary } from "@/lib/producer";
import { loadProducerHistory, loadSavingsState, saveProducerHistory } from "@/lib/storage";
import { ProducerAiCommentary, ProducerRecord, SavingsState } from "@/types";

const defaultForm = {
  productName: "Cilek receli",
  salePrice: 120,
  unitsSold: 12,
  materialCost: 780,
  packagingCost: 60,
  shippingCost: 0,
  laborHours: 8,
};

export default function ProducerPage() {
  const { aiSettings, result } = useAppState();
  const [form, setForm] = useState(defaultForm);
  const [history, setHistory] = useState<ProducerRecord[]>([]);
  const [savingsState, setSavingsState] = useState<SavingsState | null>(null);
  const [insight, setInsight] = useState<ProducerAiCommentary | null>(null);
  const [insightLoading, setInsightLoading] = useState(false);
  const [toast, setToast] = useState<{
    title: string;
    description?: string;
    tone: "success" | "error" | "warning" | "info";
  } | null>(null);

  useEffect(() => {
    setHistory(loadProducerHistory());
    setSavingsState(loadSavingsState());
  }, []);

  const summary = useMemo(
    () =>
      calculateProducerSummary({
        salePrice: form.salePrice,
        unitsSold: form.unitsSold,
        materialCost: form.materialCost,
        packagingCost: form.packagingCost,
        shippingCost: form.shippingCost,
        laborHours: form.laborHours,
      }),
    [form],
  );

  const margin =
    summary.totalRevenue > 0 ? Math.round((summary.netProfit / summary.totalRevenue) * 100) : 0;

  const comparisonSummary = useMemo(() => {
    if (history.length === 0) {
      return {
        averageProfit: 0,
        bestHourlyIncome: 0,
        topProduct: null as ProducerRecord | null,
      };
    }

    const averageProfit = Math.round(
      history.reduce((sum, item) => sum + item.summary.netProfit, 0) / history.length,
    );
    const topProduct =
      history.reduce((best, item) =>
        item.summary.hourlyIncome > best.summary.hourlyIncome ? item : best,
      ) ?? history[0];

    return {
      averageProfit,
      bestHourlyIncome: topProduct.summary.hourlyIncome,
      topProduct,
    };
  }, [history]);

  const setNumericField = (key: keyof typeof defaultForm, value: string) => {
    const parsed = Number.parseFloat(value);
    if (parsed < 0) {
      setToast({
        title: "Negatif deger kullanilamaz",
        description: "Lutfen 0 veya daha buyuk bir deger gir.",
        tone: "warning",
      });
      return;
    }

    setForm((current) => ({
      ...current,
      [key]: Number.isNaN(parsed) ? 0 : parsed,
    }));
  };

  const requestInsight = async (nextHistory = history) => {
    const payload: ProducerAiPayload = {
      ...form,
      summary,
      result,
      savingsState,
      producerHistory: nextHistory,
    };

    setInsightLoading(true);

    try {
      if (aiSettings?.apiKey) {
        setInsight(await requestAiResponse("producer", aiSettings, payload));
      } else {
        setInsight(buildLocalProducerCommentary(payload));
      }
    } catch (error) {
      setInsight(buildLocalProducerCommentary(payload));
      setToast({
        title: "AI butce yorumu yerel moda dustu",
        description:
          error instanceof Error
            ? error.message
            : "OpenAI baglantisi basarisiz oldu, yerel yorum kullanildi.",
        tone: "warning",
      });
    } finally {
      setInsightLoading(false);
    }
  };

  const handleSaveCalculation = async () => {
    const entry: ProducerRecord = {
      id: `producer-${Date.now()}`,
      productName: form.productName.trim() || "Adsiz urun",
      salePrice: form.salePrice,
      unitsSold: form.unitsSold,
      materialCost: form.materialCost,
      packagingCost: form.packagingCost,
      shippingCost: form.shippingCost,
      laborHours: form.laborHours,
      summary,
      createdAt: new Date().toISOString(),
    };

    const nextHistory = [entry, ...history].slice(0, 8);
    setHistory(nextHistory);
    saveProducerHistory(nextHistory);
    setToast({
      title: "Hesap kaydedildi",
      description: "Urun artik karsilastirma gecmisinde gorunecek.",
      tone: "success",
    });
    await requestInsight(nextHistory);
  };

  return (
    <AppShell
      eyebrow="Evden Ureten Kadin"
      title="Uretim gelirini gorunur kil"
      description="Net kari, gider baskisini ve hedefe ayrilabilecek tutari tek ekranda gor."
      breadcrumb="Anasayfa → Evden Uretim"
      icon={<Package className="h-5 w-5" />}
      ethicNotice="Bu hesaplama gelir-gider farkindaligi icindir. Vergi ve yasal yukumluluk hesabi degildir."
      aside={
        <Card>
          <CardHeader>
            <CardTitle>Net kar</CardTitle>
            <CardDescription>Hizli gorunum</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-medium text-emerald-700">
              {formatCurrency(summary.netProfit)}
            </p>
            <p className="mt-2 text-sm text-muted-500">
              Saatlik kazanc: {formatCurrency(summary.hourlyIncome)}
            </p>
            <div className="mt-4">
              {aiSettings?.apiKey ? (
                <Badge variant="emerald">OpenAI aktif</Badge>
              ) : (
                <Badge variant="neutral">Yerel yorum</Badge>
              )}
            </div>
          </CardContent>
        </Card>
      }
    >
      <section className="grid gap-6 xl:grid-cols-[0.88fr_1.12fr]">
        <Card variant="premium">
          <CardHeader>
            <CardTitle>Urun bilgileri</CardTitle>
            <CardDescription>Hesapla, kaydet, sonra onceki urunlerle karsilastir.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Urun adi"
              value={form.productName}
              onChange={(event) =>
                setForm((current) => ({ ...current, productName: event.target.value }))
              }
              className="sm:col-span-2"
            />
            <Input
              label="Satis fiyati (TL)"
              type="number"
              value={form.salePrice}
              onChange={(event) => setNumericField("salePrice", event.target.value)}
            />
            <Input
              label="Satilan adet"
              type="number"
              value={form.unitsSold}
              onChange={(event) => setNumericField("unitsSold", event.target.value)}
            />
            <Input
              label="Malzeme maliyeti (TL)"
              type="number"
              value={form.materialCost}
              onChange={(event) => setNumericField("materialCost", event.target.value)}
            />
            <Input
              label="Ambalaj gideri (TL)"
              type="number"
              value={form.packagingCost}
              onChange={(event) => setNumericField("packagingCost", event.target.value)}
            />
            <Input
              label="Kargo gideri (TL)"
              type="number"
              value={form.shippingCost}
              onChange={(event) => setNumericField("shippingCost", event.target.value)}
            />
            <Input
              label="Tahmini emek suresi (saat)"
              type="number"
              value={form.laborHours}
              onChange={(event) => setNumericField("laborHours", event.target.value)}
            />
            <div className="flex flex-wrap gap-3 pt-2 sm:col-span-2">
              <Button onClick={() => void handleSaveCalculation()} loading={insightLoading}>
                Hesapla ve kaydet
              </Button>
              <Button variant="secondary" onClick={() => void requestInsight()} loading={insightLoading}>
                Butce yorumu al
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setForm(defaultForm);
                  setInsight(null);
                }}
              >
                Yeni urun
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card variant="premium">
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-500">Ana sonuc</p>
              <p className="text-5xl font-medium text-emerald-700">
                {formatCurrency(summary.netProfit)}
              </p>
              <p className="text-base text-ink-700">{form.productName} icin tahmini net kar</p>
              {summary.netProfit < 0 ? (
                <div className="rounded-2xl border border-danger-500/20 bg-danger-100 px-4 py-3 text-sm text-danger-500">
                  Bu hesap zararda gorunuyor. Maliyet dagilimini ve satis adedini tekrar kontrol et.
                </div>
              ) : null}
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <MetricCard
              label="Toplam Gelir"
              value={formatCurrency(summary.totalRevenue)}
              detail="Satis fiyati x satilan adet"
            />
            <MetricCard
              label="Toplam Gider"
              value={formatCurrency(summary.totalCost)}
              detail="Malzeme, ambalaj ve kargo toplami"
            />
            <MetricCard
              label="Saatlik Kazanc"
              value={formatCurrency(summary.hourlyIncome)}
              detail="Net kar / emek suresi"
            />
            <MetricCard label="Marj" value={`%${margin}`} detail="Net kar / toplam gelir orani" />
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-emerald-700" />
                <CardTitle>Butce yorumu</CardTitle>
              </div>
              <CardDescription>
                Kural bazli hesap sonucunun ustune yorum katmani eklenir.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {insight ? (
                <>
                  <p className="rounded-2xl border border-ivory-200 bg-ivory-50 p-4 text-sm leading-relaxed text-ink-700">
                    {insight.summary}
                  </p>
                  <div className="rounded-2xl border border-gold-400/25 bg-gold-400/10 p-4 text-sm text-ink-700">
                    {insight.budgetFocus}
                  </div>
                  <div className="space-y-2">
                    {insight.actions.map((item) => (
                      <div
                        key={item}
                        className="rounded-2xl border border-ivory-200 bg-white px-4 py-3 text-sm text-ink-700"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                  <p className="text-sm font-medium text-burgundy">{insight.nextQuestion}</p>
                </>
              ) : (
                <p className="text-sm text-muted-500">
                  Kayitli bir hesap uzerinden AI veya yerel butce yorumu alabilirsin.
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Bu karla neler dusunebilirsin?</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-success-500/20 bg-success-100 p-4">
                <p className="text-sm text-muted-500">Malzeme yenileme</p>
                <p className="mt-3 text-2xl font-medium text-emerald-700">
                  {formatCurrency(summary.restockSuggestion)}
                </p>
              </div>
              <div className="rounded-2xl border border-gold-400/30 bg-gold-400/10 p-4">
                <p className="text-sm text-muted-500">Kendi hedefin</p>
                <p className="mt-3 text-2xl font-medium text-burgundy">
                  {formatCurrency(summary.goalSuggestion)}
                </p>
              </div>
              <div className="rounded-2xl border border-ivory-200 bg-ivory-50 p-4">
                <p className="text-sm text-muted-500">Kalan serbest alan</p>
                <p className="mt-3 text-2xl font-medium text-ink-900">
                  {formatCurrency(
                    Math.max(
                      0,
                      summary.netProfit - summary.restockSuggestion - summary.goalSuggestion,
                    ),
                  )}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Karsilastirma gorunumu</CardTitle>
              <CardDescription>Kaydedilen urunler artik bos placeholder degil.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 md:grid-cols-3">
                <div className="rounded-2xl border border-ivory-200 bg-ivory-50 p-4">
                  <p className="text-sm text-muted-500">Kayit sayisi</p>
                  <p className="mt-2 text-2xl font-medium text-ink-900">{history.length}</p>
                </div>
                <div className="rounded-2xl border border-ivory-200 bg-ivory-50 p-4">
                  <p className="text-sm text-muted-500">Ortalama net kar</p>
                  <p className="mt-2 text-2xl font-medium text-ink-900">
                    {formatCurrency(comparisonSummary.averageProfit)}
                  </p>
                </div>
                <div className="rounded-2xl border border-ivory-200 bg-ivory-50 p-4">
                  <p className="text-sm text-muted-500">En iyi saatlik kazanc</p>
                  <p className="mt-2 text-2xl font-medium text-ink-900">
                    {formatCurrency(comparisonSummary.bestHourlyIncome)}
                  </p>
                </div>
              </div>

              {history.length > 0 ? (
                <div className="space-y-3">
                  {history.map((item) => (
                    <div
                      key={item.id}
                      className="grid gap-3 rounded-2xl border border-ivory-200 bg-white px-4 py-4 md:grid-cols-[1fr_auto_auto]"
                    >
                      <div>
                        <p className="text-base font-medium text-ink-900">{item.productName}</p>
                        <p className="mt-1 text-sm text-muted-500">
                          {new Date(item.createdAt).toLocaleDateString("tr-TR")} • {item.unitsSold} adet
                        </p>
                      </div>
                      <div className="text-sm text-ink-700">
                        <p>Net kar</p>
                        <p className="mt-1 font-medium text-emerald-700">
                          {formatCurrency(item.summary.netProfit)}
                        </p>
                      </div>
                      <div className="text-sm text-ink-700">
                        <p>Saatlik</p>
                        <p className="mt-1 font-medium text-burgundy">
                          {formatCurrency(item.summary.hourlyIncome)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-500">
                  Ilk hesap kaydedildiginde bu alan urunleri karsilastirmaya baslar.
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Bilgi notu</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-500">
              <p>Bu hesaplama tahmini bir aractir. Vergi, sosyal guvenlik veya yasal yukumlulukleri icermez.</p>
              <p>Amac, emegi ve maliyeti gorunur kilip karar kalitesini artirmaktir.</p>
            </CardContent>
          </Card>
        </div>
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
