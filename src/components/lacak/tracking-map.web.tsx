import type { Ref } from 'react';
import { useImperativeHandle } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Brand } from '@/constants/theme';
import type { Bus, LatLng, Route, Stop } from '@/data/transit';

export type TrackingMapHandle = {
  focusRoute: (route: Route) => void;
  focusStop: (stop: Stop) => void;
  focusLocation: (location: LatLng) => void;
};

type TrackingMapProps = {
  ref?: Ref<TrackingMapHandle>;
  selectedRoute?: Route;
  selectedStopId?: string;
  padding: { top: number; bottom: number };
  onPressStop: (stop: Stop) => void;
  onPressBus: (bus: Bus) => void;
};

/** react-native-maps has no web support; the list in the sheet still works on web. */
export function TrackingMap({ ref, padding }: TrackingMapProps) {
  useImperativeHandle(ref, () => ({
    focusRoute: () => {},
    focusStop: () => {},
    focusLocation: () => {},
  }));

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
    fontWeight: '500',
    color: Brand.textSecondary,
  },
});
