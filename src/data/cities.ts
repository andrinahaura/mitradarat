/**
 * Cities for the Beranda city picker: every city with a city bus operator in the
 * Teman Bus, BRT Nusantara or BisKita programs. The chosen city is kept for the
 * session only; replace with saved settings once accounts exist.
 */

import { useSyncExternalStore } from 'react';

import { getOperator, type Operator } from '@/data/transit';

export type City = {
  id: string;
  name: string;
  province: string;
  operatorIds: string[];
};

export const cities: City[] = [
  { id: 'semarang', name: 'Semarang', province: 'Jawa Tengah', operatorIds: ['trans-semarang', 'trans-jateng'] },
  { id: 'yogyakarta', name: 'Yogyakarta', province: 'D.I. Yogyakarta', operatorIds: ['trans-jogja'] },
  { id: 'surabaya', name: 'Surabaya', province: 'Jawa Timur', operatorIds: ['suroboyo-bus', 'trans-jatim'] },
  { id: 'surakarta', name: 'Surakarta', province: 'Jawa Tengah', operatorIds: ['batik-solo-trans'] },
  { id: 'bandung', name: 'Bandung', province: 'Jawa Barat', operatorIds: ['metro-jabar-trans'] },
  { id: 'bogor', name: 'Bogor', province: 'Jawa Barat', operatorIds: ['trans-pakuan'] },
  { id: 'tangerang', name: 'Tangerang', province: 'Banten', operatorIds: ['trans-tangerang'] },
  { id: 'purwokerto', name: 'Purwokerto', province: 'Jawa Tengah', operatorIds: ['trans-banyumas'] },
  { id: 'palembang', name: 'Palembang', province: 'Sumatera Selatan', operatorIds: ['trans-musi'] },
  { id: 'pekanbaru', name: 'Pekanbaru', province: 'Riau', operatorIds: ['trans-pekanbaru'] },
  { id: 'batam', name: 'Batam', province: 'Kepulauan Riau', operatorIds: ['trans-batam'] },
  { id: 'banda-aceh', name: 'Banda Aceh', province: 'Aceh', operatorIds: ['trans-koetaradja'] },
  {
    id: 'banjarmasin',
    name: 'Banjarmasin',
    province: 'Kalimantan Selatan',
    operatorIds: ['trans-banjarmasin', 'trans-banjarbakula'],
  },
  { id: 'balikpapan', name: 'Balikpapan', province: 'Kalimantan Timur', operatorIds: ['balikpapan-city-trans'] },
  { id: 'manado', name: 'Manado', province: 'Sulawesi Utara', operatorIds: ['trans-manado'] },
  { id: 'palu', name: 'Palu', province: 'Sulawesi Tengah', operatorIds: ['trans-palu'] },
];

/** The city the prototype treats as the current location (see `userLocation`). */
export const CURRENT_CITY_ID = 'semarang';

export function getCity(id: string) {
  return cities.find((city) => city.id === id);
}

export function cityOperators(city: City) {
  return city.operatorIds.map(getOperator).filter((operator): operator is Operator => operator !== undefined);
}

let selectedId = CURRENT_CITY_ID;
const listeners = new Set<() => void>();
const getSelectedId = () => selectedId;

export function useSelectedCity() {
  const id = useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    getSelectedId,
    getSelectedId,
  );
  return getCity(id) ?? cities[0];
}

export function selectCity(id: string) {
  selectedId = id;
  listeners.forEach((listener) => listener());
}
