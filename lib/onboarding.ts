import {
  AgeRange,
  DecisionStyle,
  IncomePattern,
  LearningPreference,
  MainBarrier,
  MainMotivation,
  MicroIncomeStatus,
  MonthlyLeftoverRange,
  PersonalGoal,
  ProductionType,
  ProfitTrackingLevel,
  ScamExperience,
  UserContext,
  UserSegment,
  WeeklyTimeCommitment,
} from "@/types";

type OnboardingField =
  | "ageRange"
  | "userSegment"
  | "decisionStyle"
  | "incomePattern"
  | "budgetRole"
  | "monthlyLeftoverRange"
  | "householdDecisionPower"
  | "hasMicroIncome"
  | "productionType"
  | "profitTrackingLevel"
  | "personalGoal"
  | "mainMotivation"
  | "mainBarrier"
  | "scamExperience"
  | "digitalComfort"
  | "learningPreference"
  | "weeklyTimeCommitment";

export type OnboardingOption = {
  label: string;
  value: string | number;
};

export type OnboardingQuestion = {
  id: OnboardingField;
  prompt: string;
  helper?: string;
  type: "single" | "multi" | "scale";
  options: OnboardingOption[];
};

export type OnboardingStep = {
  id: string;
  title: string;
  description: string;
  questions: OnboardingQuestion[];
};

const ageRanges: AgeRange[] = ["18-24", "25-34", "35-44", "45-54", "55+"];
const userSegments: UserSegment[] = [
  "Ev bütçesini yöneten",
  "Evden üretim yapan",
  "Çalışan ama finansal kararları öğrenmek isteyen",
  "Öğrenci / genç kadın",
  "Kooperatif üyesi",
];
const decisionStyles: DecisionStyle[] = [
  "Tek başıma",
  "Ailemle birlikte",
  "Genelde başkası karar verir",
  "Kararsız kalırım",
];
const incomePatterns: IncomePattern[] = [
  "Yok",
  "Düzensiz",
  "Düşük ama düzenli",
  "Orta düzey",
  "Söylemek istemiyorum",
];
const budgetRoles = [
  "Market",
  "Fatura",
  "Çocuk / okul masrafı",
  "Borç / taksit",
  "Mutfak",
  "Hiçbirini takip etmiyorum",
];
const leftoverRanges: MonthlyLeftoverRange[] = [
  "Hiç kalmıyor",
  "100-300 TL",
  "300-700 TL",
  "700 TL üzeri",
  "Emin değilim",
];
const microIncomeStatuses: MicroIncomeStatus[] = [
  "Hayır",
  "Ara sıra",
  "Düzenli olmasa da satış yapıyorum",
  "Düzenli üretim / satış yapıyorum",
];
const productionTypes: ProductionType[] = [
  "Yemek/pasta/reçel",
  "Dikiş/tekstil",
  "El işi/takı",
  "Sosyal medya satışı",
  "Kooperatif üretimi",
  "Diğer",
  "Yok",
];
const profitTrackingLevels: ProfitTrackingLevel[] = [
  "Hayır",
  "Kabaca biliyorum",
  "Bazen hesaplıyorum",
  "Düzenli takip ediyorum",
];
const personalGoals: PersonalGoal[] = [
  "Yok",
  "Acil durum parası",
  "Eğitim",
  "Sağlık",
  "Çocuğumun eğitimi",
  "Yeni ekipman",
  "Borç kapatma",
  "Diğer",
];
const motivations: MainMotivation[] = [
  "Finansal terimleri anlamak",
  "Küçük birikim alışkanlığı kazanmak",
  "Dolandırıcılıktan korunmak",
  "Evden üretim gelirimi yönetmek",
  "Finansal özgüven kazanmak",
];
const barriers: MainBarrier[] = [
  "Gelir yetmiyor",
  "Nereden başlayacağımı bilmiyorum",
  "Riskten korkuyorum",
  "Aile içinde karar almak zor",
  "Uygulamalar karışık geliyor",
];
const scamExperiences: ScamExperience[] = [
  "Hayır",
  "Evet ama önemsemedim",
  "Evet ve kararsız kaldım",
  "Evet ve zarar gördüm",
];
const learningPreferences: LearningPreference[] = [
  "Kısa kartlar",
  "Video",
  "Örnek senaryolarla öğrenme",
  "Sohbet ederek",
  "Grafiklerle",
];
const weeklyTimes: WeeklyTimeCommitment[] = ["5 dk", "10 dk", "20 dk", "30+ dk"];

const scaleOptions = [1, 2, 3, 4, 5].map((value) => ({
  label: String(value),
  value,
}));

export const onboardingSteps: OnboardingStep[] = [
  {
    id: "life-context",
    title: "Yaşam Bağlamı",
    description: "Altınİkiz’i yaşam ritmine göre kuruyoruz.",
    questions: [
      {
        id: "ageRange",
        prompt: "Yaş aralığın nedir?",
        type: "single",
        options: ageRanges.map((item) => ({ label: item, value: item })),
      },
      {
        id: "userSegment",
        prompt: "Kendini en çok hangi gruba yakın görüyorsun?",
        type: "single",
        options: userSegments.map((item) => ({ label: item, value: item })),
      },
      {
        id: "decisionStyle",
        prompt: "Finansal kararları genellikle nasıl alıyorsun?",
        type: "single",
        options: decisionStyles.map((item) => ({ label: item, value: item })),
      },
    ],
  },
  {
    id: "income-budget",
    title: "Gelir ve Bütçe Rolü",
    description: "Ev bütçesindeki alanını anlamak ilk önerileri şekillendirir.",
    questions: [
      {
        id: "incomePattern",
        prompt: "Düzenli kişisel gelirin var mı?",
        type: "single",
        options: incomePatterns.map((item) => ({ label: item, value: item })),
      },
      {
        id: "budgetRole",
        prompt: "Ev bütçesinde hangi alanları takip ediyorsun?",
        helper: "Birden fazla seçim yapabilirsin.",
        type: "multi",
        options: budgetRoles.map((item) => ({ label: item, value: item })),
      },
      {
        id: "monthlyLeftoverRange",
        prompt: "Ay sonunda bazen para kalıyor mu?",
        type: "single",
        options: leftoverRanges.map((item) => ({ label: item, value: item })),
      },
      {
        id: "householdDecisionPower",
        prompt: "Ev bütçesinde ne kadar söz sahibi hissediyorsun?",
        helper: "1 az, 5 yüksek.",
        type: "scale",
        options: scaleOptions,
      },
    ],
  },
  {
    id: "micro-income",
    title: "Evden Üretim / Mikro Gelir",
    description: "Üretim yapıyorsan ilk odak modüller buna göre sıralanır.",
    questions: [
      {
        id: "hasMicroIncome",
        prompt: "Evden veya küçük ölçekte gelir elde ediyor musun?",
        type: "single",
        options: microIncomeStatuses.map((item) => ({ label: item, value: item })),
      },
      {
        id: "productionType",
        prompt: "Ne tür üretim / satış yapıyorsun?",
        type: "single",
        options: productionTypes.map((item) => ({ label: item, value: item })),
      },
      {
        id: "profitTrackingLevel",
        prompt: "Gerçek kârını hesaplıyor musun?",
        type: "single",
        options: profitTrackingLevels.map((item) => ({ label: item, value: item })),
      },
      {
        id: "personalGoal",
        prompt: "Kendi adına bir finansal hedefin var mı?",
        helper: "Birden fazla seçim yapabilirsin.",
        type: "multi",
        options: personalGoals.map((item) => ({ label: item, value: item })),
      },
    ],
  },
  {
    id: "goals-motivation",
    title: "Hedefler ve Motivasyon",
    description: "İlk adımların ihtiyaç duyduğun yere göre önerilir.",
    questions: [
      {
        id: "mainMotivation",
        prompt: "AltınÖtesi’nden en çok ne bekliyorsun?",
        type: "single",
        options: motivations.map((item) => ({ label: item, value: item })),
      },
      {
        id: "mainBarrier",
        prompt: "Seni hedef koymaktan en çok ne uzaklaştırıyor?",
        type: "single",
        options: barriers.map((item) => ({ label: item, value: item })),
      },
    ],
  },
  {
    id: "risk-experience",
    title: "Risk ve Dolandırıcılık Deneyimi",
    description: "Risk geçmişi korunma önceliğini belirler.",
    questions: [
      {
        id: "scamExperience",
        prompt: "Daha önce şüpheli kazanç mesajı aldın mı?",
        type: "single",
        options: scamExperiences.map((item) => ({ label: item, value: item })),
      },
      {
        id: "digitalComfort",
        prompt: "Para kaybetme ihtimali seni ne kadar kaygılandırır?",
        helper: "1 az, 5 çok.",
        type: "scale",
        options: scaleOptions,
      },
    ],
  },
  {
    id: "digital-habits",
    title: "Dijital Finans Alışkanlığı",
    description: "Anlatım tonu ve öğrenme biçimi bu cevaplarla ayarlanır.",
    questions: [
      {
        id: "learningPreference",
        prompt: "Finansal terimleri en iyi nasıl öğrenirsin?",
        type: "single",
        options: learningPreferences.map((item) => ({ label: item, value: item })),
      },
      {
        id: "weeklyTimeCommitment",
        prompt: "Haftada kaç dakika ayırabilirsin?",
        type: "single",
        options: weeklyTimes.map((item) => ({ label: item, value: item })),
      },
    ],
  },
];

export const defaultUserContext: UserContext = {
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
