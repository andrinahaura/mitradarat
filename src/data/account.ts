/**
 * Sample account data for the Akun tab. The profile is a made-up person so no real
 * data ends up in the prototype. Replace with the account and report APIs.
 */

import { useSyncExternalStore } from 'react';

export const profile = {
  name: 'Rina Wulandari',
  email: 'rina.wulandari@contoh.id',
  joined: 'Oktober 2026',
};

export const appVersion = '2.0.0 (prototipe)';

export type ReportStatus = 'Diterima' | 'Diproses' | 'Selesai' | 'Ditolak';

export type ReportEvent = {
  status: ReportStatus;
  /** "29 Okt 2026, 09.12" */
  at: string;
  note: string;
};

export type Report = {
  id: string;
  ticket: string;
  category: string;
  title: string;
  description: string;
  plate?: string;
  createdAt: string;
  /** Oldest first; the last event is the current status. */
  history: ReportEvent[];
};

const sampleReports: Report[] = [
  {
    id: 'r3',
    ticket: 'LPR-2026-10-0412',
    category: 'BRT Nusantara',
    title: 'Bus Arrival di Terminal Mangkang selalu kosong',
    description:
      'Di halte Terminal Mangkang, layar kedatangan bus tidak menampilkan apa pun padahal bus sedang beroperasi.',
    createdAt: '29 Okt 2026',
    history: [
      { status: 'Diterima', at: '29 Okt 2026, 09.12', note: 'Laporan diterima sistem.' },
      {
        status: 'Diproses',
        at: '29 Okt 2026, 13.40',
        note: 'Laporan diteruskan ke tim data Trans Semarang untuk dicek.',
      },
    ],
  },
  {
    id: 'r2',
    ticket: 'LPR-2026-10-0377',
    category: 'Cek Laik',
    title: 'Hasil Cek Laik tidak muncul',
    description: 'Setelah memasukkan nomor plat bus pariwisata, halaman hasil tidak terbuka.',
    plate: 'H 7191 OQ',
    createdAt: '21 Okt 2026',
    history: [
      { status: 'Diterima', at: '21 Okt 2026, 19.05', note: 'Laporan diterima sistem.' },
      { status: 'Diproses', at: '22 Okt 2026, 08.30', note: 'Tim aplikasi memeriksa layanan Cek Laik.' },
      {
        status: 'Selesai',
        at: '23 Okt 2026, 15.10',
        note: 'Gangguan sudah diperbaiki. Silakan coba Cek Laik kembali.',
      },
    ],
  },
  {
    id: 'r1',
    ticket: 'LPR-2026-10-0301',
    category: 'Masalah pada Aplikasi',
    title: 'Peta terbuka di zoom se-Asia',
    description: 'Setiap membuka Peta Prasarana, peta tidak langsung menunjukkan Indonesia.',
    createdAt: '12 Okt 2026',
    history: [
      { status: 'Diterima', at: '12 Okt 2026, 07.48', note: 'Laporan diterima sistem.' },
      {
        status: 'Ditolak',
        at: '13 Okt 2026, 10.02',
        note: 'Laporan yang sama sudah tercatat dengan nomor LPR-2026-10-0288. Perkembangannya bisa dilihat di sana.',
      },
    ],
  },
];

/** The 10 categories from v1 (screenshot 64), in the same order. */
export const reportCategories = [
  'Teman Bus',
  'BRT Nusantara',
  'BisKita',
  'KSPN',
  'Perintis',
  'Cek Laik',
  'Internal Hubdat',
  'Mudik Gratis',
  'Masalah pada Aplikasi',
  'Lainnya',
] as const;

export type ReportCategory = (typeof reportCategories)[number];

/*
 * In-memory report store, so a report sent from Lapor shows up in Laporan saya
 * during the session. It resets when the app reloads.
 */
let reports: Report[] = sampleReports;
const listeners = new Set<() => void>();

export function subscribeReports(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getReports() {
  return reports;
}

export function useReports() {
  return useSyncExternalStore(subscribeReports, getReports, getReports);
}

export function getReport(id: string) {
  return reports.find((report) => report.id === id);
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

function formatDay(date: Date) {
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

function formatTime(date: Date) {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${formatDay(date)}, ${pad(date.getHours())}.${pad(date.getMinutes())}`;
}

export type NewReport = {
  category: ReportCategory;
  title: string;
  description: string;
  plate?: string;
  photoCount: number;
};

/** Adds a report as "Diterima" and returns it. The ticket number continues the sample series. */
export function addReport(input: NewReport): Report {
  const now = new Date();
  const sequence = 413 + reports.length - sampleReports.length;
  const report: Report = {
    id: `r${Date.now()}`,
    ticket: `LPR-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(sequence).padStart(4, '0')}`,
    category: input.category,
    title: input.title,
    description: input.description,
    plate: input.plate,
    createdAt: formatDay(now),
    history: [
      {
        status: 'Diterima',
        at: formatTime(now),
        note:
          input.photoCount > 0
            ? `Laporan dan ${input.photoCount} foto diterima sistem.`
            : 'Laporan diterima sistem.',
      },
    ],
  };
  reports = [report, ...reports];
  listeners.forEach((listener) => listener());
  return report;
}

export function currentStatus(report: Report): ReportStatus {
  return report.history.at(-1)?.status ?? 'Diterima';
}

export type SavedVehicle = {
  plate: string;
  label: string;
  result: string;
  checkedAt: string;
};

/* Saved vehicles share the session-only store pattern of reports above. */
let savedVehicles: SavedVehicle[] = [
  {
    plate: 'H 7191 OQ',
    label: 'Bus pariwisata',
    result: 'Laik jalan',
    checkedAt: '23 Okt 2026',
  },
];
const vehicleListeners = new Set<() => void>();

function subscribeVehicles(listener: () => void) {
  vehicleListeners.add(listener);
  return () => vehicleListeners.delete(listener);
}

const getSavedVehicles = () => savedVehicles;

export function useSavedVehicles() {
  return useSyncExternalStore(subscribeVehicles, getSavedVehicles, getSavedVehicles);
}

export function toggleSavedVehicle(vehicle: SavedVehicle) {
  savedVehicles = savedVehicles.some((item) => item.plate === vehicle.plate)
    ? savedVehicles.filter((item) => item.plate !== vehicle.plate)
    : [...savedVehicles, vehicle];
  vehicleListeners.forEach((listener) => listener());
}

export type Language = { id: string; name: string; native: string };

export const languages: Language[] = [
  { id: 'id', name: 'Bahasa Indonesia', native: 'Bahasa Indonesia' },
  { id: 'en', name: 'Bahasa Inggris', native: 'English' },
];
