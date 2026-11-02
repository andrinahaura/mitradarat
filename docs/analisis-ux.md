# Analisis UX MitraDarat (iOS v2.9.0)

Analisis ini dibuat dari 72 screenshot di folder `screenshots/` (lihat `screenshots/INDEX.md`). Nomor dalam kurung, misalnya (13), merujuk ke nomor screenshot.

Batasan: layar yang butuh mengirim form, login ulang, onboarding, atau membuka aplikasi lain tidak dianalisis. Resolusi screenshot rendah (sekitar 360×780), jadi kode warna dan ukuran huruf di bawah adalah perkiraan.

---

## 1. Ringkasan

MitraDarat adalah aplikasi informasi angkutan darat dari Ditjen Perhubungan Darat. Fungsi intinya ada tiga: melacak bus kota secara langsung, melihat peta prasarana (terminal, pelabuhan, jembatan timbang, posko mudik), dan membaca berita.

Masalah terbesar:

1. **Data terlihat tidak bisa dipercaya.** Marker posko mudik muncul di Afrika, posisi bus live berumur 1,5 jam tanpa peringatan, callout ATMS berisi "-" semua, FAQ menampilkan ikon gambar rusak, dan banner mudik masih bertanggal 2024.
2. **Fitur utama tersembunyi dan tidak stabil.** Tracking bus tidak punya tab sendiri. Separuh fitur tersembunyi di balik segmen "Tools". Ikon layanan di Home hilang setelah pindah tab.
3. **Peta sulit dipakai.** Peta terbuka di zoom se-Asia, ratusan marker bertumpuk tanpa clustering, semua rute KSPN berwarna hitam, dan rute Semarang tampil sekaligus tanpa legenda.
4. **Tampilan tidak konsisten.** Bahasa Inggris dan Indonesia bercampur, ada beberapa gaya ikon dan beberapa font (termasuk Times New Roman), dan halaman webview punya gaya visual sendiri-sendiri.
5. **Teks terpotong di banyak tempat.** Nama rute, nama operator di grid, chip filter, dan kartu Information and Guide.

---

## 2. Peta navigasi

```
Tab bar (3 tab)
├── Home
│   ├── Header: logo, ikon lonceng → Inbox
│   │   └── Inbox: tab Message (11), tab Notification (12, tidak bisa dibuka detailnya)
│   ├── Quick Tracking (carousel operator terakhir)
│   │   └── Peta tracking (13) → Select Route (14, 19) → Detail rute (15, 20)
│   │       ├── Callout bus live (16)
│   │       └── Callout halte (17) → Bus Arrival (18)
│   ├── Segmen "Tracking Bus" (grid 6 + kartu Bus Pariwisata)
│   │   ├── Bus Pariwisata → Cek Laik Bus Pariwisata (22) → FAQ
│   │   ├── Teman Bus → list/grid operator (23–25) → peta tracking
│   │   ├── BRT Nusantara → list/grid operator (26–27) → peta tracking
│   │   ├── KSPN → list BPTD (28–29) → peta rute (30)
│   │   ├── Perintis → list BPTD (31) → peta rute
│   │   ├── AKAP → list operator (32–33) → peta rute
│   │   └── BisKita → list (1 item) (34) → peta tracking
│   ├── Segmen "Tools" (35)
│   │   ├── Cek Laik (36) → FAQ Cek Laik (37)
│   │   ├── Peta Prasarana (38–41): Terminal / Pelabuhan / Jembatan Timbang → callout → Direction (Google Maps)
│   │   ├── Peta Tematik (42–48): rute mudik, Posko Mudik, Bengkel Siaga, Pelabuhan → callout → detail
│   │   └── ATMS (49–51): layer Ruas / Simpang / Lainnya → callout
│   ├── Kartu "Tracking Bus IKN" → peta tracking IKN (21)
│   ├── Banner carousel (02–04), tidak bisa diketuk
│   ├── "Maybe it's important to you" (carousel)
│   │   ├── Survei Kepuasan (52–53, webview)
│   │   ├── eTicket TOS (54, webview)
│   │   └── Cek Kelaikan Kendaraan (07) → Cek Laik
│   ├── News for you (2 kartu) → detail berita
│   └── Information and Guide: FAQ (55–57), Hubungi CS, Sosial Media
├── News
│   └── List berita (58–59) → detail (60–61)
└── Profile (62)
    ├── Report & Complains: form (63) → kategori (64), tab Response (65)
    ├── Privacy Policy (66–67), Terms & Conditions (68–69), About (70–71)
    ├── Write a Review (App Store), Language (keluar ke iOS Settings, 72)
    └── Delete Account, Logout
```

**Masalah struktur:**

- Tracking bus adalah fitur paling penting, tapi tidak punya tab. Pengguna harus masuk lewat Home, lalu memilih kategori operator.
- Pengelompokan berdasarkan istilah internal (Teman Bus, BRT Nusantara, KSPN, Perintis, AKAP, BisKita) memaksa pengguna tahu program pemerintah mana yang mengelola busnya. Pengguna biasanya berpikir berdasarkan kota atau tujuan.
- Cek Laik ada di tiga tempat (22, 36, 07) dengan teks berbeda.
- FAQ ada di dua tempat dengan isi berbeda (37 dan 55).
- Inbox hanya bisa diakses dari Home.

---

## 3. Masalah UX (urut dari paling parah)

### Kritis — merusak kepercayaan atau fungsi utama

| # | Masalah | Layar | Dampak |
|---|---|---|---|
| K1 | Marker Posko Mudik muncul di Afrika (koordinat salah) | 45 | Pengguna meragukan semua data peta |
| K2 | Posisi bus "live" berumur 1,5 jam tanpa tanda data lama | 16 | Pengguna menunggu bus yang mungkin sudah lewat |
| K3 | Ikon layanan Home hilang atau berputar setelah pindah tab | 09, 10 | Navigasi utama tidak bisa dipakai |
| K4 | Bus Arrival kosong, ilustrasi terpotong, tanpa penjelasan | 18 | Pengguna tidak tahu apakah bus tidak ada atau aplikasi error |
| K5 | Callout ATMS berisi "-" di semua nilai | 51 | Fitur terlihat rusak |
| K6 | Teks hukum masih sisa template: "SIDOARUM", "APLIKASI MITRA DARAT LLC", "cara kami menghasilkan uang" | 69 | Tidak pantas untuk aplikasi pemerintah, merusak kepercayaan |

### Tinggi — menghambat tugas utama

| # | Masalah | Layar |
|---|---|---|
| T1 | Peta terbuka di zoom se-Asia, bukan Indonesia atau lokasi pengguna. Memilih filter mengembalikan zoom ke awal | 38, 40, 41, 42, 45 |
| T2 | Ratusan marker Bengkel Siaga bertumpuk tanpa clustering | 46 |
| T3 | Semua rute Trans Semarang tampil sekaligus, tanpa legenda. Semua rute KSPN berwarna hitam | 13, 30 |
| T4 | Nama rute di detail berjalan (marquee) dan terpotong. Nama rute Banyumas huruf kapital dan terpotong di list | 15, 19, 20 |
| T5 | Detail rute: list halte berada di area sempit, peta dan list berebut ruang. Tombol tukar arah tidak jelas fungsinya | 15, 20 |
| T6 | FAQ menampilkan ikon gambar rusak (⚠). Tab "Mudik Gratis 2026" berisi pertanyaan 2025. URL di jawaban tidak bisa diketuk | 37, 55, 56, 57 |
| T7 | Konten usang: banner Mudik Gratis bertanggal 2024 | 03 |
| T8 | Bahasa campur: label UI bahasa Inggris (Next, Select Route, See Bus Arrival, No data available, Maybe it's important to you), konten bahasa Indonesia. Placeholder "Cari data" di sheet berjudul "Select Route" | 05, 14, 18, 22 |
| T9 | Menu Language membuka iOS Settings, bukan pilihan bahasa di aplikasi | 72 |

### Sedang — membingungkan atau tidak konsisten

| # | Masalah | Layar |
|---|---|---|
| S1 | Home terlalu padat: 7 bagian, 3 carousel, judul berbahasa Inggris panjang. Segmen Tracking Bus/Tools menyembunyikan separuh fitur | 01, 02, 05, 35 |
| S2 | Carousel banner tidak snap dan tanpa indikator halaman. Banner tidak bisa diketuk | 03, 04 |
| S3 | Judul kartu survei terpotong di bagian atas ("Survei Kepuasan Pengguna") | 02, 05 |
| S4 | Kartu Information and Guide: judul terpotong ("ıbungi CS", "sial Media") | 08 |
| S5 | Grid operator: nama terpotong di dua sisi. Teman Bus memakai logo identik untuk semua operator, jadi grid tidak membantu | 24, 25, 27 |
| S6 | Toggle list/grid tidak memberi nilai tambah. Tampilan list sudah lebih jelas | 23–27 |
| S7 | List AKAP: huruf kapital campur, item "SEMUA BUS", urutan alfabet pecah karena awalan "PT." | 32, 33 |
| S8 | KSPN dan Perintis dikelompokkan per "BPTD Kelas II/III", istilah internal yang tidak dipahami pengguna. Urutan tidak jelas | 28, 29, 31 |
| S9 | BisKita hanya berisi satu operator, tapi punya kategori sendiri | 34 |
| S10 | Input plat nomor 3 kotak tanpa label, contoh, atau placeholder | 22, 36 |
| S11 | Chip filter peta terpotong di tepi layar, angka terpotong ("3...", "4...") | 38, 41, 42 |
| S12 | Tombol kembali di peta ada di kiri bawah. Di layar lain ada di kiri atas | 38, 49 |
| S13 | Header biru di banyak layar tanpa judul. Tombol kembali transparan, kontras rendah | 11, 22, 60, 63 |
| S14 | Halaman webview punya gaya sendiri: survei (gradien, font lain), eTicket (header ganda), FAQ (kuning-ungu), About (Times New Roman) | 52–55, 71 |
| S15 | Notifikasi berupa teks panjang mentah, tidak bisa dibuka, tanpa struktur | 12 |
| S16 | Detail bengkel: gambar placeholder, jam operasional "-", deskripsi hanya mengulang nama | 47, 48 |

### Rendah — polesan

| # | Masalah | Layar |
|---|---|---|
| R1 | Empty state memakai ilustrasi dan teks yang sama ("No data available") tanpa ajakan bertindak | 11, 65 |
| R2 | About Us menampilkan layar putih saat loading, tanpa skeleton | 70 |
| R3 | List berita tanpa tanggal yang menonjol, tanpa kategori atau pencarian, tanpa penanda akhir list | 58, 59 |
| R4 | Form Report: label kecil di dalam kotak, sheet kategori tanpa ikon atau pengelompokan | 63, 64 |
| R5 | Label "Public" di kartu profil tidak jelas artinya | 62 |
| R6 | Kontras rendah: ringkasan berita abu-abu muda di atas putih, teks sekunder kecil | 58, 60 |
| R7 | Rute hanya dibedakan dengan warna, tidak ramah buta warna | 13, 14 |

---

## 4. Design system lama

### Warna (perkiraan)

| Peran | Warna | Dipakai di |
|---|---|---|
| Primary | `#2350E6` | Header, tombol utama, tab aktif |
| Gradien Home | `#1636C8` → `#4A7BF2` | Latar belakang Home |
| Aksen oranye | `#F5A623` | Kata "Darat" di logo, "Laik", badge NEW |
| Hijau | `#43A047` | Ikon dan kartu Cek Laik |
| Kuning FAQ | `#F4B248` | Accordion FAQ |
| Ungu FAQ | `#5B3BB5` | Tombol + di FAQ |
| Teks utama | `#1F2937` | Judul, isi |
| Teks sekunder | `#6B7280` | Subjudul, ringkasan |
| Latar sekunder | `#F2F5FD` | Segmen tab, kartu FAQ |
| Warna rute | Dari data operator | Badge koridor, polyline |

Masalah: ada setidaknya 6 warna aksen tanpa aturan pemakaian. Oranye, hijau, kuning, dan ungu muncul di tempat berbeda tanpa makna yang konsisten.

### Tipografi

- Aplikasi native: sans-serif sistem (mirip SF Pro). Judul ~17–20 pt semibold, isi ~14 pt, caption ~12 pt.
- Webview memakai font lain: sans tipis (Privacy Policy), sans bergaya lain (Terms), Times New Roman (About), sans geometris (Survei).
- Huruf kapital dipakai tidak konsisten: "PERINTIS" vs "KSPN" vs "Teman Bus" di judul halaman, nama operator AKAP campur.

### Ikon

Tiga gaya bercampur:

1. Tile ilustrasi berwarna dengan teks di dalam (Teman Bus, BRT, KSPN, Perintis, AKAP).
2. Ikon flat berwarna di tile (Cek Laik, Peta Prasarana, Peta Tematik, ATMS).
3. Ikon garis/solid kecil biru di list dan menu Profile.

### Bentuk dan jarak

- Radius kartu ~12–16 pt, tombol ~8 pt, chip ~8 pt, indikator tab bar berbentuk pil.
- Margin layar ~16 pt. Jarak antar-bagian di Home tidak konsisten.

### Inventaris komponen

| Komponen | Contoh layar | Catatan |
|---|---|---|
| Header biru + tombol kembali bulat | 11, 22, 23 | Sering tanpa judul |
| Tab bar 3 item, indikator pil | 01, 58, 62 | |
| Segmented control (pil) | 01, 11, 63 | Dua gaya berbeda |
| Kartu fitur (tile ikon + label) | 01, 35 | |
| Kartu promosi berwarna dengan tombol | 05, 06, 07 | Judul terpotong |
| Banner carousel | 02–04 | Tanpa indikator |
| Kartu berita (gambar + judul + ringkasan) | 05, 58 | |
| List item dengan chevron | 23, 28, 32 | Logo/ikon kiri, 2–3 baris teks |
| Toggle list/grid | 23 | |
| Search bar | 14, 23 | Placeholder bahasa campur |
| Bottom sheet dengan judul + tombol tutup | 14, 43, 50, 64 | |
| Callout peta (kartu kecil + tombol) | 16, 17, 39, 47, 51 | Isi sering kosong |
| Chip filter peta dengan angka | 38, 42 | Terpotong |
| Badge koridor berwarna | 14, 17 | |
| Timeline halte | 15 | |
| Chip armada | 15 | |
| Input plat 3 kotak | 22, 36 | Tanpa label |
| Accordion | 56, 67 | Dua gaya berbeda |
| Toggle switch | 50 | |
| Empty state (ilustrasi + teks) | 11, 65 | |
| Badge NEW | 01, 35 | |

---

## 5. Peluang redesign

1. **Jadikan tracking sebagai fitur utama.** Tab khusus "Lacak" dengan pencarian berdasarkan kota, operator, atau nama halte. Kategori program (BRT, KSPN, dan lain-lain) jadi filter, bukan pintu masuk.
2. **Sederhanakan Home.** Satu pencarian besar, rute favorit/terakhir, akses cepat ke tools, lalu berita. Hapus segmen Tracking Bus/Tools.
3. **Satu komponen peta yang benar.** Zoom awal ke lokasi pengguna atau Indonesia, clustering marker, legenda rute, kontrol peta di posisi standar, dan bottom sheet yang bisa ditarik untuk list halte.
4. **Tunjukkan umur data.** Label "diperbarui 2 menit lalu", warna peringatan untuk data lama, dan pesan jelas saat data kosong.
5. **Satu bahasa.** Bahasa Indonesia sebagai bawaan, dengan pilihan bahasa di dalam aplikasi.
6. **Design system baru.** Satu warna primary + satu aksen, satu font, satu gaya ikon, skala jarak yang tetap, dan komponen yang dipakai ulang di semua layar, termasuk pengganti halaman webview.
7. **Empty, loading, dan error state** yang punya penjelasan dan tindakan berikutnya.
