"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { BrainCircuit, MessageCircle, ShieldAlert } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { useAppState } from "@/components/providers/app-state-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Toast } from "@/components/ui/toast";
import {
  buildLocalCoachReply,
  CoachAiPayload,
  DEFAULT_AI_MODEL,
  requestAiResponse,
} from "@/lib/ai";
import {
  loadAcademyProgress,
  loadCoachMessages,
  loadProducerHistory,
  loadSavingsState,
  loadScamHistory,
  saveCoachMessages,
} from "@/lib/storage";
import { CoachMessage, CoachReply, ToastTone } from "@/types";

const individualStarterPrompts = [
  "Enflasyon ev butcemi nasil etkiler?",
  "Acil durum fonunu kucuk adimlarla nasil kurabilirim?",
  "Supheli bir link gordugumde ilk neyi kontrol etmeliyim?",
  "Evde urettigim bir urunun kari neden bazen gorundugunden dusuk cikiyor?",
];

const corporateStarterPrompts = [
  "Calisanlara phishing farkindaligini nasil anlatmaliyim?",
  "Kurumsal AI Koc ile haftalik farkindalik dili nasil kurulur?",
  "Calisan gelisimini anonim metriklerle nasil yorumlamaliyim?",
  "Kurumsal Kalkan ciktisini yoneticilere nasil ozetlemeliyim?",
];

function buildWelcomeMessage(isCorporate: boolean): CoachMessage {
  return {
    id: "welcome",
    role: "assistant",
    text: isCorporate
      ? "Merhaba. Burada kurum tarafindan calisan gelisimi, farkindalik dili ve dolandiricilik risk iletisimini sade dille aciklarim. Belirli yatirim urunu veya alim-satim tavsiyesi vermem."
      : "Merhaba. Burada finansal kavramlari sade dille aciklarim, ama belirli yatirim urunu veya alim-satim tavsiyesi vermem. Sorunu tek bir durum veya ornek uzerinden sorarsan daha net yardimci olurum.",
    createdAt: new Date(0).toISOString(),
  };
}

function buildCoachPayload(
  question: string,
  messages: CoachMessage[],
  result: ReturnType<typeof useAppState>["result"],
  viewerRole: "individual" | "corporate",
  organizationName?: string,
): CoachAiPayload {
  return {
    question,
    messages,
    result,
    viewerRole,
    organizationName,
    academyProgress: loadAcademyProgress(),
    savingsState: loadSavingsState(),
    scamHistory: loadScamHistory(),
    producerHistory: loadProducerHistory(),
  };
}

export default function CoachPage() {
  const { aiSettings, authSession, result } = useAppState();
  const isCorporate = authSession?.role === "corporate";
  const starterPrompts = isCorporate ? corporateStarterPrompts : individualStarterPrompts;
  const welcomeMessage = useMemo(() => buildWelcomeMessage(isCorporate), [isCorporate]);
  const [messages, setMessages] = useState<CoachMessage[]>([buildWelcomeMessage(false)]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [historyReady, setHistoryReady] = useState(false);
  const [followUps, setFollowUps] = useState<string[]>(starterPrompts.slice(0, 2));
  const [caution, setCaution] = useState(
    "Belirli bir yatirim urunu, alim-satim zamani veya garanti getiri onerisi vermem.",
  );
  const [toast, setToast] = useState<{
    title: string;
    description?: string;
    tone: ToastTone;
  } | null>(null);

  useEffect(() => {
    const savedMessages = loadCoachMessages();
    if (savedMessages.length > 0) {
      setMessages(savedMessages);
    } else {
      setMessages([welcomeMessage]);
    }
    setHistoryReady(true);
  }, [welcomeMessage]);

  useEffect(() => {
    if (!historyReady) return;
    saveCoachMessages(messages);
  }, [historyReady, messages]);

  const profileSummary = useMemo(() => {
    if (isCorporate) {
      return `${authSession?.organizationName ?? "A Bankasi"} • kurumsal farkindalik ve calisan gelisimi`;
    }

    if (!result) return "Test sonucu yok. Genel finansal farkindalik modunda calisiyorum.";

    return `${result.profile.name} • ${result.profile.primaryNeed}`;
  }, [authSession?.organizationName, isCorporate, result]);

  const sendQuestion = async (rawQuestion: string) => {
    const trimmed = rawQuestion.trim();
    if (!trimmed || loading) return;

    const userMessage: CoachMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text: trimmed,
      createdAt: new Date().toISOString(),
    };
    const nextMessages = [...messages, userMessage];
    const payload = buildCoachPayload(
      trimmed,
      nextMessages,
      result,
      isCorporate ? "corporate" : "individual",
      authSession?.organizationName,
    );

    setMessages(nextMessages);
    setQuestion("");
    setLoading(true);

    let reply: CoachReply;

    try {
      if (aiSettings?.apiKey) {
        reply = await requestAiResponse("coach", aiSettings, payload);
      } else {
        reply = buildLocalCoachReply(payload);
      }
    } catch (error) {
      reply = buildLocalCoachReply(payload);
      setToast({
        title: "AI istegi yerel moda dustu",
        description:
          error instanceof Error
            ? error.message
            : "OpenAI baglantisi kurulamadi, yerel yorum kullanildi.",
        tone: "warning",
      });
    }

    const assistantMessage: CoachMessage = {
      id: `assistant-${Date.now()}`,
      role: "assistant",
      text: reply.answer,
      createdAt: new Date().toISOString(),
    };

    setMessages((current) => [...current, assistantMessage]);
    setFollowUps(reply.followUps);
    setCaution(reply.caution);
    setLoading(false);
  };

  return (
    <AppShell
      eyebrow={isCorporate ? "Kurumsal AI Koc" : "AI Koç"}
      title={isCorporate ? "Kurumsal Finans ve Farkindalik Kocu" : "AI Finans Koçu"}
      description={
        isCorporate
          ? "Kurum bilgileri, calisan gelisimi ve farkindalik akisina gore yorum yapar."
          : "Profiline ve uygulama icindeki ilerlemene bakarak sade Turkce ile yorum yapar."
      }
      breadcrumb="Anasayfa → AI Koç"
      icon={<MessageCircle className="h-5 w-5" />}
      ethicNotice="AI Koc egitim ve farkindalik amaclidir. Yatirim kararlari icin yetkili finans kuruluslarina basvurun."
      aside={
        <Card>
          <CardHeader>
            <CardTitle>Baglanti durumu</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {aiSettings?.apiKey ? (
              <>
                <Badge variant="emerald">OpenAI bagli</Badge>
                <p className="text-sm text-muted-500">Model: {aiSettings.model || DEFAULT_AI_MODEL}</p>
              </>
            ) : (
              <>
                <Badge variant="neutral">Yerel fallback</Badge>
                <p className="text-sm text-muted-500">
                  Profil ve AI ekranindan key eklediginde gercek model yorumu acilir.
                </p>
                <Link href="/profile" className="text-sm font-medium text-burgundy">
                  Profil ve AI ayarlarina git
                </Link>
              </>
            )}
          </CardContent>
        </Card>
      }
    >
      <Card className="border-warning-500/20 bg-warning-100/70">
        <CardContent className="grid gap-3 py-5 md:grid-cols-2 xl:grid-cols-4">
          {[
            "Belirli yatirim urunu onermez",
            "Sunu al, bunu sat demez",
            "Garanti getiri vaat etmez",
            "Riskli mesajlari sorgulamayi onerir",
          ].map((item) => (
            <div key={item} className="flex items-center gap-3">
              <ShieldAlert className="h-5 w-5 text-warning-500" />
              <span className="text-sm text-ink-700">{item}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Onerilen baslangic sorulari</CardTitle>
              <CardDescription>Profil ve modullere uygun giris noktasi</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {starterPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => void sendQuestion(prompt)}
                  className="w-full rounded-2xl border border-ivory-200 bg-ivory-50 px-4 py-4 text-left text-sm transition hover:border-gold-400 hover:bg-white"
                >
                  {prompt}
                </button>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <BrainCircuit className="h-5 w-5 text-emerald-700" />
                <CardTitle>Aktif baglam</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-ink-700">
              <p>{profileSummary}</p>
              <p className="rounded-2xl border border-ivory-200 bg-ivory-50 p-4 text-muted-500">
                Bu ekran, test profilini ve diger modullerdeki ilerlemeyi sohbetin tonuna dahil
                eder.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card variant="premium">
          <CardHeader>
            <CardTitle>Canli sohbet</CardTitle>
            <CardDescription>Her soru yeni bir toast yerine gercek konusmaya eklenir.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="max-h-[520px] space-y-4 overflow-y-auto pr-1">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`rounded-2xl px-4 py-4 text-sm leading-relaxed ${
                    message.role === "user"
                      ? "border border-ivory-200 bg-white text-ink-700"
                      : "border border-gold-400/25 bg-ivory-50 text-ink-700"
                  }`}
                >
                  <p className="mb-2 font-medium">
                    {message.role === "user" ? "Kullanici" : "AltinOtesi Kocu"}
                  </p>
                  <p className="whitespace-pre-line">{message.text}</p>
                </div>
              ))}
              {loading ? (
                <div className="rounded-2xl border border-gold-400/25 bg-ivory-50 px-4 py-4 text-sm text-muted-500">
                  AI cevap hazirlaniyor...
                </div>
              ) : null}
            </div>

            <div className="rounded-2xl border border-ivory-200 bg-white p-4">
              <p className="text-sm font-medium text-ink-900">Sonraki sorular</p>
              <div className="mt-3 grid gap-2 md:grid-cols-2">
                {followUps.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => void sendQuestion(item)}
                    className="rounded-2xl border border-ivory-200 bg-ivory-50 px-4 py-3 text-left text-sm text-ink-700 transition hover:border-gold-400 hover:bg-white"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-warning-500/20 bg-warning-100/70 p-4 text-sm text-ink-700">
              {caution}
            </div>

            <Textarea
              label="Yeni soru sor"
              placeholder="Ornek: Bu ay artan market giderini nereden okumaliyim?"
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              className="min-h-[120px]"
            />
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => void sendQuestion(question)} loading={loading}>
                Gonder
              </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setMessages([welcomeMessage]);
                  setFollowUps(starterPrompts.slice(0, 2));
                  setCaution(
                    "Belirli bir yatirim urunu, alim-satim zamani veya garanti getiri onerisi vermem.",
                  );
                }}
              >
                Sohbeti sifirla
              </Button>
            </div>
          </CardContent>
        </Card>
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
