import { ScamAnalysis, UrlAnalysis, UrlFeatures, UrlRiskLevel } from "@/types";

const trustedDomains = ["halkbank.com.tr", "turkiye.gov.tr", "spk.gov.tr", "tcmb.gov.tr", "bddk.org.tr"];
const suspiciousTlds = ["xyz", "top", "click", "site", "vip", "live", "loan", "work", "shop"];
const suspiciousKeywords = ["login", "verify", "update", "bonus", "secure", "gift", "yatirim", "firsat", "kazanc", "banka"];
const shortenedDomains = ["bit.ly", "tinyurl.com", "t.co", "goo.gl", "rb.gy", "cutt.ly"];

function normalizeForMatch(value: string) {
  return value
    .toLocaleLowerCase("tr-TR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replaceAll("ı", "i")
    .replaceAll("’", "'")
    .replaceAll("“", '"')
    .replaceAll("”", '"');
}

function cleanUrlCandidate(url: string) {
  return url.replace(/[),.;!?]+$/g, "");
}

export function extractUrls(message: string): string[] {
  const urlPattern =
    /\b((?:https?:\/\/|www\.|bit\.ly\/|t\.me\/|wa\.me\/|chat\.whatsapp\.com\/)[^\s<>"']+|(?:[a-z0-9-]+\.)+[a-z]{2,}(?:\/[^\s<>"']*)?)/gi;

  return Array.from(new Set((message.match(urlPattern) ?? []).map(cleanUrlCandidate)));
}

function toParsableUrl(url: string) {
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `https://${url}`;
}

function getHostname(url: string) {
  try {
    const hostname = new URL(toParsableUrl(url)).hostname.toLocaleLowerCase("tr-TR");
    return hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

function matchesBrandContext(normalizedMessage: string, brandKeywords: string[]) {
  return brandKeywords.some((keyword) => normalizedMessage.includes(keyword));
}

export function extractUrlFeatures(url: string, messageContext = ""): UrlFeatures {
  const normalizedMessage = normalizeForMatch(messageContext);
  const hostname = getHostname(url);
  const pathname = (() => {
    try {
      return new URL(toParsableUrl(url)).pathname.toLocaleLowerCase("tr-TR");
    } catch {
      return "";
    }
  })();

  const normalizedUrl = normalizeForMatch(url);
  const tld = hostname.split(".").at(-1) ?? "";
  const trustedDomainMismatch =
    !trustedDomains.includes(hostname) &&
    ["halkbank", "turkiye", "edevlet", "spk", "tcmb", "bddk"].some((token) => hostname.includes(token));

  const brandImpersonation =
    (matchesBrandContext(normalizedMessage, ["halkbank"]) && hostname !== "halkbank.com.tr") ||
    (matchesBrandContext(normalizedMessage, ["e-devlet", "edevlet"]) && hostname !== "turkiye.gov.tr") ||
    (matchesBrandContext(normalizedMessage, ["spk"]) && hostname !== "spk.gov.tr") ||
    (matchesBrandContext(normalizedMessage, ["tcmb"]) && hostname !== "tcmb.gov.tr");

  return {
    urlLength: url.length,
    domainLength: hostname.length,
    dotCount: (hostname.match(/\./g) ?? []).length,
    hyphenCount: (hostname.match(/-/g) ?? []).length,
    digitCount: (url.match(/\d/g) ?? []).length,
    hasAtSymbol: url.includes("@"),
    usesHttp: url.startsWith("http://"),
    isShortenedUrl: shortenedDomains.some((domain) => hostname === domain),
    isTelegramLink: hostname === "t.me" || hostname.endsWith(".telegram.me"),
    isWhatsappLink: hostname === "wa.me" || hostname === "chat.whatsapp.com" || hostname.endsWith(".whatsapp.com"),
    hasSuspiciousTld: suspiciousTlds.includes(tld),
    hasSuspiciousKeywords: suspiciousKeywords.some((keyword) => normalizedUrl.includes(keyword) || pathname.includes(keyword)),
    brandImpersonation,
    trustedDomainMismatch,
    containsIpAddress: /^\d{1,3}(\.\d{1,3}){3}$/.test(hostname)
  };
}

export function scoreUrlRisk(features: UrlFeatures) {
  let score = 0;

  // This MVP uses a rule-based URL risk score. In a later phase, this function can be replaced by an ML phishing URL classifier.
  if (features.usesHttp) score += 10;
  if (features.isShortenedUrl) score += 20;
  if (features.isTelegramLink || features.isWhatsappLink) score += 20;
  if (features.hasSuspiciousTld) score += 10;
  if (features.hasSuspiciousKeywords) score += 10;
  if (features.brandImpersonation) score += 35;
  if (features.trustedDomainMismatch) score += 20;
  if (features.containsIpAddress) score += 25;
  if (features.urlLength > 80) score += 10;
  if (features.hyphenCount >= 2) score += 10;
  if (features.dotCount >= 3) score += 10;
  if (features.hasAtSymbol) score += 10;

  return Math.max(0, Math.min(100, score));
}

function getUrlRiskLevel(score: number): UrlRiskLevel {
  if (score <= 20) return "Düşük";
  if (score <= 45) return "Orta";
  if (score <= 70) return "Yüksek";
  return "Kritik";
}

function summarizeUrlFeatures(features: UrlFeatures) {
  const labels: string[] = [];

  if (features.usesHttp) labels.push("HTTP kullanımı");
  if (features.isShortenedUrl) labels.push("kısaltılmış bağlantı");
  if (features.isTelegramLink) labels.push("Telegram bağlantısı");
  if (features.isWhatsappLink) labels.push("WhatsApp bağlantısı");
  if (features.hasSuspiciousTld) labels.push("şüpheli alan adı uzantısı");
  if (features.hasSuspiciousKeywords) labels.push("şüpheli anahtar kelimeler");
  if (features.brandImpersonation) labels.push("marka taklidi");
  if (features.trustedDomainMismatch) labels.push("resmi alan adı uyumsuzluğu");
  if (features.containsIpAddress) labels.push("IP adresi kullanımı");
  if (features.urlLength > 80) labels.push("çok uzun bağlantı");
  if (features.hyphenCount >= 2) labels.push("çoklu tire kullanımı");
  if (features.dotCount >= 3) labels.push("olağandışı alt alan yapısı");
  if (features.hasAtSymbol) labels.push("@ karakteri");

  return labels;
}

function buildUrlExplanation(domain: string, level: UrlRiskLevel, featureLabels: string[]) {
  if (level === "Düşük") {
    return `${domain} bağlantısında belirgin bir yüksek risk sinyali görülmedi. Yine de resmi kurum alan adı üzerinden doğrulama yapılmalıdır.`;
  }

  return `${domain} bağlantısı ${featureLabels.join(", ")} nedeniyle yüksek riskli sinyaller içeriyor. Resmi kurum alan adına ait görünmediği için tıklamadan önce kurumun resmi web sitesinden doğrulanmalıdır.`;
}

function analyzeUrls(message: string): UrlAnalysis[] {
  const urls = extractUrls(message);

  return urls.map((url) => {
    const domain = getHostname(url);
    const features = extractUrlFeatures(url, message);
    const riskScore = scoreUrlRisk(features);
    const riskLevel = getUrlRiskLevel(riskScore);
    const featureLabels = summarizeUrlFeatures(features);

    return {
      originalUrl: url,
      domain,
      riskScore,
      riskLevel,
      features: featureLabels,
      explanation: buildUrlExplanation(domain || url, riskLevel, featureLabels)
    };
  });
}

const textPatterns = [
  { label: "Garanti kazanç vaadi", regex: /garanti kazanc|kesin kar|kesin kazanc|%100 getiri|garantili getiri/ },
  { label: "Kısa sürede yüksek getiri", regex: /kisa surede yuksek getiri|hizli kazanc|hemen kazan|\b\d+\s*ayda\b|\b\d+\s*haftada\b|\bgunde\b|iki kati|yuksek getiri/ },
  { label: "Bugün son fırsat", regex: /bugun son|sinirli sure|son sans|bugun bitiyor|bugun son firsat/ },
  { label: "IBAN'a para gönderme", regex: /iban|hesap numarasi|hesabima gonder|hesaba para gonder/ },
  { label: "Kimseye söyleme", regex: /kimseye soyleme|sadece sana ozel|gizli kalsin|gizli tut/ },
  { label: "Lisans/yetki belirsizliği", regex: /lisanssiz|yetkisiz|resmi olmayan|lisans gostermez|yetki bilgisi yok/ },
  { label: "Kişisel bilgi isteme", regex: /sifreni gonder|tc numara|tc kimlik|kimlik bilgi|kart bilgisi|dogum tarihi/ },
  { label: "SMS kodu isteme", regex: /sms kodu|dogrulama kodu|otp/ },
  { label: "Hızlı karar baskısı", regex: /hemen karar ver|simdi onayla|cok gec olmadan|acele et|kontenjan|bekleme|son firsat/ }
];

function getTextRiskLevel(count: number): UrlRiskLevel {
  if (count === 0) return "Düşük";
  if (count <= 2) return "Orta";
  if (count <= 4) return "Yüksek";
  return "Kritik";
}

export function analyzeScamMessage(message: string): ScamAnalysis {
  const normalizedMessage = normalizeForMatch(message);
  const signals = textPatterns.filter((pattern) => pattern.regex.test(normalizedMessage)).map((pattern) => pattern.label);
  const urlAnalyses = analyzeUrls(message);
  const textLevel = getTextRiskLevel(signals.length);
  const hasCriticalUrl = urlAnalyses.some((analysis) => analysis.riskScore >= 71);
  const hasHighUrl = urlAnalyses.some((analysis) => analysis.riskScore >= 46);

  let level: UrlRiskLevel = textLevel;

  if (hasCriticalUrl) {
    level = signals.length >= 2 ? "Kritik" : textLevel === "Kritik" ? "Kritik" : "Yüksek";
  } else if (hasHighUrl && (textLevel === "Düşük" || textLevel === "Orta")) {
    level = "Yüksek";
  }

  const summaryMap: Record<UrlRiskLevel, string> = {
    Düşük:
      "Belirgin bir baskı sinyali görünmüyor. Yine de resmi kurum kanalı dışında kişisel bilgi veya para paylaşmayın.",
    Orta:
      "Mesajda dikkat gerektiren ibareler var. Bağımsız doğrulama yapmadan ilerlemeyin.",
    Yüksek:
      "Birden fazla risk sinyali veya şüpheli bağlantı bulundu. İşlemi durdurup resmi kurum kanallarından teyit alın.",
    Kritik:
      "Metin sinyalleri ve/veya bağlantı modeli çok yüksek risk gösteriyor. Para, kod veya kişisel bilgi paylaşmayın."
  };

  return {
    signals,
    level,
    summary: summaryMap[level],
    safeReply:
      "Bu talebi resmi kurum kanalı dışında ilerletemem. Yetkili ve doğrulanabilir kaynaklardan bilgi almadan para, kod veya kişisel veri paylaşmayacağım.",
    urlAnalyses
  };
}
