"use client";

import { useMemo, useState } from "react";
import { Package } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MetricCard } from "@/components/ui/metric-card";
import { Toast } from "@/components/ui/toast";
import { formatCurrency } from "@/lib/format";
import { calculateProducerSummary } from "@/lib/producer";

const defaultForm = {
  productName: "Çilek reçeli",
  salePrice: 120,
  unitsSold: 12,
  materialCost: 780,
  packagingCost: 60,
  shippingCost: 0,
  laborHours: 8,
};

export default function ProducerPage() {
  const [form, setForm] = useState(defaultForm);
  const [toast, setToast] = useState<{
    title: string;
    description?: string;
    tone: "success" | "error" | "warning" | "info";
  } | null>(null);

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

  const setNumericField = (key: keyof typeof defaultForm, value: string) => {
    const parsed = Number.parseFloat(value);
    if (parsed < 0) {
      setToast({
        title: "Negatif değer kullanılamaz",
        description: "Lütfen 0 veya daha büyük bir değer gir.",
        tone: "warning",
      });
      return;
    }

    setForm((current) => ({
      ...current,
      [key]: Number.isNaN(parsed) ? 0 : parsed,
    }));
  };

  return (
    <AppShell
      eyebrow="Evden Üreten Kadın"
      title="Üretim gelirini görünür kıl"
      description="Net kârı ve gider yapısını tek ekranda gör. Bu modül yatırım tavsiyesi vermez."
      breadcrumb="Anasayfa → Evden Üretim"
      icon={<Package className="h-5 w-5" />}
      ethicNotice="Bu hesaplama gelir-gider farkındalığı içindir, vergi ve yasal yükümlülük hesaplaması değildir."
      aside={
        <Card>
          <CardHeader>
            <CardTitle>Net kâr</CardTitle>
            <CardDescription>Hızlı görünüm</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-medium text-emerald-700">{formatCurrency(summary.netProfit)}</p>
            <p className="mt-2 text-sm text-muted-500">
              Saatlik kazanç: {formatCurrency(summary.hourlyIncome)}
            </p>
          </CardContent>
        </Card>
      }
    >
      <section className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <Card variant="premium">
          <CardHeader>
            <CardTitle>Ürün bilgileri</CardTitle>
            <CardDescription>Varsayılan örnek: Çilek reçeli</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Ürün adı"
              value={form.productName}
              onChange={(event) => setForm((current) => ({ ...current, productName: event.target.value }))}
              className="sm:col-span-2"
            />
            <Input label="Satış fiyatı (TL)" type="number" value={form.salePrice} onChange={(event) => setNumericField("salePrice", event.target.value)} />
            <Input label="Satılan adet" type="number" value={form.unitsSold} onChange={(event) => setNumericField("unitsSold", event.target.value)} />
            <Input label="Malzeme maliyeti (TL)" type="number" value={form.materialCost} onChange={(event) => setNumericField("materialCost", event.target.value)} />
            <Input label="Ambalaj gideri (TL)" type="number" value={form.packagingCost} onChange={(event) => setNumericField("packagingCost", event.target.value)} />
            <Input label="Kargo gideri (TL)" type="number" value={form.shippingCost} onChange={(event) => setNumericField("shippingCost", event.target.value)} />
            <Input label="Tahmini emek süresi (saat)" type="number" value={form.laborHours} onChange={(event) => setNumericField("laborHours", event.target.value)} />
            <div className="sm:col-span-2 flex flex-wrap gap-3 pt-2">
              <Button
                onClick={() => {
                  setToast({
                    title: "Hesap güncellendi",
                    description: "Sonuç kartları yenilendi.",
                    tone: "success",
                  });
                }}
              >
                Hesapla
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setForm(defaultForm);
                }}
              >
                Yeni ürün
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card variant="premium">
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-500">Ana sonuç</p>
              <p className="text-5xl font-medium text-emerald-700">{formatCurrency(summary.netProfit)}</p>
              <p className="text-base text-ink-700">{form.productName} için bu haftalık net kârın</p>
              {summary.netProfit < 0 ? (
                <div className="rounded-2xl border border-danger-500/20 bg-danger-100 px-4 py-3 text-sm text-danger-500">
                  Bu üretim zararla sonuçlanmış. Maliyetleri düşürmek için olası alanları kontrol edebilirsin.
                </div>
              ) : null}
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <MetricCard label="Toplam Gelir" value={formatCurrency(summary.totalRevenue)} detail="Satış fiyatı x satılan adet" />
            <MetricCard label="Toplam Gider" value={formatCurrency(summary.totalCost)} detail="Malzeme, ambalaj ve kargo toplamı" />
            <MetricCard label="Saatlik Kazanç" value={formatCurrency(summary.hourlyIncome)} detail="Net kâr / emek süresi" />
            <MetricCard label="Marj" value={`%${margin}`} detail="Net kâr / toplam gelir oranı" />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Bu kârla neler düşünebilirsin?</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-success-500/20 bg-success-100 p-4">
                <p className="text-sm text-muted-500">Malzeme yenileme</p>
                <p className="mt-3 text-2xl font-medium text-emerald-700">{formatCurrency(summary.restockSuggestion)}</p>
              </div>
              <div className="rounded-2xl border border-gold-400/30 bg-gold-400/10 p-4">
                <p className="text-sm text-muted-500">Kendi birikim hedefin</p>
                <p className="mt-3 text-2xl font-medium text-burgundy">{formatCurrency(summary.goalSuggestion)}</p>
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
            <CardContent className="pt-0 text-sm text-ink-700">
              Net kârının bir kısmını malzeme yenilemeye, bir kısmını kendi hedefin için ayırmayı düşünebilirsin.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Karşılaştırma görünümü</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-500">
              Şu ana kadar 1 ürün hesabı yaptın. İleride bu alan geçmiş ürünleri kıyaslamak için kullanılacak.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Bilgi notu</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-500">
              <p>Bu hesaplama tahmini bir araçtır. Vergi, sosyal güvenlik veya yasal yükümlülükleri içermez.</p>
              <p>İleride üretim takvimi, malzeme stoğu ve kooperatif satış kanalları da eklenebilir.</p>
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
