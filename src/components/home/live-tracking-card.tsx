import { StyleSheet, Pressable, Text, View } from 'react-native';

import { CorridorBadge } from '@/components/corridor-badge';
import { RoutePreviewMap } from '@/components/home/route-preview-map';
import { Brand, Radius, Spacing, Type } from '@/constants/theme';
import {
  arrivalsAtStop,
  type Bus,
  distanceMeters,
  formatDistance,
  headsign,
  type Route,
  type Stop,
  userLocation,
} from '@/data/transit';
import { isStale } from '@/utils/freshness';

type LiveTrackingCardProps = {
  route: Route;
  bus: Bus;
  stop: Stop;
  onPress: () => void;
};

/**
 * The bus the person follows (reference 4, middle screen): route and bus code, a
 * small map, then three facts. The ETA is hidden when the data is stale.
 */
export function LiveTrackingCard({ route, bus, stop, onPress }: LiveTrackingCardProps) {
  const stale = isStale(bus.updatedSecondsAgo);
  const arrival = arrivalsAtStop(stop.id).find((item) => item.bus.id === bus.id);
  const origin = bus.direction === 'forward' ? route.from : route.to;
  const distance = formatDistance(distanceMeters(userLocation, stop.coordinate));
  const eta = stale || !arrival ? 'Tertunda' : `${arrival.minutes} mnt`;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.body, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel={`${route.operator} koridor ${route.corridor}, bus ${bus.code} menuju ${stop.name}, ${
        stale ? 'data tertunda' : `tiba ${eta}`
      }. Ketuk untuk melacak`}>
      <View style={styles.inner}>
        <View style={styles.routeRow}>
          <CorridorBadge code={route.corridor} color={route.color} />
          <Text style={styles.route} numberOfLines={1}>
            {origin} → {headsign(route, bus.direction)}
          </Text>
          <Text style={styles.busCode}>Bus {bus.code}</Text>
        </View>

        <View>
          <RoutePreviewMap route={route} bus={bus} stop={stop.coordinate} />
          <View style={styles.trackPill}>
            <Text style={styles.trackPillText}>Lacak bus</Text>
          </View>
        </View>

        <View style={styles.facts}>
          <Fact label="Halte kamu" value={stop.name} />
          <Fact label="Jarak" value={distance} />
          <Fact label="Bus tiba" value={eta} highlight={!stale} warn={stale} />
        </View>
      </View>
    </Pressable>
  );
}

function Fact({
  label,
  value,
  highlight,
  warn,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  warn?: boolean;
}) {
  return (
    <View style={styles.fact}>
      <Text style={styles.factLabel}>{label}</Text>
      <Text
        style={[styles.factValue, highlight && styles.factValueHighlight, warn && styles.factValueWarn]}
        numberOfLines={2}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.three,
  },
  inner: {
    padding: Spacing.three - 4,
    gap: Spacing.three - 4,
    borderRadius: Radius.inner,
    backgroundColor: Brand.background,
  },
  pressed: {
    opacity: 0.7,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two + 2,
  },
  route: {
    ...Type.label,
    flex: 1,
    color: Brand.text,
  },
  busCode: {
    ...Type.bodySmall,
    color: Brand.textSecondary,
  },
  trackPill: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: Spacing.three - 4,
    height: 34,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.full,
    backgroundColor: Brand.surfaceContrast,
    justifyContent: 'center',
  },
  trackPillText: {
    ...Type.labelSmall,
    color: Brand.textOnPrimary,
  },
  facts: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  fact: {
    flex: 1,
    gap: 2,
    alignItems: 'center',
  },
  factLabel: {
    ...Type.caption,
    color: Brand.textSecondary,
  },
  factValue: {
    ...Type.label,
    color: Brand.text,
    textAlign: 'center',
  },
  factValueHighlight: {
    color: Brand.primary,
  },
  factValueWarn: {
    color: '#A16207',
  },
});
