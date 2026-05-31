import { LayerScores, Profile, TaskItem, TwinDimension, UserContext } from "@/types";

export function buildTwinDimensions(
  scores: LayerScores,
  overrides?: TwinDimension[],
): TwinDimension[] {
  if (overrides && overrides.length > 0) {
    return overrides;
  }

  return [
    { name: "Finansal Bilgi", value: scores.knowledge },
    { name: "Risk Farkındalığı", value: scores.risk },
    { name: "Mikro-Birikim Davranışı", value: scores.behavior },
    {
      name: "Dolandırıcılık Farkındalığı",
      value: Math.min(100, scores.risk + 12),
    },
    {
      name: "Evden Üretim Gelir Yönetimi",
      value: Math.min(100, Math.round(scores.behavior * 0.6 + scores.knowledge * 0.4)),
    },
  ];
}

export function buildTwinTasks(profileName: string): TaskItem[] {
  if (profileName === "Evden Üreten Başlangıç") {
    return [
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
        detail: "Mesaj baskısı, marka taklidi ve IBAN isteme sinyallerini pratik et.",
        href: "/scam-shield",
      },
    ];
  }

  if (profileName === "Riske Açık Başlangıç") {
    return [
      {
        title: "Garanti kazanç dilini tanımayı öğren",
        detail: "Dolandırıcılık sinyallerini kısa bir kontrol listesi halinde not et.",
        href: "/scam-shield",
      },
      {
        title: "Bir haftalık temel bütçe kaydı tut",
        detail: "Gelir ve zorunlu giderleri ayrı sütunlarda yaz.",
        href: "/dashboard",
      },
      {
        title: "Resmi kurum doğrulama listesi hazırla",
        detail: "SPK, BDDK ve banka resmi sitelerini yer imlerine ekle.",
        href: "/institution?demo=true",
      },
    ];
  }

  if (profileName === "Altınla Biriktiren Başlangıç") {
    return [
      {
        title: "Kumbara için ilk hedefini belirle",
        detail: "Kısa vadeli birikim hedefi ile düzenli ayırma alışkanlığı başlat.",
        href: "/savings",
      },
      {
        title: "Enflasyon ve acil durum fonu derslerini aç",
        detail: "Temel kavramları kısa içeriklerle netleştir.",
        href: "/academy",
      },
      {
        title: "Bir şüpheli mesaj senaryosu çöz",
        detail: "Risk sinyalleri ile karar baskısını ayırt etmeyi pratik et.",
        href: "/scam-shield",
      },
    ];
  }

  if (profileName === "İleri Seviye Bilgili") {
    return [
      {
        title: "Çevrendeki biri için risk kontrol listesi oluştur",
        detail: "Dolandırıcılık uyarı işaretlerini basit bir metne dönüştür.",
        href: "/scam-shield",
      },
      {
        title: "Üretim veya birikim hedeflerini aylık olarak kıyasla",
        detail: "Gelişimini aylık ritimde gözden geçir.",
        href: "/producer",
      },
      {
        title: "Akademi içinde ileri seviye seriyi izle",
        detail: "Bilgini davranış ve aktarım düzeyine taşı.",
        href: "/academy",
      },
    ];
  }

  return [
    {
      title: "Mikro-birikim rutinini görünür kıl",
      detail: "Küçük ama sürdürülebilir bir hedef belirle.",
      href: "/savings",
    },
    {
      title: "Bir şüpheli mesajı çözümle",
      detail: "Risk sinyallerini adım adım tanımla.",
      href: "/scam-shield",
    },
    {
      title: "Gelir-gider farkını ölç",
      detail: "Üretim veya bütçe örneği üzerinde net tablo çıkar.",
      href: "/producer",
    },
  ];
}

export function buildLearningPath(profileName: string): string[] {
  if (profileName === "Evden Üreten Başlangıç") {
    return [
      "Net kâr nasıl hesaplanır?",
      "Hedef ayırma alışkanlığı",
      "Acil durum fonu neden önemlidir?",
      "Garanti kazanç neden risklidir?",
      "Enflasyon nedir?",
    ];
  }

  if (profileName === "Riske Açık Başlangıç") {
    return [
      "Dolandırıcılık sinyalleri",
      "Garanti kazanç tuzakları",
      "Kişisel veri güvenliği",
      "Resmi kaynak kontrolü",
    ];
  }

  if (profileName === "Altınla Biriktiren Başlangıç") {
    return [
      "Acil durum fonu",
      "Enflasyon farkındalığı",
      "Mini hedef kumbarası",
      "Düzenli bütçe kontrolü",
    ];
  }

  if (profileName === "Orta Seviye Öğrenen") {
    return [
      "Davranışsal disiplin",
      "Risk senaryoları",
      "Maliyet kontrolü",
      "Hedef planlama",
    ];
  }

  return [
    "İleri finansal okuryazarlık",
    "Topluluk bilinçlendirme",
    "Veriyle hedef takibi",
    "Risk filtresi",
  ];
}

export function buildProfileSummary(
  profileName: string,
  context: UserContext,
  primaryNeed: string,
): string {
  const productionPart =
    context.hasMicroIncome === "Hayır"
      ? "ev bütçesinde daha görünür bir söz sahibi olmak istiyor"
      : `${context.productionType.toLowerCase()} alanında emek veriyor`;

  const trackingPart =
    context.profitTrackingLevel === "Düzenli takip ediyorum"
      ? "gelirini takip ediyor"
      : "kârını henüz düzenli takip etmiyor";

  return `${context.userSegment} profiline yakın, ${productionPart} ve ${trackingPart}. İlk odak alanı: ${primaryNeed.toLowerCase()}.`;
}

export function buildModulePriority(profileName: string): string[] {
  if (profileName === "Evden Üreten Başlangıç") {
    return [
      "Evden Üreten Kadın",
      "Dolandırıcılık Kalkanı",
      "Kendi Adıma Kumbara",
      "Akademi",
    ];
  }

  if (profileName === "Riske Açık Başlangıç") {
    return [
      "Dolandırıcılık Kalkanı",
      "Altınİkiz",
      "Akademi",
      "Kendi Adıma Kumbara",
    ];
  }

  if (profileName === "Altınla Biriktiren Başlangıç") {
    return [
      "Kendi Adıma Kumbara",
      "Akademi",
      "Dolandırıcılık Kalkanı",
      "Altınİkiz",
    ];
  }

  if (profileName === "Orta Seviye Öğrenen") {
    return [
      "Altınİkiz",
      "Kendi Adıma Kumbara",
      "Dolandırıcılık Kalkanı",
      "Akademi",
    ];
  }

  return [
    "Altınİkiz",
    "Akademi",
    "Dolandırıcılık Kalkanı",
    "Evden Üreten Kadın",
  ];
}

export function buildFirstSteps(profile: Profile): string[] {
  return profile.weeklyTasks.slice(0, 3).map((task) => task.title);
}
