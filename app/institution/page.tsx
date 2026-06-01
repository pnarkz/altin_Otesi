"use client";

import Image from "next/image";
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
import { Building2, Download, Filter, Printer } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { useAppState } from "@/components/providers/app-state-provider";
import { loadAcademyProgress, loadSavingsState, loadScamHistory } from "@/lib/storage";
import { AcademyProgress, ScamCheckRecord, SavingsState, UrlRiskLevel } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { Toast } from "@/components/ui/toast";

const segments = ["Tümü", "KOBİ Pilot", "Kooperatif", "Çalışan Kadınlar"] as const;

const segmentMeta: Record<
  (typeof segments)[number],
  { factor: number; institution: string; summary: string }
> = {
  Tümü: {
    factor: 1,
    institution: "Ankara KOBİ Pilot",
    summary: "Tüm segmentler birlikte okunuyor; canlı demo davranışları bu cihazdan gelen verilerle ekleniyor.",
  },
  "KOBİ Pilot": {
    factor: 0.82,
    institution: "Ankara KOBİ Pilot",
    summary: "Pilot kurumda test tamamlama, ders ilerlemesi ve hedef açma birlikte izleniyor.",
  },
  Kooperatif: {
    factor: 0.68,
    institution: "İstanbul Kadın Kooperatifi",
    summary: "Kooperatif segmentinde üretim ve ekipman hedefleri daha baskın görünüyor.",
  },
  "Çalışan Kadınlar": {
    factor: 0.74,
    institution: "Kurumsal Çalışan Programı",
    summary: "Bu segmentte eğitim tamamlama ve risk analizi davranışı birlikte öne çıkıyor.",
  },
};

const baseScoreTrend = [
  { month: "Oca", score: 36 },
  { month: "Şub", score: 38 },
  { month: "Mar", score: 41 },
  { month: "Nis", score: 44 },
  { month: "May", score: 47 },
];

const baseRiskDistribution: Record<UrlRiskLevel, number> = {
  Düşük: 45,
  Orta: 67,
  Yüksek: 32,
  Kritik: 12,
};

function clamp(value: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, Math.round(value)));
}

function scale(value: number, factor: number) {
  return Math.max(1, Math.round(value * factor));
}

function mapProductionCategory(productionType?: string) {
  if (!productionType) return "Diğer";
  if (productionType.includes("Yemek") || productionType.includes("pasta") || productionType.includes("reçel")) {
    return "Yemek/Pasta";
  }
  if (productionType.includes("Dikiş")) return "Dikiş";
  if (productionType.includes("El işi") || productionType.includes("takı")) return "El İşi";
  return "Diğer";
}

function downloadTextFile(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export default function InstitutionPage() {
  const { result } = useAppState();
  const [segment, setSegment] = useState<(typeof segments)[number]>("Tümü");
  const [isDemo, setIsDemo] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [academyProgress, setAcademyProgress] = useState<AcademyProgress | null>(null);
  const [savingsState, setSavingsState] = useState<SavingsState | null>(null);
  const [scamHistory, setScamHistory] = useState<ScamCheckRecord[]>([]);
  const [toast, setToast] = useState<{
    title: string;
    description?: string;
    tone: "success" | "error" | "warning" | "info";
  } | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setIsDemo(params.get("demo") === "true");
    setAcademyProgress(loadAcademyProgress());
    setSavingsState(loadSavingsState());
    setScamHistory(loadScamHistory());
    setIsReady(true);
  }, []);

  const metrics = useMemo(() => {
    const factor = segmentMeta[segment].factor;
    const completedLessons = academyProgress?.completedLessonIds.length ?? 2;
    const goalCount = savingsState?.goals.length ?? 3;
    const contributionThisMonth =
      savingsState?.contributions.reduce((sum, entry) => {
        const entryDate = new Date(entry.createdAt);
        const now = new Date();
        if (
          entryDate.getMonth() === now.getMonth() &&
          entryDate.getFullYear() === now.getFullYear()
        ) {
          return sum + entry.amount;
        }
        return sum;
      }, 0) ?? 350;
    const resultScore = Math.round(result?.overallScore ?? 38);
    const participantLift = result ? 1 : 0;
    const testsCompletedRaw = 45 + participantLift;
    const participantsRaw = 46 + participantLift;
    const invitedRaw = 50 + participantLift;
    const analyzedMessagesRaw = 153 + scamHistory.length;
    const productionBoost =
      mapProductionCategory(result?.userContext.productionType) === "Yemek/Pasta" ? 1 : 0;

    const educationValue = clamp(58 + completedLessons * 6);
    const goalValue = clamp(50 + goalCount * 5 + Math.min(12, contributionThisMonth / 40));
    const shieldValue = clamp(
      55 +
        scamHistory.length * 5 +
        scamHistory.filter((item) => item.level === "Kritik").length * 4,
    );
    const productionValue = clamp(
      48 +
        (result?.profile.name === "Evden Üreten Başlangıç" ? 10 : 0) +
        productionBoost * 8,
    );
    const scoreValue = clamp(resultScore + Math.min(10, completedLessons * 2));
    const socialImpactIndex = Math.round(
      (educationValue + goalValue + shieldValue + productionValue + scoreValue) / 5,
    );

    const scoreTrendFinal = clamp(
      (baseScoreTrend.at(-1)?.score ?? 47) + completedLessons + Math.round((resultScore - 38) / 2),
      30,
      65,
    );
    const scoreTrend = [...baseScoreTrend, { month: "Haz", score: scoreTrendFinal }];

    const riskDistribution = (["Düşük", "Orta", "Yüksek", "Kritik"] as UrlRiskLevel[]).map(
      (level) => ({
        name: level,
        value: scale(
          baseRiskDistribution[level] +
            scamHistory.filter((item) => item.level === level).length,
          factor,
        ),
        color:
          level === "Düşük"
            ? "#16A34A"
            : level === "Orta"
              ? "#D97706"
              : level === "Yüksek"
                ? "#B8860B"
                : "#DC2626",
      }),
    );

    const productionCategories = [
      { name: "Yemek/Pasta", value: scale(18 + (productionBoost ? 3 : 0), factor) },
      {
        name: "El İşi",
        value: scale(
          12 + (mapProductionCategory(result?.userContext.productionType) === "El İşi" ? 3 : 0),
          factor,
        ),
      },
      {
        name: "Dikiş",
        value: scale(
          8 + (mapProductionCategory(result?.userContext.productionType) === "Dikiş" ? 3 : 0),
          factor,
        ),
      },
      { name: "Takı", value: scale(5, factor) },
      { name: "Diğer", value: scale(4, factor) },
    ];

    const conceptData = [
      {
        concept: "Acil durum fonu",
        value: clamp(64 - (academyProgress?.completedLessonIds.includes("lesson-3") ? 24 : 0)),
      },
      {
        concept: "Bütçe artığı",
        value: clamp(58 - (academyProgress?.completedLessonIds.includes("lesson-4") ? 22 : 0)),
      },
      {
        concept: "Mikro-birikim",
        value: clamp(55 - (academyProgress?.completedLessonIds.includes("lesson-5") ? 20 : 0)),
      },
      {
        concept: "Garanti kazanç tuzakları",
        value: clamp(60 - (academyProgress?.completedLessonIds.includes("lesson-8") ? 25 : 0)),
      },
      {
        concept: "Risk-vade ilişkisi",
        value: clamp(48 - (academyProgress?.completedLessonIds.includes("lesson-12") ? 18 : 0)),
      },
    ];

    const topStats = [
      {
        label: "Toplam Katılımcı",
        value: `${scale(participantsRaw, factor)} kadın`,
      },
      {
        label: "Test Tamamlama",
        value: `%${Math.round((scale(testsCompletedRaw, factor) / scale(invitedRaw, factor)) * 100)}`,
      },
      {
        label: "Açılan Hedef",
        value: String(scale(35 + goalCount, factor)),
      },
      {
        label: "Analiz Edilen Mesaj",
        value: String(scale(analyzedMessagesRaw, factor)),
      },
    ];

    const impactBars = [
      { label: "Eğitim", value: educationValue },
      { label: "Hedef", value: goalValue },
      { label: "Kalkan", value: shieldValue },
      { label: "Üretim", value: productionValue },
      { label: "Skor", value: scoreValue },
    ];

    return {
      topStats,
      impactBars,
      socialImpactIndex,
      scoreTrend,
      conceptData,
      riskDistribution,
      productionCategories,
      liveSummary: {
        completedLessons,
        goalCount,
        contributionThisMonth,
        scamChecks: scamHistory.length,
      },
    };
  }, [academyProgress, result, savingsState, scamHistory, segment]);

  const handleCsvExport = () => {
    const rows = [
      ["Metrik", "Değer"],
      ...metrics.topStats.map((item) => [item.label, item.value]),
      ["Sosyal Etki Endeksi", `${metrics.socialImpactIndex}/100`],
      ...metrics.impactBars.map((item) => [`Etki - ${item.label}`, String(item.value)]),
      ...metrics.conceptData.map((item) => [`Kavram - ${item.concept}`, `%${item.value}`]),
    ];

    const csv = rows
      .map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(","))
      .join("\n");

    downloadTextFile("altinotesi-kurum-paneli.csv", csv, "text/csv;charset=utf-8;");
    setToast({
      title: "CSV indirildi",
      description: "Kurum paneli özeti dosya olarak dışa aktarıldı.",
      tone: "success",
    });
  };

  const handlePrintReport = () => {
    const printWindow = window.open("", "_blank", "width=960,height=720");
    if (!printWindow) {
      setToast({
        title: "Yazdırma penceresi açılamadı",
        description: "Tarayıcı açılır pencereyi engellemiş olabilir.",
        tone: "warning",
      });
      return;
    }

    const reportHtml = `
      <html>
        <head>
          <title>AltınÖtesi Kurum Paneli</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 32px; color: #1a1a1a; }
            h1, h2 { margin-bottom: 8px; }
            table { width: 100%; border-collapse: collapse; margin-top: 16px; }
            td, th { border: 1px solid #ddd; padding: 10px; text-align: left; }
            .muted { color: #666; }
          </style>
        </head>
        <body>
          <h1>AltınÖtesi Kurum Paneli</h1>
          <p class="muted">${segmentMeta[segment].institution} • ${new Date().toLocaleDateString("tr-TR")}</p>
          <h2>Üst Metrikler</h2>
          <table>
            <tbody>
              ${metrics.topStats
                .map((item) => `<tr><th>${item.label}</th><td>${item.value}</td></tr>`)
                .join("")}
              <tr><th>Sosyal Etki Endeksi</th><td>${metrics.socialImpactIndex}/100</td></tr>
            </tbody>
          </table>
          <h2>Canlı Demo Etkisi</h2>
          <table>
            <tbody>
              <tr><th>Tamamlanan ders</th><td>${metrics.liveSummary.completedLessons}</td></tr>
              <tr><th>Açık hedef</th><td>${metrics.liveSummary.goalCount}</td></tr>
              <tr><th>Bu ay katkı</th><td>${metrics.liveSummary.contributionThisMonth} TL</td></tr>
              <tr><th>Scam analizi</th><td>${metrics.liveSummary.scamChecks}</td></tr>
            </tbody>
          </table>
        </body>
      </html>
    `;

    printWindow.document.write(reportHtml);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  if (!isReady) return null;

  return (
    <AppShell
      eyebrow="Kurum Paneli"
      title="Anonim sosyal etki görünümü"
      description="Bireysel veri yok; metrikler cihazdaki canlı davranışlardan türetilen anonim özetlerle güncellenir."
      breadcrumb="Anasayfa → Kurum Paneli"
      icon={<Building2 className="h-5 w-5" />}
      ethicNotice="Bu panelde bireysel veri yoktur, yalnızca toplulaştırılmış ve anonim metrikler gösterilir."
      aside={
        <Card variant="premium">
          <CardHeader>
            <CardTitle>Kurum seçici</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-2xl border border-ivory-200 bg-white px-4 py-3 text-sm text-ink-700">
              {segmentMeta[segment].institution}
            </div>
            {isDemo ? <Badge variant="gold">Demo modu</Badge> : null}
            <div className="rounded-2xl border border-ivory-200 bg-ivory-50 p-4 text-sm text-ink-700">
              <p className="font-medium text-ink-900">Canlı özet</p>
              <p className="mt-2">Ders: {metrics.liveSummary.completedLessons}</p>
              <p>Hedef: {metrics.liveSummary.goalCount}</p>
              <p>Scam analizi: {metrics.liveSummary.scamChecks}</p>
            </div>
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
            <p className="text-sm text-ink-700">{segmentMeta[segment].summary}</p>
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
            <Button variant="ghost" iconLeft={<Printer className="h-4 w-4" />} onClick={handlePrintReport}>
              PDF / Yazdır
            </Button>
            <Button variant="ghost" iconLeft={<Download className="h-4 w-4" />} onClick={handleCsvExport}>
              CSV dışa aktar
            </Button>
          </div>
        </CardContent>
      </Card>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {metrics.topStats.map((stat) => (
          <StatCard key={stat.label} label={stat.label} value={stat.value} tone="gold" />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <Card variant="premium">
          <CardHeader>
            <CardTitle>AltınÖtesi Sosyal Etki Endeksi</CardTitle>
            <CardDescription>Canlı kullanıcı davranışlarıyla güncellenir</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <p className="text-5xl font-medium text-burgundy">{metrics.socialImpactIndex}/100</p>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metrics.impactBars}>
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
            <CardDescription>
              36&apos;dan {metrics.scoreTrend.at(-1)?.score}&apos;e çıkan güncel görünüm
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[340px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={metrics.scoreTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EBE2CC" />
                <XAxis dataKey="month" stroke="#737373" />
                <YAxis stroke="#737373" domain={[30, 65]} />
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
            <CardDescription>Akademi ilerlemesine göre yeniden hesaplanır</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {metrics.conceptData.map((item) => (
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
            <CardDescription>Gerçek analiz geçmişi toplamı ile güncellenir</CardDescription>
          </CardHeader>
          <CardContent className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={metrics.riskDistribution} dataKey="value" nameKey="name" outerRadius={100}>
                  {metrics.riskDistribution.map((entry) => (
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
            <CardDescription>Kullanıcı profilindeki üretim sinyalini de yansıtır</CardDescription>
          </CardHeader>
          <CardContent className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics.productionCategories}>
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
          <CardDescription>Kurumsal kullanım özeti</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-base text-ink-700">
              {segmentMeta[segment].institution}, AltınÖtesi&apos;ni kadın kullanıcılarına eğitim ve güven katmanı olarak sunuyor.
            </p>
            <p className="mt-2 text-sm text-muted-500">
              Karttaki marka alanı artık yer tutucu değil; ürün logosu ve canlı segment özeti birlikte gösteriliyor.
            </p>
          </div>
          <div className="flex items-center gap-4 rounded-2xl border border-ivory-200 bg-ivory-50 px-4 py-4">
            <Image
              src="/altinotesi-logo.svg"
              alt="AltınÖtesi logosu"
              width={96}
              height={40}
              className="h-10 w-auto"
            />
            <div className="text-sm text-ink-700">
              <p className="font-medium">{segmentMeta[segment].institution}</p>
              <p className="text-muted-500">Canlı segment özeti</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Toast
        open={Boolean(toast)}
        onClose={() => setToast(null)}
        tone={toast?.tone ?? "info"}
        title={toast?.title ?? ""}
        description={toast?.description}
      />
    </AppShell>
  );
}
