"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Building2,
  KeyRound,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";
import { useAppState } from "@/components/providers/app-state-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toast } from "@/components/ui/toast";
import { authenticateDemoUser } from "@/lib/auth";
import { createDemoResult } from "@/lib/demo";
import {
  clearAcademyProgress,
  clearCoachMessages,
  clearProducerHistory,
  clearScamHistory,
  clearSavingsState,
  clearTestProgress,
  clearTwinProgress,
} from "@/lib/storage";
import { AuthRole, ToastTone } from "@/types";

const roleCards: {
  role: AuthRole;
  title: string;
  description: string;
  icon: typeof UserRound;
  accent: string;
}[] = [
  {
    role: "individual",
    title: "Bireysel",
    description:
      "Ayse Hanim profiliyle Kumbara, bireysel AltinIkiz ve AI Koc akisina dogrudan giris.",
    icon: UserRound,
    accent: "from-gold-400/25 to-coral/20",
  },
  {
    role: "corporate",
    title: "Kurumsal",
    description: "Kurum paneli, calisan gelisimi, kurumsal AltinIkiz ve kurumsal Kalkan.",
    icon: Building2,
    accent: "from-emerald-600/20 to-teal/20",
  },
];

export default function LoginPage() {
  const router = useRouter();
  const { authSession, isReady, setAuthSession, setResult } = useAppState();
  const [role, setRole] = useState<AuthRole>("individual");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [toast, setToast] = useState<{
    title: string;
    description?: string;
    tone: ToastTone;
  } | null>(null);

  useEffect(() => {
    if (!isReady || !authSession) return;
    router.replace("/dashboard");
  }, [authSession, isReady, router]);

  const selectedRole = useMemo(
    () => roleCards.find((item) => item.role === role) ?? roleCards[0],
    [role],
  );

  const handleLogin = () => {
    const session = authenticateDemoUser(role, username, password);

    if (!session) {
      setToast({
        title: "Giris bilgileri hatali",
        description: "Kullanici adi veya sifre uyusmuyor.",
        tone: "error",
      });
      return;
    }

    if (session.role === "individual") {
      clearTestProgress();
      clearAcademyProgress();
      clearSavingsState();
      clearScamHistory();
      clearProducerHistory();
      clearTwinProgress();
      clearCoachMessages();
      setResult(createDemoResult());
    } else {
      setResult(null);
    }

    setAuthSession(session);
    router.push("/dashboard");
  };

  if (!isReady) {
    return null;
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(212,162,76,0.22),transparent_20%),radial-gradient(circle_at_bottom_right,rgba(215,140,121,0.22),transparent_24%),linear-gradient(135deg,#6f2c39_0%,#6f2c39_46%,#d78c79_100%)] text-white">
      <div className="absolute inset-0 opacity-35">
        <div className="absolute -left-20 top-24 h-72 w-72 rotate-12 rounded-[44px] border border-white/10 bg-white/5" />
        <div className="absolute left-[28%] top-[18%] h-60 w-60 rotate-45 rounded-[36px] border border-white/10 bg-white/5" />
        <div className="absolute bottom-10 left-16 h-52 w-52 -rotate-12 rounded-[38px] border border-white/10 bg-gold-400/10" />
        <div className="absolute right-[34%] top-10 h-80 w-80 rounded-full bg-gold-400/12 blur-3xl" />
        <div className="absolute bottom-10 right-10 h-72 w-72 rounded-full bg-coral/20 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-[1480px] items-center px-4 py-6 lg:px-8">
        <div className="grid w-full overflow-hidden rounded-[34px] border border-white/10 bg-white/6 shadow-[0_40px_120px_rgba(10,16,40,0.45)] backdrop-blur-xl lg:grid-cols-[1.08fr_0.92fr]">
          <section className="relative overflow-hidden px-6 py-8 sm:px-10 lg:px-12 lg:py-12">
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <Badge variant="gold">AltinOtesi</Badge>
            </div>

            <div className="max-w-xl space-y-4">
              <h1 className="text-balance text-4xl font-semibold tracking-tight text-white md:text-5xl">
                Altınla başlayan güveni, finansal okuryazarlıkla AltınÖtesi’ne taşı
              </h1>
            </div>

            <div className="mt-8 rounded-[30px] border border-white/12 bg-[linear-gradient(180deg,rgba(255,248,241,0.98),rgba(245,239,224,0.92))] p-6 shadow-[0_28px_80px_rgba(9,17,35,0.22)]">
              <div className="rounded-[28px] bg-[radial-gradient(circle_at_top,rgba(212,162,76,0.12),transparent_40%),linear-gradient(180deg,#fffaf4_0%,#f6efe3_100%)] p-4 sm:p-6">
                <Image
                  src="/login-logo.png"
                  alt="AltinOtesi logosu"
                  width={1200}
                  height={1200}
                  priority
                  className="mx-auto w-full max-w-[520px] mix-blend-multiply saturate-[1.08]"
                />
                <p className="mx-auto mt-4 max-w-[560px] text-center text-sm font-medium leading-relaxed text-burgundy sm:text-base">
                  Kadının emeğini, birikimini ve finansal güvenini AltınÖtesi’ne taşıyoruz.
                </p>
              </div>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                {
                  icon: ShieldCheck,
                  title: "Dolandiricilik Kalkani",
                  text: "Supheli mesaj ve linkleri sade dille yorumlayip guvenli cevap onerisi sunar.",
                },
                {
                  icon: Sparkles,
                  title: "AltinIkiz yolu",
                  text: "Test veya hazir profil uzerinden kisisel ya da kurumsal gelisim yolunu gorunur kilar.",
                },
                {
                  icon: KeyRound,
                  title: "Kumbara ve AI Koc",
                  text: "Kucuk hedefleri takip eder, AI Koc ile karar dilini finansal okuryazarliga baglar.",
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="rounded-[24px] border border-white/10 bg-white/8 px-4 py-4 backdrop-blur-sm"
                  >
                    <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/12 text-gold-400">
                      <Icon className="h-5 w-5" />
                    </div>
                    <p className="text-sm font-medium text-white">{item.title}</p>
                    <p className="mt-2 text-sm leading-relaxed text-white/68">{item.text}</p>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="relative bg-[linear-gradient(180deg,#fffaf4_0%,#f6efe3_100%)] px-6 py-8 text-ink-900 sm:px-10 lg:px-12 lg:py-12">
            <div className="mx-auto flex h-full max-w-xl flex-col justify-center">
              <div className="mb-6 space-y-3">
                <span className="inline-flex items-center rounded-full border border-gold-400/30 bg-gold-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-burgundy">
                  Giris
                </span>
                <h2 className="text-3xl font-semibold tracking-tight text-ink-900 sm:text-[2.2rem]">
                  Hesabina gec
                </h2>
                <p className="max-w-md text-sm leading-relaxed text-ink-700 sm:text-base">
                  Once hangi arayuzu kullanacagini sec. Sag taraftaki alan secimine gore
                  bireysel veya kurumsal akisa yonlendirileceksin.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {roleCards.map((item) => {
                  const Icon = item.icon;
                  const selected = role === item.role;

                  return (
                    <button
                      key={item.role}
                      type="button"
                      onClick={() => setRole(item.role)}
                      className={[
                        "group rounded-[24px] border px-4 py-4 text-left transition-all duration-200",
                        selected
                          ? "border-burgundy/25 bg-white shadow-[0_18px_40px_rgba(111,44,57,0.08)]"
                          : "border-ivory-200 bg-white/70 hover:border-gold-400/50 hover:bg-white",
                      ].join(" ")}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${item.accent} text-burgundy`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <span
                          className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${
                            selected ? "bg-burgundy text-white" : "bg-ivory-100 text-muted-500"
                          }`}
                        >
                          {selected ? "Secili" : "Sec"}
                        </span>
                      </div>
                      <p className="mt-4 text-base font-medium text-ink-900">{item.title}</p>
                      <p className="mt-2 text-sm leading-relaxed text-muted-500">
                        {item.description}
                      </p>
                    </button>
                  );
                })}
              </div>

              <form
                className="mt-7 space-y-5"
                onSubmit={(event) => {
                  event.preventDefault();
                  handleLogin();
                }}
              >
                <div className="rounded-[28px] border border-ivory-200 bg-white/84 p-5 shadow-[0_20px_45px_rgba(26,26,26,0.06)]">
                  <div className="mb-5 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-ink-900">{selectedRole.title} oturumu</p>
                      <p className="mt-1 text-sm text-muted-500">
                        {selectedRole.role === "corporate"
                          ? "Kurum bilgileri, calisan ritmi ve anonim istatistikler acilir."
                          : "Ayse Hanim profili test cozulmeden dogrudan yuklenir."}
                      </p>
                    </div>
                    <div className="hidden h-11 w-11 items-center justify-center rounded-2xl bg-burgundy text-white sm:flex">
                      <ArrowRight className="h-5 w-5" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Input
                      label="Kullanici adi"
                      placeholder={role === "corporate" ? "Kurumsal kullanici adi" : "Kullanici adi"}
                      value={username}
                      onChange={(event) => setUsername(event.target.value)}
                    />
                    <Input
                      label="Sifre"
                      type="password"
                      placeholder="Sifreni gir"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button type="submit" size="lg" className="sm:flex-1">
                    Giris yap
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="lg"
                    className="sm:flex-1"
                    onClick={() => {
                      setUsername("");
                      setPassword("");
                    }}
                  >
                    Alanlari temizle
                  </Button>
                </div>
              </form>
            </div>
          </section>
        </div>
      </div>

      <Toast
        open={Boolean(toast)}
        onClose={() => setToast(null)}
        title={toast?.title ?? ""}
        description={toast?.description}
        tone={toast?.tone ?? "info"}
      />
    </div>
  );
}
