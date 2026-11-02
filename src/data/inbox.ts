/**
 * Sample inbox for Kotak Masuk. The Balikpapan detour follows the notification in
 * v1 (screenshot 12), split into fields instead of one long block of text. Other
 * items are written for the prototype. Read state lives for the session only.
 */

import type { Href } from 'expo-router';
import { useSyncExternalStore } from 'react';

import type { SymbolName } from '@/data/home';

export type InboxTab = 'notifikasi' | 'pesan';

export type InboxCategory = 'Perubahan rute' | 'Laporan' | 'Info';

export type InboxItem = {
  id: string;
  tab: InboxTab;
  category: InboxCategory;
  title: string;
  summary: string;
  /** "6 Sep 2026, 05.30" */
  sentAt: string;
  /** Calendar day of `sentAt`, used to group the list (YYYY-MM-DD). */
  sentOn: string;
  read: boolean;
  /** Paragraphs shown on the detail screen. */
  body: string[];
  /** Stops a detour skips; only for route changes. */
  skippedStops?: string[];
  validity?: string;
  action?: { label: string; href: Href };
};

export const categoryIcon: Record<InboxCategory, SymbolName> = {
  'Perubahan rute': { ios: 'arrow.triangle.branch', android: 'alt_route', web: 'alt_route' },
  Laporan: { ios: 'exclamationmark.bubble', android: 'report', web: 'report' },
  Info: { ios: 'info.circle', android: 'info', web: 'info' },
};

let items: InboxItem[] = [
  {
    id: 'smg-1-tugu-muda',
    tab: 'notifikasi',
    category: 'Perubahan rute',
    title: 'Trans Semarang Koridor 1: Halte Tugu Muda tidak dilayani',
    summary: 'Bus tidak berhenti di Halte Tugu Muda karena perbaikan trotoar. Naik atau turun di Kalibanteng atau Simpang Lima.',
    sentAt: '1 Nov 2026, 06.15',
    sentOn: '2026-11-01',
    read: false,
    body: [
      'Halte Tugu Muda tidak dilayani sementara karena perbaikan trotoar di sekitar halte.',
      'Bus tetap melintas di rute yang sama tanpa berhenti. Gunakan halte terdekat: Kalibanteng atau Simpang Lima.',
    ],
    skippedStops: ['Tugu Muda'],
    validity: '1–7 November 2026',
    action: { label: 'Lihat rute di Lacak', href: { pathname: '/lacak', params: { rute: 'smg-1' } } },
  },
  {
    id: 'lpr-0412-diproses',
    tab: 'notifikasi',
    category: 'Laporan',
    title: 'Laporan LPR-2026-10-0412 sedang diproses',
    summary: 'Laporan diteruskan ke tim data Trans Semarang untuk dicek.',
    sentAt: '29 Okt 2026, 13.40',
    sentOn: '2026-10-29',
    read: false,
    body: [
      'Laporan "Bus Arrival di Terminal Mangkang selalu kosong" sudah diteruskan ke tim data Trans Semarang.',
      'Kamu akan menerima notifikasi lagi saat laporan selesai ditangani.',
    ],
    action: { label: 'Lihat laporan', href: { pathname: '/akun/laporan/[id]', params: { id: 'r3' } } },
  },
  {
    id: 'bct-rspb-run',
    tab: 'notifikasi',
    category: 'Perubahan rute',
    title: 'Balikpapan City Trans: pengalihan rute koridor',
    summary: 'Pengalihan sementara karena kegiatan RSPB Run 2026 di Lapangan Merdeka dan sekitarnya.',
    sentAt: '6 Sep 2026, 05.30',
    sentOn: '2026-09-06',
    read: true,
    body: [
      'Sehubungan dengan kegiatan lari RSPB Run 2026 di Lapangan Merdeka dan sekitarnya, ada pengalihan rute sementara.',
      'Bus dialihkan melalui Kantor Pos, Terminal Rasa, dan Gedung Parkir Klandasan, lalu kembali ke rute semula.',
    ],
    skippedStops: [
      'Bank Indonesia',
      'RSPB B',
      'Benua Patra',
      'Melawai B',
      'Pelabuhan Semayang',
      'Melawai A',
      'Lapangan Merdeka',
      'RSPB A',
      'PNW',
    ],
    validity: 'Selama kegiatan RSPB Run 2026',
  },
  {
    id: 'lpr-0377-balasan',
    tab: 'pesan',
    category: 'Laporan',
    title: 'Balasan petugas untuk LPR-2026-10-0377',
    summary: 'Gangguan Cek Laik sudah diperbaiki. Silakan coba lagi.',
    sentAt: '23 Okt 2026, 15.10',
    sentOn: '2026-10-23',
    read: false,
    body: [
      'Terima kasih atas laporannya. Gangguan pada halaman hasil Cek Laik sudah diperbaiki.',
      'Silakan coba Cek Laik kembali. Jika masih bermasalah, balas lewat laporan baru dengan menyebut nomor tiket ini.',
    ],
    action: { label: 'Buka Cek Laik', href: '/layanan/cek-laik' },
  },
];

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((listener) => listener());

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

const getItems = () => items;

export function useInbox() {
  return useSyncExternalStore(subscribe, getItems, getItems);
}

export function getInboxItem(id: string) {
  return items.find((item) => item.id === id);
}

export function unreadCount(list: InboxItem[], tab?: InboxTab) {
  return list.filter((item) => !item.read && (!tab || item.tab === tab)).length;
}

export function markRead(id: string) {
  if (!items.some((item) => item.id === id && !item.read)) return;
  items = items.map((item) => (item.id === id ? { ...item, read: true } : item));
  emit();
}

export function markAllRead(tab: InboxTab) {
  items = items.map((item) => (item.tab === tab ? { ...item, read: true } : item));
  emit();
}
