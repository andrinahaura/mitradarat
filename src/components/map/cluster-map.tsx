import { SymbolView } from 'expo-symbols';
import { type Ref, useImperativeHandle, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, Polyline, type Region } from 'react-native-maps';

import { Brand, Radius } from '@/constants/theme';
import type { SymbolName } from '@/data/home';
import { type LatLng, userLocation } from '@/data/transit';
import { clusterPoints, type MapPoint } from '@/utils/cluster';

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
  /** Optional line drawn under the markers, e.g. a mudik route. */
  line?: { coordinates: LatLng[]; color: string };
  padding: { top: number; bottom: number };
  onPressPoint: (id: string) => void;
};

/** Opens around the user, not zoomed out over Asia as v1 did (screenshots 38, 42). */
const INITIAL_DELTA = 4;
const FOCUS_DELTA = 0.08;
const EDGE = { top: 48, right: 48, bottom: 48, left: 48 };

/** Map with clustered markers, used by Peta Prasarana and Peta Tematik. */
export function ClusterMap({
  ref,
  points,
  color,
  icon,
  selectedId,
  line,
  padding,
  onPressPoint,
}: ClusterMapProps) {
  const map = useRef<MapView>(null);
  const [latitudeDelta, setLatitudeDelta] = useState(INITIAL_DELTA);

  useImperativeHandle(ref, () => ({
    focus: (coordinate) =>
      map.current?.animateToRegion(
        { ...coordinate, latitudeDelta: FOCUS_DELTA, longitudeDelta: FOCUS_DELTA },
        400,
      ),
    fit: (coordinates) =>
      map.current?.fitToCoordinates(coordinates, { edgePadding: EDGE, animated: true }),
  }));

  const zoomInto = (coordinate: LatLng) =>
    map.current?.animateToRegion(
      { ...coordinate, latitudeDelta: latitudeDelta / 3, longitudeDelta: latitudeDelta / 3 },
      400,
    );

  return (
    <MapView
      ref={map}
      style={StyleSheet.absoluteFill}
      initialRegion={{ ...userLocation, latitudeDelta: INITIAL_DELTA, longitudeDelta: INITIAL_DELTA }}
      mapPadding={{ top: padding.top, bottom: padding.bottom, left: 0, right: 0 }}
      onRegionChangeComplete={(region: Region) => setLatitudeDelta(region.latitudeDelta)}
      showsPointsOfInterests={false}
      pitchEnabled={false}
      userInterfaceStyle="light">
      {line && (
        <Polyline
          coordinates={line.coordinates}
          strokeColor={line.color}
          strokeWidth={5}
          lineCap="round"
          lineJoin="round"
        />
      )}

      {clusterPoints(points, latitudeDelta).map((cluster) => {
        if (cluster.items.length > 1) {
          return (
            <Marker
              key={cluster.key}
              coordinate={cluster.coordinate}
              anchor={{ x: 0.5, y: 0.5 }}
              onPress={() => zoomInto(cluster.coordinate)}
              accessibilityLabel={`${cluster.items.length} lokasi. Ketuk untuk memperbesar`}>
              <View style={[styles.cluster, { backgroundColor: color }]}>
                <Text style={styles.clusterText}>{cluster.items.length}</Text>
              </View>
            </Marker>
          );
        }
        const point = cluster.items[0];
        const selected = point.id === selectedId;
        const pointColor = point.color ?? color;
        return (
          <Marker
            key={point.id}
            coordinate={point.coordinate}
            anchor={{ x: 0.5, y: 0.5 }}
            onPress={() => onPressPoint(point.id)}
            zIndex={selected ? 2 : 1}
            accessibilityLabel={point.name}>
            <View style={[styles.pin, { borderColor: pointColor }, selected && { backgroundColor: pointColor }]}>
              <SymbolView name={point.icon ?? icon} size={14} tintColor={selected ? '#FFFFFF' : pointColor} />
            </View>
          </Marker>
        );
      })}

      <Marker coordinate={userLocation} anchor={{ x: 0.5, y: 0.5 }} zIndex={3}>
        <View style={styles.userDot} />
      </Marker>
    </MapView>
  );
}

const styles = StyleSheet.create({
  cluster: {
    minWidth: 34,
    height: 34,
    paddingHorizontal: 8,
    borderRadius: Radius.full,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clusterText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  pin: {
    width: 30,
    height: 30,
    borderRadius: Radius.full,
    borderWidth: 2,
    backgroundColor: '#FFFFFF',
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
