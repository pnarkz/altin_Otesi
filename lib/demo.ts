import { calculateOverallScore } from "@/lib/scoring";
import { TestResult, UserContext } from "@/types";

const demoContext: UserContext = {
  ageRange: "35-44",
  userSegment: "Ev bütçesini yöneten",
  decisionStyle: "Ailemle birlikte",
  incomePattern: "Düşük ama düzenli",
  budgetRole: ["Market", "Mutfak", "Fatura"],
  monthlyLeftoverRange: "100-300 TL",
  householdDecisionPower: 3,
  hasMicroIncome: "Hayır",
  productionType: "Yok",
  profitTrackingLevel: "Hayır",
  personalGoal: ["Acil durum parası"],
  mainMotivation: "Finansal terimleri anlamak",
  mainBarrier: "Nereden başlayacağımı bilmiyorum",
  scamExperience: "Hayır",
  digitalComfort: 2,
  learningPreference: "Örnek senaryolarla öğrenme",
  weeklyTimeCommitment: "10 dk",
};

export function createDemoResult(): TestResult {
  const scores = {
    knowledge: 18,
    behavior: 24,
    risk: 44,
    attitude: 32,
  };
  const overallScore = calculateOverallScore(scores);

  return {
    userName: "Ayşe Hanım",
    answers: {},
    scores,
    overallScore,
    userContext: demoContext,
    profile: {
      name: "Altınla Biriktiren Başlangıç",
      description:
        "Temel finans bilgisi düşük, düzenli ama sınırlı geliri olan ve küçük hedef disiplinini sıfırdan kuracak başlangıç profili.",
      shortSummary:
        "Ayşe Hanım ev hanımı. Tek düzenli geliri 12.000 TL kira ve finans hakkında başlangıç seviyesinde. Dolandırıcılık deneyimi yok; önce temel kavramları, sonra küçük hedef ritmini kurması gerekiyor.",
      primaryNeed: "Temel finans terimlerini anlayıp küçük birikimi sistemli hedefe dönüştürmek",
      mainRisk: "Bilgi eksikliği nedeniyle yanlış yönlendirmelerde kararsız kalmak",
      recommendedTone: "Sade, destekleyici, adım adım",
      learningPath: [
        "Enflasyon nedir?",
        "Acil durum fonu neden önemlidir?",
        "Bütçe artığı nasıl bulunur?",
        "Garanti kazanç neden risklidir?",
        "Küçük hedef kumbarası nasıl açılır?",
      ],
      weeklyTasks: [
        {
          title: "Acil durum kumbarası için 100 TL hedef oluştur",
          detail: "Kendi adına küçük ama takip edilebilir bir hedef belirle.",
          href: "/savings",
        },
        {
          title: "Dolandırıcılık Kalkanı'nda 1 örnek mesajı analiz et",
          detail: "Şüpheli mesajlarda baskı ve marka taklidi dilini ilk kez pratik et.",
          href: "/scam-shield",
        },
        {
          title: "Akademi'de enflasyon ve acil durum fonu derslerini aç",
          detail: "Temel kavramları kısa içeriklerle netleştir.",
          href: "/academy",
        },
      ],
      modulePriority: [
        "Kendi Adıma Kumbara",
        "Akademi",
        "Dolandırıcılık Kalkanı",
        "Altınİkiz",
      ],
      firstSteps: [
        "Acil durum kumbarası için 100 TL hedef oluştur",
        "Dolandırıcılık Kalkanı'nda 1 örnek mesajı analiz et",
        "Akademi'de enflasyon ve acil durum fonu derslerini aç",
      ],
    },
    twinDimensions: [
      { name: "Finansal Bilgi", value: 18 },
      { name: "Risk Farkındalığı", value: 44 },
      { name: "Mikro-Birikim Davranışı", value: 24 },
      { name: "Dolandırıcılık Farkındalığı", value: 48 },
      { name: "Evden Üretim Gelir Yönetimi", value: 12 },
    ],
    twin: {
      dimensions: {
        financialKnowledge: 18,
        riskAwareness: 44,
        microSaving: 24,
        scamAwareness: 48,
        homeProductionManagement: 12,
      },
      tasks: [
        {
          id: 1,
          title: "Acil durum kumbarası için 100 TL hedef oluştur",
          completed: false,
        },
        {
          id: 2,
          title: "Dolandırıcılık Kalkanı'nda 1 örnek mesajı analiz et",
          completed: false,
        },
        {
          id: 3,
          title: "Akademi'de enflasyon ve acil durum fonu derslerini aç",
          completed: false,
        },
      ],
      learningPath: [
        { id: "lesson-1", title: "Enflasyon nedir?", status: "recommended" },
        { id: "lesson-2", title: "Acil durum fonu neden önemlidir?", status: "recommended" },
        { id: "lesson-3", title: "Bütçe artığı nasıl bulunur?", status: "locked" },
      ],
    },
    completedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };
}
