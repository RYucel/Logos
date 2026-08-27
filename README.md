# ΛΟΓΟΣ - Greek Language Learning PWA & Platform

Akademik standartlarda modern Yunanca öğrenme platformu ve Progressive Web App (PWA).

## 🚀 Özellikler

- **Akademik & Günlük Yunanca Müfredatı**: 500'ü aşkın temel fiil, isim, sıfat, seyahat, mutfak ve günlük diyalog kalıpları.
- **Bilimsel SM-2 Aralıklı Tekrar (Spaced Repetition)**: Kelime hafızasını en üst düzeye çıkaran akıllı arka plan planlayıcısı.
- **PWA (Progressive Web App) Desteği**:
  - Android, iOS ve Masaüstü için tam ekran uygulama deneyimi.
  - Link açıldığında anında kurulum daveti ve rehberi.
  - Çevrimdışı (Offline) çalışma kabiliyeti ve Service Worker önbelleklemesi.
  - Özel yüksek çözünürlüklü Android adaptive/maskable ikon seti (72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512, SVG, Apple Touch Icon).
- **GitHub Actions Entegrasyonu**: Her `git push` işleminde otomatik lint, derleme ve GitHub Pages / Production dağıtımı.

---

## 📦 GitHub'a Push ve Otomatik Deploy (GitHub Actions)

Projeyi GitHub'a yüklemek ve GitHub Actions ile yayına almak için terminalde aşağıdaki komutları çalıştırabilirsiniz:

```bash
# 1. Git repository başlatın (henüz başlatılmadıysa)
git init

# 2. Tüm dosyaları ve PWA varlıklarını ekleyin
git add .

# 3. İlk commit'i oluşturun
git commit -m "feat: Add full PWA support, Android icon set, SM-2 engine, and GitHub Actions deploy workflow"

# 4. GitHub repository adresinizi ekleyin (kendi repo linkinizi yazın)
git remote add origin https://github.com/KULLANICI_ADINIZ/logos-greek-pwa.git

# 5. Ana dala gönderin
git branch -M main
git push -u origin main
```

### GitHub Pages Ayarı:
1. GitHub reponuzda **Settings > Pages** sekmesine gidin.
2. **Build and deployment > Source** seçeneğini **GitHub Actions** olarak seçin.
3. `main` dalına push yaptığınızda `.github/workflows/deploy.yml` otomatik çalışacak ve uygulamanız canlıya alınacaktır.

---

## 📱 PWA İkonları ve Varlıklar

İkonlar `/public/icons` ve `/public` dizininde otomatik oluşturulmuştur:
- `favicon.svg` & `favicon.ico`
- `icon-192x192.png` (Android Launcher standardı)
- `icon-512x512.png` (Yüksek çözünürlüklü splash ekranı)
- `icon-512x512-maskable.png` (Android Adaptive Icon güvenli alanlı)
- `apple-touch-icon.png` (iOS Safari Ana Ekran simgesi)
- `manifest.json` & `manifest.webmanifest`
- `sw.js` (Service Worker)

İkonları yeniden oluşturmak isterseniz:
```bash
node scripts/generate-icons.js
```

---

## 🛠️ Yerel Geliştirme

```bash
# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm run dev

# Üretim için derleyin
npm run build
```
