/**
 * Sample ATMS (traffic monitoring) points for Lalu Lintas, v1 screenshots 49–51.
 * "TC Pejagan B" is the point shown in v1, where every value was "-"; here it stays
 * without data on purpose so the empty state is visible. Other points, counts and
 * speeds are written for the prototype. Replace with the ATMS API.
 */

import type { SymbolName } from '@/data/home';
import { distanceMeters, type LatLng } from '@/data/transit';

export type TrafficLayer = 'ruas' | 'simpang' | 'lainnya';

export type TrafficStatus = 'lancar' | 'padat' | 'macet' | 'tanpa-data';

export type TrafficPoint = {
  id: string;
  layer: TrafficLayer;
  name: string;
  area: string;
  coordinate: LatLng;
  status: TrafficStatus;
  /** Average speed in km/h; absent when there is no data. */
  speed?: number;
  /** Vehicles per hour by class; absent when there is no data. */
  volume?: { motor: number; mobil: number; bus: number; truk: number };
  updatedMinutesAgo?: number;
};

export const trafficLayers: { id: TrafficLayer; label: string; icon: SymbolName }[] = [
  { id: 'ruas', label: 'Ruas', icon: { ios: 'road.lanes', android: 'add_road', web: 'add_road' } },
  {
    id: 'simpang',
    label: 'Simpang',
    icon: { ios: 'arrow.triangle.merge', android: 'merge', web: 'merge' },
  },
  { id: 'lainnya', label: 'Lainnya', icon: { ios: 'sensor', android: 'sensors', web: 'sensors' } },
];

export const trafficStatuses: Record<TrafficStatus, { label: string; color: string }> = {
  lancar: { label: 'Lancar', color: '#16A34A' },
  padat: { label: 'Padat', color: '#D97706' },
  macet: { label: 'Macet', color: '#B42318' },
  'tanpa-data': { label: 'Data belum tersedia', color: '#A0A4B0' },
};

/** Counts older than this are shown as outdated. */
export const TRAFFIC_STALE_AFTER_MINUTES = 15;

const at = (latitude: number, longitude: number): LatLng => ({ latitude, longitude });

export const trafficPoints: TrafficPoint[] = [
  { id: 'r-kaligawe', layer: 'ruas', name: 'Ruas Jl. Kaligawe', area: 'Kota Semarang, Jawa Tengah', coordinate: at(-6.9605, 110.4495), status: 'macet', speed: 12, volume: { motor: 3120, mobil: 1480, bus: 64, truk: 410 }, updatedMinutesAgo: 3 },
  { id: 'r-jatingaleh', layer: 'ruas', name: 'Ruas Jl. Setiabudi Jatingaleh', area: 'Kota Semarang, Jawa Tengah', coordinate: at(-7.029, 110.4185), status: 'padat', speed: 24, volume: { motor: 2650, mobil: 1210, bus: 38, truk: 120 }, updatedMinutesAgo: 4 },
  { id: 'r-mangkang', layer: 'ruas', name: 'Ruas Jl. Raya Mangkang', area: 'Kota Semarang, Jawa Tengah', coordinate: at(-6.972, 110.31), status: 'lancar', speed: 46, volume: { motor: 1480, mobil: 760, bus: 22, truk: 290 }, updatedMinutesAgo: 5 },
  { id: 'r-pantura-batang', layer: 'ruas', name: 'Ruas Pantura Batang', area: 'Kab. Batang, Jawa Tengah', coordinate: at(-6.92, 109.78), status: 'lancar', speed: 58, volume: { motor: 980, mobil: 870, bus: 46, truk: 520 }, updatedMinutesAgo: 41 },

  { id: 's-kalibanteng', layer: 'simpang', name: 'Simpang Kalibanteng', area: 'Kota Semarang, Jawa Tengah', coordinate: at(-6.9842, 110.3872), status: 'padat', speed: 18, volume: { motor: 2890, mobil: 1350, bus: 41, truk: 230 }, updatedMinutesAgo: 2 },
  { id: 's-tugu-muda', layer: 'simpang', name: 'Simpang Tugu Muda', area: 'Kota Semarang, Jawa Tengah', coordinate: at(-6.984, 110.4093), status: 'lancar', speed: 31, volume: { motor: 2210, mobil: 1120, bus: 36, truk: 40 }, updatedMinutesAgo: 2 },
  { id: 's-simpang-lima', layer: 'simpang', name: 'Simpang Lima', area: 'Kota Semarang, Jawa Tengah', coordinate: at(-6.9903, 110.4229), status: 'padat', speed: 20, volume: { motor: 3340, mobil: 1590, bus: 52, truk: 35 }, updatedMinutesAgo: 3 },
  { id: 's-pedurungan', layer: 'simpang', name: 'Simpang Pedurungan', area: 'Kota Semarang, Jawa Tengah', coordinate: at(-7.0005, 110.456), status: 'macet', speed: 9, volume: { motor: 3010, mobil: 1270, bus: 30, truk: 180 }, updatedMinutesAgo: 6 },
  { id: 's-jomin', layer: 'simpang', name: 'Simpang Jomin', area: 'Kab. Karawang, Jawa Barat', coordinate: at(-6.39, 107.41), status: 'lancar', speed: 42, volume: { motor: 1120, mobil: 1430, bus: 88, truk: 610 }, updatedMinutesAgo: 8 },

  { id: 'l-pejagan', layer: 'lainnya', name: 'TC Pejagan B', area: 'Kemurang Kulon, Kab. Brebes, Jawa Tengah', coordinate: at(-6.89, 108.95), status: 'tanpa-data' },
  { id: 'l-kalikangkung', layer: 'lainnya', name: 'TC Kalikangkung', area: 'Kota Semarang, Jawa Tengah', coordinate: at(-6.99, 110.29), status: 'lancar', speed: 72, volume: { motor: 0, mobil: 1840, bus: 96, truk: 670 }, updatedMinutesAgo: 7 },
  { id: 'l-cikampek', layer: 'lainnya', name: 'TC Cikampek Utama', area: 'Kab. Karawang, Jawa Barat', coordinate: at(-6.43, 107.47), status: 'padat', speed: 38, volume: { motor: 0, mobil: 3920, bus: 210, truk: 1140 }, updatedMinutesAgo: 9 },
];

export function getTrafficPoint(id: string) {
  return trafficPoints.find((point) => point.id === id);
}

export function trafficByDistance(layers: TrafficLayer[], from: LatLng) {
  return trafficPoints
    .filter((point) => layers.includes(point.layer))
    .map((point) => ({ point, meters: distanceMeters(from, point.coordinate) }))
    .sort((a, b) => a.meters - b.meters);
}

export function formatTrafficUpdated(minutes: number) {
  return minutes < 60 ? `Diperbarui ${minutes} menit lalu` : `Diperbarui ${Math.round(minutes / 60)} jam lalu`;
}
