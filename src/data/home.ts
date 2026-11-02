/**
 * Sample data for the Home screen. Replace with API data once the backend is known.
 */

import type { Href } from 'expo-router';
import type { SymbolViewProps } from 'expo-symbols';

export type SymbolName = SymbolViewProps['name'];

/** The bus the person follows on Beranda: one bus on one route, heading to their stop. */
export type LiveTrip = {
  routeId: string;
  busId: string;
  /** The stop the person waits at. */
  stopId: string;
};

export type SavedRoute = {
  id: string;
  corridor: string;
  corridorColor: string;
  operator: string;
  route: string;
};

export type Service = {
  id: string;
  label: string;
  /** Short hint under the label, a few words. */
  description: string;
  icon: SymbolName;
};

export type Announcement = {
  id: string;
  title: string;
  /** One line for the Beranda list. */
  body: string;
  category: string;
  postedAt: string;
  /** Full text for the detail screen, one string per paragraph. */
  paragraphs: string[];
  /** Short checklist under the text. */
  steps?: string[];
  action?: { label: string; href: Href };
};

/** Bus I 018 on Trans Semarang Koridor 1, heading to Simpang Lima near the sample location. */
export const liveTrip: LiveTrip = { routeId: 'smg-1', busId: 'b1', stopId: 'simpang-lima' };

export const savedRoutes: SavedRoute[] = [
  {
    id: 'smg-1',
    corridor: '1',
    corridorColor: '#E5484D',
    operator: 'Trans Semarang',
    route: 'Mangkang – Penggaron',
  },
  {
    id: 'jogja-1a',
    corridor: '1A',
    corridorColor: '#16A34A',
    operator: 'Trans Jogja',
    route: 'Prambanan – Malioboro',
  },
  {
    id: 'sby-r1',
    corridor: 'R1',
    corridorColor: '#7C3AED',
    operator: 'Suroboyo Bus',
    route: 'Purabaya – Rajawali',
  },
];

export const services: Service[] = [
  {
    id: 'lacak',
    label: 'Lacak Bus',
    description: 'Posisi bus secara langsung',
    icon: { ios: 'bus', android: 'directions_bus', web: 'directions_bus' },
  },
  {
    id: 'cek-laik',
    label: 'Cek Laik',
    description: 'Cek kelaikan bus',
    icon: { ios: 'checkmark.shield', android: 'verified_user', web: 'verified_user' },
  },
  {
    id: 'prasarana',
    label: 'Peta Prasarana',
    description: 'Terminal dan pelabuhan',
    icon: { ios: 'building.2', android: 'location_city', web: 'location_city' },
  },
  {
    id: 'mudik',
    label: 'Peta Tematik',
    description: 'Jalur dan posko mudik',
    icon: { ios: 'map', android: 'map', web: 'map' },
  },
  {
    id: 'lalu-lintas',
    label: 'Lalu Lintas',
    description: 'Kondisi jalan raya',
    icon: { ios: 'car.2', android: 'traffic', web: 'traffic' },
  },
  {
    id: 'etiket',
    label: 'eTiket Terminal',
    description: 'Tiket bus terminal',
    icon: { ios: 'ticket', android: 'confirmation_number', web: 'confirmation_number' },
  },
  {
    id: 'lapor',
    label: 'Lapor',
    description: 'Laporkan masalah',
    icon: { ios: 'exclamationmark.bubble', android: 'report', web: 'report' },
  },
  {
    id: 'survei',
    label: 'Survei',
    description: 'Beri penilaian',
    icon: { ios: 'star.bubble', android: 'reviews', web: 'reviews' },
  },
];

/**
 * Announcements replace the v1 banner carousel (screenshots 02–04), which could not
 * be opened. The text is written for the prototype; Ditjen Hubdat supplies the real copy.
 */
export const announcements: Announcement[] = [
  {
    id: 'nataru',
    title: 'Libur Natal & Tahun Baru',
    body: 'Puncak arus diprediksi 23–24 Desember 2026. Rencanakan perjalanan lebih awal.',
    category: 'Libur & Mudik',
    postedAt: '28 Oktober 2026',
    paragraphs: [
      'Puncak arus libur Natal dan Tahun Baru diprediksi pada 23–24 Desember 2026. Jalan tol, jalur arteri, dan terminal penumpang akan lebih padat dari biasanya.',
      'Berangkat lebih awal atau di luar tanggal puncak membuat perjalanan lebih lancar. Pantau kondisi lalu lintas sebelum berangkat.',
    ],
    steps: [
      'Pesan tiket bus hanya di loket resmi terminal atau aplikasi resmi operator.',
      'Cek kelaikan bus dengan nomor plat sebelum naik.',
      'Lihat kondisi lalu lintas di menu Lalu Lintas sebelum berangkat.',
    ],
    action: { label: 'Lihat lalu lintas', href: '/layanan/lalu-lintas' },
  },
  {
    id: 'bus-pariwisata',
    title: 'Sewa bus pariwisata?',
    body: 'Cek kelaikan bus dengan nomor plat sebelum berangkat.',
    category: 'Keselamatan',
    postedAt: '21 Oktober 2026',
    paragraphs: [
      'Sebelum menyewa bus untuk rombongan, pastikan bus sudah lulus uji berkala dan inspeksi keselamatan.',
      'Masukkan nomor plat bus di Cek Laik. Hasilnya menunjukkan status inspeksi terakhir dan masa berlaku uji berkala.',
    ],
    steps: [
      'Minta nomor plat bus ke penyedia sewa sebelum hari keberangkatan.',
      'Cek nomor plat di MitraDarat.',
      'Jika hasilnya tidak laik, minta bus pengganti atau laporkan.',
    ],
    action: {
      label: 'Cek laik bus pariwisata',
      href: { pathname: '/layanan/cek-laik', params: { jenis: 'pariwisata' } },
    },
  },
  {
    id: 'odol',
    title: 'Menuju Zero ODOL 2027',
    body: 'Kenali aturan kendaraan over dimension dan over loading.',
    category: 'Angkutan barang',
    postedAt: '14 Oktober 2026',
    paragraphs: [
      'ODOL adalah kendaraan barang yang ukurannya melebihi ketentuan (over dimension) atau muatannya melebihi batas yang diizinkan (over loading).',
      'Kendaraan ODOL memperpanjang jarak pengereman, membuat kendaraan sulit dikendalikan, dan mempercepat kerusakan jalan serta jembatan.',
    ],
    steps: [
      'Pastikan ukuran kendaraan sama dengan yang tercatat di dokumen kendaraan.',
      'Muat barang sesuai batas yang tertera di buku uji.',
      'Masuk ke jembatan timbang yang dilewati untuk pemeriksaan.',
    ],
    action: {
      label: 'Lihat jembatan timbang',
      href: { pathname: '/layanan/peta-prasarana', params: { jenis: 'jembatan-timbang' } },
    },
  },
];

export function getAnnouncement(id: string) {
  return announcements.find((item) => item.id === id);
}

