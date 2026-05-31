import { questions } from "@/lib/questions";
import { buildFirstSteps, buildLearningPath, buildModulePriority, buildProfileSummary, buildTwinDimensions, buildTwinTasks } from "@/lib/twin";
import { LayerScores, Profile, TestResult, UserContext } from "@/types";

const roundScore = (value: number) => Math.round(value);

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function calculateLayerScores(answers: Record<string, number>): LayerScores {
  const grouped = questions.reduce<Record<keyof LayerScores, number[]>>(
    (acc, question) => {
      const answer = answers[question.id];
      if (typeof answer === "number") {
        acc[question.layer].push(answer);
      }
      return acc;
    },
    {
      knowledge: [],
      behavior: [],
      risk: [],
      attitude: [],
    },
  );

  return {
    knowledge: roundScore(average(grouped.knowledge)),
    behavior: roundScore(average(grouped.behavior)),
    risk: roundScore(average(grouped.risk)),
    attitude: roundScore(average(grouped.attitude)),
  };
}

export function calculateOverallScore(scores: LayerScores): number {
  return roundScore(
    scores.knowledge * 0.3 +
      scores.behavior * 0.35 +
      scores.risk * 0.25 +
      scores.attitude * 0.1,
  );
}

function hasProducerSignal(context: UserContext): boolean {
  return context.hasMicroIncome !== "Hayır";
}

function hasHighScamRisk(context: UserContext, scores: LayerScores): boolean {
  return (
    (context.scamExperience === "Evet ve zarar gördüm" && scores.risk < 55) ||
    (context.scamExperience === "Evet ve kararsız kaldım" && scores.risk < 45) ||
    scores.risk < 35
  );
}

function shouldUseProducerProfile(
  context: UserContext,
  answers: Record<string, number>,
): boolean {
  return (
    hasProducerSignal(context) &&
    (context.profitTrackingLevel === "Hayır" ||
      context.profitTrackingLevel === "Kabaca biliyorum" ||
      (answers.q8 ?? 0) < 80)
  );
}

function getPrimaryNeed(profileName: string, context: UserContext): string {
  if (profileName === "Evden Üreten Başlangıç") {
    return "Üretim gelirini görünür hale getirmek ve küçük hedefe bağlamak";
  }

  if (profileName === "Riske Açık Başlangıç") {
    return "Riskli mesajlarda durup doğrulama refleksi kazanmak";
  }

  if (profileName === "Altınla Biriktiren Başlangıç") {
    return "Küçük birikimi sistemli hedefe dönüştürmek";
  }

  if (profileName === "Orta Seviye Öğrenen") {
    return "Davranışsal disiplini sürdürüp karar güvenini artırmak";
  }

  if (context.mainMotivation === "Evden üretim gelirimi yönetmek") {
    return "Üretim ve hedef yönetimini daha ileri seviyeye taşımak";
  }

  return "Bilgiyi alışkanlığa çevirip sürdürülebilir hale getirmek";
}

function getMainRisk(profileName: string, context: UserContext): string {
  if (profileName === "Evden Üreten Başlangıç") {
    return "Şüpheli kazanç mesajlarında kararsız kalma";
  }

  if (profileName === "Riske Açık Başlangıç") {
    return "Hız baskısı ve garanti kazanç diliyle yönlendirilme";
  }

  if (profileName === "Altınla Biriktiren Başlangıç") {
    return "Birikimi plansız ve dağınık bırakma";
  }

  if (context.digitalComfort <= 2) {
    return "Dijital araçlar karşısında çekingen kalma";
  }

  return "Düzenli tekrar yapılmadığında motivasyon kaybı yaşama";
}

function getRecommendedTone(context: UserContext): Profile["recommendedTone"] {
  if (context.digitalComfort <= 2) {
    return "Sade, destekleyici, adım adım";
  }

  if (context.learningPreference === "Örnek senaryolarla öğrenme") {
    return "Önce örnek gösteren";
  }

  if (context.learningPreference === "Grafiklerle") {
    return "Detaylı ama anlaşılır";
  }

  return "Adım adım yönlendiren";
}

function decideProfileName(
  overallScore: number,
  scores: LayerScores,
  answers: Record<string, number>,
  context: UserContext,
): string {
  if (hasHighScamRisk(context, scores)) {
    return "Riske Açık Başlangıç";
  }

  if (shouldUseProducerProfile(context, answers)) {
    return "Evden Üreten Başlangıç";
  }

  if (overallScore < 50) {
    return "Altınla Biriktiren Başlangıç";
  }

  if (overallScore >= 70) {
    return "İleri Seviye Bilgili";
  }

  if (overallScore >= 50 && overallScore < 70 && context.digitalComfort >= 3) {
    return "Orta Seviye Öğrenen";
  }

  return "Altınla Biriktiren Başlangıç";
}

export function getProfile(
  overallScore: number,
  scores: LayerScores,
  answers: Record<string, number>,
  context: UserContext,
): Profile {
  const name = decideProfileName(overallScore, scores, answers, context);
  const primaryNeed = getPrimaryNeed(name, context);
  const mainRisk = getMainRisk(name, context);
  const learningPath = buildLearningPath(name);
  const weeklyTasks = buildTwinTasks(name);
  const modulePriority = buildModulePriority(name);
  const recommendedTone = getRecommendedTone(context);
  const shortSummary = buildProfileSummary(name, context, primaryNeed);

  const descriptionMap: Record<string, string> = {
    "Riske Açık Başlangıç":
      "Temel risk filtreleri ve güvenli doğrulama alışkanlığı bu profil için ilk güçlenme adımıdır.",
    "Evden Üreten Başlangıç":
      "Üretim emeğini görünür kılmaya yakın, gelir-gider farkındalığını sistemli hale getirmeye hazır başlangıç profili.",
    "Altınla Biriktiren Başlangıç":
      "Birikim fikri güçlü, ancak sistemli ilerleme ve karar güveni henüz gelişim aşamasında.",
    "Orta Seviye Öğrenen":
      "Temel kavramları tanıyor, davranışsal istikrar kuruyor ve risk sinyallerini daha hızlı fark etmeye başlıyor.",
    "İleri Seviye Bilgili":
      "Bilgi, davranış ve risk farkındalığı dengeli; sonraki adım bunu sürdürülebilir alışkanlığa dönüştürmek.",
  };

  return {
    name,
    description: descriptionMap[name],
    shortSummary,
    primaryNeed,
    mainRisk,
    recommendedTone,
    learningPath,
    weeklyTasks,
    modulePriority,
    firstSteps: buildFirstSteps({
      name,
      description: descriptionMap[name],
      shortSummary,
      primaryNeed,
      mainRisk,
      recommendedTone,
      learningPath,
      weeklyTasks,
      modulePriority,
      firstSteps: [],
    }),
  };
}

export function buildTestResult(
  answers: Record<string, number>,
  userContext: UserContext,
): TestResult {
  const scores = calculateLayerScores(answers);
  const overallScore = calculateOverallScore(scores);
  const profile = getProfile(overallScore, scores, answers, userContext);

  return {
    userName: "Ayşe Hanım",
    answers,
    scores,
    overallScore,
    profile,
    userContext,
    twinDimensions: buildTwinDimensions(scores),
    completedAt: new Date().toISOString(),
  };
}
