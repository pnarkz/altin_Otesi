"use client";

import { useMemo, useState } from "react";
import { MessageCircle, ShieldAlert } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Toast } from "@/components/ui/toast";

type Thread = {
  id: string;
  title: string;
  messages: { role: "user" | "assistant"; text: string }[];
  followUps: string[];
};

const threads: Thread[] = [
  {
    id: "inflation",
    title: "Enflasyon nedir, ev bütçeme etkisi ne?",
    messages: [
      { role: "user", text: "Enflasyon nedir, ev bütçeme etkisi ne?" },
      {
        role: "assistant",
        text: "Enflasyon, fiyatların zamanla artması ve aynı parayla daha az ürün alınabilmesi demektir. Bu yüzden market, fatura ve mutfak giderleri daha hızlı hissedilir.",
      },
      {
        role: "user",
        text: "Bu durumda ne yapmam gerekir?",
      },
      {
        role: "assistant",
        text: "Belirli bir ürün öneremem. Ama giderlerini görünür kılmak, küçük hedefleri ayrı takip etmek ve acil durum tamponu oluşturmak karar güvenini artırır.",
      },
    ],
    followUps: ["Acil durum fonu neden önemli?", "Bütçe artığını nasıl görürüm?"],
  },
  {
    id: "emergency",
    title: "Acil durum fonu için ne kadar biriktirmeliyim?",
    messages: [
      { role: "user", text: "Acil durum fonu için ne kadar biriktirmeliyim?" },
      {
        role: "assistant",
        text: "Acil durum fonu beklenmedik harcamalar için ayrılan güvenlik alanıdır. Yaygın yaklaşım 3-6 aylık zorunlu giderleri hedeflemek olsa da küçük adımlarla başlamak daha gerçekçidir.",
      },
      {
        role: "user",
        text: "Aylık giderim 5.000 TL civarında, ne yapabilirim?",
      },
      {
        role: "assistant",
        text: "Bu durumda 15.000 TL üç aylık, 30.000 TL altı aylık tamponu temsil eder. Ama başlangıç için ayda 200-300 TL ile ilk 1.000-1.500 TL güvenlik alanını kurmak daha uygulanabilir olabilir.",
      },
    ],
    followUps: ["Bu fonu nerede tutmalıyım?", "Acil durum fonu olmadan hangi riskler var?"],
  },
  {
    id: "scam",
    title: "Garanti kazanç vaadi neden risklidir?",
    messages: [
      { role: "user", text: "Garanti kazanç vaadi neden risklidir?" },
      {
        role: "assistant",
        text: "Finansal karar alanında garanti kazanç dili tipik bir risk işaretidir. Özellikle hız baskısı ve resmi olmayan linklerle birleştiğinde dolandırıcılık ihtimali artar.",
      },
      {
        role: "user",
        text: "Ne yapmalıyım?",
      },
      {
        role: "assistant",
        text: "Belirli bir işlem öneremem. Ama resmi kurum kaydını doğrulamak, bağımsız kaynaklardan kontrol etmek ve mesajı Dolandırıcılık Kalkanı’nda analiz etmek iyi bir güvenlik adımıdır.",
      },
    ],
    followUps: ["IBAN’a para gönderme neden riskli olabilir?", "Resmi doğrulamayı nasıl yaparım?"],
  },
  {
    id: "profit",
    title: "Evden ürettiğim ürünün kârını nasıl hesaplarım?",
    messages: [
      { role: "user", text: "Evden ürettiğim ürünün kârını nasıl hesaplarım?" },
      {
        role: "assistant",
        text: "Net kâr, toplam gelirinden malzeme, ambalaj, kargo ve varsa diğer giderleri çıkardığında kalan tutardır. Emek süresini de görünür kılarsan saatlik kazancı daha net okuyabilirsin.",
      },
      {
        role: "user",
        text: "Bu neden önemli?",
      },
      {
        role: "assistant",
        text: "Belirli bir ürün yönlendirmesi yapamam. Ama kâr görünürlüğü sağlandığında üretim gelirini hedefe bağlamak ve malzeme yenileme kararını daha güvenli vermek kolaylaşır.",
      },
    ],
    followUps: ["Saatlik kazanç nasıl bulunur?", "Kârın bir kısmını nasıl ayırabilirim?"],
  },
];

export default function CoachPage() {
  const [activeThreadId, setActiveThreadId] = useState(threads[0].id);
  const [question, setQuestion] = useState("");
  const [toast, setToast] = useState<{
    title: string;
    description?: string;
    tone: "success" | "error" | "warning" | "info";
  } | null>(null);

  const activeThread = useMemo(
    () => threads.find((item) => item.id === activeThreadId) ?? threads[0],
    [activeThreadId],
  );

  return (
    <AppShell
      eyebrow="AI Koç"
      title="AI Finans Koçu"
      description="Sade Türkçe ile kavramları öğren. Yatırım tavsiyesi vermez."
      breadcrumb="Anasayfa → AI Koç"
      icon={<MessageCircle className="h-5 w-5" />}
      ethicNotice="AI Koç eğitim ve farkındalık amaçlıdır. Yatırım kararları için yetkili finans kuruluşlarına başvurun."
      aside={
        <Card>
          <CardHeader>
            <CardTitle>Güvenlik katmanı</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Badge variant="gold">Aktif</Badge>
            <p className="text-sm text-muted-500">Belirli ürün önerisi vermez.</p>
          </CardContent>
        </Card>
      }
    >
      <Card className="border-warning-500/20 bg-warning-100/70">
        <CardContent className="grid gap-3 py-5 md:grid-cols-2 xl:grid-cols-4">
          <div className="flex items-center gap-3">
            <ShieldAlert className="h-5 w-5 text-warning-500" />
            <span className="text-sm text-ink-700">Belirli yatırım ürünü önermez</span>
          </div>
          <div className="flex items-center gap-3">
            <ShieldAlert className="h-5 w-5 text-warning-500" />
            <span className="text-sm text-ink-700">“Şunu al, bunu sat” demez</span>
          </div>
          <div className="flex items-center gap-3">
            <ShieldAlert className="h-5 w-5 text-warning-500" />
            <span className="text-sm text-ink-700">Garanti getiri vaat etmez</span>
          </div>
          <div className="flex items-center gap-3">
            <ShieldAlert className="h-5 w-5 text-warning-500" />
            <span className="text-sm text-ink-700">“Senin için en iyisi” demez</span>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Önerilen sorular</CardTitle>
            <CardDescription>Profil için öne çıkan başlıklar</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {threads.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveThreadId(item.id)}
                className={`w-full rounded-2xl border px-4 py-4 text-left text-sm transition ${
                  activeThreadId === item.id
                    ? "border-gold-400 bg-gold-400/10"
                    : "border-ivory-200 bg-ivory-50 hover:border-gold-400"
                }`}
              >
                {item.title}
              </button>
            ))}
          </CardContent>
        </Card>

        <Card variant="premium">
          <CardHeader>
            <CardTitle>{activeThread.title}</CardTitle>
            <CardDescription>Yatırım tavsiyesi içermeyen örnek thread</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeThread.messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`rounded-2xl px-4 py-4 text-sm leading-relaxed ${
                  message.role === "user"
                    ? "border border-ivory-200 bg-white text-ink-700"
                    : "border border-gold-400/25 bg-ivory-50 text-ink-700"
                }`}
              >
                <p className="mb-2 font-medium">
                  {message.role === "user" ? "Kullanıcı" : "AltınÖtesi Koçu"}
                </p>
                <p>{message.text}</p>
              </div>
            ))}

            <div className="rounded-2xl border border-ivory-200 bg-white p-4">
              <p className="text-sm font-medium text-ink-900">Önerilen sonraki sorular</p>
              <div className="mt-3 grid gap-2 md:grid-cols-2">
                {activeThread.followUps.map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-ivory-200 bg-ivory-50 px-4 py-3 text-sm text-ink-700"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <Textarea
              label="Yeni soru sor"
              placeholder="Soru sor..."
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              className="min-h-[120px]"
            />
            <Button
              onClick={() => {
                setQuestion("");
                setToast({
                  title: "Mock cevap üretildi",
                  description:
                    "Bu örnek akışta koç yalnızca açıklama ve karar kriteri dili üretir.",
                  tone: "info",
                });
              }}
            >
              Gönder
            </Button>
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
