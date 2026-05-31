"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Building2, Download, Filter } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { Toast } from "@/components/ui/toast";

const topStats = [
  { label: "Toplam Katılımcı", value: "47 kadın" },
  { label: "Test Tamamlama", value: "%94" },
  { label: "Açılan Hedef", value: "38" },
  { label: "Analiz Edilen Mesaj", value: "156" },
];

const impactBars = [
  { label: "Eğitim", value: 72 },
  { label: "Hedef", value: 61 },
  { label: "Kalkan", value: 79 },
  { label: "Üretim", value: 58 },
  { label: "Skor", value: 67 },
];

const scoreTrend = [
  { month: "Oca", score: 36 },
  { month: "Şub", score: 38 },
  { month: "Mar", score: 41 },
  { month: "Nis", score: 44 },
  { month: "May", score: 47 },
  { month: "Haz", score: 49 },
];

const conceptData = [
  { concept: "BES", value: 62 },
  { concept: "Fon", value: 48 },
  { concept: "Likidite", value: 41 },
  { concept: "Kira sertifikası", value: 35 },
  { concept: "Vade", value: 28 },
];

const riskDistribution = [
  { name: "Düşük", value: 45, color: "#16A34A" },
  { name: "Orta", value: 67, color: "#D97706" },
  { name: "Yüksek", value: 32, color: "#B8860B" },
  { name: "Kritik", value: 12, color: "#DC2626" },
];

const productionCategories = [
  { name: "Yemek/Pasta", value: 18 },
  { name: "El İşi", value: 12 },
  { name: "Dikiş", value: 8 },
  { name: "Takı", value: 5 },
  { name: "Diğer", value: 4 },
];

const segments = ["Tümü", "KOBİ Pilot", "Kooperatif", "Çalışan Kadınlar"] as const;

export default function InstitutionPage() {
  const [isDemo, setIsDemo] = useState(false);
  const [segment, setSegment] = useState<(typeof segments)[number]>("Tümü");
  const [toastOpen, setToastOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    setIsDemo(params.get("demo") === "true");
  }, []);

  const segmentSummary = useMemo(() => {
    if (segment === "Kooperatif") return "Kooperatif üyelerinde üretim modülü kullanımı öne çıkıyor.";
    if (segment === "Çalışan Kadınlar") return "Bu segmentte hedef oluşturma ve risk analizi birlikte ilerliyor.";
    if (segment === "KOBİ Pilot") return "Pilot kurumda test tamamlama ve hedef açma oranı birlikte yükselmiş görünüyor.";
    return "Tüm demo segmentlerinde anonim sosyal etki sinyalleri birlikte okunuyor.";
  }, [segment]);

  return (
    <AppShell
      eyebrow="Kurum Paneli — Demo"
      title="Anonim sosyal etki görünümü"
      description="Bireysel veri yok; yalnızca toplulaştırılmış ve anonim demo metrikleri gösterilir."
      breadcrumb="Anasayfa → Kurum Paneli"
      icon={<Building2 className="h-5 w-5" />}
      ethicNotice="Bu panelde bireysel veri yoktur, sadece anonim toplulaştırılmış metrikler gösterilir."
      aside={
        <Card variant="premium">
          <CardHeader>
            <CardTitle>Kurum seçici</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-2xl border border-ivory-200 bg-white px-4 py-3 text-sm text-ink-700">
              Ankara KOBİ Pilot
            </div>
            {isDemo ? <Badge variant="gold">Demo modu</Badge> : null}
          </CardContent>
        </Card>
      }
    >
      <Card>
        <CardContent className="flex flex-col gap-4 py-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-500">
              <Filter className="h-4 w-4" />
              <span className="text-sm">Filtre ve rapor aksiyonları</span>
            </div>
            <p className="text-sm text-ink-700">{segmentSummary}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="flex flex-wrap gap-2">
              {segments.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setSegment(item)}
                  className={`rounded-full border px-4 py-2 text-sm transition ${
                    segment === item
                      ? "border-gold-400 bg-gold-400/10 text-burgundy"
                      : "border-ivory-200 bg-white text-ink-700 hover:border-gold-400"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
            <Button
              variant="ghost"
              iconLeft={<Download className="h-4 w-4" />}
              onClick={() => setToastOpen(true)}
            >
              PDF indir
            </Button>
            <Button
              variant="ghost"
              iconLeft={<Download className="h-4 w-4" />}
              onClick={() => setToastOpen(true)}
            >
              CSV dışa aktar
            </Button>
          </div>
        </CardContent>
      </Card>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {topStats.map((stat) => (
          <StatCard key={stat.label} label={stat.label} value={stat.value} tone="gold" />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <Card variant="premium">
          <CardHeader>
            <CardTitle>AltınÖtesi Sosyal Etki Endeksi</CardTitle>
            <CardDescription>Geçen aya göre +12 puan</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <p className="text-5xl font-medium text-burgundy">67/100</p>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={impactBars}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EBE2CC" />
                  <XAxis dataKey="label" stroke="#737373" />
                  <YAxis stroke="#737373" domain={[0, 100]} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#B8860B" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ortalama skor değişimi</CardTitle>
            <CardDescription>36’dan 49’a çıkan 6 aylık görünüm</CardDescription>
          </CardHeader>
          <CardContent className="h-[340px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={scoreTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EBE2CC" />
                <XAxis dataKey="month" stroke="#737373" />
                <YAxis stroke="#737373" domain={[30, 55]} />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="#0F4F3C" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Zorlanılan kavramlar</CardTitle>
            <CardDescription>En çok tekrar isteyen 5 başlık</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {conceptData.map((item) => (
              <div
                key={item.concept}
                className="flex items-center justify-between rounded-2xl border border-ivory-200 bg-ivory-50 px-4 py-3"
              >
                <span className="text-sm text-ink-700">{item.concept}</span>
                <span className="text-sm font-medium text-burgundy">%{item.value}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Risk dağılımı</CardTitle>
            <CardDescription>Analiz edilen mesajların görünümü</CardDescription>
          </CardHeader>
          <CardContent className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={riskDistribution} dataKey="value" nameKey="name" outerRadius={100}>
                  {riskDistribution.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Üretim kategorileri</CardTitle>
            <CardDescription>Producer modülünde öne çıkan alanlar</CardDescription>
          </CardHeader>
          <CardContent className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productionCategories}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EBE2CC" />
                <XAxis dataKey="name" stroke="#737373" />
                <YAxis stroke="#737373" />
                <Tooltip />
                <Bar dataKey="value" fill="#0F4F3C" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </section>

      <Card variant="premium">
        <CardHeader>
          <CardTitle>Bu panelde bireysel veri yoktur</CardTitle>
          <CardDescription>Minimum grup büyüklüğü 5 kişidir.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {[
            "Hiçbir kullanıcının ismi, kimliği veya bütçe rakamı görünmez.",
            "Minimum grup büyüklüğü 5 kişidir.",
            "Tüm metrikler toplulaştırılmış ve anonimdir.",
            "Kurumlar kişisel veriye erişemez.",
          ].map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-gold-400/20 bg-white px-4 py-4 text-sm text-ink-700"
            >
              {item}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sponsor görünümü</CardTitle>
          <CardDescription>Kurumsal kullanım özet kartı</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-base text-ink-700">
              Bu kurum AltınÖtesi’ni kadın çalışanlarına 6 aydır sunmaktadır.
            </p>
            <p className="mt-2 text-sm text-muted-500">
              Demo sürümünde kurum logosu yer tutucu olarak gösterilir.
            </p>
          </div>
          <div className="grid h-20 w-32 place-items-center rounded-2xl border border-ivory-200 bg-ivory-50 text-sm text-muted-500">
            Kurum logosu
          </div>
        </CardContent>
      </Card>

      <Toast
        open={toastOpen}
        onClose={() => setToastOpen(false)}
        tone="info"
        title="Dışa aktarma demo"
        description="PDF ve CSV aksiyonları bu MVP’de görsel olarak sunulur."
      />
    </AppShell>
  );
}
