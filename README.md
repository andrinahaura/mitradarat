# MitraDarat v2

Prototipe redesign aplikasi MitraDarat (Ditjen Perhubungan Darat) yang dibuat dengan Expo dan React Native. Semua halaman v1 dibangun ulang sebagai layar native: Beranda, Lacak dengan peta interaktif, Layanan (Cek Laik, eTiket Terminal, Peta Prasarana, Peta Tematik, Lalu Lintas, Survei Kepuasan, Pusat Bantuan), Berita, Akun, dan Kotak Masuk.

> Ini prototipe untuk kajian desain, bukan aplikasi resmi. Semua data adalah contoh. Login, kontak resmi, dan pengiriman laporan belum tersambung ke server.

## Teknologi

- Expo SDK 58, React Native 0.88, React 19, TypeScript
- Expo Router (navigasi berbasis file di `src/app`)
- react-native-maps (Apple Maps di iOS), Reanimated 4

## Menjalankan di HP (paling mudah)

Yang dibutuhkan: Node.js 22.13 atau lebih baru, dan aplikasi **Expo Go** di HP (App Store atau Play Store) yang mendukung SDK 58.

```bash
git clone https://github.com/andrinahaura/mitradarat.git
cd mitradarat
npm install
npx expo start
```

Lalu scan QR yang muncul di terminal:

- **iPhone:** pakai aplikasi Kamera, lalu buka di Expo Go.
- **Android:** pakai tombol "Scan QR code" di Expo Go.

HP dan komputer harus di Wi-Fi yang sama. Kalau tidak bisa tersambung, jalankan `npx expo start --tunnel`.

## Pratinjau di browser

```bash
npx expo start --web
```

Peta tidak tampil di browser (hanya di HP), selebihnya bisa dicoba.

## Data contoh untuk mencoba

- **Cek Laik:** plat `H 7191 OQ`, `B 7012 TGA`, atau `AB 7123 XY`
- **eTiket Terminal:** kode `TOS7K2M9` dengan nama `Budi Santoso`
- **Masuk / Daftar:** isi bebas; prototipe tidak memeriksa atau menyimpan kata sandi

## Struktur

- `src/app/` layar dan navigasi (satu file = satu halaman)
- `src/components/` komponen UI
- `src/constants/` token desain (`theme.ts`), header (`navigation.ts`), animasi (`motion.ts`)
- `src/data/` data contoh
- `design.md` panduan desain, `docs/analisis-ux.md` analisis UX aplikasi v1

## Pemeriksaan

```bash
npx tsc --noEmit
npx expo lint
```

Jalankan `npx expo start` sekali sebelum `npx tsc`: perintah itu membuat `expo-env.d.ts` (tipe untuk impor CSS), yang tidak ikut di repo. Satu error tipe di `src/components/app-tabs.web.tsx` dan satu error lint di `src/hooks/use-color-scheme.web.ts` berasal dari template Expo dan hanya menyangkut versi web; aplikasi tetap berjalan.

Jangan jalankan `npm run reset-project`: skrip bawaan template itu memindahkan seluruh isi `src/app` ke folder `example`.
