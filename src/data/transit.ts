/**
 * Sample transit data for the Lacak tab. Coordinates are approximate and only
 * good enough to draw a believable map. Replace with the route, stop and GPS APIs.
 */

import type { SymbolName } from '@/data/home';
import { isStale } from '@/utils/freshness';

export type LatLng = { latitude: number; longitude: number };

export type Stop = {
  id: string;
  name: string;
  coordinate: LatLng;
};

export type Direction = 'forward' | 'backward';

export type Route = {
  id: string;
  operator: string;
  /** Government program the operator belongs to. Shown as a label, never as an entry point. */
  program: string;
  city: string;
  corridor: string;
  color: string;
  /** Stop ids in the forward direction, from `from` to `to`. */
  stopIds: string[];
  from: string;
  to: string;
  hours: string;
};

export type Bus = {
  id: string;
  code: string;
  routeId: string;
  direction: Direction;
  /** Position as a stop index in the bus's direction; 2.5 is halfway between the 3rd and 4th stop. */
  progress: number;
  updatedSecondsAgo: number;
};

export type Arrival = {
  bus: Bus;
  route: Route;
  /** Last stop in the bus's direction. */
  headsign: string;
  minutes: number;
  stale: boolean;
};

/** Average travel time between two stops, used for the sample arrival estimates. */
export const MINUTES_PER_STOP = 3;
const ARRIVAL_WINDOW_MINUTES = 60;

/** Sample position of the person using the app, near Simpang Lima, Semarang. */
export const userLocation: LatLng = { latitude: -6.9925, longitude: 110.4205 };

export const stops: Stop[] = [
  { id: 'mangkang', name: 'Terminal Mangkang', coordinate: { latitude: -6.9706, longitude: 110.2947 } },
  { id: 'pasar-mangkang', name: 'Pasar Mangkang', coordinate: { latitude: -6.9722, longitude: 110.3065 } },
  { id: 'jrakah', name: 'Jrakah', coordinate: { latitude: -6.979, longitude: 110.342 } },
  { id: 'krapyak', name: 'Krapyak', coordinate: { latitude: -6.9846, longitude: 110.369 } },
  { id: 'kalibanteng', name: 'Kalibanteng', coordinate: { latitude: -6.9842, longitude: 110.3872 } },
  { id: 'tugu-muda', name: 'Tugu Muda', coordinate: { latitude: -6.984, longitude: 110.4093 } },
  { id: 'simpang-lima', name: 'Simpang Lima', coordinate: { latitude: -6.9903, longitude: 110.4229 } },
  { id: 'pedurungan', name: 'Pedurungan', coordinate: { latitude: -7.0005, longitude: 110.456 } },
  { id: 'penggaron', name: 'Terminal Penggaron', coordinate: { latitude: -7.0183, longitude: 110.4935 } },
  { id: 'terboyo', name: 'Terminal Terboyo', coordinate: { latitude: -6.9545, longitude: 110.4628 } },
  { id: 'kaligawe', name: 'Kaligawe', coordinate: { latitude: -6.9605, longitude: 110.4495 } },
  { id: 'johar', name: 'Pasar Johar', coordinate: { latitude: -6.9688, longitude: 110.4268 } },
  { id: 'jatingaleh', name: 'Jatingaleh', coordinate: { latitude: -7.029, longitude: 110.4185 } },
  { id: 'banyumanik', name: 'Banyumanik', coordinate: { latitude: -7.061, longitude: 110.4165 } },
  { id: 'ungaran', name: 'Ungaran', coordinate: { latitude: -7.1385, longitude: 110.4055 } },
  { id: 'prambanan', name: 'Terminal Prambanan', coordinate: { latitude: -7.7525, longitude: 110.4915 } },
  { id: 'adisutjipto', name: 'Bandara Adisutjipto', coordinate: { latitude: -7.788, longitude: 110.432 } },
  { id: 'janti', name: 'Janti', coordinate: { latitude: -7.783, longitude: 110.41 } },
  { id: 'malioboro', name: 'Malioboro', coordinate: { latitude: -7.7926, longitude: 110.3658 } },
  { id: 'purabaya', name: 'Terminal Purabaya', coordinate: { latitude: -7.351, longitude: 112.724 } },
  { id: 'wonokromo', name: 'Wonokromo', coordinate: { latitude: -7.3, longitude: 112.735 } },
  { id: 'darmo', name: 'Darmo', coordinate: { latitude: -7.285, longitude: 112.738 } },
  { id: 'tunjungan', name: 'Tunjungan', coordinate: { latitude: -7.262, longitude: 112.739 } },
  { id: 'rajawali', name: 'Rajawali', coordinate: { latitude: -7.2385, longitude: 112.734 } },
];

export const routes: Route[] = [
  {
    id: 'smg-1',
    operator: 'Trans Semarang',
    program: 'BRT Nusantara',
    city: 'Semarang',
    corridor: '1',
    color: '#E5484D',
    stopIds: [
      'mangkang',
      'pasar-mangkang',
      'jrakah',
      'krapyak',
      'kalibanteng',
      'tugu-muda',
      'simpang-lima',
      'pedurungan',
      'penggaron',
    ],
    from: 'Mangkang',
    to: 'Penggaron',
    hours: '05.30–21.00',
  },
  {
    id: 'smg-2',
    operator: 'Trans Semarang',
    program: 'BRT Nusantara',
    city: 'Semarang',
    corridor: '2',
    color: '#9F1239',
    stopIds: ['terboyo', 'kaligawe', 'johar', 'simpang-lima', 'jatingaleh', 'banyumanik', 'ungaran'],
    from: 'Terboyo',
    to: 'Ungaran',
    hours: '05.30–21.00',
  },
  {
    id: 'jogja-1a',
    operator: 'Trans Jogja',
    program: 'BRT Nusantara',
    city: 'Yogyakarta',
    corridor: '1A',
    color: '#16A34A',
    stopIds: ['prambanan', 'adisutjipto', 'janti', 'malioboro'],
    from: 'Prambanan',
    to: 'Malioboro',
    hours: '05.30–21.30',
  },
  {
    id: 'sby-r1',
    operator: 'Suroboyo Bus',
    program: 'BRT Nusantara',
    city: 'Surabaya',
    corridor: 'R1',
    color: '#7C3AED',
    stopIds: ['purabaya', 'wonokromo', 'darmo', 'tunjungan', 'rajawali'],
    from: 'Purabaya',
    to: 'Rajawali',
    hours: '05.00–22.00',
  },
];

export const buses: Bus[] = [
  { id: 'b1', code: 'I 018', routeId: 'smg-1', direction: 'forward', progress: 3, updatedSecondsAgo: 30 },
  { id: 'b2', code: 'I 021', routeId: 'smg-1', direction: 'forward', progress: 6.6, updatedSecondsAgo: 45 },
  { id: 'b3', code: 'I 005', routeId: 'smg-1', direction: 'backward', progress: 1.4, updatedSecondsAgo: 20 },
  { id: 'b4', code: 'II 007', routeId: 'smg-2', direction: 'forward', progress: 1.5, updatedSecondsAgo: 480 },
  { id: 'b5', code: 'II 011', routeId: 'smg-2', direction: 'backward', progress: 1.3, updatedSecondsAgo: 50 },
  { id: 'b6', code: 'SB 03', routeId: 'sby-r1', direction: 'forward', progress: 1.5, updatedSecondsAgo: 25 },
];

/** Route ids saved by the person; kept in sync with the saved routes on Beranda. */
export const savedRouteIds = ['smg-1', 'jogja-1a', 'sby-r1'];

export type Program = {
  id: string;
  name: string;
  description: string;
  icon: SymbolName;
};

export type Operator = {
  id: string;
  programId: string;
  name: string;
  /** City, regency or region the operator serves. */
  area: string;
  /** BPTD class for KSPN and Perintis, shown as secondary text. */
  unit?: string;
  routeCount?: number;
  /** Routes with sample data in this prototype. */
  routeIds: string[];
};

/** Every bus program from v1 stays as a menu; v1 showed them as a grid on Beranda. */
export const programs: Program[] = [
  {
    id: 'teman-bus',
    name: 'Teman Bus',
    description: 'Bus kota bersubsidi di 7 kota',
    icon: { ios: 'bus', android: 'directions_bus', web: 'directions_bus' },
  },
  {
    id: 'brt-nusantara',
    name: 'BRT Nusantara',
    description: 'Bus rapid transit di kota besar',
    icon: { ios: 'bus.doubledecker', android: 'airport_shuttle', web: 'airport_shuttle' },
  },
  {
    id: 'kspn',
    name: 'KSPN',
    description: 'Bus ke kawasan strategis pariwisata nasional',
    icon: { ios: 'mountain.2', android: 'landscape', web: 'landscape' },
  },
  {
    id: 'perintis',
    name: 'Perintis',
    description: 'Bus ke daerah yang belum dilayani bus umum',
    icon: { ios: 'signpost.right', android: 'signpost', web: 'signpost' },
  },
  {
    id: 'akap',
    name: 'AKAP',
    description: 'Bus antarkota antarprovinsi',
    icon: { ios: 'road.lanes', android: 'add_road', web: 'add_road' },
  },
  {
    id: 'biskita',
    name: 'BisKita',
    description: 'Bus perkotaan BisKita',
    icon: { ios: 'person.2', android: 'groups', web: 'groups' },
  },
  {
    id: 'ikn',
    name: 'Bus IKN',
    description: 'Bus di Ibu Kota Nusantara',
    icon: { ios: 'building.columns', android: 'account_balance', web: 'account_balance' },
  },
];

/** Operators as listed in v1 (screenshots 23–34), with names in title case. */
export const operators: Operator[] = [
  { id: 'trans-banyumas', programId: 'teman-bus', name: 'Trans Banyumas', area: 'Kab. Banyumas', routeCount: 5, routeIds: [] },
  { id: 'batik-solo-trans', programId: 'teman-bus', name: 'Batik Solo Trans', area: 'Kota Surakarta', routeCount: 10, routeIds: [] },
  { id: 'metro-jabar-trans', programId: 'teman-bus', name: 'Metro Jabar Trans', area: 'Kota Bandung', routeCount: 8, routeIds: [] },
  { id: 'trans-banjarbakula', programId: 'teman-bus', name: 'Trans Banjarbakula', area: 'Kota Banjarmasin', routeCount: 6, routeIds: [] },
  { id: 'balikpapan-city-trans', programId: 'teman-bus', name: 'Balikpapan City Trans', area: 'Kota Balikpapan', routeCount: 3, routeIds: [] },
  { id: 'trans-musi', programId: 'teman-bus', name: 'Trans Musi', area: 'Kota Palembang', routeCount: 2, routeIds: [] },
  { id: 'trans-manado', programId: 'teman-bus', name: 'Trans Manado', area: 'Kota Manado', routeCount: 2, routeIds: [] },

  { id: 'trans-semarang', programId: 'brt-nusantara', name: 'Trans Semarang', area: 'Kota Semarang', routeCount: 19, routeIds: ['smg-1', 'smg-2'] },
  { id: 'trans-jogja', programId: 'brt-nusantara', name: 'Trans Jogja', area: 'D.I. Yogyakarta', routeCount: 20, routeIds: ['jogja-1a'] },
  { id: 'trans-jateng', programId: 'brt-nusantara', name: 'Trans Jateng', area: 'Provinsi Jawa Tengah', routeCount: 7, routeIds: [] },
  { id: 'trans-batam', programId: 'brt-nusantara', name: 'Trans Batam', area: 'Kota Batam', routeCount: 10, routeIds: [] },
  { id: 'trans-jatim', programId: 'brt-nusantara', name: 'Trans Jatim', area: 'Provinsi Jawa Timur', routeCount: 11, routeIds: [] },
  { id: 'trans-tangerang', programId: 'brt-nusantara', name: 'Trans Tangerang Tayo', area: 'Kota Tangerang', routeCount: 15, routeIds: [] },
  { id: 'suroboyo-bus', programId: 'brt-nusantara', name: 'Suroboyo Bus', area: 'Kota Surabaya', routeCount: 16, routeIds: ['sby-r1'] },
  { id: 'trans-pekanbaru', programId: 'brt-nusantara', name: 'Trans Metro Pekanbaru', area: 'Kota Pekanbaru', routeCount: 9, routeIds: [] },
  { id: 'trans-banjarmasin', programId: 'brt-nusantara', name: 'Trans Banjarmasin', area: 'Kota Banjarmasin', routeCount: 4, routeIds: [] },
  { id: 'trans-koetaradja', programId: 'brt-nusantara', name: 'Trans Koetaradja', area: 'Provinsi Aceh', routeCount: 14, routeIds: [] },
  { id: 'trans-palu', programId: 'brt-nusantara', name: 'Trans Palu', area: 'Kota Palu', routeCount: 9, routeIds: [] },

  { id: 'kspn-sumut', programId: 'kspn', name: 'Sumatera Utara', area: 'Sumatera Utara', unit: 'BPTD Kelas II', routeCount: 4, routeIds: [] },
  { id: 'kspn-sumbar', programId: 'kspn', name: 'Sumatera Barat', area: 'Sumatera Barat', unit: 'BPTD Kelas II', routeCount: 9, routeIds: [] },
  { id: 'kspn-babel', programId: 'kspn', name: 'Bangka Belitung', area: 'Bangka Belitung', unit: 'BPTD Kelas III', routeCount: 2, routeIds: [] },
  { id: 'kspn-kepri', programId: 'kspn', name: 'Kepulauan Riau', area: 'Kepulauan Riau', unit: 'BPTD Kelas II', routeCount: 1, routeIds: [] },
  { id: 'kspn-diy', programId: 'kspn', name: 'D.I. Yogyakarta', area: 'D.I. Yogyakarta', unit: 'BPTD Kelas III', routeCount: 4, routeIds: [] },
  { id: 'kspn-jatim', programId: 'kspn', name: 'Jawa Timur', area: 'Jawa Timur', unit: 'BPTD Kelas II', routeCount: 7, routeIds: [] },
  { id: 'kspn-banten', programId: 'kspn', name: 'Banten', area: 'Banten', unit: 'BPTD Kelas II', routeCount: 2, routeIds: [] },
  { id: 'kspn-ntb', programId: 'kspn', name: 'Nusa Tenggara Barat', area: 'Nusa Tenggara Barat', unit: 'BPTD Kelas II', routeCount: 3, routeIds: [] },
  { id: 'kspn-ntt', programId: 'kspn', name: 'Nusa Tenggara Timur', area: 'Nusa Tenggara Timur', unit: 'BPTD Kelas II', routeCount: 1, routeIds: [] },
  { id: 'kspn-kaltim', programId: 'kspn', name: 'Kalimantan Timur', area: 'Kalimantan Timur', unit: 'BPTD Kelas II', routeCount: 1, routeIds: [] },
  { id: 'kspn-sulut', programId: 'kspn', name: 'Sulawesi Utara', area: 'Sulawesi Utara', unit: 'BPTD Kelas II', routeCount: 2, routeIds: [] },
  { id: 'kspn-sultra', programId: 'kspn', name: 'Sulawesi Tenggara', area: 'Sulawesi Tenggara', unit: 'BPTD Kelas II', routeCount: 1, routeIds: [] },
  { id: 'kspn-papua', programId: 'kspn', name: 'Papua', area: 'Papua', unit: 'BPTD Kelas II', routeCount: 1, routeIds: [] },

  { id: 'perintis-aceh', programId: 'perintis', name: 'Aceh', area: 'Aceh', unit: 'BPTD Kelas II', routeCount: 13, routeIds: [] },
  { id: 'perintis-sumut', programId: 'perintis', name: 'Sumatera Utara', area: 'Sumatera Utara', unit: 'BPTD Kelas II', routeCount: 10, routeIds: [] },
  { id: 'perintis-sumbar', programId: 'perintis', name: 'Sumatera Barat', area: 'Sumatera Barat', unit: 'BPTD Kelas II', routeCount: 7, routeIds: [] },
  { id: 'perintis-riau', programId: 'perintis', name: 'Riau', area: 'Riau', unit: 'BPTD Kelas II', routeCount: 10, routeIds: [] },
  { id: 'perintis-jambi', programId: 'perintis', name: 'Jambi', area: 'Jambi', unit: 'BPTD Kelas II', routeCount: 9, routeIds: [] },
  { id: 'perintis-sumsel', programId: 'perintis', name: 'Sumatera Selatan', area: 'Sumatera Selatan', unit: 'BPTD Kelas II', routeCount: 4, routeIds: [] },
  { id: 'perintis-bengkulu', programId: 'perintis', name: 'Bengkulu', area: 'Bengkulu', unit: 'BPTD Kelas III', routeCount: 5, routeIds: [] },
  { id: 'perintis-lampung', programId: 'perintis', name: 'Lampung', area: 'Lampung', unit: 'BPTD Kelas II', routeCount: 5, routeIds: [] },
  { id: 'perintis-babel', programId: 'perintis', name: 'Bangka Belitung', area: 'Bangka Belitung', unit: 'BPTD Kelas III', routeCount: 7, routeIds: [] },

  { id: 'akap-anugerah-gusti', programId: 'akap', name: 'PT Anugerah Gusti Pariwisata', area: 'Operator AKAP', routeIds: [] },
  { id: 'akap-ardana', programId: 'akap', name: 'PT Ardana Purwa Wisata', area: 'Operator AKAP', routeIds: [] },
  { id: 'akap-bongkaran', programId: 'akap', name: 'Bongkaran Petrokimia', area: 'Operator AKAP', routeIds: [] },
  { id: 'akap-buana', programId: 'akap', name: 'Buana Centra Swakarsa', area: 'Operator AKAP', routeIds: [] },
  { id: 'akap-bumi-karya', programId: 'akap', name: 'Bumi Karya Anugrah', area: 'Operator AKAP', routeIds: [] },
  { id: 'akap-hikmah', programId: 'akap', name: 'Hikmah Agung Gogreen', area: 'Operator AKAP', routeIds: [] },
  { id: 'akap-kacebe', programId: 'akap', name: 'PT Kacebe Murni Transport', area: 'Operator AKAP', routeIds: [] },
  { id: 'akap-limas', programId: 'akap', name: 'Limas Executive', area: 'Operator AKAP', routeIds: [] },

  { id: 'trans-pakuan', programId: 'biskita', name: 'Trans Pakuan', area: 'Kota Bogor', routeCount: 4, routeIds: [] },

  { id: 'bus-ikn', programId: 'ikn', name: 'Bus IKN', area: 'Nusantara, Kalimantan Timur', routeIds: [] },
];

/** Operators the person tracked most recently; v1 called this Quick Tracking. */
export const recentOperatorIds = ['trans-semarang', 'trans-banyumas'];

export function getProgram(id: string) {
  return programs.find((program) => program.id === id);
}

export function getOperator(id: string) {
  return operators.find((operator) => operator.id === id);
}

/** Sort key that ignores a leading "PT", so it no longer splits the alphabet as it did in v1. */
const sortName = (name: string) => name.replace(/^PT\.?\s+/i, '');

export function operatorsInProgram(programId: string) {
  return operators
    .filter((operator) => operator.programId === programId)
    .sort((a, b) => sortName(a.name).localeCompare(sortName(b.name), 'id'));
}

const stopById = new Map(stops.map((stop) => [stop.id, stop]));
const routeById = new Map(routes.map((route) => [route.id, route]));

export function getStop(id: string) {
  return stopById.get(id);
}

export function getBus(id: string) {
  return buses.find((bus) => bus.id === id);
}

export function getRoute(id: string) {
  return routeById.get(id);
}

export function stopIdsInDirection(route: Route, direction: Direction) {
  return direction === 'forward' ? route.stopIds : [...route.stopIds].reverse();
}

export function stopsOnRoute(route: Route, direction: Direction = 'forward') {
  return stopIdsInDirection(route, direction)
    .map((id) => stopById.get(id))
    .filter((stop): stop is Stop => stop !== undefined);
}

export function routesAtStop(stopId: string) {
  return routes.filter((route) => route.stopIds.includes(stopId));
}

export function busesOnRoute(routeId: string) {
  return buses.filter((bus) => bus.routeId === routeId);
}

export function headsign(route: Route, direction: Direction) {
  return direction === 'forward' ? route.to : route.from;
}

/** Interpolated map position of a bus between the two stops it is travelling between. */
export function busCoordinate(bus: Bus): LatLng | undefined {
  const route = routeById.get(bus.routeId);
  if (!route) return undefined;
  const path = stopsOnRoute(route, bus.direction);
  const index = Math.min(Math.floor(bus.progress), path.length - 1);
  const next = Math.min(index + 1, path.length - 1);
  const t = bus.progress - index;
  const a = path[index].coordinate;
  const b = path[next].coordinate;
  return {
    latitude: a.latitude + (b.latitude - a.latitude) * t,
    longitude: a.longitude + (b.longitude - a.longitude) * t,
  };
}

/** Buses heading to a stop within the arrival window, soonest first. */
export function arrivalsAtStop(stopId: string): Arrival[] {
  return buses
    .flatMap((bus) => {
      const route = routeById.get(bus.routeId);
      if (!route) return [];
      const index = stopIdsInDirection(route, bus.direction).indexOf(stopId);
      if (index === -1 || index <= bus.progress) return [];
      const minutes = Math.round((index - bus.progress) * MINUTES_PER_STOP);
      if (minutes > ARRIVAL_WINDOW_MINUTES) return [];
      return [
        {
          bus,
          route,
          headsign: headsign(route, bus.direction),
          minutes,
          stale: isStale(bus.updatedSecondsAgo),
        },
      ];
    })
    .sort((a, b) => a.minutes - b.minutes);
}

/** Straight-line distance in metres. */
export function distanceMeters(a: LatLng, b: LatLng) {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.latitude)) * Math.cos(toRad(b.latitude)) * Math.sin(dLon / 2) ** 2;
  return 2 * 6371000 * Math.asin(Math.sqrt(h));
}

export function formatDistance(meters: number) {
  return meters < 1000 ? `${Math.round(meters / 10) * 10} m` : `${(meters / 1000).toFixed(1)} km`;
}

export function nearbyStops(from: LatLng, limit = 5) {
  return stops
    .map((stop) => ({ stop, meters: distanceMeters(from, stop.coordinate) }))
    .sort((a, b) => a.meters - b.meters)
    .slice(0, limit);
}

const normalize = (text: string) => text.toLowerCase().trim();

/**
 * Matches stops by name, routes by corridor, operator, city, program or end points,
 * and operators by name, area or program.
 */
export function search(query: string) {
  const q = normalize(query);
  if (!q) return { stops: [], routes: [], operators: [] };
  return {
    operators: operators.filter((operator) =>
      [operator.name, operator.area, getProgram(operator.programId)?.name ?? '']
        .map(normalize)
        .some((field) => field.includes(q)),
    ),
    stops: stops.filter((stop) => normalize(stop.name).includes(q)),
    routes: routes.filter((route) =>
      [route.corridor, `koridor ${route.corridor}`, route.operator, route.city, route.program, route.from, route.to]
        .map(normalize)
        .some((field) => field.includes(q)),
    ),
  };
}
