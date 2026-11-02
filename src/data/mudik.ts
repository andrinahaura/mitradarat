/**
 * Sample data for Peta Tematik (v1 screenshots 42–48). Route names and end points
 * follow v1's route sheet (43); lines run through the main cities and are
 * approximate. Posts and workshops are samples placed along those lines; opening
 * hours and services are written for the prototype. Replace with the mudik API.
 */

import type { SymbolName } from '@/data/home';
import { distanceMeters, type LatLng } from '@/data/transit';

export type MudikRoute = {
  id: string;
  name: string;
  from: string;
  to: string;
  color: string;
  line: LatLng[];
};

export type MudikPointType = 'posko' | 'bengkel' | 'pelabuhan';

export type MudikPoint = {
  id: string;
  type: MudikPointType;
  name: string;
  area: string;
  routeIds: string[];
  hours: string;
  services: string[];
  coordinate: LatLng;
};

const at = (latitude: number, longitude: number): LatLng => ({ latitude, longitude });

export const mudikRoutes: MudikRoute[] = [
  {
    id: 'utara',
    name: 'Jalur Mudik Utara',
    from: 'Cilegon',
    to: 'Surabaya',
    color: '#2350E6',
    line: [
      at(-6.017, 106.054), at(-6.2, 106.85), at(-6.42, 107.46), at(-6.72, 108.55),
      at(-6.87, 109.14), at(-6.89, 109.67), at(-6.99, 110.42), at(-6.8, 110.84),
      at(-6.71, 111.34), at(-6.9, 112.05), at(-7.25, 112.75),
    ],
  },
  {
    id: 'selatan',
    name: 'Jalur Mudik Selatan',
    from: 'Tasikmalaya',
    to: 'Kebumen',
    color: '#0E7490',
    line: [at(-7.33, 108.22), at(-7.33, 108.35), at(-7.37, 108.54), at(-7.52, 109.05), at(-7.67, 109.65)],
  },
  {
    id: 'barang',
    name: 'Jalur Mudik Barang',
    from: 'Tangerang Selatan',
    to: 'Lampung Utara',
    color: '#A16207',
    line: [at(-6.29, 106.71), at(-5.93, 106.0), at(-5.87, 105.75), at(-5.43, 105.26), at(-4.83, 104.89)],
  },
  {
    id: 'tol',
    name: 'Tol Trans Jawa',
    from: 'Merak',
    to: 'Surabaya',
    color: '#7C3AED',
    line: [
      at(-5.93, 106.0), at(-6.18, 106.63), at(-6.2, 106.85), at(-6.42, 107.46), at(-6.75, 108.5),
      at(-6.87, 109.04), at(-7.02, 110.4), at(-7.55, 110.8), at(-7.4, 111.45), at(-7.6, 112.1),
      at(-7.3, 112.7),
    ],
  },
];

export const mudikPointTypes: {
  id: MudikPointType;
  label: string;
  color: string;
  icon: SymbolName;
}[] = [
  { id: 'posko', label: 'Posko Mudik', color: '#B42318', icon: { ios: 'house', android: 'home', web: 'home' } },
  {
    id: 'bengkel',
    label: 'Bengkel Siaga',
    color: '#C2410C',
    icon: { ios: 'wrench.and.screwdriver', android: 'build', web: 'build' },
  },
  {
    id: 'pelabuhan',
    label: 'Pelabuhan',
    color: '#0E7490',
    icon: { ios: 'ferry', android: 'directions_boat', web: 'directions_boat' },
  },
];

export function mudikPointType(id: MudikPointType) {
  return mudikPointTypes.find((type) => type.id === id) ?? mudikPointTypes[0];
}

const POSKO_SERVICES = ['Tempat istirahat', 'Toilet', 'Pos kesehatan', 'Informasi arus lalu lintas'];
const BENGKEL_SERVICES = ['Servis ringan', 'Tambal ban', 'Derek kendaraan'];

export const mudikPoints: MudikPoint[] = [
  { id: 'pk-cikampek', type: 'posko', name: 'Posko Mudik Cikampek', area: 'Kab. Karawang, Jawa Barat', routeIds: ['utara', 'tol'], hours: '24 jam selama masa mudik', services: POSKO_SERVICES, coordinate: at(-6.41, 107.45) },
  { id: 'pk-brebes', type: 'posko', name: 'Posko Mudik Brebes', area: 'Kab. Brebes, Jawa Tengah', routeIds: ['utara', 'tol'], hours: '24 jam selama masa mudik', services: POSKO_SERVICES, coordinate: at(-6.87, 109.05) },
  { id: 'pk-kendal', type: 'posko', name: 'Posko Mudik Kendal', area: 'Kab. Kendal, Jawa Tengah', routeIds: ['utara'], hours: '24 jam selama masa mudik', services: POSKO_SERVICES, coordinate: at(-6.92, 110.2) },
  { id: 'pk-tuban', type: 'posko', name: 'Posko Mudik Tuban', area: 'Kab. Tuban, Jawa Timur', routeIds: ['utara'], hours: '24 jam selama masa mudik', services: POSKO_SERVICES, coordinate: at(-6.9, 112.06) },
  { id: 'pk-ciamis', type: 'posko', name: 'Posko Mudik Ciamis', area: 'Kab. Ciamis, Jawa Barat', routeIds: ['selatan'], hours: '24 jam selama masa mudik', services: POSKO_SERVICES, coordinate: at(-7.33, 108.35) },
  { id: 'pk-wangon', type: 'posko', name: 'Posko Mudik Wangon', area: 'Kab. Banyumas, Jawa Tengah', routeIds: ['selatan'], hours: '24 jam selama masa mudik', services: POSKO_SERVICES, coordinate: at(-7.52, 109.05) },
  { id: 'pk-bakauheni', type: 'posko', name: 'Posko Mudik Bakauheni', area: 'Kab. Lampung Selatan, Lampung', routeIds: ['barang'], hours: '24 jam selama masa mudik', services: POSKO_SERVICES, coordinate: at(-5.87, 105.75) },
  { id: 'pk-ngawi', type: 'posko', name: 'Posko Mudik Ngawi', area: 'Kab. Ngawi, Jawa Timur', routeIds: ['tol'], hours: '24 jam selama masa mudik', services: POSKO_SERVICES, coordinate: at(-7.4, 111.45) },

  { id: 'bk-cirebon', type: 'bengkel', name: 'Bengkel Siaga Cirebon', area: 'Kota Cirebon, Jawa Barat', routeIds: ['utara'], hours: '07.00–22.00', services: BENGKEL_SERVICES, coordinate: at(-6.72, 108.55) },
  { id: 'bk-pekalongan', type: 'bengkel', name: 'Bengkel Siaga Pekalongan', area: 'Kota Pekalongan, Jawa Tengah', routeIds: ['utara'], hours: '07.00–22.00', services: BENGKEL_SERVICES, coordinate: at(-6.89, 109.67) },
  { id: 'bk-semarang', type: 'bengkel', name: 'Bengkel Siaga Semarang', area: 'Kota Semarang, Jawa Tengah', routeIds: ['utara', 'tol'], hours: '24 jam selama masa mudik', services: BENGKEL_SERVICES, coordinate: at(-7.0, 110.41) },
  { id: 'bk-banjar', type: 'bengkel', name: 'Bengkel Siaga Banjar', area: 'Kota Banjar, Jawa Barat', routeIds: ['selatan'], hours: '07.00–22.00', services: BENGKEL_SERVICES, coordinate: at(-7.37, 108.54) },
  { id: 'bk-lampung', type: 'bengkel', name: 'Bengkel Siaga Bandar Lampung', area: 'Kota Bandar Lampung, Lampung', routeIds: ['barang'], hours: '07.00–22.00', services: BENGKEL_SERVICES, coordinate: at(-5.43, 105.26) },
  { id: 'bk-kertosono', type: 'bengkel', name: 'Bengkel Siaga Kertosono', area: 'Kab. Nganjuk, Jawa Timur', routeIds: ['tol'], hours: '24 jam selama masa mudik', services: BENGKEL_SERVICES, coordinate: at(-7.6, 112.1) },

  { id: 'pl-merak', type: 'pelabuhan', name: 'Pelabuhan Merak', area: 'Kota Cilegon, Banten', routeIds: ['barang', 'tol'], hours: '24 jam', services: ['Penyeberangan ke Bakauheni', 'Area tunggu', 'Loket tiket'], coordinate: at(-5.933, 105.997) },
  { id: 'pl-bakauheni', type: 'pelabuhan', name: 'Pelabuhan Bakauheni', area: 'Kab. Lampung Selatan, Lampung', routeIds: ['barang'], hours: '24 jam', services: ['Penyeberangan ke Merak', 'Area tunggu', 'Loket tiket'], coordinate: at(-5.87, 105.752) },
];

export function getMudikPoint(id: string) {
  return mudikPoints.find((point) => point.id === id);
}

/** Points of one type, on one route or all routes, nearest to `from` first. */
export function mudikPointsByDistance(type: MudikPointType, routeId: string | undefined, from: LatLng) {
  return mudikPoints
    .filter((point) => point.type === type && (!routeId || point.routeIds.includes(routeId)))
    .map((point) => ({ point, meters: distanceMeters(from, point.coordinate) }))
    .sort((a, b) => a.meters - b.meters);
}
