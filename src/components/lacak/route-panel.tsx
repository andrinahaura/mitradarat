import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Brand, Gutter, Radius, SecondaryButton, Spacing, Type } from '@/constants/theme';
import {
  busesOnRoute,
  type Direction,
  distanceMeters,
  headsign,
  MINUTES_PER_STOP,
  type Route,
  type Stop,
  stopsOnRoute,
  userLocation,
} from '@/data/transit';
import { formatUpdated, isStale } from '@/utils/freshness';

type RoutePanelProps = {
  route: Route;
  direction: Direction;
  saved: boolean;
  onBack: () => void;
  onToggleSave: () => void;
  onToggleDirection: () => void;
  onPressStop: (stop: Stop) => void;
};

/**
 * One route (reference "Fleet to Riverside"): a colored title strip with close,
 * the bus card tucked under it, then the stops as a dashed timeline with the
 * stop each bus is heading to and minutes per stop.
 */
export function RoutePanel({
  route,
  direction,
  saved,
  onBack,
  onToggleSave,
  onToggleDirection,
  onPressStop,
}: RoutePanelProps) {
  const [alertOn, setAlertOn] = useState(false);
  const path = stopsOnRoute(route, direction);
  const buses = busesOnRoute(route.id)
    .filter((bus) => bus.direction === direction)
    .sort((a, b) => a.progress - b.progress);
  const origin = direction === 'forward' ? route.from : route.to;

  // The person's stop: the stop on this route closest to them.
  const myIndex = path.reduce(
    (best, stop, i) =>
      distanceMeters(userLocation, stop.coordinate) <
      distanceMeters(userLocation, path[best].coordinate)
        ? i
        : best,
    0,
  );
  // The bus that reaches the person's stop first: the last bus still before it.
  const nextBus = [...buses].reverse().find((bus) => bus.progress < myIndex) ?? buses[0];
  const nextBusStale = nextBus ? isStale(nextBus.updatedSecondsAgo) : false;
  const minutesTo = (index: number) =>
    nextBus && !nextBusStale && index > nextBus.progress
      ? Math.round((index - nextBus.progress) * MINUTES_PER_STOP)
      : undefined;
  /** Stop index each bus is heading to. */
  const headingTo = (index: number) => buses.filter((bus) => Math.floor(bus.progress) + 1 === index);
  const passed = (index: number) => (nextBus ? index <= nextBus.progress : false);

  return (
    <View style={styles.wrap}>
      <View style={styles.strip}>
        <View style={styles.stripText}>
          <Text style={styles.stripTitle} numberOfLines={1} accessibilityRole="header">
            {origin} → {headsign(route, direction)}
          </Text>
          <Text style={styles.stripSubtitle}>
            {route.operator} · Koridor {route.corridor}
          </Text>
        </View>
        <Pressable
          onPress={onToggleSave}
          hitSlop={8}
          style={({ pressed }) => [styles.stripButton, pressed && styles.pressed]}
          accessibilityRole="button"
          accessibilityState={{ selected: saved }}
          accessibilityLabel={saved ? 'Hapus dari tersimpan' : 'Simpan rute'}>
          <SymbolView
            name={
              saved
                ? { ios: 'bookmark.fill', android: 'bookmark', web: 'bookmark' }
                : { ios: 'bookmark', android: 'bookmark_border', web: 'bookmark_border' }
            }
            size={14}
            tintColor={Brand.textOnPrimary}
          />
        </Pressable>
        <Pressable
          onPress={onBack}
          hitSlop={8}
          style={({ pressed }) => [styles.stripButton, pressed && styles.pressed]}
          accessibilityRole="button"
          accessibilityLabel="Tutup">
          <SymbolView
            name={{ ios: 'xmark', android: 'close', web: 'close' }}
            size={12}
            weight="bold"
            tintColor={Brand.textOnPrimary}
          />
        </Pressable>
      </View>

      <View style={styles.busCard}>
        <View style={styles.busIcon}>
          <SymbolView
            name={{ ios: 'bus', android: 'directions_bus', web: 'directions_bus' }}
            size={22}
            tintColor={route.color}
          />
        </View>
        <View style={styles.busText}>
          <Text style={styles.busTitle}>{nextBus ? `Bus ${nextBus.code}` : 'Belum ada bus aktif'}</Text>
          <Text style={styles.busMeta}>
            Beroperasi: <Text style={styles.busMetaStrong}>{route.hours}</Text>
          </Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Koridor {route.corridor}</Text>
        </View>
      </View>

      <View style={styles.detailsHeader}>
        <Text style={styles.detailsTitle} accessibilityRole="header">
          Detail rute
        </Text>
        <Pressable
          onPress={onToggleDirection}
          hitSlop={8}
          style={({ pressed }) => [styles.swap, pressed && styles.pressed]}
          accessibilityRole="button"
          accessibilityLabel="Tukar arah">
          <SymbolView
            name={{ ios: 'arrow.up.arrow.down', android: 'swap_vert', web: 'swap_vert' }}
            size={13}
            weight="semibold"
            tintColor={Brand.primary}
          />
          <Text style={styles.swapText}>Tukar arah</Text>
        </Pressable>
      </View>

      {nextBus && (
        <Text style={[styles.freshness, nextBusStale && styles.warn]}>
          {nextBusStale ? 'Data bus tertunda. Perkiraan menit disembunyikan.' : formatUpdated(nextBus.updatedSecondsAgo)}
        </Text>
      )}

      <View>
        {path.map((stop, i) => {
          const first = i === 0;
          const last = i === path.length - 1;
          const coming = headingTo(i);
          const minutes = minutesTo(i);
          const mine = i === myIndex;
          const isPassed = passed(i) && !first;
          const label = first ? 'Halte awal' : last ? 'Halte akhir' : mine ? 'Halte kamu' : 'Halte';
          return (
            <Pressable
              key={stop.id}
              onPress={() => onPressStop(stop)}
              style={({ pressed }) => [styles.stopRow, pressed && styles.pressed]}
              accessibilityRole="button"
              accessibilityLabel={`${label} ${stop.name}${
                coming.length ? `, bus ${coming.map((b) => b.code).join(' dan ')} sedang menuju` : ''
              }${minutes !== undefined ? `, ${minutes} menit` : ''}`}>
              <View style={styles.rail}>
                <View style={[styles.dash, first && styles.hidden]} />
                {first ? (
                  <View style={[styles.ring, { borderColor: route.color }]}>
                    <View style={[styles.ringCore, { backgroundColor: route.color }]} />
                  </View>
                ) : (
                  <View
                    style={[
                      styles.dot,
                      (coming.length > 0 || mine) && styles.dotStrong,
                      isPassed && styles.dotPassed,
                    ]}
                  />
                )}
                <View style={[styles.dash, last && styles.hidden]} />
              </View>

              <View style={styles.stopText}>
                <View style={styles.labelRow}>
                  {coming.length > 0 && (
                    <View style={styles.onTheWay}>
                      <Text style={styles.onTheWayText}>Sedang menuju</Text>
                    </View>
                  )}
                  {coming.length > 0 && <Text style={styles.label}>·</Text>}
                  <Text style={[styles.label, mine && styles.labelMine]}>{label}</Text>
                </View>
                <Text
                  style={[
                    styles.stopName,
                    (first || mine || coming.length > 0) && styles.stopNameStrong,
                    isPassed && styles.stopNamePassed,
                  ]}>
                  {stop.name}
                </Text>
              </View>

              {minutes !== undefined && (
                <View style={styles.minutes}>
                  <SymbolView
                    name={{ ios: 'clock', android: 'schedule', web: 'schedule' }}
                    size={11}
                    tintColor={Brand.text}
                  />
                  <Text style={styles.minutesText}>{minutes} mnt</Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </View>

      {nextBus && (
        <Pressable
          onPress={() => setAlertOn((on) => !on)}
          style={({ pressed }) => [styles.alert, alertOn && styles.alertOn, pressed && styles.pressed]}
          accessibilityRole="switch"
          accessibilityState={{ checked: alertOn }}>
          <SymbolView
            name={
              alertOn
                ? { ios: 'bell.fill', android: 'notifications_active', web: 'notifications_active' }
                : { ios: 'bell', android: 'notifications', web: 'notifications' }
            }
            size={16}
            tintColor={alertOn ? Brand.textOnPrimary : Brand.primary}
          />
          <Text style={[styles.alertText, alertOn && styles.alertTextOn]}>
            {alertOn ? `Pengingat aktif untuk ${path[myIndex].name}` : 'Ingatkan saat bus mendekat'}
          </Text>
        </Pressable>
      )}
    </View>
  );
}

const RAIL_WIDTH = 20;

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: Gutter,
  },
  pressed: {
    opacity: 0.6,
  },
  strip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    minHeight: 64,
    paddingHorizontal: Spacing.three + 2,
    paddingVertical: Spacing.three - 4,
    borderRadius: Radius.panel,
    backgroundColor: Brand.primary,
    boxShadow: '0 8px 20px -8px rgba(16, 24, 40, 0.35)',
    zIndex: 1,
  },
  stripText: {
    flex: 1,
    gap: 2,
  },
  stripTitle: {
    ...Type.headline,
    color: Brand.textOnPrimary,
  },
  stripSubtitle: {
    ...Type.caption,
    color: 'rgba(255, 255, 255, 0.75)',
  },
  stripButton: {
    width: 28,
    height: 28,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  busCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three - 4,
    marginHorizontal: Spacing.two,
    marginTop: -Spacing.three,
    paddingTop: Spacing.three + Spacing.three - 4,
    paddingBottom: Spacing.three - 4,
    paddingHorizontal: Spacing.three - 4,
    borderBottomLeftRadius: Radius.inner,
    borderBottomRightRadius: Radius.inner,
    backgroundColor: Brand.surface,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: Brand.border,
  },
  busIcon: {
    width: 44,
    height: 44,
    borderRadius: Radius.control,
    backgroundColor: Brand.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  busText: {
    flex: 1,
    gap: 2,
  },
  busTitle: {
    ...Type.label,
    color: Brand.text,
  },
  busMeta: {
    ...Type.bodySmall,
    color: Brand.textSecondary,
  },
  busMetaStrong: {
    fontWeight: '600',
    color: Brand.text,
  },
  badge: {
    height: 26,
    paddingHorizontal: Spacing.two,
    borderRadius: Radius.small,
    backgroundColor: Brand.surfaceContrast,
    justifyContent: 'center',
  },
  badgeText: {
    ...Type.labelSmall,
    fontSize: 12,
    color: Brand.textOnPrimary,
  },
  detailsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.four,
  },
  detailsTitle: {
    ...Type.headline,
    color: Brand.text,
  },
  swap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  swapText: {
    ...Type.labelSmall,
    color: Brand.primary,
  },
  freshness: {
    ...Type.caption,
    color: Brand.textSecondary,
    marginTop: 2,
    marginBottom: Spacing.two,
  },
  warn: {
    color: '#A16207',
  },
  stopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three - 4,
    minHeight: 64,
  },
  rail: {
    width: RAIL_WIDTH,
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  dash: {
    flex: 1,
    width: 0,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: Brand.inputBorder,
  },
  hidden: {
    borderColor: 'transparent',
  },
  ring: {
    width: 16,
    height: 16,
    borderRadius: Radius.full,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringCore: {
    width: 6,
    height: 6,
    borderRadius: Radius.full,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: Radius.full,
    backgroundColor: Brand.textMuted,
  },
  dotStrong: {
    width: 10,
    height: 10,
    backgroundColor: Brand.text,
  },
  dotPassed: {
    backgroundColor: Brand.inputBorder,
  },
  stopText: {
    flex: 1,
    gap: 2,
    paddingVertical: Spacing.two,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one + 2,
  },
  label: {
    ...Type.caption,
    color: Brand.textSecondary,
  },
  labelMine: {
    fontWeight: '600',
    color: Brand.primary,
  },
  onTheWay: {
    height: 20,
    paddingHorizontal: Spacing.one + 2,
    borderRadius: Radius.small - 2,
    backgroundColor: Brand.surfaceContrast,
    justifyContent: 'center',
  },
  onTheWayText: {
    fontSize: 11,
    fontWeight: '600',
    color: Brand.textOnPrimary,
  },
  stopName: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '500',
    color: Brand.textSecondary,
  },
  stopNameStrong: {
    fontWeight: '600',
    color: Brand.text,
  },
  stopNamePassed: {
    color: Brand.textMuted,
  },
  minutes: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    height: 26,
    paddingHorizontal: Spacing.two,
    borderRadius: Radius.small,
    backgroundColor: Brand.background,
  },
  minutesText: {
    ...Type.caption,
    fontWeight: '600',
    color: Brand.text,
  },
  alert: {
    ...SecondaryButton,
    flexDirection: 'row',
    gap: Spacing.two,
    height: 48,
    marginTop: Spacing.three,
    borderColor: Brand.primary,
  },
  alertOn: {
    backgroundColor: Brand.primary,
  },
  alertText: {
    ...Type.label,
    color: Brand.primary,
  },
  alertTextOn: {
    color: Brand.textOnPrimary,
  },
});
