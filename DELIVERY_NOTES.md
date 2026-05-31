# AltınÖtesi MVP Delivery Notes

## Canlı Çalışan Modüller

- Çok katmanlı test
- Skor ve profil sonucu
- Altınİkiz radar chart ve görevler
- Dolandırıcılık Kalkanı
- Evden Üreten Kadın modülü

## Mockup Olan Modüller

- Kendi Adıma Kumbara
- AltınÖtesi Akademi
- Simülasyon Laboratuvarı
- AI Finans Koçu
- Kurum paneli özet ekranları

## MVP Dışında Bırakılan Özellikler

- Gerçek banka entegrasyonu
- Açık bankacılık
- Ödeme altyapısı
- Gerçek alım-satım işlemleri
- Gerçek yatırım ürünü önerisi
- Authentication
- Veritabanı
- Backend API servisleri

## Yatırım Tavsiyesi Güvenliği

- Uygulama metinlerinde alım-satım yönlendirmesi bulunmaz.
- Skor, twin ve üretim modülü eğitim ve farkındalık diliyle yazılmıştır.
- Scam Shield çıktısı güvenli cevap önerisi verir, ürün veya yatırım tavsiyesi vermez.
- Kritik ekranlarda "AltınÖtesi yatırım tavsiyesi vermez" ve "yetkili finans kuruluşlarından bilgi alınmalıdır" uyarıları yer alır.

## KVKK ve Veri İşleme Yaklaşımı

- Kullanıcının test sonucu sadece tarayıcı localStorage içinde tutulur.
- Kurum panelinde bireysel veri değil, anonim ve sahte sosyal etki metrikleri gösterilir.
- Demo verisi deterministik ve sabittir; harici servise gönderilmez.
- Bu MVP sürümünde gerçek kimlik, banka veya hassas finansal veri işlenmez.

## Gerçek Build Doğrulaması İçin Çalıştırılacak Komutlar

```bash
npm install
npm run lint
npm run build
npm run dev
```

## Node/npm Yoksa Alınan Hata Ne Anlama Gelir

Windows terminalinde `npm is not recognized as the name of a cmdlet, function, script file, or operable program` hatası görülüyorsa:

- Node.js kurulu olmayabilir.
- Node.js kurulu olsa bile terminal yeniden açılmamış olabilir.
- `npm` PATH değişkenine eklenmemiş olabilir.

Bu durumda önce Node.js 20 LTS kurulup terminal yeniden başlatılmalı, sonra `node -v` ve `npm -v` ile doğrulama yapılmalıdır.
