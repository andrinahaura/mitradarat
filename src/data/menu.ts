/**
 * Every menu from v1, grouped by what the person wants to do. Nothing from v1 is
 * removed; only the grouping and the names are friendlier. `v1` records where the
 * menu lived in the original app so the mapping stays traceable.
 */

import type { Href } from 'expo-router';

import type { SymbolName } from '@/data/home';
import { programs } from '@/data/transit';

export type MenuTarget =
  | { kind: 'program'; programId: string }
  | { kind: 'route'; href: Href }
  /** Screen not built in the prototype yet. */
  | { kind: 'soon' };

export type MenuItem = {
  id: string;
  title: string;
  description: string;
  icon: SymbolName;
  target: MenuTarget;
  v1: string;
};

export type MenuGroup = {
  id: string;
  title: string;
  items: MenuItem[];
};

export const menuGroups: MenuGroup[] = [
  {
    id: 'lacak',
    title: 'Lacak bus',
    items: programs.map((program) => ({
      id: program.id,
      title: program.name,
      description: program.description,
      icon: program.icon,
      target: { kind: 'program', programId: program.id },
      v1:
        program.id === 'ikn'
          ? 'Kartu Tracking Bus IKN di Beranda'
          : `Grid Tracking Bus di Beranda → ${program.name}`,
    })),
  },
  {
    id: 'keselamatan',
    title: 'Keselamatan kendaraan',
    items: [
      {
        id: 'cek-laik',
        title: 'Cek Laik Kendaraan',
        description: 'Lihat hasil inspeksi keselamatan dengan nomor plat',
        icon: { ios: 'checkmark.shield', android: 'verified_user', web: 'verified_user' },
        target: { kind: 'route', href: '/layanan/cek-laik' },
        v1: 'Tools → Cek Laik; kartu Cek Kelaikan Kendaraan',
      },
      {
        id: 'cek-laik-pariwisata',
        title: 'Cek Laik Bus Pariwisata',
        description: 'Pastikan bus sewaan laik jalan sebelum berangkat',
        icon: { ios: 'bus', android: 'directions_bus', web: 'directions_bus' },
        target: { kind: 'route', href: { pathname: '/layanan/cek-laik', params: { jenis: 'pariwisata' } } },
        v1: 'Kartu Bus Pariwisata di Beranda',
      },
    ],
  },
  {
    id: 'peta',
    title: 'Peta dan lalu lintas',
    items: [
      {
        id: 'peta-prasarana',
        title: 'Peta Prasarana',
        description: 'Terminal, pelabuhan, dan jembatan timbang',
        icon: { ios: 'building.2', android: 'location_city', web: 'location_city' },
        target: { kind: 'route', href: '/layanan/peta-prasarana' },
        v1: 'Tools → Peta Prasarana',
      },
      {
        id: 'peta-tematik',
        title: 'Peta Tematik',
        description: 'Jalur mudik, posko mudik, dan bengkel siaga',
        icon: { ios: 'map', android: 'map', web: 'map' },
        target: { kind: 'route', href: '/layanan/peta-tematik' },
        v1: 'Tools → Peta Tematik',
      },
      {
        id: 'atms',
        title: 'Lalu Lintas (ATMS)',
        description: 'Kondisi ruas jalan dan simpang',
        icon: { ios: 'car.2', android: 'traffic', web: 'traffic' },
        target: { kind: 'route', href: '/layanan/lalu-lintas' },
        v1: 'Tools → ATMS',
      },
    ],
  },
  {
    id: 'tiket',
    title: 'Tiket dan survei',
    items: [
      {
        id: 'etiket',
        title: 'eTiket Terminal (TOS)',
        description: 'Cari e-tiket untuk check-in dan boarding di terminal',
        icon: { ios: 'ticket', android: 'confirmation_number', web: 'confirmation_number' },
        target: { kind: 'route', href: '/layanan/etiket' },
        v1: 'Kartu eTicket Terminal Online System di Beranda',
      },
      {
        id: 'survei',
        title: 'Survei Kepuasan',
        description: 'Beri penilaian untuk layanan MitraDarat',
        icon: { ios: 'star.bubble', android: 'reviews', web: 'reviews' },
        target: { kind: 'route', href: '/layanan/survei' },
        v1: 'Kartu Survei Kepuasan Pengguna di Beranda',
      },
    ],
  },
  {
    id: 'info',
    title: 'Informasi dan bantuan',
    items: [
      {
        id: 'berita',
        title: 'Berita',
        description: 'Kabar terbaru seputar transportasi darat',
        icon: { ios: 'newspaper', android: 'newspaper', web: 'newspaper' },
        target: { kind: 'route', href: '/berita' },
        v1: 'Tab News; News for you di Beranda',
      },
      {
        id: 'kotak-masuk',
        title: 'Kotak Masuk',
        description: 'Pesan dan notifikasi, termasuk perubahan rute',
        icon: { ios: 'bell', android: 'notifications', web: 'notifications' },
        target: { kind: 'route', href: '/kotak-masuk' },
        v1: 'Ikon lonceng di Beranda',
      },
      {
        id: 'lapor',
        title: 'Lapor dan Pengaduan',
        description: 'Kirim laporan dan pantau statusnya',
        icon: { ios: 'exclamationmark.bubble', android: 'report', web: 'report' },
        target: { kind: 'route', href: '/akun/lapor' },
        v1: 'Profile → Report & Complains',
      },
      {
        id: 'faq',
        title: 'Pertanyaan Umum (FAQ)',
        description: 'Seputar pelacakan bus, Cek Laik, dan mudik',
        icon: { ios: 'questionmark.circle', android: 'help', web: 'help' },
        target: { kind: 'route', href: '/layanan/bantuan' },
        v1: 'Information and Guide → FAQ; FAQ Cek Laik',
      },
      {
        id: 'cs',
        title: 'Hubungi Layanan Pelanggan',
        description: 'Telepon atau email resmi',
        icon: { ios: 'headphones', android: 'support_agent', web: 'support_agent' },
        target: { kind: 'route', href: '/layanan/hubungi-cs' },
        v1: 'Information and Guide → Hubungi CS',
      },
      {
        id: 'sosmed',
        title: 'Media Sosial Resmi',
        description: 'Akun resmi Ditjen Perhubungan Darat',
        icon: { ios: 'at', android: 'alternate_email', web: 'alternate_email' },
        target: { kind: 'route', href: '/layanan/media-sosial' },
        v1: 'Information and Guide → Sosial Media',
      },
    ],
  },
];
