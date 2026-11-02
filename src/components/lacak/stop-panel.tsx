import { Pressable, StyleSheet, Text, View } from 'react-native';

import { CorridorBadge } from '@/components/corridor-badge';
import { EmptyNote, SectionTitle } from '@/components/list';
import { PanelHeader } from '@/components/lacak/panel-header';
import { Brand, Card, Gutter, Radius, Spacing } from '@/constants/theme';
import { type Arrival, arrivalsAtStop, type Route, routesAtStop, type Stop } from '@/data/transit';
import { formatEta, formatUpdated } from '@/utils/freshness';

type StopPanelProps = {
  stop: Stop;
  saved: boolean;
  onBack?: () => void;
  onToggleSave: () => void;
  onPressRoute: (route: Route, direction: Arrival['bus']['direction']) => void;
};

export function StopPanel({ stop, saved, onBack, onToggleSave, onPressRoute }: StopPanelProps) {
  const corridors = routesAtStop(stop.id);
  const arrivals = arrivalsAtStop(stop.id);

  return (
    <View>
      <PanelHeader
        title={stop.name}
        subtitle={`Halte · ${corridors[0]?.city ?? ''}`}
        saved={saved}
        onBack={onBack}
        onToggleSave={onToggleSave}
      />

      <View style={styles.corridors}>
        {corridors.map((route) => (
          <Pressable
            key={route.id}
            onPress={() => onPressRoute(route, 'forward')}
            style={({ pressed }) => [styles.corridorChip, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel={`Lihat rute koridor ${route.corridor}`}>
            <CorridorBadge code={route.corridor} color={route.color} />
            <Text style={styles.corridorText}>
              {route.from} – {route.to}
            </Text>
          </Pressable>
        ))}
      </View>

      <SectionTitle>Kedatangan</SectionTitle>
      {arrivals.length === 0 ? (
        <EmptyNote
          title="Belum ada bus menuju halte ini dalam 60 menit"
          body={`Jam operasional: ${corridors
            .map((route) => `koridor ${route.corridor} pukul ${route.hours}`)
            .join(', ')}.`}
        />
      ) : (
        <View style={styles.card}>
          {arrivals.map((arrival, i) => (
            <ArrivalRow
              key={arrival.bus.id}
              arrival={arrival}
              last={i === arrivals.length - 1}
              onPress={() => onPressRoute(arrival.route, arrival.bus.direction)}
            />
          ))}
        </View>
      )}
    </View>
  );
}

function ArrivalRow({ arrival, last, onPress }: { arrival: Arrival; last: boolean; onPress: () => void }) {
  const { bus, route, headsign, minutes, stale } = arrival;
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.arrival, !last && styles.rowBorder, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel={
        stale
          ? `Koridor ${route.corridor} ke ${headsign}, bus ${bus.code}, data tertunda`
          : `Koridor ${route.corridor} ke ${headsign}, bus ${bus.code}, ${formatEta(minutes)}`
      }>
      <CorridorBadge code={route.corridor} color={route.color} size="large" />
      <View style={styles.arrivalText}>
        <Text style={styles.headsign}>ke {headsign}</Text>
        <Text style={[styles.meta, stale && styles.metaStale]}>
          Bus {bus.code} · {formatUpdated(bus.updatedSecondsAgo)}
        </Text>
      </View>
      {stale ? (
        <View style={[styles.eta, styles.etaStale]}>
          <Text style={styles.etaStaleText}>Tertunda</Text>
        </View>
      ) : (
        <View style={styles.eta}>
          <Text style={styles.etaText}>{formatEta(minutes)}</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  corridors: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    paddingHorizontal: Gutter,
  },
  corridorChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingVertical: Spacing.one + 2,
    paddingLeft: Spacing.one + 2,
    paddingRight: Spacing.three - 4,
    borderRadius: Radius.medium,
    backgroundColor: Brand.surface,
  },
  corridorText: {
    fontSize: 13,
    fontWeight: '600',
    color: Brand.text,
  },
  pressed: {
    opacity: 0.6,
  },
  card: {
    marginHorizontal: Gutter,
    paddingHorizontal: Spacing.three,
    ...Card,
  },
  rowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Brand.border,
  },
  arrival: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three - 4,
    paddingVertical: Spacing.three - 4,
  },
  arrivalText: {
    flex: 1,
    gap: 2,
  },
  headsign: {
    fontSize: 16,
    fontWeight: '700',
    color: Brand.text,
  },
  meta: {
    fontSize: 12,
    fontWeight: '500',
    color: Brand.textSecondary,
  },
  metaStale: {
    color: '#A16207',
  },
  eta: {
    paddingHorizontal: Spacing.two + 2,
    paddingVertical: Spacing.one + 2,
    borderRadius: Radius.small,
    backgroundColor: Brand.primarySoft,
  },
  etaText: {
    fontSize: 15,
    fontWeight: '700',
    color: Brand.primary,
    fontVariant: ['tabular-nums'],
  },
  etaStale: {
    backgroundColor: Brand.accentSoft,
  },
  etaStaleText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#A16207',
  },
});
