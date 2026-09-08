# FIRE-GUARD INDONESIA 🛰️🔥
### Sistem Deteksi Kebakaran Hutan & Lahan (Karhutla) Serta Analisis Trajektori Asap Berbasis Angin Riil

Aplikasi pemantauan titik kebakaran hutan dan lahan (Karhutla) di Indonesia yang dirancang khusus dengan pendekatan **User-Centric**: Pengguna tidak perlu mencari di mana letak kebakaran terjadi secara manual, melainkan menentukan **lokasi tempat tinggal/posisi mereka** (melalui **GPS otomatis** atau mengetik **Kecamatan / Kota / Kabupaten**). Sistem akan memindai seluruh anomali termal dan titik api aktif di sekitarnya serta mengalkulasi secara matematis apakah **arah angin meniupkan kabut asap (smoke plume) masuk ke wilayah pemukiman pengguna** atau bertiup menjauh.

---

## 🌟 Fitur Utama

1. **Deteksi Lokasi Cerdas (GPS & Kecamatan/Kota)**
   - **GPS Real-Time**: Deteksi koordinat posisi pengguna secara instan dari perangkat mobile/desktop dengan reverse-geocoding otomatis.
   - **Pencarian Kecamatan / Kota**: Fitur autocomplete cerdas untuk mencari seluruh wilayah di Indonesia (didukung preset cepat daerah rawan Karhutla di Riau, Jambi, Sumsel, Kalbar, Kalteng, Kalsel, Jabar, Jatim, NTT, dll. serta integrasi OpenStreetMap Nominatim).
   - **Pemilihan Titik Langsung di Peta**: Cukup klik pada peta untuk memindahkan lokasi pemantauan.

2. **Analisis Trajektori Arah Angin & Sebaran Asap (Smoke Dispersion Modeling)**
   - Mengambil data meteorologi arah & kecepatan angin riil (*surface wind* 10m & *atmospheric transport* 850 hPa) dari Open-Meteo ECMWF & GFS.
   - Algoritma trigonometri bola & azimuth bearing menghitung perbandingan vektor tiupan angin terhadap vektor arah titik api ke lokasi pengguna.
   - Menghasilkan status ancaman:
     - 🚨 **BAHAYA (DANGER_SMOKE_IMPACT)**: Angin meniupkan kabut asap langsung menuju posisi Anda, lengkap dengan estimasi waktu tiba asap (*Smoke Arrival ETA* dalam menit).
     - ⚠️ **WASPADA (WARNING_NEAR_FIRE)**: Titik api sangat dekat (< 10 km) dengan risiko pergeseran angin mendadak atau bara terbang.
     - ℹ️ **WASPADA (ALERT_FIRE_DOWNWIND)**: Terdapat titik api aktif di radius sekitar, namun arah angin saat ini bertiup menjauhi posisi Anda.
     - 🛡️ **AMAN (SAFE_NO_FIRE)**: Tidak terdeteksi hotspot satelit dalam radius pemantauan.

3. **Peta Taktis Satelit Interaktif (Tactical GIS)**
   - Dark mode CartoDB minimalis bergaya pusat komando bencana (tanpa desain "AI slop" atau gradien berlebihan).
   - Menampilkan radius pemindaian (15 km, 25 km, 50 km, 75 km).
   - Visualisasi kerucut asap (*smoke plume cone*) yang mengalir searah tiupan angin.
   - Kompas HUD interaktif dengan indikator jarum arah angin real-time.
   - Popup detail hotspot: Satelit pendeteksi (VIIRS 375m / MODIS), daya radiasi api (*Fire Radiative Power* dalam MW), dan suhu kecerahan (*brightness temperature* Kelvin).

4. **Telemetri Kualitas Udara & Kontak Darurat Terpadu**
   - Pemantauan partikulat asap halus PM2.5, debu PM10, dan Karbon Monoksida (CO) dari Copernicus Atmosphere Monitoring Service (CAMS).
   - Klasifikasi baku mutu ISPU / WHO.
   - Hotline tanggap darurat terintegrasi (Damkar 113, Manggala Agni KLHK 1500-111, BPBD 112/117, Ambulans 118/119).

---

## 🚀 Panduan Menjalankan di Lokal

### Prasyarat:
- Node.js >= 20.0.0
- npm >= 9.0.0

```bash
# 1. Masuk ke direktori proyek
cd deteksi-kebakaran

# 2. Install dependensi
npm install

# 3. Jalankan server pengembangan
npm run dev

# Buka http://localhost:3000 di browser
```

---

## 🚢 Deployment ke Railway

Proyek ini telah dikonfigurasi secara lengkap dan optimal untuk Railway menggunakan **Docker Multi-Stage Build** (Node 20 Bookworm Slim) dengan Next.js **Standalone Output**:

1. Pastikan repository telah terhubung ke GitHub: `https://github.com/VixStnly/deteksi-kebakaran.git`.
2. Masuk ke [Railway Dashboard](https://railway.com/) dan pilih **New Project** -> **Deploy from GitHub repo**.
3. Pilih repository `deteksi-kebakaran`.
4. Railway akan otomatis mendeteksi `railway.json` dan `Dockerfile`.
5. Aplikasi akan ter-build dan langsung berstatus aktif (live) di port 3000 tanpa kendala dependensi OS.

---

## 📡 Sumber Data (Data Provenance)
- **NASA FIRMS** (Fire Information for Resource Management System): Satelit Suomi-NPP & NOAA-20/21 VIIRS (resolusi 375m) dan Aqua/Terra MODIS.
- **KLHK SiPongi**: Sistem Informasi Pengendalian Kebakaran Hutan dan Lahan Kementerian Lingkungan Hidup dan Kehutanan.
- **Open-Meteo & ECMWF / GFS**: Data vektor angin dan atmosfer riil.
- **Copernicus CAMS & SILAM**: Data partikulat PM2.5, PM10, dan gas Karbon Monoksida (CO).
- **OpenStreetMap & CARTO**: Kartografi batas wilayah dan peta taktis.
