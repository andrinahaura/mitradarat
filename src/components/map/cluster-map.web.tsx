import { type Ref, useImperativeHandle } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Brand } from '@/constants/theme';
import type { SymbolName } from '@/data/home';
import type { LatLng } from '@/data/transit';
import type { MapPoint } from '@/utils/cluster';

export type ClusterMapHandle = {
  focus: (coordinate: LatLng) => void;
  fit: (coordinates: LatLng[]) => void;
};

type ClusterMapProps = {
  ref?: Ref<ClusterMapHandle>;
  /** A point may carry its own color and icon, e.g. traffic status and layer. */
  points: (MapPoint & { name: string; color?: string; icon?: SymbolName })[];
  color: string;
  icon: SymbolName;
  selectedId?: string;
  line?: { coordinates: LatLng[]; color: string };
  padding: { top: number; bottom: number };
  onPressPoint: (id: string) => void;
};

/** react-native-maps has no web support; the list in the sheet still works on web. */
export function ClusterMap({ ref, padding }: ClusterMapProps) {
  useImperativeHandle(ref, () => ({ focus: () => {}, fit: () => {} }));

  return (
    <View style={[styles.placeholder, { paddingTop: padding.top }]}>
      <Text style={styles.text}>Peta tersedia di aplikasi iOS dan Android.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    backgroundColor: '#DCE6F5',
  },
  text: {
    marginTop: 24,
    fontSize: 14,
    color: Brand.textSecondary,
  },
});
