import {
  AcademyProgress,
  AiSettings,
  CoachMessage,
  CoachReply,
  ProducerAiCommentary,
  ProducerRecord,
  ProducerSummary,
  ScamAiCommentary,
  ScamAnalysis,
  ScamCheckRecord,
  SavingsState,
  TestResult,
} from "@/types";

export const DEFAULT_AI_MODEL = "gpt-4o-mini";

export type CoachAiPayload = {
  question: string;
  messages: CoachMessage[];
  result: TestResult | null;
  viewerRole?: "individual" | "corporate";
  organizationName?: string;
  academyProgress: AcademyProgress | null;
  savingsState: SavingsState | null;
  scamHistory: ScamCheckRecord[];
  producerHistory: ProducerRecord[];
};

export type ScamAiPayload = {
  message: string;
  analysis: ScamAnalysis;
  result: TestResult | null;
  viewerRole?: "individual" | "corporate";
  organizationName?: string;
};

export type ProducerAiPayload = {
  productName: string;
  salePrice: number;
  unitsSold: number;
  materialCost: number;
  packagingCost: number;
  shippingCost: number;
  laborHours: number;
  summary: ProducerSummary;
  result: TestResult | null;
  savingsState: SavingsState | null;
  producerHistory: ProducerRecord[];
};

type AiModeMap = {
  coach: {
    payload: CoachAiPayload;
    response: CoachReply;
  };
  scam: {
    payload: ScamAiPayload;
    response: ScamAiCommentary;
  };
  producer: {
    payload: ProducerAiPayload;
    response: ProducerAiCommentary;
  };
};

function normalizeText(value: string) {
  return value
    .toLocaleLowerCase("tr-TR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replaceAll("ı", "i");
}

function formatProfileContext(result: TestResult | null) {
  if (!result) return "Test sonucu yok. Demo veya misafir baglami ile yanit ver.";

  return [
    `Profil: ${result.profile.name}`,
    `Birincil ihtiyac: ${result.profile.primaryNeed}`,
    `Ana risk: ${result.profile.mainRisk}`,
    `Onerilen ton: ${result.profile.recommendedTone}`,
    `Haftalik zaman: ${result.userContext.weeklyTimeCommitment}`,
    `Uretim tipi: ${result.userContext.productionType}`,
  ].join("\n");
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function percent(part: number, total: number) {
  if (total <= 0) return 0;
  return Math.round((part / total) * 100);
}

function getLatestGoalSummary(state: SavingsState | null) {
  const latestGoal = state?.goals[0];
  if (!latestGoal) return "Kayitli kumbara hedefi yok.";

  return `${latestGoal.title}: ${latestGoal.current}/${latestGoal.target} TL`;
}

function buildCoachFollowUps(topic: "scam" | "budget" | "emergency" | "producer" | "general") {
  if (topic === "scam") {
    return [
      "Boyle bir mesaji kontrol ederken ilk uc adim ne olmali?",
      "Supheli link varsa hangi resmi kanaldan dogrulama yapmaliyim?",
    ];
  }

  if (topic === "budget") {
    return [
      "Bu ay butce artigini bulmak icin nelere bakmaliyim?",
      "Giderleri zorunlu ve ertelenebilir diye nasil ayirabilirim?",
    ];
  }

  if (topic === "emergency") {
    return [
      "Acil durum hedefini kucuk adimlara nasil bolebilirim?",
      "Bu hedefi kumbara ekraninda nasil takip edebilirim?",
    ];
  }

  if (topic === "producer") {
    return [
      "Saatlik kazanci yukseltmek icin ilk hangi maliyeti incelemeliyim?",
      "Karimin ne kadarini malzeme ve hedef icin ayirmaliyim?",
    ];
  }

  return [
    "Bu konuda once hangi ekrana gitmem daha faydali olur?",
    "Bu bilgiyi bu hafta tek bir adima nasil donusturebilirim?",
  ];
}

export function buildLocalCoachReply(payload: CoachAiPayload): CoachReply {
  const text = normalizeText(payload.question);
  const isCorporate = payload.viewerRole === "corporate";
  const completedLessons = payload.academyProgress?.completedLessonIds.length ?? 0;
  const contributionCount = payload.savingsState?.contributions.length ?? 0;
  const producerCount = payload.producerHistory.length;
  const scamChecks = payload.scamHistory.length;
  const safetyLine =
    "Belirli bir yatirim urunu, alim-satim zamani veya garanti getiri onerisi vermem.";

  if (isCorporate) {
    if (text.includes("phishing") || text.includes("scam") || text.includes("mesaj")) {
      return {
        answer:
          `${payload.organizationName ?? "Kurum"} icin en saglam dil, calisana korku degil kontrol adimi veren dildir. ` +
          `Su an bu cihazda ${scamChecks} scam analizi ve ${completedLessons} ders hareketi gorunuyor. Kurumsal mesajlasmada once supheli linke tiklama, sonra resmi BT kanalindan dogrulama, en son bildirim mekanizmasini tek cümlede anlatmak daha etkilidir.`,
        followUps: [
          "Calisana gidecek phishing uyarisini 3 maddede nasil yazarim?",
          "Kurumsal Kalkan ciktisini yonetime nasil ozetlemeliyim?",
        ],
        caution: safetyLine,
      };
    }

    return {
      answer:
        `${payload.organizationName ?? "Kurum"} tarafinda hedef, bireysel yatirim karari degil; calisan farkindaligi, egitim tamamlama ve risk bildirim refleksini guclendirmektir. ` +
        `Bu cihazdaki hareketlerde ${completedLessons} ders, ${scamChecks} scam analizi ve ${producerCount} diger modul etkisi gorunuyor. Bunlari haftalik kurum dili ve yonetici ozeti uzerinden okumak daha faydalidir.`,
      followUps: [
        "Calisan gelisimini haftalik olarak hangi 3 metrikle okumaliyim?",
        "Kurumsal AI Koc ile yoneticiye gidecek ozet metni nasil kurarim?",
      ],
      caution: safetyLine,
    };
  }

  if (
    text.includes("dolandir") ||
    text.includes("scam") ||
    text.includes("iban") ||
    text.includes("link") ||
    text.includes("otp") ||
    text.includes("mesaj")
  ) {
    return {
      answer:
        `Boyle bir durumda once baski dilini, sonra linki, en son istenen aksiyonu ayirmak gerekir. ` +
        `Senin kaydinda ${scamChecks} adet scam analizi gorunuyor; ayni mantik burada da gecerli: resmi kanaldan dogrulama gelmeden para, kod veya kisisel veri paylasma. ` +
        `Mesaji Scam Shield ekranina yapistirirsan kural bazli risk sinyallerini tek tek gorebilirsin.`,
      followUps: buildCoachFollowUps("scam"),
      caution: safetyLine,
    };
  }

  if (
    text.includes("enflasyon") ||
    text.includes("butce") ||
    text.includes("gider") ||
    text.includes("harcama")
  ) {
    return {
      answer:
        `Butceyi sadelestirmenin pratik yolu, once zorunlu giderleri ayirmak sonra degisken kalemleri tek tek gormektir. ` +
        `Senin ilerlemende ${completedLessons} ders ve ${contributionCount} kumbara katkisi var; bu ritim, butce artigini ayri hedefe donusturmek icin iyi bir baslangic. ` +
        `Bu hafta amac, butceyi kusursuz yapmak degil; para cikisinin en cok arttigi iki kalemi netlestirmek olmali.`,
      followUps: buildCoachFollowUps("budget"),
      caution: safetyLine,
    };
  }

  if (
    text.includes("acil durum") ||
    text.includes("fon") ||
    text.includes("birikim") ||
    text.includes("hedef")
  ) {
    return {
      answer:
        `Acil durum hedefi, once buyuk rakami degil ilk guvenlik tamponunu kurma isidir. ` +
        `Kumbara ekranindaki son hedef ozeti: ${getLatestGoalSummary(payload.savingsState)}. ` +
        `Bu hedefi 4 haftaya bolup sabit bir mini katkı ritmi kurarsan davranissal olarak daha surdurulebilir olur.`,
      followUps: buildCoachFollowUps("emergency"),
      caution: safetyLine,
    };
  }

  if (
    text.includes("kar") ||
    text.includes("maliyet") ||
    text.includes("uretim") ||
    text.includes("urun") ||
    text.includes("satis")
  ) {
    return {
      answer:
        `Net kar icin once toplam geliri, sonra malzeme-ambalaj-kargo gibi cikan giderleri ayirmak gerekir. ` +
        `Bugune kadar ${producerCount} adet uretim hesabi kaydedildi; karsilastirma yaptikca hangi urunun saatlik kazanci daha saglikli oldugu netlesir. ` +
        `Buradaki hedef, daha cok satis soylemi degil; hangi maliyet kaleminin kari incelttigini gormektir.`,
      followUps: buildCoachFollowUps("producer"),
      caution: safetyLine,
    };
  }

  return {
    answer:
      `${formatProfileContext(payload.result)}\n\n` +
      `Bu soruya en saglam yaklasim, konuyu tek adima indirgemek: once mevcut durumu sayi veya risk isaretiyle gor, sonra bir sonraki haftalik karari sec. ` +
      `AltinOtesi icinde Akademi, Scam Shield, Kumbara ve Producer ekranlari bu adimlari ayri ayri gorunur kilmak icin tasarlandi.`,
    followUps: buildCoachFollowUps("general"),
    caution: safetyLine,
  };
}

export function buildLocalScamCommentary(payload: ScamAiPayload): ScamAiCommentary {
  const isCorporate = payload.viewerRole === "corporate";
  const topUrl = payload.analysis.urlAnalyses[0];
  const signalLine =
    payload.analysis.signals.length > 0
      ? `Metinde su sinyaller var: ${payload.analysis.signals.slice(0, 3).join(", ")}.`
      : "Metinde belirgin sinyal az olsa da link yapisi tek basina incelenmeli.";
  const urlLine = topUrl
    ? `${topUrl.domain || topUrl.originalUrl} baglantisi ${topUrl.riskScore}/100 risk verdi.`
    : "Mesajda ayri bir baglanti bulunmadi; yorum metin baskisi uzerinden yapildi.";

  return {
    explanation:
      `${signalLine} ${urlLine} ${
        isCorporate
          ? "Bu nedenle kurumsal akis icinde mesaj BT, IK veya yonetici talebi gibi gorunse bile bagimsiz dogrulama zorunlu olmalidir."
          : "Bu nedenle skorun temel kaynagi kural bazli tarama; yorum katmani ise kullaniciya neden durmasi gerektigini sade dilde aciklar."
      }`,
    nextSteps: [
      isCorporate
        ? "Mesaji kurumun resmi BT, IK veya guvenlik kanalinda bagimsiz olarak dogrula."
        : "Resmi kurum uygulamasi veya resmi web adresi disinda islem yapma.",
      "Para, OTP, kart bilgisi veya kimlik bilgisi paylasmadan once bagimsiz dogrulama yap.",
      isCorporate
        ? "Supheli mesaji silmeden once kurum icindeki olay bildirim akisina ilet."
        : "Mesaji silmeden once ekran goruntusu alip guvenilir bir yakina veya kuruma danis.",
    ],
    safeReply: payload.analysis.safeReply,
  };
}

export function buildLocalProducerCommentary(payload: ProducerAiPayload): ProducerAiCommentary {
  const margin = percent(payload.summary.netProfit, payload.summary.totalRevenue);
  const materialShare = percent(payload.materialCost, payload.summary.totalCost);
  const packagingShare = percent(payload.packagingCost, payload.summary.totalCost);
  const shippingShare = percent(payload.shippingCost, payload.summary.totalCost);

  if (payload.summary.netProfit < 0) {
    return {
      summary:
        "Bu hesap zararda. Ilk bakilacak yer, satis fiyatini degil birim basina dagilmayan giderleri ve dusuk adet etkisini ayirmak.",
      actions: [
        "Malzeme ve ambalaj toplam maliyetini adet bazinda yeniden hesapla.",
        "Bu urunu dusuk adet yerine daha gercekci satis adediyle ikinci kez test et.",
        "Zarardaki urunu kumbara hedefinden ayri takip et.",
      ],
      budgetFocus: `Toplam maliyetin en buyuk parcasi malzemede: %${materialShare}.`,
      nextQuestion: "Bu urunde hangi gider kalemi seni en cok zorluyor: malzeme, ambalaj, yoksa kargo?",
    };
  }

  const budgetFocus =
    materialShare >= packagingShare && materialShare >= shippingShare
      ? `Maliyet baskisinin ana kaynagi malzeme gibi gorunuyor: toplam giderin %${materialShare}'i.`
      : packagingShare >= shippingShare
        ? `Ambalaj gideri toplam maliyet icinde dikkat cekiyor: %${packagingShare}.`
        : `Kargo gideri toplam maliyet icinde dikkat cekiyor: %${shippingShare}.`;

  const summary =
    margin >= 35
      ? "Bu urunde kar marji saglikli gorunuyor. Simdi hedef, ayni marji korurken ritmi surdurmek."
      : margin >= 15
        ? "Kar var ama marj hassas. Kucuk bir maliyet artisi karini hizla asindırabilir."
        : "Kar pozitif olsa da marj ince. Uretim devam edecekse maliyetleri daha sik izlemen gerekir.";

  return {
    summary,
    actions: [
      `Net karin yaklasik %${clamp(Math.round(payload.summary.goalSuggestion > 0 ? (payload.summary.goalSuggestion / Math.max(payload.summary.netProfit, 1)) * 100 : 0), 0, 100)} kadarini hedefe ayirmayi dusunebilirsin.`,
      "En az bir onceki urun kaydiyla saatlik kazanci karsilastir.",
      "Yeni malzeme alimini, bugunku kar gordugun urunler icin ayri tut.",
    ],
    budgetFocus,
    nextQuestion:
      "Bu kar senin icin once malzeme yenileme mi, yoksa kisisel hedefe ayrilacak pay mi olusturmali?",
  };
}

export function maskApiKey(value: string) {
  if (!value) return "";
  if (value.length <= 8) return "********";
  return `${value.slice(0, 4)}...${value.slice(-4)}`;
}

export async function requestAiResponse<TMode extends keyof AiModeMap>(
  mode: TMode,
  settings: AiSettings,
  payload: AiModeMap[TMode]["payload"],
): Promise<AiModeMap[TMode]["response"]> {
  const response = await fetch("/api/ai", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      mode,
      apiKey: settings.apiKey,
      model: settings.model || DEFAULT_AI_MODEL,
      payload,
    }),
  });

  const data = (await response.json()) as {
    result?: AiModeMap[TMode]["response"];
    error?: string;
  };

  if (!response.ok || !data.result) {
    throw new Error(data.error ?? "AI istegi basarisiz.");
  }

  return data.result;
}

export function buildCoachPrompt(payload: CoachAiPayload) {
  const transcript = payload.messages
    .slice(-6)
    .map((message) => `${message.role === "user" ? "Kullanici" : "Koc"}: ${message.text}`)
    .join("\n");

  return [
    "Baglam:",
    formatProfileContext(payload.result),
    `Goruntuleyen rol: ${payload.viewerRole ?? "individual"}`,
    `Kurum adi: ${payload.organizationName ?? "-"}`,
    `Tamamlanan ders sayisi: ${payload.academyProgress?.completedLessonIds.length ?? 0}`,
    `Kumbara hedef sayisi: ${payload.savingsState?.goals.length ?? 0}`,
    `Kumbara katkisi: ${payload.savingsState?.contributions.length ?? 0}`,
    `Scam analizi sayisi: ${payload.scamHistory.length}`,
    `Producer kaydi sayisi: ${payload.producerHistory.length}`,
    "",
    "Son konusma:",
    transcript || "Konusma gecmisi yok.",
    "",
    `Yeni soru: ${payload.question}`,
  ].join("\n");
}

export function buildScamPrompt(payload: ScamAiPayload) {
  return [
    "Kullanici mesaji:",
    payload.message,
    "",
    "Kural bazli analiz:",
    JSON.stringify(payload.analysis, null, 2),
    "",
    "Profil baglami:",
    formatProfileContext(payload.result),
    `Goruntuleyen rol: ${payload.viewerRole ?? "individual"}`,
    `Kurum adi: ${payload.organizationName ?? "-"}`,
  ].join("\n");
}

export function buildProducerPrompt(payload: ProducerAiPayload) {
  return [
    "Urun formu:",
    JSON.stringify(
      {
        productName: payload.productName,
        salePrice: payload.salePrice,
        unitsSold: payload.unitsSold,
        materialCost: payload.materialCost,
        packagingCost: payload.packagingCost,
        shippingCost: payload.shippingCost,
        laborHours: payload.laborHours,
      },
      null,
      2,
    ),
    "",
    "Hesap sonucu:",
    JSON.stringify(payload.summary, null, 2),
    "",
    `Kayitli kumbara ozeti: ${getLatestGoalSummary(payload.savingsState)}`,
    `Onceki uretim kaydi sayisi: ${payload.producerHistory.length}`,
    "",
    "Profil baglami:",
    formatProfileContext(payload.result),
  ].join("\n");
}
