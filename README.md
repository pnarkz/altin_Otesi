# AltınÖtesi MVP

AltınÖtesi, hackathon demosu için hazırlanmış, yatırım tavsiyesi vermeyen bir sosyal FinTech MVP’sidir. Uygulama başlangıç testi, Altınİkiz profili, dolandırıcılık mesajı analizi ve evden üretim gelir-gider görünürlüğü sunar.

## Modüller

### Canlı çalışan
- `/test` — Altınİkiz tanıma akışı ve skor testi
- `/result` — skor, profil ve ilk adımlar
- `/twin` — radar chart, görevler ve kişisel yol haritası
- `/scam-shield` — metin ve URL risk analizi
- `/producer` — gelir, gider ve net kâr hesabı
- `/dashboard` — genel bakış ve modül yönlendirmeleri

### Demo / mock destekli
- `/savings` — hedef ve kumbara görünümü
- `/academy` — önerilen dersler ve öğrenme yolu
- `/simulation` — karar senaryoları
- `/coach` — güvenli AI koç mock ekranı
- `/institution` — anonim sosyal etki paneli

## Teknoloji

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Recharts
- lucide-react

## Kurulum

```bash
npm install
npm run dev
```

Üretim doğrulaması için:

```bash
npm run lint
npm run build
```

## Demo Akışı

1. Ana sayfada `Demo verisiyle başlat` butonuna bas.
2. Dashboard veya Altınİkiz ekranına geç.
3. Dolandırıcılık Kalkanı’nda örnek mesajı analiz et.
4. Producer ekranında varsayılan ürün hesabını göster.

## Demo Verisi

Demo akışı localStorage’a Ayşe Hanım profili yazar:

- Skor: `38`
- Profil: `Evden Üreten Başlangıç`
- Finansal Bilgi: `42`
- Risk Farkındalığı: `58`
- Mikro-Birikim: `25`
- Dolandırıcılık Farkındalığı: `70`
- Evden Üretim Gelir Yönetimi: `35`

## Etik Çerçeve

- AltınÖtesi yatırım tavsiyesi vermez.
- Uygulama eğitim ve farkındalık amaçlıdır.
- Mesaj ve profil çıktıları karar desteği değil, risk görünürlüğü sağlar.
- Finansal kararlar için yetkili kurumların resmi bilgileri esas alınmalıdır.

## Notlar

- Veriler istemci tarafında ve localStorage’da tutulur.
- Gerçek banka, ödeme, açık bankacılık veya backend entegrasyonu yoktur.
- Demo ve mock modüller ürün yönünü göstermek için hazırlanmıştır.

## Ek Dokümanlar

- [Teslim Notları](./DELIVERY_NOTES.md)
- [Demo Checklist](./DEMO_CHECKLIST.md)
- [Demo Script](./DEMO_SCRIPT.md)
- [Final Self Audit](./FINAL_SELF_AUDIT.md)
- [Jury Q&A](./JURY_QA.md)
- [Pitch Deck Outline](./PITCH_DECK_OUTLINE.md)
