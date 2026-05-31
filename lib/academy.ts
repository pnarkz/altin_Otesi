export type AcademyLessonStatus = "completed" | "recommended" | "in-progress" | "locked";

export type AcademyQuizQuestion = {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export type AcademyLesson = {
  id: string;
  week: 1 | 2 | 3 | 4;
  title: string;
  description: string;
  duration: number;
  level: "Başlangıç" | "Orta";
  type: "Kart" | "Senaryo" | "Mini Quiz";
  status: AcademyLessonStatus;
  recommended?: boolean;
  content: string[];
  takeaway: string;
  quiz: AcademyQuizQuestion[];
};

export const academyLessons: AcademyLesson[] = [
  {
    id: "lesson-1",
    week: 1,
    title: "Net kâr nasıl hesaplanır?",
    description: "Gelir, gider ve emeği tek tabloya toplar.",
    duration: 5,
    level: "Başlangıç",
    type: "Kart",
    status: "completed",
    recommended: true,
    content: [
      "Net kâr, toplam gelirinden toplam giderini çıkardığında kalan tutardır.",
      "Gelirin yanında malzeme, ambalaj, kargo ve emek süresini birlikte görmek karar güvenini artırır.",
      "Kârı görmek, üretim emeğini görünür hale getirmenin ilk adımıdır.",
    ],
    takeaway:
      "Gelir yüksek görünse bile gerçek karar için toplam gideri ve emek süresini birlikte okumak gerekir.",
    quiz: [
      {
        id: "lesson-1-q1",
        prompt: "Net kâr nasıl bulunur?",
        options: ["Gelir + gider", "Gelir - gider", "Sadece satış fiyatı"],
        correctIndex: 1,
        explanation: "Net kâr, toplam gelirden toplam gider çıkarılarak hesaplanır.",
      },
      {
        id: "lesson-1-q2",
        prompt: "Aşağıdakilerden hangisi gider değildir?",
        options: ["Malzeme", "Ambalaj", "Satış adedi"],
        correctIndex: 2,
        explanation: "Satış adedi hesaplamada kullanılır ama doğrudan gider kalemi değildir.",
      },
    ],
  },
  {
    id: "lesson-2",
    week: 1,
    title: "Enflasyon nedir?",
    description: "Günlük bütçede zaman etkisini görünür kılar.",
    duration: 4,
    level: "Başlangıç",
    type: "Kart",
    status: "completed",
    content: [
      "Enflasyon, fiyatların zaman içinde artması ve paranın alım gücünün azalmasıdır.",
      "Aynı tutarla daha az ürün alınabilmesi ev bütçesinde doğrudan hissedilir.",
      "Bu yüzden hedef koyarken bugünkü ihtiyaç ile birkaç ay sonraki ihtiyacı ayırmak önemlidir.",
    ],
    takeaway: "Enflasyon farkındalığı, bütçe ve hedef kararlarında zamanı hesaba katmayı sağlar.",
    quiz: [
      {
        id: "lesson-2-q1",
        prompt: "Enflasyon olduğunda genelde ne olur?",
        options: ["Paranın alım gücü artar", "Paranın alım gücü azalır", "Fiyatlar sabit kalır"],
        correctIndex: 1,
        explanation: "Enflasyon fiyatları yükseltir; aynı parayla daha az şey alınır.",
      },
      {
        id: "lesson-2-q2",
        prompt: "Enflasyon en çok hangi alanda hemen hissedilir?",
        options: ["Günlük harcamalarda", "Sadece tatilde", "Sadece büyük yatırımlarda"],
        correctIndex: 0,
        explanation: "Market ve fatura gibi günlük giderlerde etkisi daha görünür olur.",
      },
    ],
  },
  {
    id: "lesson-3",
    week: 1,
    title: "Acil durum fonu ne demek?",
    description: "Güvenlik alanı ile hedef birikimi ayırmayı öğretir.",
    duration: 5,
    level: "Başlangıç",
    type: "Kart",
    status: "in-progress",
    content: [
      "Acil durum fonu, beklenmedik harcamalarda kullanılmak üzere ayrılan güvenlik birikimidir.",
      "Bu fon yatırım amacı taşımaz; önce erişilebilir ve güvenli olması beklenir.",
      "Küçük tutarlarla başlamak bile finansal rahatlama sağlar.",
    ],
    takeaway: "Acil durum fonu, hedef birikimden ayrı düşünülmesi gereken koruma alanıdır.",
    quiz: [
      {
        id: "lesson-3-q1",
        prompt: "Acil durum fonunun temel amacı nedir?",
        options: ["Getiri aramak", "Beklenmedik ihtiyacı karşılamak", "Borç vermek"],
        correctIndex: 1,
        explanation: "Bu fonun amacı güvence sağlamaktır, getiri aramak değildir.",
      },
      {
        id: "lesson-3-q2",
        prompt: "Acil durum fonu için ilk öncelik hangisidir?",
        options: ["Hızlı erişim", "Yüksek risk", "Uzun vade"],
        correctIndex: 0,
        explanation: "Acil ihtiyaçta kullanılacağı için erişilebilirlik önce gelir.",
      },
    ],
  },
  {
    id: "lesson-4",
    week: 1,
    title: "Bütçe artığı nedir?",
    description: "Ay sonunda kalan serbest alanı görünür hale getirir.",
    duration: 4,
    level: "Başlangıç",
    type: "Mini Quiz",
    status: "recommended",
    content: [
      "Bütçe artığı, ay sonunda gelirden sonra elde kalan serbest tutardır.",
      "Bu tutar görünür olduğunda hedefe ayırma veya tampon oluşturma daha kolay olur.",
    ],
    takeaway: "Az da kalsa artığı görmek, finansal özgüven için başlangıç sinyalidir.",
    quiz: [
      {
        id: "lesson-4-q1",
        prompt: "Bütçe artığı neyi ifade eder?",
        options: ["Ay sonunda elde kalan tutarı", "Sadece maaşı", "Borç toplamını"],
        correctIndex: 0,
        explanation: "Bütçe artığı, zorunlu giderlerden sonra kalan serbest alandır.",
      },
      {
        id: "lesson-4-q2",
        prompt: "Bütçe artığı küçükse ne yapılabilir?",
        options: ["Hiç takip etmemek", "Küçük hedefe bağlamak", "Tamamını unutmak"],
        correctIndex: 1,
        explanation: "Küçük artıkları görünür hedefe bağlamak alışkanlık kurar.",
      },
    ],
  },
  {
    id: "lesson-5",
    week: 2,
    title: "Mikro-birikim alışkanlığı",
    description: "Küçük ama düzenli adım mantığını kurar.",
    duration: 5,
    level: "Başlangıç",
    type: "Kart",
    status: "recommended",
    recommended: true,
    content: [
      "Mikro-birikim, büyük tutar beklemeden küçük ama düzenli ayırma alışkanlığıdır.",
      "Hedefe bağlandığında motivasyon artar ve devam etmek kolaylaşır.",
    ],
    takeaway: "Düzenlilik, tek seferlik yüksek tutardan daha sürdürülebilir olabilir.",
    quiz: [
      {
        id: "lesson-5-q1",
        prompt: "Mikro-birikim için en önemli unsur nedir?",
        options: ["Düzenlilik", "Tek seferde büyük tutar", "Tam risk alma"],
        correctIndex: 0,
        explanation: "Mikro-birikimde küçük ama düzenli adım esastır.",
      },
      {
        id: "lesson-5-q2",
        prompt: "Mikro-birikim neyi güçlendirir?",
        options: ["Hedef ritmini", "Karmaşıklığı", "Belirsizliği"],
        correctIndex: 0,
        explanation: "Küçük hedeflere düzenli gitmek ritim kazandırır.",
      },
    ],
  },
  {
    id: "lesson-6",
    week: 2,
    title: "Hedef koymak neden önemli?",
    description: "Biriktirme davranışını görünür bir amaca bağlar.",
    duration: 5,
    level: "Başlangıç",
    type: "Kart",
    status: "recommended",
    content: [
      "Hedef, birikimi soyut bir fikir olmaktan çıkarıp görünür bir adıma çevirir.",
      "Ne için ayırdığını bilmek, kararsızlığı azaltır.",
    ],
    takeaway: "İsim verilmiş hedef, ayrılan tutarın anlamını büyütür.",
    quiz: [
      {
        id: "lesson-6-q1",
        prompt: "Hedef koymak neyi kolaylaştırır?",
        options: ["Takibi", "Unutmayı", "Belirsizliği artırmayı"],
        correctIndex: 0,
        explanation: "Hedef olduğunda ilerleme daha görünür olur.",
      },
      {
        id: "lesson-6-q2",
        prompt: "Hedef kartı neden faydalıdır?",
        options: ["Hatırlatıcı olur", "Kararı gizler", "Maliyeti artırır"],
        correctIndex: 0,
        explanation: "Hedef kartı, kararını görünür tutar.",
      },
    ],
  },
  {
    id: "lesson-7",
    week: 2,
    title: "Hedef ayırma teknikleri",
    description: "Birden fazla hedefte öncelik kurmayı gösterir.",
    duration: 5,
    level: "Orta",
    type: "Senaryo",
    status: "locked",
    content: [
      "Tek hedef yerine ihtiyaca göre küçük alt başlıklar oluşturmak netlik sağlar.",
      "Acil durum, eğitim ve üretim ekipmanı gibi hedeflerin ayrı görünmesi karar kalitesini artırır.",
    ],
    takeaway: "Aynı tutarı bölüştürürken öncelik sırası belirlemek kafa karışıklığını azaltır.",
    quiz: [
      {
        id: "lesson-7-q1",
        prompt: "Birden fazla hedefte ilk yapılacak şey nedir?",
        options: ["Öncelik sırası belirlemek", "Hepsini aynı görmek", "Hiçbirini yazmamak"],
        correctIndex: 0,
        explanation: "Öncelik sırası, hangi hedefe önce enerji verileceğini netleştirir.",
      },
      {
        id: "lesson-7-q2",
        prompt: "Hedef ayırmak neyi azaltır?",
        options: ["Karar karmaşasını", "Netliği", "Takibi"],
        correctIndex: 0,
        explanation: "Ayrı hedef kartları, karışıklığı azaltır.",
      },
    ],
  },
  {
    id: "lesson-8",
    week: 3,
    title: "Garanti kazanç tuzakları",
    description: "Riskli vaat dilini tanımayı öğretir.",
    duration: 4,
    level: "Başlangıç",
    type: "Mini Quiz",
    status: "locked",
    content: [
      "Garanti kazanç dili, finansal mesajlarda en temel risk işaretlerinden biridir.",
      "Özellikle hız baskısı ile birleştiğinde kullanıcıyı düşünmeden harekete zorlar.",
    ],
    takeaway: "Yatırım veya kazanç başlığında garanti ifadesi görüldüğünde durmak gerekir.",
    quiz: [
      {
        id: "lesson-8-q1",
        prompt: "“Garanti kazanç” ifadesi neyi düşündürmelidir?",
        options: ["Şüpheyi", "Rahatlığı", "Kesin güveni"],
        correctIndex: 0,
        explanation: "Kesin getiri dili riskli bir işarettir.",
      },
      {
        id: "lesson-8-q2",
        prompt: "Baskı diliyle birlikte gelirse ne yapılmalı?",
        options: ["Durup doğrulama yapmak", "Hızlı davranmak", "IBAN istemek"],
        correctIndex: 0,
        explanation: "Karar baskısı varsa işlem durdurulmalıdır.",
      },
    ],
  },
  {
    id: "lesson-9",
    week: 3,
    title: "Sahte mesaj tanıma",
    description: "Mesajı ton, link ve göndericiyle birlikte okur.",
    duration: 5,
    level: "Başlangıç",
    type: "Senaryo",
    status: "locked",
    content: [
      "Sahte mesajlar genelde acele ettirir, özel fırsat vurgular ve kişisel veri ister.",
      "Mesajın tonu kadar gönderen bilgisi ve bağlantı yapısı da önemlidir.",
    ],
    takeaway: "Mesajı sadece cümleleriyle değil, bağlantısı ve gönderen mantığıyla birlikte okumak gerekir.",
    quiz: [
      {
        id: "lesson-9-q1",
        prompt: "Sahte mesajlarda sık görülen kalıp hangisidir?",
        options: ["Hemen karar ver", "Resmi siteden kontrol et", "Yavaş düşün"],
        correctIndex: 0,
        explanation: "Acele ettirme dolandırıcılıkta çok yaygındır.",
      },
      {
        id: "lesson-9-q2",
        prompt: "Mesajı incelerken neye de bakılmalı?",
        options: ["Bağlantıya", "Sadece emojilere", "Sadece saate"],
        correctIndex: 0,
        explanation: "URL ve alan adı güçlü bir risk sinyali taşıyabilir.",
      },
    ],
  },
  {
    id: "lesson-10",
    week: 3,
    title: "IBAN dolandırıcılığı",
    description: "Doğrudan para isteme sinyalini yorumlatır.",
    duration: 4,
    level: "Başlangıç",
    type: "Kart",
    status: "locked",
    content: [
      "Doğrudan IBAN’a para istemek resmi süreç dışında riskli bir işaret olabilir.",
      "Resmi kurumların iletişim ve doğrulama akışları farklıdır.",
    ],
    takeaway: "IBAN isteme tek başına karar verdirmemeli; kurum ve yetki bilgisi bağımsız doğrulanmalıdır.",
    quiz: [
      {
        id: "lesson-10-q1",
        prompt: "Doğrudan IBAN isteme ne yaratır?",
        options: ["Şüphe", "Kesin güven", "Hiçbir şey"],
        correctIndex: 0,
        explanation: "Doğrudan para talebi resmi süreçten bağımsız olabilir.",
      },
      {
        id: "lesson-10-q2",
        prompt: "İlk yapılacak şey nedir?",
        options: ["Resmi kaynaktan doğrulamak", "Hemen göndermek", "Numarayı silmek ve yine de para yollamak"],
        correctIndex: 0,
        explanation: "Doğrulama yapmadan ilerlenmemelidir.",
      },
    ],
  },
  {
    id: "lesson-11",
    week: 4,
    title: "Vadeli mevduat mantığı",
    description: "Süre ve erişim ilişkisini sadeleştirir.",
    duration: 6,
    level: "Orta",
    type: "Kart",
    status: "locked",
    content: [
      "Vadeli mevduat belirli süre ve koşullarla çalışan temel bir ürün mantığıdır.",
      "Burada önemli olan ürün adı değil; vade, erişim ve ihtiyaç ilişkisinin nasıl kurulduğunu anlamaktır.",
    ],
    takeaway: "Vade uzadıkça erişim ihtiyacı daha önemli bir filtre haline gelir.",
    quiz: [
      {
        id: "lesson-11-q1",
        prompt: "Vadeli yapıda en önemli kavramlardan biri nedir?",
        options: ["Süre", "Rastlantı", "Bilinmezlik"],
        correctIndex: 0,
        explanation: "Vade, ürün mantığının temel parçasıdır.",
      },
      {
        id: "lesson-11-q2",
        prompt: "Karar verirken hangi soru önemlidir?",
        options: ["Paraya ne zaman ihtiyaç duyacağım?", "Sadece rengi ne?", "Sadece adı ne?"],
        correctIndex: 0,
        explanation: "Erişim zamanı, vade kararında önemlidir.",
      },
    ],
  },
  {
    id: "lesson-12",
    week: 4,
    title: "Risk-vade ilişkisi",
    description: "Risk ve süreyi birlikte okumayı öğretir.",
    duration: 6,
    level: "Orta",
    type: "Mini Quiz",
    status: "locked",
    content: [
      "Risk ve vade birlikte okunması gereken iki temel filtredir.",
      "Kısa vadeli ihtiyaç ile yüksek dalgalanma aynı masada olduğunda karar zorlaşır.",
    ],
    takeaway: "Bir karar vermeden önce risk, süre ve erişilebilirlik birlikte düşünülmelidir.",
    quiz: [
      {
        id: "lesson-12-q1",
        prompt: "Risk ve vade neden birlikte düşünülür?",
        options: ["İhtiyaç zamanını etkilediği için", "Sadece isim benzedikleri için", "Hiçbir ilgileri olmadığı için"],
        correctIndex: 0,
        explanation: "Paraya ne zaman ihtiyaç olduğu kararın risk algısını değiştirir.",
      },
      {
        id: "lesson-12-q2",
        prompt: "Kısa vadeli ihtiyacı olan biri önce neye bakmalı?",
        options: ["Erişilebilirliğe", "Sadece duyuma", "Sadece çevre yorumuna"],
        correctIndex: 0,
        explanation: "Kısa vadede erişim ihtiyacı ilk filtredir.",
      },
    ],
  },
];
