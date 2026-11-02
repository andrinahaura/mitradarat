import { StyleSheet, Text, View } from 'react-native';

import { Brand, Radius, Type } from '@/constants/theme';
import type { Bus, LatLng, Route } from '@/data/transit';

type RoutePreviewMapProps = {
  route: Route;
  bus: Bus;
  stop: LatLng;
};

/** react-native-maps has no web build; the preview keeps the same footprint. */
export function RoutePreviewMap(_props: RoutePreviewMapProps) {
  return (
    <View style={styles.frame}>
      <Text style={styles.text}>Peta tersedia di aplikasi iOS dan Android.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    height: 170,
    borderRadius: Radius.inner,
    backgroundColor: Brand.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    ...Type.caption,
    color: Brand.textSecondary,
  },
});
