# AltınÖtesi MVP Demo Checklist

## Demo Öncesi Teknik Kontrol

1. Terminali açın.
2. Node ve npm görünürlüğünü kontrol edin:

```bash
node -v
npm -v
```

3. Gerekirse bağımlılıkları kurun:

```bash
npm install
```

4. Uygulamayı başlatın:

```bash
npm run dev
```

5. Tarayıcıda `http://localhost:3000` adresini açın.

## Demo Öncesi Tarayıcı ve Veri Temizliği

- Sunumdan önce tarayıcıda localStorage temizleyin.
- Eski test sonucunu taşımamak için uygulamayı gizli pencere veya temiz profil ile açın.
- `Demo verisiyle başlat` akışını ilk kez temiz bir durumda gösterin.

## Açılacak Sayfalar

- `/`
- `/dashboard`
- `/twin`
- `/producer`
- `/scam-shield`
- `/institution`

## 5-7 Dakikalık Demo Akışı

1. Ana sayfada `Demo verisiyle başlat` butonuna basın.
2. Dashboard'ta Ayşe Hanım ve skor `38` olduğunu gösterin.
3. `Altınİkiz` ekranına geçin.
4. `Evden Üreten Kadın` modülü ile Çilek reçeli senaryosunu gösterin.
5. `Dolandırıcılık Kalkanı` ekranında örnek mesajı analiz edin.
6. `Kurum Paneli` ile anonim sosyal etki metriklerini anlatın.

## /twin Ekranında Söylenecek Cümleler

- "Burada kullanıcının sadece puanını değil, karar kalıbını da görselleştiriyoruz."
- "Ayşe Hanım'ın finansal bilgi seviyesi, risk farkındalığı ve mikro-birikim davranışı aynı ekranda okunabiliyor."
- "Bu ekran yatırım tavsiyesi vermez; sadece farkındalık ve eğitim haritası çıkarır."

## /scam-shield Ekranında Yapıştırılacak Örnek Mesaj

```text
10.000 TL yatır, 1 ayda 18.000 TL al. Garanti kazanç. Bugün son fırsat. IBAN’a gönder, kimseye söyleme.
```

Beklenen anlatım:

- En az 6 risk sinyali yakalanır.
- Risk seviyesi `Kritik` görünür.
- Güvenli cevap önerisi herhangi bir alım-satım dili kullanmaz.

## /producer Ekranında Gösterilecek Örnek Hesap

- Ürün adı: `Çilek reçeli`
- Satış fiyatı: `120`
- Satılan adet: `12`
- Malzeme maliyeti: `780`
- Ambalaj gideri: `60`
- Kargo gideri: `0`
- Tahmini emek süresi: `8`

Beklenen sonuç:

- Toplam gelir: `1440 TL`
- Toplam gider: `840 TL`
- Net kâr: `600 TL`
- Saatlik kazanç: `75 TL`

## /institution Ekranında Anlatılacak Sosyal Etki Metrikleri

- Demo kullanıcı sayısı
- Riskli mesaj analizi hacmi
- Tamamlanan test sayısı
- Akademi etkileşimi
- Profil dağılımı ve bölgesel eğitim ihtiyacı gibi anonim göstergeler

## Demo Sırasında Söylenmeyecek Riskli İfadeler

- "Şunu alın"
- "Bunu satın"
- "Bu yatırım size uygun"
- "Kesin kazandırır"
- "En iyi finansal ürün bu"

## İnternet Gitmesi Durumunda Yedek Anlatım Planı

- Uygulamanın tamamen mock veri ve local state ile çalıştığını belirtin.
- Demo verisinin localStorage tabanlı olduğunu, harici API'ye bağlı olmadığını vurgulayın.
- Açık sayfaları yenilemeden sırasıyla anlatımı sürdürün.
- Gerekirse sadece ekran görüntüleri veya açık sekmeler üzerinden şu üç değeri anlatın:
  - Skor ve profil
  - Kritik scam analizi
  - Çilek reçeli kâr hesaplaması
