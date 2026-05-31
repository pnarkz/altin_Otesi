"use client";

import { useMemo, useState } from "react";
import { PiggyBank, Plus } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Toast } from "@/components/ui/toast";

type Goal = {
  title: string;
  current: number;
  target: number;
  lastContribution: string;
  weeklyRhythm: string;
  tip: string;
};

const initialGoals: Goal[] = [
  {
    title: "Acil Durum Param",
    current: 1200,
    target: 6000,
    lastContribution: "3 gün önce, 100 TL",
    weeklyRhythm: "Haftada 150 TL",
    tip: "Bu hedef güven alanını güçlendirmek için öne çıkıyor.",
  },
  {
    title: "Yeni Mikser Hedefi",
    current: 2800,
    target: 5000,
    lastContribution: "1 hafta önce, 200 TL",
    weeklyRhythm: "Haftada 180 TL",
    tip: "Üretim ekipmanı hedefi görünür oldukça motivasyon artar.",
  },
  {
    title: "Kendi Eğitimim",
    current: 450,
    target: 2000,
    lastContribution: "5 gün önce, 50 TL",
    weeklyRhythm: "Haftada 90 TL",
    tip: "Kendi adına hedef, finansal özgüven için güçlü bir sinyal üretir.",
  },
];

const targetOptions = [
  "Acil Durum Param",
  "Kendi Eğitimim",
  "Sağlık Güvencem",
  "Çocuğumun Eğitimi",
  "Küçük İş Sermayesi",
  "Borç Kapatma",
  "Kooperatif Üretim Sermayesi",
  "Yeni Malzeme Alma",
  "Kişisel Hedef",
];

const durationOptions = ["3 ay", "6 ay", "12 ay", "24 ay"];

export default function SavingsPage() {
  const [goals, setGoals] = useState(initialGoals);
  const [showCreate, setShowCreate] = useState(false);
  const [toast, setToast] = useState<{
    title: string;
    description?: string;
    tone: "success" | "error" | "warning" | "info";
  } | null>(null);
  const [form, setForm] = useState({
    title: "Kişisel Hedef",
    target: 3000,
    duration: "12 ay",
  });

  const totals = useMemo(() => {
    const totalSaved = goals.reduce((sum, goal) => sum + goal.current, 0);
    return {
      activeTargets: goals.length,
      totalSaved,
      addedThisMonth: 320,
    };
  }, [goals]);

  const weeklyPreview = useMemo(() => {
    const months = Number.parseInt(form.duration, 10) || 12;
    const monthly = Math.ceil(form.target / months);
    const weekly = Math.ceil(monthly / 4);
    return { monthly, weekly };
  }, [form]);

  return (
    <AppShell
      eyebrow="Kumbara"
      title="Kendi Adıma Kumbaralar"
      description="Küçük hedefleri görünür kıl, ritmi koru."
      breadcrumb="Anasayfa → Kumbara"
      icon={<PiggyBank className="h-5 w-5" />}
      ethicNotice="Bu öneri yatırım tavsiyesi değildir. Sadece hedef bazlı birikim farkındalığı içindir."
      aside={
        <Card>
          <CardHeader>
            <CardTitle>Yeni hedef</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="secondary"
              iconLeft={<Plus className="h-4 w-4" />}
              onClick={() => setShowCreate(true)}
            >
              Yeni hedef oluştur
            </Button>
            <p className="text-sm text-muted-500">
              Demo sürümünde hedef kartları yerel state ile güncellenir.
            </p>
          </CardContent>
        </Card>
      }
    >
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="space-y-2 pt-6">
            <p className="text-sm text-muted-500">Aktif hedef</p>
            <p className="text-3xl font-medium text-burgundy">{totals.activeTargets}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-2 pt-6">
            <p className="text-sm text-muted-500">Toplam birikim</p>
            <p className="text-3xl font-medium text-emerald-700">
              {totals.totalSaved.toLocaleString("tr-TR")} TL
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-2 pt-6">
            <p className="text-sm text-muted-500">Bu ay eklenen</p>
            <p className="text-3xl font-medium text-gold-600">
              {totals.addedThisMonth.toLocaleString("tr-TR")} TL
            </p>
          </CardContent>
        </Card>
      </div>

      <section className="grid gap-5 xl:grid-cols-3">
        {goals.map((goal) => {
          const progress = Math.round((goal.current / goal.target) * 100);
          return (
            <Card key={goal.title} className="h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="gold">Hedef</Badge>
                  <Badge variant="neutral">%{progress}</Badge>
                </div>
                <CardTitle>{goal.title}</CardTitle>
                <CardDescription>
                  {goal.current.toLocaleString("tr-TR")} / {goal.target.toLocaleString("tr-TR")} TL
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Progress value={progress} />
                <div className="grid gap-3 text-sm text-ink-700">
                  <div className="rounded-2xl border border-ivory-200 bg-ivory-50 p-4">
                    Son katkı: {goal.lastContribution}
                  </div>
                  <div className="rounded-2xl border border-ivory-200 bg-ivory-50 p-4">
                    Haftalık ritim: {goal.weeklyRhythm}
                  </div>
                  <div className="rounded-2xl border border-ivory-200 bg-white p-4 text-muted-500">
                    {goal.tip}
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button
                    size="sm"
                    onClick={() =>
                      setToast({
                        title: "Katkı ekleme demo",
                        description: "Bu akış demo sürümünde görsel vitrin olarak sunulur.",
                        tone: "info",
                      })
                    }
                  >
                    Katkı ekle
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                      setToast({
                        title: "Düzenleme demo",
                        description: "Hedef düzenleme akışı demo sürümünde hazırlanmıştır.",
                        tone: "info",
                      })
                    }
                  >
                    Düzenle
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.95fr]">
        <Card variant="premium">
          <CardHeader>
            <CardTitle>Haftalık önerilen küçük adım</CardTitle>
            <CardDescription>Önce hedefi görünür kıl, sonra ritmi küçük tut.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-ink-700">
            <p>Acil Durum Param hedefinde bu hafta tek odak görünürlük olsun.</p>
            <p>Hedef kartını açmak bile karar güvenini artıran bir başlangıç adımıdır.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Yeni hedef oluştur</CardTitle>
            <CardDescription>Mock akış yerel state ile çalışır.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="secondary"
              iconLeft={<Plus className="h-4 w-4" />}
              onClick={() => setShowCreate(true)}
            >
              Yeni hedef oluştur
            </Button>
          </CardContent>
        </Card>
      </div>

      {showCreate ? (
        <Card variant="premium">
          <CardHeader>
            <CardTitle>Yeni hedef oluştur</CardTitle>
            <CardDescription>Kendi adına hedefini ve ritmini görünür kıl.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <Input
              label="Hedef adı"
              value={form.title}
              onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
            />
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-ink-800">Hedef türü</span>
              <select
                value={form.title}
                onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                className="w-full rounded-2xl border border-ivory-200 bg-white px-4 py-3 text-sm text-ink-900 outline-none transition focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20"
              >
                {targetOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <Input
              label="Hedef tutarı (TL)"
              type="number"
              value={form.target}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  target: Number.parseInt(event.target.value || "0", 10),
                }))
              }
            />
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-ink-800">Hedef süresi</span>
              <select
                value={form.duration}
                onChange={(event) => setForm((current) => ({ ...current, duration: event.target.value }))}
                className="w-full rounded-2xl border border-ivory-200 bg-white px-4 py-3 text-sm text-ink-900 outline-none transition focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20"
              >
                {durationOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <div className="md:col-span-2 rounded-2xl border border-gold-400/20 bg-white p-4 text-sm text-ink-700">
              Haftada yaklaşık <strong>{weeklyPreview.weekly} TL</strong> veya ayda{" "}
              <strong>{weeklyPreview.monthly} TL</strong> ayırman gerekir.
            </div>

            <div className="md:col-span-2 flex flex-wrap gap-3">
              <Button
                onClick={() => {
                  setGoals((current) => [
                    ...current,
                    {
                      title: form.title,
                      current: 0,
                      target: form.target,
                      lastContribution: "Henüz katkı yok",
                      weeklyRhythm: `Haftada ${weeklyPreview.weekly} TL`,
                      tip: "Bu hedef demo modunda yeni oluşturuldu.",
                    },
                  ]);
                  setShowCreate(false);
                  setToast({
                    title: "Hedef oluşturuldu",
                    description: "Yeni hedef kartı ekranda görünür hale geldi.",
                    tone: "success",
                  });
                }}
              >
                Hedef oluştur
              </Button>
              <Button variant="ghost" onClick={() => setShowCreate(false)}>
                Vazgeç
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}

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
