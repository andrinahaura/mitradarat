import { SymbolView } from 'expo-symbols';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';

import { Brand, Radius } from '@/constants/theme';
import { type Bus, busCoordinate, type LatLng, type Route, stopsOnRoute } from '@/data/transit';

type RoutePreviewMapProps = {
  route: Route;
  bus: Bus;
  /** The stop the person waits at, drawn as a filled dot. */
  stop: LatLng;
};

/** Padding around the route, as a share of its span. */
const MARGIN = 0.35;

/** Small static map of one route and one bus. Taps go to the card around it. */
export function RoutePreviewMap({ route, bus, stop }: RoutePreviewMapProps) {
  const path = stopsOnRoute(route).map((item) => item.coordinate);
  const busAt = busCoordinate(bus);

  const lats = path.map((p) => p.latitude);
  const lngs = path.map((p) => p.longitude);
  const latSpan = Math.max(...lats) - Math.min(...lats);
  const lngSpan = Math.max(...lngs) - Math.min(...lngs);
  const region = {
    latitude: (Math.max(...lats) + Math.min(...lats)) / 2,
    longitude: (Math.max(...lngs) + Math.min(...lngs)) / 2,
    latitudeDelta: latSpan * (1 + MARGIN * 2) || 0.05,
    longitudeDelta: lngSpan * (1 + MARGIN * 2) || 0.05,
  };

  return (
    <View style={styles.frame} pointerEvents="none">
      <MapView
        style={StyleSheet.absoluteFill}
        initialRegion={region}
        scrollEnabled={false}
        zoomEnabled={false}
        rotateEnabled={false}
        pitchEnabled={false}
        showsPointsOfInterests={false}
        showsBuildings={false}
        toolbarEnabled={false}
        liteMode
        userInterfaceStyle="light">
        <Polyline coordinates={path} strokeColor={route.color} strokeWidth={4} />
        <Marker coordinate={stop} anchor={{ x: 0.5, y: 0.5 }}>
          <View style={[styles.stop, { borderColor: route.color }]} />
        </Marker>
        {busAt && (
          <Marker coordinate={busAt} anchor={{ x: 0.5, y: 0.5 }}>
            <View style={[styles.bus, { backgroundColor: route.color }]}>
              <SymbolView
                name={{ ios: 'bus', android: 'directions_bus', web: 'directions_bus' }}
                size={13}
                tintColor="#FFFFFF"
              />
            </View>
          </Marker>
        )}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    height: 170,
    borderRadius: Radius.inner,
    overflow: 'hidden',
    backgroundColor: Brand.primarySoft,
  },
  stop: {
    width: 16,
    height: 16,
    borderRadius: Radius.full,
    borderWidth: 4,
    backgroundColor: '#FFFFFF',
  },
  bus: {
    width: 28,
    height: 28,
    borderRadius: Radius.full,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
