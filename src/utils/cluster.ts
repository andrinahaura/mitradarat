import type { LatLng } from '@/data/transit';

export type MapPoint = {
  id: string;
  coordinate: LatLng;
};

export type Cluster<T extends MapPoint> = {
  key: string;
  coordinate: LatLng;
  items: T[];
};

/**
 * Groups points that would overlap at the current zoom: points in the same grid
 * cell (an eighth of the visible height) become one cluster.
 */
export function clusterPoints<T extends MapPoint>(items: T[], latitudeDelta: number): Cluster<T>[] {
  const cell = latitudeDelta / 8;
  const cells = new Map<string, T[]>();
  for (const item of items) {
    const key = `${Math.floor(item.coordinate.latitude / cell)}:${Math.floor(item.coordinate.longitude / cell)}`;
    cells.set(key, [...(cells.get(key) ?? []), item]);
  }
  return [...cells.entries()].map(([key, group]) => ({
    key,
    items: group,
    coordinate: {
      latitude: group.reduce((sum, p) => sum + p.coordinate.latitude, 0) / group.length,
      longitude: group.reduce((sum, p) => sum + p.coordinate.longitude, 0) / group.length,
    },
  }));
}
