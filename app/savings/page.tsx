"use client";

import { useEffect, useMemo, useState } from "react";
import { PiggyBank, Plus } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { loadSavingsState, saveSavingsState } from "@/lib/storage";
import { SavingsGoal, SavingsState } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Toast } from "@/components/ui/toast";

const durationOptions = [
  { label: "3 ay", months: 3 },
  { label: "6 ay", months: 6 },
  { label: "12 ay", months: 12 },
  { label: "24 ay", months: 24 },
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

function daysAgoIso(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
}

function buildWeeklyPlan(target: number, durationMonths: number) {
  const monthly = Math.ceil(target / durationMonths);
  const weekly = Math.ceil(monthly / 4);
  return {
    monthly,
    weekly,
    label: `Haftada ${weekly.toLocaleString("tr-TR")} TL`,
  };
}

function formatContributionLabel(amount: number, createdAt: string) {
  const created = new Date(createdAt);
  const now = new Date();
  const diffDays = Math.max(
    0,
    Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24)),
  );

  if (diffDays === 0) return `bugün, ${amount.toLocaleString("tr-TR")} TL`;
  if (diffDays === 1) return `1 gün önce, ${amount.toLocaleString("tr-TR")} TL`;
  if (diffDays < 7) return `${diffDays} gün önce, ${amount.toLocaleString("tr-TR")} TL`;
  if (diffDays < 14) return `1 hafta önce, ${amount.toLocaleString("tr-TR")} TL`;
  return `${Math.ceil(diffDays / 7)} hafta önce, ${amount.toLocaleString("tr-TR")} TL`;
}

function createGoal(
  id: string,
  title: string,
  current: number,
  target: number,
  durationMonths: number,
  contributionAmount: number,
  contributionDate: string,
  tip: string,
): SavingsGoal {
  return {
    id,
    title,
    current,
    target,
    durationMonths,
    lastContribution: formatContributionLabel(contributionAmount, contributionDate),
    weeklyRhythm: buildWeeklyPlan(target, durationMonths).label,
    tip,
    createdAt: contributionDate,
    updatedAt: contributionDate,
  };
}

const defaultSavingsState: SavingsState = {
  goals: [
    createGoal(
      "goal-1",
      "Acil Durum Param",
      1200,
      6000,
      10,
      100,
      daysAgoIso(3),
      "Bu hedef güven alanını güçlendirmek için öne çıkıyor.",
    ),
    createGoal(
      "goal-2",
      "Yeni Mikser Hedefi",
      2800,
      5000,
      7,
      200,
      daysAgoIso(7),
      "Üretim ekipmanı hedefi görünür oldukça motivasyon artar.",
    ),
    createGoal(
      "goal-3",
      "Kendi Eğitimim",
      450,
      2000,
      6,
      50,
      daysAgoIso(5),
      "Kendi adına hedef, finansal özgüven için güçlü bir sinyal üretir.",
    ),
  ],
  contributions: [
    { goalId: "goal-1", amount: 100, createdAt: daysAgoIso(3) },
    { goalId: "goal-2", amount: 200, createdAt: daysAgoIso(7) },
    { goalId: "goal-3", amount: 50, createdAt: daysAgoIso(5) },
  ],
  updatedAt: new Date().toISOString(),
};

export default function SavingsPage() {
  const [savingsState, setSavingsState] = useState<SavingsState>(defaultSavingsState);
  const [isReady, setIsReady] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [activeContributionGoalId, setActiveContributionGoalId] = useState<string | null>(null);
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);
  const [contributionAmount, setContributionAmount] = useState("100");
  const [toast, setToast] = useState<{
    title: string;
    description?: string;
    tone: "success" | "error" | "warning" | "info";
  } | null>(null);
  const [form, setForm] = useState({
    title: "Kişisel Hedef",
    target: 3000,
    durationMonths: 12,
  });
  const [editForm, setEditForm] = useState({
    title: "",
    target: 0,
    durationMonths: 12,
  });

  useEffect(() => {
    const saved = loadSavingsState();
    if (saved?.goals?.length) {
      setSavingsState(saved);
    } else {
      saveSavingsState(defaultSavingsState);
    }
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) return;
    saveSavingsState(savingsState);
  }, [isReady, savingsState]);

  const totals = useMemo(() => {
    const now = new Date();
    const totalSaved = savingsState.goals.reduce((sum, goal) => sum + goal.current, 0);
    const addedThisMonth = savingsState.contributions
      .filter((entry) => {
        const date = new Date(entry.createdAt);
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
      })
      .reduce((sum, entry) => sum + entry.amount, 0);

    return {
      activeTargets: savingsState.goals.length,
      totalSaved,
      addedThisMonth,
    };
  }, [savingsState]);

  const weeklyPreview = useMemo(
    () => buildWeeklyPlan(form.target, form.durationMonths),
    [form.durationMonths, form.target],
  );

  const updateSavingsState = (updater: (current: SavingsState) => SavingsState) => {
    setSavingsState((current) => ({
      ...updater(current),
      updatedAt: new Date().toISOString(),
    }));
  };

  const handleCreateGoal = () => {
    if (form.target <= 0) {
      setToast({
        title: "Hedef tutarı gerekli",
        description: "0'dan büyük bir hedef tutarı gir.",
        tone: "warning",
      });
      return;
    }

    const createdAt = new Date().toISOString();
    const newGoal: SavingsGoal = {
      id: `goal-${Date.now()}`,
      title: form.title,
      current: 0,
      target: form.target,
      durationMonths: form.durationMonths,
      lastContribution: "Henüz katkı yok",
      weeklyRhythm: weeklyPreview.label,
      tip: "Bu hedef oluşturuldu. İlk küçük katkı ritmi başlatır.",
      createdAt,
      updatedAt: createdAt,
    };

    updateSavingsState((current) => ({
      ...current,
      goals: [...current.goals, newGoal],
    }));

    setShowCreate(false);
    setToast({
      title: "Hedef oluşturuldu",
      description: "Yeni hedef kartı ekranda görünür hale geldi.",
      tone: "success",
    });
  };

  const handleAddContribution = (goalId: string) => {
    const parsedAmount = Number.parseFloat(contributionAmount);
    if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      setToast({
        title: "Katkı tutarı geçersiz",
        description: "0'dan büyük bir tutar gir.",
        tone: "warning",
      });
      return;
    }

    const createdAt = new Date().toISOString();
    updateSavingsState((current) => ({
      ...current,
      goals: current.goals.map((goal) =>
        goal.id === goalId
          ? {
              ...goal,
              current: goal.current + parsedAmount,
              lastContribution: formatContributionLabel(parsedAmount, createdAt),
              updatedAt: createdAt,
            }
          : goal,
      ),
      contributions: [...current.contributions, { goalId, amount: parsedAmount, createdAt }],
    }));

    setActiveContributionGoalId(null);
    setContributionAmount("100");
    setToast({
      title: "Katkı eklendi",
      description: "Hedef ilerlemesi güncellendi.",
      tone: "success",
    });
  };

  const startEditingGoal = (goal: SavingsGoal) => {
    setEditingGoalId(goal.id);
    setEditForm({
      title: goal.title,
      target: goal.target,
      durationMonths: goal.durationMonths,
    });
  };

  const handleSaveGoalEdit = (goalId: string) => {
    if (editForm.target <= 0) {
      setToast({
        title: "Hedef tutarı geçersiz",
        description: "0'dan büyük bir hedef tutarı gir.",
        tone: "warning",
      });
      return;
    }

    updateSavingsState((current) => ({
      ...current,
      goals: current.goals.map((goal) =>
        goal.id === goalId
          ? {
              ...goal,
              title: editForm.title,
              target: editForm.target,
              durationMonths: editForm.durationMonths,
              weeklyRhythm: buildWeeklyPlan(editForm.target, editForm.durationMonths).label,
              tip: "Hedef güncellendi. Ritim yeni plana göre yenilendi.",
              updatedAt: new Date().toISOString(),
            }
          : goal,
      ),
    }));

    setEditingGoalId(null);
    setToast({
      title: "Hedef güncellendi",
      description: "Kart bilgileri yeni planla kaydedildi.",
      tone: "success",
    });
  };

  if (!isReady) return null;

  return (
    <AppShell
      eyebrow="Kumbara"
      title="Kendi Adıma Kumbaralar"
      description="Küçük hedefleri görünür kıl, ritmi koru ve katkılarını kaybetmeden ilerle."
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
              Hedefler ve katkılar cihazında saklanır. Böylece kaldığın yerden devam edebilirsin.
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
        {savingsState.goals.map((goal) => {
          const progress = Math.min(100, Math.round((goal.current / goal.target) * 100));
          return (
            <Card key={goal.id} className="h-full">
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

                {activeContributionGoalId === goal.id ? (
                  <div className="rounded-2xl border border-gold-400/20 bg-ivory-50 p-4">
                    <Input
                      label="Katkı tutarı (TL)"
                      type="number"
                      value={contributionAmount}
                      onChange={(event) => setContributionAmount(event.target.value)}
                    />
                    <div className="mt-3 flex flex-wrap gap-3">
                      <Button size="sm" onClick={() => handleAddContribution(goal.id)}>
                        Kaydet
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setActiveContributionGoalId(null)}>
                        Vazgeç
                      </Button>
                    </div>
                  </div>
                ) : null}

                {editingGoalId === goal.id ? (
                  <div className="rounded-2xl border border-gold-400/20 bg-ivory-50 p-4">
                    <div className="grid gap-4">
                      <Input
                        label="Hedef adı"
                        value={editForm.title}
                        onChange={(event) =>
                          setEditForm((current) => ({ ...current, title: event.target.value }))
                        }
                      />
                      <Input
                        label="Hedef tutarı (TL)"
                        type="number"
                        value={editForm.target}
                        onChange={(event) =>
                          setEditForm((current) => ({
                            ...current,
                            target: Number.parseInt(event.target.value || "0", 10),
                          }))
                        }
                      />
                      <label className="block">
                        <span className="mb-2 block text-sm font-medium text-ink-800">Hedef süresi</span>
                        <select
                          value={editForm.durationMonths}
                          onChange={(event) =>
                            setEditForm((current) => ({
                              ...current,
                              durationMonths: Number.parseInt(event.target.value, 10),
                            }))
                          }
                          className="w-full rounded-2xl border border-ivory-200 bg-white px-4 py-3 text-sm text-ink-900 outline-none transition focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20"
                        >
                          {durationOptions.map((item) => (
                            <option key={item.months} value={item.months}>
                              {item.label}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-3">
                      <Button size="sm" onClick={() => handleSaveGoalEdit(goal.id)}>
                        Kaydet
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setEditingGoalId(null)}>
                        Vazgeç
                      </Button>
                    </div>
                  </div>
                ) : null}

                <div className="flex flex-wrap gap-3">
                  <Button
                    size="sm"
                    onClick={() => {
                      setActiveContributionGoalId(goal.id);
                      setEditingGoalId(null);
                    }}
                  >
                    Katkı ekle
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => startEditingGoal(goal)}>
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
            <p>Aktif hedeflerin için haftalık ritmi güncel tut. Katkı ekledikçe kartlar anında yenilenir.</p>
            <p>Küçük düzenli tutarlar, belirsiz büyük hedeflerden daha sürdürülebilir ilerleme sağlar.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Yeni hedef oluştur</CardTitle>
            <CardDescription>Yeni hedefler mevcut planına eklenir ve aynı cihazda saklanır.</CardDescription>
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
                value={form.durationMonths}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    durationMonths: Number.parseInt(event.target.value, 10),
                  }))
                }
                className="w-full rounded-2xl border border-ivory-200 bg-white px-4 py-3 text-sm text-ink-900 outline-none transition focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20"
              >
                {durationOptions.map((item) => (
                  <option key={item.months} value={item.months}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>

            <div className="md:col-span-2 rounded-2xl border border-gold-400/20 bg-white p-4 text-sm text-ink-700">
              Haftada yaklaşık <strong>{weeklyPreview.weekly} TL</strong> veya ayda{" "}
              <strong>{weeklyPreview.monthly} TL</strong> ayırman gerekir.
            </div>

            <div className="md:col-span-2 flex flex-wrap gap-3">
              <Button onClick={handleCreateGoal}>Hedef oluştur</Button>
              <Button variant="ghost" onClick={() => setShowCreate(false)}>
                Vazgeç
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}

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
