import { SymbolView } from 'expo-symbols';
import { type Ref, useImperativeHandle, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';

import { Brand, Radius } from '@/constants/theme';
import {
  type Bus,
  busCoordinate,
  busesOnRoute,
  buses as allBuses,
  type LatLng,
  type Route,
  routes,
  type Stop,
  stops as allStops,
  stopsOnRoute,
  userLocation,
} from '@/data/transit';
import { isStale } from '@/utils/freshness';

export type TrackingMapHandle = {
  focusRoute: (route: Route) => void;
  focusStop: (stop: Stop) => void;
  focusLocation: (location: LatLng) => void;
};

type TrackingMapProps = {
  ref?: Ref<TrackingMapHandle>;
  selectedRoute?: Route;
  selectedStopId?: string;
  /** Space covered by floating UI, so the map centres content in the visible area. */
  padding: { top: number; bottom: number };
  onPressStop: (stop: Stop) => void;
  onPressBus: (bus: Bus) => void;
};

const CITY_DELTA = 0.09;
const STOP_DELTA = 0.02;

export function TrackingMap({
  ref,
  selectedRoute,
  selectedStopId,
  padding,
  onPressStop,
  onPressBus,
}: TrackingMapProps) {
  const map = useRef<MapView>(null);

  useImperativeHandle(ref, () => ({
    focusRoute: (route) =>
      map.current?.fitToCoordinates(
        stopsOnRoute(route).map((stop) => stop.coordinate),
        { edgePadding: { top: 48, right: 48, bottom: 48, left: 48 }, animated: true },
      ),
    focusStop: (stop) =>
      map.current?.animateToRegion(
        { ...stop.coordinate, latitudeDelta: STOP_DELTA, longitudeDelta: STOP_DELTA },
        400,
      ),
    focusLocation: (location) =>
      map.current?.animateToRegion(
        { ...location, latitudeDelta: CITY_DELTA, longitudeDelta: CITY_DELTA },
        400,
      ),
  }));

  const visibleStops = selectedRoute ? stopsOnRoute(selectedRoute) : allStops;
  const visibleBuses = selectedRoute ? busesOnRoute(selectedRoute.id) : allBuses;
  const stopColor = selectedRoute?.color ?? Brand.primary;

  return (
    <MapView
      ref={map}
      style={StyleSheet.absoluteFill}
      initialRegion={{ ...userLocation, latitudeDelta: CITY_DELTA, longitudeDelta: CITY_DELTA }}
      mapPadding={{ top: padding.top, bottom: padding.bottom, left: 0, right: 0 }}
      showsPointsOfInterests={false}
      showsBuildings={false}
      pitchEnabled={false}
      userInterfaceStyle="light">
      {routes.map((route) => {
        const selected = route.id === selectedRoute?.id;
        if (selectedRoute && !selected) return null;
        return (
          <Polyline
            key={route.id}
            coordinates={stopsOnRoute(route).map((stop) => stop.coordinate)}
            strokeColor={selected ? route.color : `${route.color}99`}
            strokeWidth={selected ? 5 : 3}
            lineCap="round"
            lineJoin="round"
          />
        );
      })}

      {visibleStops.map((stop) => {
        const selected = stop.id === selectedStopId;
        return (
          <Marker
            key={stop.id}
            coordinate={stop.coordinate}
            anchor={{ x: 0.5, y: 0.5 }}
            onPress={() => onPressStop(stop)}
            zIndex={selected ? 3 : 1}
            accessibilityLabel={`Halte ${stop.name}`}>
            <View
              style={[
                styles.stop,
                { borderColor: stopColor },
                selected && [styles.stopSelected, { backgroundColor: stopColor }],
              ]}
            />
          </Marker>
        );
      })}

      {visibleBuses.map((bus) => {
        const coordinate = busCoordinate(bus);
        const route = routes.find((r) => r.id === bus.routeId);
        if (!coordinate || !route) return null;
        const stale = isStale(bus.updatedSecondsAgo);
        return (
          <Marker
            key={bus.id}
            coordinate={coordinate}
            anchor={{ x: 0.5, y: 0.5 }}
            onPress={() => onPressBus(bus)}
            zIndex={2}
            accessibilityLabel={`Bus ${bus.code}${stale ? ', data tertunda' : ''}`}>
            <View
              style={[
                styles.bus,
                { backgroundColor: route.color },
                stale && styles.busStale,
              ]}>
              <SymbolView
                name={{ ios: 'bus', android: 'directions_bus', web: 'directions_bus' }}
                size={12}
                tintColor="#FFFFFF"
              />
              <Text style={styles.busText}>{route.corridor}</Text>
            </View>
          </Marker>
        );
      })}

      <Marker coordinate={userLocation} anchor={{ x: 0.5, y: 0.5 }} zIndex={4}>
        <View style={styles.userHalo}>
          <View style={styles.userDot} />
        </View>
      </Marker>
    </MapView>
  );
}

const styles = StyleSheet.create({
  stop: {
    width: 14,
    height: 14,
    borderRadius: Radius.full,
    borderWidth: 3,
    backgroundColor: '#FFFFFF',
  },
  stopSelected: {
    width: 22,
    height: 22,
    borderColor: '#FFFFFF',
  },
  bus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    height: 22,
    borderRadius: Radius.small,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  busStale: {
    opacity: 0.65,
    borderColor: Brand.accent,
  },
  busText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  userHalo: {
    width: 28,
    height: 28,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(35, 80, 230, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userDot: {
    width: 14,
    height: 14,
    borderRadius: Radius.full,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    backgroundColor: Brand.primary,
  },
});
