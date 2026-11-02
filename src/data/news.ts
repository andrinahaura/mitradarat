/**
 * Sample news for the Berita tab. Dates and title openings follow the v1 news list
 * (screenshots 58–61); where v1 cut a title off, the ending is written for the
 * prototype. Bodies are short summaries, not the published articles.
 * Replace with the news CMS API.
 */

import type { SymbolName } from '@/data/home';

export type NewsCategory = 'Keselamatan' | 'Angkutan' | 'Libur & Mudik' | 'Regulasi';

export type NewsArticle = {
  id: string;
  title: string;
  /** ISO date, used for sorting and month grouping. */
  date: string;
  place: string;
  category: NewsCategory;
  author: string;
  summary: string;
  body: string[];
};

export const newsCategories: NewsCategory[] = ['Keselamatan', 'Angkutan', 'Libur & Mudik', 'Regulasi'];

export const categoryIcon: Record<NewsCategory, SymbolName> = {
  Keselamatan: { ios: 'checkmark.shield', android: 'verified_user', web: 'verified_user' },
  Angkutan: { ios: 'bus', android: 'directions_bus', web: 'directions_bus' },
  'Libur & Mudik': { ios: 'calendar', android: 'calendar_month', web: 'calendar_month' },
  Regulasi: { ios: 'doc.text', android: 'description', web: 'description' },
};

const AUTHOR = 'Kemenhub (Bagren)';

const articles: NewsArticle[] = [
  {
    id: 'budaya-keselamatan',
    title: 'Kemenhub Perkuat Budaya Keselamatan Transportasi Jalan Melalui Kolaborasi dengan Semua Stakeholders',
    date: '2026-10-28',
    place: 'Jakarta',
    category: 'Keselamatan',
    author: AUTHOR,
    summary:
      'Ditjen Perhubungan Darat mendorong keselamatan jalan lewat pengawasan, penegakan hukum, dan edukasi bersama operator dan masyarakat.',
    body: [
      'Direktorat Jenderal Perhubungan Darat terus berupaya meningkatkan keselamatan transportasi jalan melalui pengawasan, penegakan hukum, dan edukasi.',
      'Keselamatan dinilai perlu menjadi budaya bersama. Bukan hanya pemerintah sebagai regulator, tetapi juga operator perusahaan angkutan dan masyarakat.',
      'Hal ini disampaikan dalam diskusi bertema keselamatan jalan sebagai tanggung jawab bersama di Kantor Kemenhub, Jakarta.',
    ],
  },
  {
    id: 'nataru-2026',
    title: 'Ditjen Hubdat Siapkan Langkah Strategis Hadapi Libur Natal 2026 dan Tahun Baru 2027',
    date: '2026-10-27',
    place: 'Jakarta',
    category: 'Libur & Mudik',
    author: AUTHOR,
    summary:
      'Puncak arus Natal diprediksi 23–24 Desember 2026 dan puncak arus Tahun Baru 30–31 Desember 2026.',
    body: [
      'Ditjen Perhubungan Darat menyiapkan langkah untuk mengatur perjalanan masyarakat selama libur Natal 2026 dan Tahun Baru 2027.',
      'Puncak arus sebelum Natal diprediksi pada 23–24 Desember 2026, dan arus sesudahnya pada 27–28 Desember 2026.',
      'Untuk Tahun Baru, puncak arus diprediksi pada 30–31 Desember 2026, dan arus balik pada 3–4 Januari 2027.',
      'Persiapan meliputi ramp check bus AKAP dan pariwisata, pemeriksaan kesehatan pengemudi, kesiapan terminal, serta pemetaan titik rawan kecelakaan dan kemacetan.',
    ],
  },
  {
    id: 'bmn-bpljskb',
    title: 'Optimalkan Pemanfaatan BMN, BPLJSKB Gelar Penandatanganan Kerja Sama',
    date: '2026-10-21',
    place: 'Bekasi',
    category: 'Regulasi',
    author: AUTHOR,
    summary: 'Langkah untuk mengoptimalkan pemanfaatan Barang Milik Negara di lingkungan Ditjen Perhubungan Darat.',
    body: [
      'Ditjen Perhubungan Darat melalui BPLJSKB berupaya mengoptimalkan pemanfaatan Barang Milik Negara (BMN).',
      'Kegiatan ini menjadi bagian dari tata kelola aset yang lebih tertib dan bermanfaat.',
    ],
  },
  {
    id: 'ekosistem-keselamatan',
    title: 'Kemenhub Perkuat Ekosistem Keselamatan Angkutan Jalan',
    date: '2026-10-13',
    place: 'Jakarta',
    category: 'Keselamatan',
    author: AUTHOR,
    summary: 'Ditjen Perhubungan Darat terus mendorong penguatan ekosistem keselamatan angkutan jalan.',
    body: [
      'Ditjen Perhubungan Darat terus mendorong penguatan ekosistem keselamatan, dari kendaraan, pengemudi, hingga prasarana jalan.',
    ],
  },
  {
    id: 'zero-odol',
    title: 'Zero ODOL 2027, Kemenhub Perkuat Aksi Penanganan Kendaraan ODOL',
    date: '2026-10-09',
    place: 'Surabaya',
    category: 'Regulasi',
    author: AUTHOR,
    summary: 'Langkah nyata menangani kendaraan over dimension dan over loading menuju target Zero ODOL 2027.',
    body: [
      'Ditjen Perhubungan Darat memperkuat aksi nyata penanganan kendaraan over dimension dan over loading (ODOL).',
      'Langkah ini mendukung target Zero ODOL pada 2027.',
    ],
  },
  {
    id: 'dim-ruu-llaj',
    title: 'Rampung Susun DIM RUU LLAJ, Kemenhub Siap Bahas Bersama DPR',
    date: '2026-09-18',
    place: 'Jakarta',
    category: 'Regulasi',
    author: AUTHOR,
    summary: 'Pemerintah selesai menyusun Daftar Inventarisasi Masalah Rancangan Undang-Undang LLAJ.',
    body: [
      'Pemerintah telah menyelesaikan dan menyepakati penyusunan Daftar Inventarisasi Masalah (DIM) Rancangan Undang-Undang Lalu Lintas dan Angkutan Jalan.',
    ],
  },
  {
    id: 'bulan-keselamatan',
    title: 'Bulan Keselamatan Transportasi, Ditjen Hubdat Gelar Rangkaian Kegiatan',
    date: '2026-09-18',
    place: 'Jakarta',
    category: 'Keselamatan',
    author: AUTHOR,
    summary: 'Rangkaian kegiatan dalam peringatan Hari Perhubungan Nasional 2026.',
    body: [
      'Dalam rangkaian Hari Perhubungan Nasional 2026, Ditjen Perhubungan Darat menggelar kegiatan Bulan Keselamatan Transportasi.',
    ],
  },
  {
    id: 'urai-kemacetan',
    title: 'Ditjen Hubdat Lakukan Strategi Urai Kepadatan Lalu Lintas',
    date: '2026-09-05',
    place: 'Jakarta',
    category: 'Angkutan',
    author: AUTHOR,
    summary: 'Langkah mengurai kepadatan lalu lintas melalui balai pengelola transportasi.',
    body: ['Ditjen Perhubungan Darat melalui balai pengelola transportasi menjalankan strategi untuk mengurai kepadatan lalu lintas.'],
  },
  {
    id: 'konektivitas-balikpapan',
    title: 'Ditjen Hubdat Dukung Konektivitas di Wilayah Kalimantan Timur',
    date: '2026-08-27',
    place: 'Balikpapan',
    category: 'Angkutan',
    author: AUTHOR,
    summary: 'Penyediaan mobilitas yang aman, selamat, dan terjangkau di Kalimantan Timur.',
    body: ['Ditjen Perhubungan Darat mendukung penyediaan mobilitas yang aman, selamat, dan terjangkau di wilayah Kalimantan Timur.'],
  },
];

/** Newest first. */
export const news = [...articles].sort((a, b) => b.date.localeCompare(a.date));

export function getArticle(id: string) {
  return news.find((article) => article.id === id);
}

const MONTHS = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

/** "28 Okt 2026". Parsed from the ISO string so the day never shifts with the time zone. */
export function formatDate(iso: string) {
  const [year, month, day] = iso.split('-').map(Number);
  return `${day} ${MONTHS[month - 1].slice(0, 3)} ${year}`;
}

/** "Oktober 2026", for month section headers. */
export function formatMonth(iso: string) {
  const [year, month] = iso.split('-').map(Number);
  return `${MONTHS[month - 1]} ${year}`;
}
