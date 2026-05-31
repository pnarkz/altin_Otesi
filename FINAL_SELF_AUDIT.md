# AltınÖtesi MVP Final Self Audit

## Canlı Çalışan Modüller

- Landing sayfası
- Çok katmanlı test
- Sonuç ve skor ekranı
- Altınİkiz
- Dolandırıcılık Kalkanı
- Evden Üreten Kadın modülü

## Mockup Modüller

- Kendi Adıma Kumbara
- AltınÖtesi Akademi
- Simülasyon Laboratuvarı
- AI Finans Koçu
- Kurum paneli detay alanları

## MVP Dışında Bırakılan Özellikler

- Gerçek banka entegrasyonu
- Açık bankacılık
- Ödeme sistemleri
- Gerçek yatırım veya alım-satım işlemleri
- Authentication
- Veritabanı
- Backend servisleri
- Gerçek kullanıcı analitiği

## Etik AI ve Yatırım Tavsiyesi Güvenliği

- Uygulama yatırım tavsiyesi vermez.
- Hiçbir ekranda "al", "sat", "kesin kazanır" gibi yönlendirici dil kullanılmaz.
- Scam Shield analizleri kural tabanlıdır ve farkındalık odaklıdır.
- Tüm finansal dil eğitim, davranış ve risk farkındalığı çerçevesindedir.

## KVKK / Veri Mahremiyeti Yaklaşımı

- Test sonucu yalnızca kullanıcının tarayıcısındaki localStorage içinde tutulur.
- Kurum panelinde bireysel veri değil, anonim ve sahte metrikler kullanılır.
- Demo verisi deterministiktir ve harici sisteme gönderilmez.
- Hassas kimlik, banka veya ödeme verisi toplanmaz.

## Bilinen Teknik Sınırlılıklar

- Uygulama şu anda mock veri ve frontend state üzerinden çalışır.
- Backend, auth ve veri kalıcılığı MVP sonrası aşamaya bırakılmıştır.
- Akademi, Simülasyon, Kumbara ve AI Koç ekranları ürün yönünü gösteren demo yüzeylerdir; gerçek servis bağlantıları yoktur.

## Node/npm Kurulunca Çalıştırılacak Doğrulama Komutları

```bash
node -v
npm -v
npm install
npm run lint
npm run build
npm run dev
```

## İlk Build Hatasında Kontrol Edilecek Dosyalar

- `package.json`
- `tsconfig.json`
- `.eslintrc.json`
- `app/layout.tsx`
- `components/providers/app-state-provider.tsx`
- `components/result/result-guard.tsx`
- `app/twin/page.tsx`
- `lib/scoring.ts`
- `lib/scam.ts`
- `lib/producer.ts`
