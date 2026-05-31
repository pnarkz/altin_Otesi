export type QuestionCategory = "knowledge" | "behavior" | "risk" | "attitude";

export type QuestionChoice = {
  label: string;
  score: number;
  hint?: string;
};

export type Question = {
  id: string;
  layer: QuestionCategory;
  type?: "multiple" | "scale";
  prompt: string;
  helper?: string;
  choices: QuestionChoice[];
};

export type LayerScores = {
  knowledge: number;
  behavior: number;
  risk: number;
  attitude: number;
};

export type AgeRange = "18-24" | "25-34" | "35-44" | "45-54" | "55+";

export type UserSegment =
  | "Ev bütçesini yöneten"
  | "Evden üretim yapan"
  | "Çalışan ama finansal kararları öğrenmek isteyen"
  | "Öğrenci / genç kadın"
  | "Kooperatif üyesi";

export type DecisionStyle =
  | "Tek başıma"
  | "Ailemle birlikte"
  | "Genelde başkası karar verir"
  | "Kararsız kalırım";

export type IncomePattern =
  | "Yok"
  | "Düzensiz"
  | "Düşük ama düzenli"
  | "Orta düzey"
  | "Söylemek istemiyorum";

export type MonthlyLeftoverRange =
  | "Hiç kalmıyor"
  | "100-300 TL"
  | "300-700 TL"
  | "700 TL üzeri"
  | "Emin değilim";

export type MicroIncomeStatus =
  | "Hayır"
  | "Ara sıra"
  | "Düzenli olmasa da satış yapıyorum"
  | "Düzenli üretim / satış yapıyorum";

export type ProductionType =
  | "Yemek/pasta/reçel"
  | "Dikiş/tekstil"
  | "El işi/takı"
  | "Sosyal medya satışı"
  | "Kooperatif üretimi"
  | "Diğer"
  | "Yok";

export type ProfitTrackingLevel =
  | "Hayır"
  | "Kabaca biliyorum"
  | "Bazen hesaplıyorum"
  | "Düzenli takip ediyorum";

export type PersonalGoal =
  | "Yok"
  | "Acil durum parası"
  | "Eğitim"
  | "Sağlık"
  | "Çocuğumun eğitimi"
  | "Yeni ekipman"
  | "Borç kapatma"
  | "Diğer";

export type MainMotivation =
  | "Finansal terimleri anlamak"
  | "Küçük birikim alışkanlığı kazanmak"
  | "Dolandırıcılıktan korunmak"
  | "Evden üretim gelirimi yönetmek"
  | "Finansal özgüven kazanmak";

export type MainBarrier =
  | "Gelir yetmiyor"
  | "Nereden başlayacağımı bilmiyorum"
  | "Riskten korkuyorum"
  | "Aile içinde karar almak zor"
  | "Uygulamalar karışık geliyor";

export type ScamExperience =
  | "Hayır"
  | "Evet ama önemsemedim"
  | "Evet ve kararsız kaldım"
  | "Evet ve zarar gördüm";

export type LearningPreference =
  | "Kısa kartlar"
  | "Video"
  | "Örnek senaryolarla öğrenme"
  | "Sohbet ederek"
  | "Grafiklerle";

export type RecommendedTone =
  | "Çok sade"
  | "Detaylı ama anlaşılır"
  | "Önce örnek gösteren"
  | "Adım adım yönlendiren"
  | "Sade, destekleyici, adım adım";

export type WeeklyTimeCommitment = "5 dk" | "10 dk" | "20 dk" | "30+ dk";

export type UserContext = {
  ageRange: AgeRange;
  userSegment: UserSegment;
  decisionStyle: DecisionStyle;
  incomePattern: IncomePattern;
  budgetRole: string[];
  monthlyLeftoverRange: MonthlyLeftoverRange;
  householdDecisionPower: number;
  hasMicroIncome: MicroIncomeStatus;
  productionType: ProductionType;
  profitTrackingLevel: ProfitTrackingLevel;
  personalGoal: PersonalGoal[];
  mainMotivation: MainMotivation;
  mainBarrier: MainBarrier;
  scamExperience: ScamExperience;
  digitalComfort: number;
  learningPreference: LearningPreference;
  weeklyTimeCommitment: WeeklyTimeCommitment;
};

export type TaskItem = {
  title: string;
  detail: string;
  href?: string;
};

export type TwinDimension = {
  name: string;
  value: number;
};

export type TwinTask = {
  id: number;
  title: string;
  completed: boolean;
};

export type TwinLearningItem = {
  id: string;
  title: string;
  status: "recommended" | "completed" | "locked";
};

export type TwinSnapshot = {
  dimensions: {
    financialKnowledge: number;
    riskAwareness: number;
    microSaving: number;
    scamAwareness: number;
    homeProductionManagement: number;
  };
  tasks: TwinTask[];
  learningPath: TwinLearningItem[];
};

export type Profile = {
  name: string;
  description: string;
  shortSummary: string;
  primaryNeed: string;
  mainRisk: string;
  recommendedTone: RecommendedTone;
  learningPath: string[];
  weeklyTasks: TaskItem[];
  modulePriority: string[];
  firstSteps: string[];
};

export type TestResult = {
  userName?: string;
  answers: Record<string, number>;
  scores: LayerScores;
  overallScore: number;
  profile: Profile;
  userContext: UserContext;
  completedAt: string;
  twinDimensions?: TwinDimension[];
  twin?: TwinSnapshot;
  createdAt?: string;
};

export type UrlRiskLevel = "Düşük" | "Orta" | "Yüksek" | "Kritik";

export type UrlFeatures = {
  urlLength: number;
  domainLength: number;
  dotCount: number;
  hyphenCount: number;
  digitCount: number;
  hasAtSymbol: boolean;
  usesHttp: boolean;
  isShortenedUrl: boolean;
  isTelegramLink: boolean;
  isWhatsappLink: boolean;
  hasSuspiciousTld: boolean;
  hasSuspiciousKeywords: boolean;
  brandImpersonation: boolean;
  trustedDomainMismatch: boolean;
  containsIpAddress: boolean;
};

export type UrlAnalysis = {
  originalUrl: string;
  domain: string;
  riskScore: number;
  riskLevel: UrlRiskLevel;
  features: string[];
  explanation: string;
};

export type ScamAnalysis = {
  signals: string[];
  level: UrlRiskLevel;
  summary: string;
  safeReply: string;
  urlAnalyses: UrlAnalysis[];
};

export type ProducerSummary = {
  totalRevenue: number;
  totalCost: number;
  netProfit: number;
  hourlyIncome: number;
  restockSuggestion: number;
  goalSuggestion: number;
};

export type ToastTone = "success" | "error" | "warning" | "info";

export type TestProgress = {
  answers: Record<string, number>;
  currentIndex: number;
  userContext: Partial<UserContext>;
  onboardingStep: number;
};
