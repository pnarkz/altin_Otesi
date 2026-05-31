import { buildTwinDimensions } from "@/lib/twin";
import { TestResult, UserContext } from "@/types";

const demoContext: UserContext = {
  ageRange: "35-44",
  userSegment: "Evden üretim yapan",
  decisionStyle: "Ailemle birlikte",
  incomePattern: "Düzensiz",
  budgetRole: ["Market", "Mutfak", "Fatura"],
  monthlyLeftoverRange: "300-700 TL",
  householdDecisionPower: 3,
  hasMicroIncome: "Düzenli olmasa da satış yapıyorum",
  productionType: "Yemek/pasta/reçel",
  profitTrackingLevel: "Kabaca biliyorum",
  personalGoal: ["Acil durum parası", "Yeni ekipman"],
  mainMotivation: "Evden üretim gelirimi yönetmek",
  mainBarrier: "Nereden başlayacağımı bilmiyorum",
  scamExperience: "Evet ve zarar gördüm",
  digitalComfort: 2,
  learningPreference: "Örnek senaryolarla öğrenme",
  weeklyTimeCommitment: "10 dk",
};

export function createDemoResult(): TestResult {
  const scores = {
    knowledge: 42,
    behavior: 25,
    risk: 58,
    attitude: 35,
  };

  const twinDimensions = buildTwinDimensions(scores, [
    { name: "Finansal Bilgi", value: 42 },
    { name: "Risk Farkındalığı", value: 58 },
    { name: "Mikro-Birikim Davranışı", value: 25 },
    { name: "Dolandırıcılık Farkındalığı", value: 70 },
    { name: "Evden Üretim Gelir Yönetimi", value: 35 },
  ]);

  return {
    userName: "Ayşe Hanım",
    answers: {},
    scores,
    overallScore: 38,
    userContext: demoContext,
    profile: {
      name: "Evden Üreten Başlangıç",
      description:
        "Üretim emeğini görünür hale getirmeye yakın, gelir-gider farkındalığını sistemli hale getirmeye hazır başlangıç profili.",
      shortSummary:
        "Ayşe Hanım evden üretim yapıyor, kârını düzenli takip etmiyor ve kendi adına küçük hedef oluşturmak istiyor.",
      primaryNeed: "Üretim gelirini görünür hale getirmek",
      mainRisk: "Şüpheli kazanç mesajlarında kararsız kalma",
      recommendedTone: "Sade, destekleyici, adım adım",
      learningPath: [
        "Net kâr nasıl hesaplanır?",
        "Hedef ayırma alışkanlığı",
        "Acil durum fonu neden önemlidir?",
        "Garanti kazanç neden risklidir?",
        "Küçük hedef kumbarası nasıl açılır?",
      ],
      weeklyTasks: [
        {
          title: "Bu hafta evden ürettiğin bir ürünün net kârını hesapla",
          detail:
            "Producer modülünde ürün bilgilerini girerek toplam gelir, gider ve saatlik kazancı görün.",
          href: "/producer",
        },
        {
          title: "Acil durum kumbarası için 100 TL hedef oluştur",
          detail: "Kendi adına küçük ama takip edilebilir bir hedef belirle.",
          href: "/savings",
        },
        {
          title: "Dolandırıcılık Kalkanı’nda 3 örnek mesajı analiz et",
          detail: "Şüpheli mesajlarda baskı ve marka taklidi dilini pratik et.",
          href: "/scam-shield",
        },
      ],
      modulePriority: [
        "Evden Üreten Kadın",
        "Dolandırıcılık Kalkanı",
        "Kendi Adıma Kumbara",
        "Akademi",
      ],
      firstSteps: [
        "Bu hafta evden ürettiğin bir ürünün net kârını hesapla",
        "Acil durum kumbarası için 100 TL hedef oluştur",
        "Dolandırıcılık Kalkanı’nda 3 örnek mesajı analiz et",
      ],
    },
    twinDimensions,
    twin: {
      dimensions: {
        financialKnowledge: 42,
        riskAwareness: 58,
        microSaving: 25,
        scamAwareness: 70,
        homeProductionManagement: 35,
      },
      tasks: [
        {
          id: 1,
          title: "Bu hafta evden ürettiğin bir ürünün net kârını hesapla",
          completed: false,
        },
        {
          id: 2,
          title: "Acil durum kumbarası için 100 TL hedef oluştur",
          completed: false,
        },
        {
          id: 3,
          title: "Dolandırıcılık Kalkanı’nda 3 örnek mesajı analiz et",
          completed: false,
        },
      ],
      learningPath: [
        { id: "lesson-1", title: "Net kâr nasıl hesaplanır?", status: "recommended" },
        { id: "lesson-2", title: "Hedef ayırma alışkanlığı", status: "recommended" },
        { id: "lesson-3", title: "Acil durum fonu nedir?", status: "locked" },
      ],
    },
    completedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };
}
