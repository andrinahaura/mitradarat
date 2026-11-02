/**
 * Sample facilities for Peta Prasarana (v1 screenshots 38–41). Names are real
 * places; coordinates are approximate and locations are given at city level only.
 * v1 listed 130 terminals and 783 ports; the prototype carries a small sample.
 * Replace with the facility API.
 */

import type { SymbolName } from '@/data/home';
import { distanceMeters, type LatLng } from '@/data/transit';

export type FacilityType = 'terminal' | 'pelabuhan' | 'jembatan-timbang';

export type Facility = {
  id: string;
  type: FacilityType;
  name: string;
  area: string;
  coordinate: LatLng;
};

export const facilityTypes: {
  id: FacilityType;
  label: string;
  color: string;
  icon: SymbolName;
}[] = [
  {
    id: 'terminal',
    label: 'Terminal',
    color: '#2350E6',
    icon: { ios: 'bus', android: 'directions_bus', web: 'directions_bus' },
  },
  {
    id: 'pelabuhan',
    label: 'Pelabuhan',
    color: '#0E7490',
    icon: { ios: 'ferry', android: 'directions_boat', web: 'directions_boat' },
  },
  {
    id: 'jembatan-timbang',
    label: 'Jembatan Timbang',
    color: '#A16207',
    icon: { ios: 'scalemass', android: 'scale', web: 'scale' },
  },
];

export function facilityType(id: FacilityType) {
  return facilityTypes.find((type) => type.id === id) ?? facilityTypes[0];
}

const at = (latitude: number, longitude: number): LatLng => ({ latitude, longitude });

export const facilities: Facility[] = [
  { id: 't-mangkang', type: 'terminal', name: 'Terminal Mangkang', area: 'Kota Semarang, Jawa Tengah', coordinate: at(-6.9706, 110.2947) },
  { id: 't-terboyo', type: 'terminal', name: 'Terminal Terboyo', area: 'Kota Semarang, Jawa Tengah', coordinate: at(-6.9545, 110.4628) },
  { id: 't-penggaron', type: 'terminal', name: 'Terminal Penggaron', area: 'Kota Semarang, Jawa Tengah', coordinate: at(-7.0183, 110.4935) },
  { id: 't-tirtonadi', type: 'terminal', name: 'Terminal Tirtonadi', area: 'Kota Surakarta, Jawa Tengah', coordinate: at(-7.555, 110.818) },
  { id: 't-giwangan', type: 'terminal', name: 'Terminal Giwangan', area: 'Kota Yogyakarta, D.I. Yogyakarta', coordinate: at(-7.834, 110.392) },
  { id: 't-leuwipanjang', type: 'terminal', name: 'Terminal Leuwipanjang', area: 'Kota Bandung, Jawa Barat', coordinate: at(-6.945, 107.594) },
  { id: 't-pulo-gebang', type: 'terminal', name: 'Terminal Pulo Gebang', area: 'Jakarta Timur, DKI Jakarta', coordinate: at(-6.21, 106.953) },
  { id: 't-kampung-rambutan', type: 'terminal', name: 'Terminal Kampung Rambutan', area: 'Jakarta Timur, DKI Jakarta', coordinate: at(-6.309, 106.882) },
  { id: 't-purabaya', type: 'terminal', name: 'Terminal Purabaya', area: 'Kab. Sidoarjo, Jawa Timur', coordinate: at(-7.351, 112.724) },
  { id: 't-arjosari', type: 'terminal', name: 'Terminal Arjosari', area: 'Kota Malang, Jawa Timur', coordinate: at(-7.933, 112.658) },
  { id: 't-rajabasa', type: 'terminal', name: 'Terminal Rajabasa', area: 'Kota Bandar Lampung, Lampung', coordinate: at(-5.37, 105.243) },

  { id: 'p-merak', type: 'pelabuhan', name: 'Pelabuhan Merak', area: 'Kota Cilegon, Banten', coordinate: at(-5.933, 105.997) },
  { id: 'p-bakauheni', type: 'pelabuhan', name: 'Pelabuhan Bakauheni', area: 'Kab. Lampung Selatan, Lampung', coordinate: at(-5.87, 105.752) },
  { id: 'p-ketapang', type: 'pelabuhan', name: 'Pelabuhan Ketapang', area: 'Kab. Banyuwangi, Jawa Timur', coordinate: at(-8.143, 114.397) },
  { id: 'p-gilimanuk', type: 'pelabuhan', name: 'Pelabuhan Gilimanuk', area: 'Kab. Jembrana, Bali', coordinate: at(-8.164, 114.437) },
  { id: 'p-padangbai', type: 'pelabuhan', name: 'Pelabuhan Padangbai', area: 'Kab. Karangasem, Bali', coordinate: at(-8.53, 115.51) },

  { id: 'jt-balonggandu', type: 'jembatan-timbang', name: 'UPPKB Balonggandu', area: 'Kab. Karawang, Jawa Barat', coordinate: at(-6.32, 107.42) },
  { id: 'jt-losarang', type: 'jembatan-timbang', name: 'UPPKB Losarang', area: 'Kab. Indramayu, Jawa Barat', coordinate: at(-6.4, 108.15) },
  { id: 'jt-subah', type: 'jembatan-timbang', name: 'UPPKB Subah', area: 'Kab. Batang, Jawa Tengah', coordinate: at(-6.96, 109.85) },
  { id: 'jt-sarang', type: 'jembatan-timbang', name: 'UPPKB Sarang', area: 'Kab. Rembang, Jawa Tengah', coordinate: at(-6.73, 111.56) },
  { id: 'jt-widang', type: 'jembatan-timbang', name: 'UPPKB Widang', area: 'Kab. Tuban, Jawa Timur', coordinate: at(-6.99, 112.14) },
];

export function getFacility(id: string) {
  return facilities.find((facility) => facility.id === id);
}

/** Facilities of one type, nearest first, with their distance from `from`. */
export function facilitiesByDistance(type: FacilityType, from: LatLng) {
  return facilities
    .filter((facility) => facility.type === type)
    .map((facility) => ({ facility, meters: distanceMeters(from, facility.coordinate) }))
    .sort((a, b) => a.meters - b.meters);
}

