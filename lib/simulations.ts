export type SimulationOption = {
  id: string;
  text: string;
  pros: string[];
  cons: string[];
};

export type SimulationCriterion = {
  title: string;
  description: string;
};

export type SimulationAlternative = {
  id: string;
  title: string;
  summary: string;
};

export type Simulation = {
  id: string;
  title: string;
  profileHint: string;
  purpose: string;
  concepts: string[];
  duration: string;
  reason: string;
  intro: string;
  question: string;
  options: SimulationOption[];
  criteria: SimulationCriterion[];
  alternativeReviews: SimulationAlternative[];
};

export const simulations: Simulation[] = [
  {
    id: "500tl",
    title: "500 TL ile acil durum kararı",
    profileHint: "Altınİkiz öneriyor",
    purpose: "Kısa vadeli ihtiyaç varken hangi kriterlerin önce geldiğini görmek.",
    concepts: ["Erişilebilirlik", "Risk", "Vade"],
    duration: "4 dk",
    reason: "Acil durum tamponu ve karar güveni için iyi bir başlangıç senaryosu.",
    intro:
      "Elinde 500 TL var ve bu paraya 2 ay içinde ihtiyacın olabilir. Karar verirken önce ürün değil; erişim süresi, risk ve dalgalanma birlikte düşünülür.",
    question: "Bu durumda en yakın yaklaşımın hangisi olurdu?",
    options: [
      {
        id: "a",
        text: "Önce kolay erişilebilen bir yerde tutarım",
        pros: [
          "Acil ihtiyaç oluşursa paraya hızlı ulaşmanı sağlar",
          "Kısa vadeli belirsizlikte stresi azaltır",
          "Kararı ihtiyaç süresiyle uyumlu hale getirir",
        ],
        cons: [
          "Daha uzun vadeli hedefler için büyüme hissi daha düşük olabilir",
          "Tüm tutarı güvenlikte tutmak motivasyonu sınırlayabilir",
        ],
      },
      {
        id: "b",
        text: "Bir kısmını hedefe, bir kısmını güvenli alana ayırırım",
        pros: [
          "Hem esneklik hem hedef duygusu kurar",
          "Paranın tamamını tek karar altında toplamamış olursun",
          "Küçük tutarlarla denge kurma pratiği kazandırır",
        ],
        cons: [
          "Takip için daha dikkatli kayıt gerekir",
          "Tutarları netleştirmeden yapılırsa karışıklık yaratabilir",
        ],
      },
      {
        id: "c",
        text: "Tamamını uzun vadeli düşünerek ayırırım",
        pros: [
          "Hedefe odaklanma hissini artırabilir",
          "Disiplin duygusu oluşturabilir",
        ],
        cons: [
          "Kısa vadeli ihtiyaç varsa erişim baskısı yaratabilir",
          "Dalgalanma veya süre uyumsuzluğu rahatsız edebilir",
        ],
      },
    ],
    criteria: [
      {
        title: "Erişilebilirlik",
        description: "Bu paraya ne kadar sürede ihtiyaç duyabileceğin ilk filtredir.",
      },
      {
        title: "Risk",
        description: "Kısa vadede dalgalanma seni ne kadar rahatsız eder, bunu düşünmek gerekir.",
      },
      {
        title: "Vade",
        description: "İhtiyaç zamanı ile karar süresi uyumlu değilse stres artabilir.",
      },
    ],
    alternativeReviews: [
      {
        id: "a",
        title: "Kolay erişim odaklı karar",
        summary: "Kısa vadeli güvenlik alanını öne alır ve acil ihtiyaç baskısını düşürür.",
      },
      {
        id: "b",
        title: "Dengeli bölüştürme",
        summary: "Esneklik ile hedef duygusunu aynı anda korumayı dener.",
      },
      {
        id: "c",
        title: "Tam uzun vadeli yaklaşım",
        summary: "Hedef odaklıdır ama kısa vadeli ihtiyaç varsa baskı yaratabilir.",
      },
    ],
  },
  {
    id: "recel",
    title: "Evden üretim geliri senaryosu",
    profileHint: "Evden Üreten için önerilir",
    purpose: "Üretim gelirinin nasıl bölüneceğini düşünmek.",
    concepts: ["Net kâr", "Malzeme yenileme", "Hedef ayırma"],
    duration: "5 dk",
    reason: "Üretim emeğini görünür kılmak ve küçük hedefe bağlamak için önerilir.",
    intro:
      "12 kavanoz reçel sattın ve elinde net kâr kaldı. Şimdi bu tutarı yeniden malzemeye, kişisel hedefe ve serbest alana nasıl böleceğini düşünüyorsun.",
    question: "Bu durumda en yakın yaklaşımın hangisi olurdu?",
    options: [
      {
        id: "a",
        text: "Tamamını yeniden üretime ayırırım",
        pros: [
          "Üretim devamlılığını korur",
          "Malzeme tarafını hızlıca güçlendirir",
          "Bir sonraki satış için hazırlık sağlar",
        ],
        cons: [
          "Kendi hedefin görünmez kalabilir",
          "Kişisel motivasyon alanı zayıflayabilir",
        ],
      },
      {
        id: "b",
        text: "Bir kısmını hedefe, bir kısmını üretime ayırırım",
        pros: [
          "Denge kurar",
          "Hem üretim hem kişisel hedef aynı anda görünür olur",
          "Gelir yönetimi alışkanlığı oluşturur",
        ],
        cons: [
          "Tutarları netleştirmek için plan gerekir",
          "Düzenli takip yapılmazsa dağılabilir",
        ],
      },
      {
        id: "c",
        text: "Tamamını harcama alanına bırakırım",
        pros: [
          "Kısa vadeli rahatlama sağlayabilir",
          "Zorlayıcı bir dönemde nefes alanı açabilir",
        ],
        cons: [
          "Üretim ritmi zayıflayabilir",
          "Kâr görünürlüğü hızla kaybolabilir",
        ],
      },
    ],
    criteria: [
      {
        title: "Net kâr görünürlüğü",
        description: "Kazancın hangi kısmının gerçekten sana kaldığını bilmek gerekir.",
      },
      {
        title: "Malzeme yenileme",
        description: "Üretimin sürmesi için yeniden alım ihtiyacı görünür olmalıdır.",
      },
      {
        title: "Kişisel hedef",
        description: "Üretim gelirinin bir kısmını kendi adına ayırmak motivasyonu güçlendirir.",
      },
    ],
    alternativeReviews: [
      {
        id: "a",
        title: "Tam üretim odaklı karar",
        summary: "İşi sürdürmeye odaklanır ama kişisel hedef alanını geri plana iter.",
      },
      {
        id: "b",
        title: "Dengeli paylaşım",
        summary: "Hem üretimi hem kendi hedefini aynı anda görünür kılar.",
      },
      {
        id: "c",
        title: "Tam serbest harcama",
        summary: "Kısa rahatlık verir ama gelir yönetimi ritmini zayıflatabilir.",
      },
    ],
  },
  {
    id: "fake-message",
    title: "Sahte Mesaj Atölyesi",
    profileHint: "Risk farkındalığı için önerilir",
    purpose: "Şüpheli mesajlarda karar filtresi kurmak.",
    concepts: ["Garanti kazanç", "Resmi doğrulama", "Marka taklidi"],
    duration: "3 dk",
    reason: "Kalkan kullanımı öncesi kısa refleks pratiği sağlar.",
    intro:
      "WhatsApp’ta tanımadığın bir numaradan şu mesaj geldi: “Halkbank yatırım fırsatı! 10.000 TL yatır, 1 ayda 18.000 TL al. Bugün son fırsat. IBAN'a gönder, kimseye söyleme.”",
    question: "Bu durumda ne yaparsın?",
    options: [
      {
        id: "a",
        text: "Önce resmi kurum sitesinden doğrularım",
        pros: [
          "Dolandırıcılık riskini ciddi biçimde azaltır",
          "Resmi kurum kaydı ve yetki bilgisi kontrolünü başlatır",
          "Acele karar baskısını ortadan kaldırır",
        ],
        cons: [
          "Sahte web siteleri de olabileceği için doğru URL’ye dikkat etmek gerekir",
          "Mesaj içindeki linke değil, adresi elle yazarak gitmek daha güvenlidir",
        ],
      },
      {
        id: "b",
        text: "Daha fazla bilgi isterim",
        pros: [
          "Hemen işlem yapmazsın",
          "Mesajın mantığını sorgulamaya başlarsın",
        ],
        cons: [
          "Karşı taraf baskıyı artırabilir",
          "Resmi doğrulama yapılmazsa hâlâ riskli kalır",
        ],
      },
      {
        id: "c",
        text: "Fırsatı kaçırmamak için hızlı davranırım",
        pros: ["Kararsızlığı kısa süreli azaltıyor gibi hissedilebilir"],
        cons: [
          "Baskı diliyle hareket etmeye yol açar",
          "Yüksek risk işaretlerini görmezden gelmene neden olabilir",
        ],
      },
      {
        id: "d",
        text: "Mesajı görmezden gelir ve numarayı engellerim",
        pros: [
          "Teması keserek riski hızlıca durdurur",
          "Baskı döngüsünden çıkmanı sağlar",
        ],
        cons: [
          "Önce ekran görüntüsü veya raporlama adımını atlayabilirsin",
          "Resmi doğrulama refleksi ayrı olarak gelişmeyebilir",
        ],
      },
    ],
    criteria: [
      {
        title: "Resmi kaynak güvencesi",
        description: "Kurumun lisanslı olup olmadığını bağımsız resmi kaynaktan kontrol etmek gerekir.",
      },
      {
        title: "Aciliyet baskısına direnme",
        description: "“Bugün son fırsat” dili tipik manipülasyon göstergesidir.",
      },
      {
        title: "Bağımsız doğrulama",
        description: "Mesajı gönderenin değil, kurumun resmi kanallarından bilgi almak gerekir.",
      },
    ],
    alternativeReviews: [
      {
        id: "a",
        title: "Resmi siteden doğrulama",
        summary: "En güçlü güvenlik refleksidir; acele baskısını etkisizleştirir.",
      },
      {
        id: "b",
        title: "Daha fazla bilgi isteme",
        summary: "İlk adım olarak yavaşlatır ama tek başına yeterli güvence vermez.",
      },
      {
        id: "c",
        title: "Hızlı davranma",
        summary: "Dolandırıcılık mesajlarının en istediği tepkiyi üretir.",
      },
      {
        id: "d",
        title: "Engelleme",
        summary: "Teması keser; ek olarak raporlama ve resmi doğrulama da düşünülebilir.",
      },
    ],
  },
];
