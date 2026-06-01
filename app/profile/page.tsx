"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { KeyRound, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { useAppState } from "@/components/providers/app-state-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Toast } from "@/components/ui/toast";
import { DEFAULT_AI_MODEL, maskApiKey } from "@/lib/ai";

export default function ProfilePage() {
  const { aiSettings, authSession, logout, setAiSettings } = useAppState();
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState(DEFAULT_AI_MODEL);
  const [toast, setToast] = useState<{
    title: string;
    description?: string;
    tone: "success" | "error" | "warning" | "info";
  } | null>(null);

  useEffect(() => {
    setApiKey(aiSettings?.apiKey ?? "");
    setModel(aiSettings?.model ?? DEFAULT_AI_MODEL);
  }, [aiSettings]);

  const handleSave = () => {
    if (!apiKey.trim()) {
      setToast({
        title: "API key bos birakilamaz",
        description: "Gercek AI yorumlari icin OpenAI API key gir.",
        tone: "warning",
      });
      return;
    }

    setAiSettings({
      apiKey: apiKey.trim(),
      model: model.trim() || DEFAULT_AI_MODEL,
      updatedAt: new Date().toISOString(),
    });
    setToast({
      title: "AI ayarlari kaydedildi",
      description: "Key bu tarayicida saklandi ve desteklenen modullerde kullanilacak.",
      tone: "success",
    });
  };

  const handleClear = () => {
    setApiKey("");
    setModel(DEFAULT_AI_MODEL);
    setAiSettings(null);
    setToast({
      title: "AI ayarlari temizlendi",
      description: "Uygulama yeniden yerel fallback moduna dondu.",
      tone: "info",
    });
  };

  return (
    <AppShell
      eyebrow="Profil ve AI"
      title="Profil ve AI ayarlari"
      description="OpenAI API key'ini bu cihazda sakla ve AI Koc, Scam Shield ve Producer yorumlarinda kullan."
      breadcrumb="Anasayfa → Profil ve AI"
      icon={<KeyRound className="h-5 w-5" />}
      ethicNotice="API key sadece bu tarayicida saklanir. AltinOtesi AI katmani yatirim tavsiyesi vermez."
      aside={
        <Card>
          <CardHeader>
            <CardTitle>Durum</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {aiSettings?.apiKey ? (
              <>
                <Badge variant="emerald">Bagli</Badge>
                <p className="text-sm text-muted-500">{maskApiKey(aiSettings.apiKey)}</p>
                <p className="text-sm text-muted-500">Model: {aiSettings.model}</p>
              </>
            ) : (
              <>
                <Badge variant="neutral">Yerel mod</Badge>
                <p className="text-sm text-muted-500">
                  Key girilmediginde uygulama kural bazli ve yerel yorumlarla calisir.
                </p>
              </>
            )}
          </CardContent>
        </Card>
      }
    >
      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Card variant="premium">
          <CardHeader>
            <CardTitle>OpenAI baglantisi</CardTitle>
            <CardDescription>
              API key kaydedildiginde AI Koc, dolandiricilik yorumu ve uretim butce yorumu
              gercek model cevabiyla calisir.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <Input
              label="OpenAI API key"
              type="password"
              value={apiKey}
              onChange={(event) => setApiKey(event.target.value)}
              placeholder="sk-..."
              helper="Key bu cihazin local storage alaninda tutulur."
            />
            <Input
              label="Model"
              value={model}
              onChange={(event) => setModel(event.target.value)}
              placeholder={DEFAULT_AI_MODEL}
              helper="Varsayilan model: gpt-4o-mini"
            />
            <div className="flex flex-wrap gap-3">
              <Button onClick={handleSave}>Kaydet</Button>
              <Button variant="ghost" onClick={handleClear}>
                Temizle
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Oturum</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-ink-700">
              <p className="font-medium text-ink-900">
                {authSession?.organizationName ?? authSession?.displayName ?? "Misafir"}
              </p>
              <p>{authSession?.role === "corporate" ? "Kurumsal hesap" : "Bireysel hesap"}</p>
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => {
                  logout();
                  window.location.href = "/";
                }}
              >
                Cikis yap
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-700" />
                <CardTitle>Kullanim bicimi</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-ink-700">
              <p>AI Koc: serbest sorulara profil baglaminla yanit verir.</p>
              <p>Scam Shield: kural bazli risk sonucunu sade dille yorumlar.</p>
              <p>Evden Ureten: kar ve maliyet tablosuna gore butce yorumu uretir.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Hizli gecis</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              <Link href="/coach">
                <Button variant="ghost" className="w-full">
                  AI Koc ekranina git
                </Button>
              </Link>
              <Link href="/scam-shield">
                <Button variant="ghost" className="w-full">
                  Scam Shield ekranina git
                </Button>
              </Link>
              <Link href="/producer">
                <Button variant="ghost" className="w-full">
                  Producer ekranina git
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

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
