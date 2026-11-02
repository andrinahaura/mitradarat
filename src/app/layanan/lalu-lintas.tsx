import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { StatusBar } from 'expo-status-bar';
import { useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { IconTile } from '@/components/icon-tile';
import { BottomSheet, type SheetSnap, useSheetHeights } from '@/components/lacak/bottom-sheet';
import { PanelHeader } from '@/components/lacak/panel-header';
import { EmptyNote, ListCard, ListRow, SectionTitle } from '@/components/list';
import { ClusterMap, type ClusterMapHandle } from '@/components/map/cluster-map';
import {
  Brand,
  Card,
  Gutter,
  IconButton,
  PillInput,
  Radius,
  Shadow,
  Spacing,
  Type,
} from '@/constants/theme';
import {
  formatTrafficUpdated,
  getTrafficPoint,
  TRAFFIC_STALE_AFTER_MINUTES,
  trafficByDistance,
  type TrafficLayer,
  trafficLayers,
  trafficPoints,
  type TrafficPoint,
  trafficStatuses,
} from '@/data/traffic';
import { formatDistance, userLocation } from '@/data/transit';

const TOP_BAR_HEIGHT = 48 + Spacing.two + 34 + Spacing.two + 18;

const vehicleClasses = [
  { key: 'motor', label: 'Motor' },
  { key: 'mobil', label: 'Mobil' },
  { key: 'bus', label: 'Bus' },
  { key: 'truk', label: 'Truk' },
] as const;

const layerIcon = (layer: TrafficLayer) =>
  trafficLayers.find((l) => l.id === layer)?.icon ?? trafficLayers[0].icon;

/** Lalu Lintas, the ATMS map of v1 (screenshots 49–51), colored by traffic condition. */
export default function TrafficScreen() {
  const insets = useSafeAreaInsets();
  const { half } = useSheetHeights();
  const map = useRef<ClusterMapHandle>(null);

  // v1 let people toggle all three layers at once (screenshot 50); kept as toggles.
  const [layers, setLayers] = useState<TrafficLayer[]>(['ruas', 'simpang', 'lainnya']);
  const [selectedId, setSelectedId] = useState<string>();
  const [snap, setSnap] = useState<SheetSnap>('half');

  const selected = selectedId ? getTrafficPoint(selectedId) : undefined;
  const visible = trafficPoints.filter((point) => layers.includes(point.layer));
  const nearby = trafficByDistance(layers, userLocation);

  const toggleLayer = (layer: TrafficLayer) =>
    setLayers((current) =>
      current.includes(layer) ? current.filter((l) => l !== layer) : [...current, layer],
    );

  const open = (point: TrafficPoint) => {
    setSelectedId(point.id);
    setSnap('half');
    map.current?.focus(point.coordinate);
  };

  const top = insets.top + Spacing.two;

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <ClusterMap
        ref={map}
        points={visible.map((point) => ({
          ...point,
          color: trafficStatuses[point.status].color,
          icon: layerIcon(point.layer),
        }))}
        color={Brand.text}
        icon={trafficLayers[0].icon}
        selectedId={selectedId}
        padding={{ top: top + TOP_BAR_HEIGHT, bottom: half }}
        onPressPoint={(id) => {
          const point = getTrafficPoint(id);
          if (point) open(point);
        }}
      />

      <View style={[styles.topBar, { top }]}>
        <View style={styles.row}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [styles.back, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel="Kembali">
            <SymbolView
              name={{ ios: 'chevron.left', android: 'arrow_back', web: 'arrow_back' }}
              size={16}
              weight="semibold"
              tintColor={Brand.text}
            />
          </Pressable>
          <View style={styles.title}>
            <Text style={styles.titleText}>Lalu Lintas</Text>
            <Text style={styles.titleSub}>Pemantauan ATMS</Text>
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          {trafficLayers.map((layer) => {
            const active = layers.includes(layer.id);
            const count = trafficPoints.filter((p) => p.layer === layer.id).length;
            return (
              <Pressable
                key={layer.id}
                onPress={() => toggleLayer(layer.id)}
                style={[styles.chip, active && styles.chipActive]}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: active }}
                accessibilityLabel={`${layer.label}, ${count} titik`}>
                <SymbolView name={layer.icon} size={14} tintColor={active ? '#FFFFFF' : Brand.text} />
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{layer.label}</Text>
                <Text style={[styles.chipCount, active && styles.chipTextActive]}>{count}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={styles.legend} accessibilityLabel="Keterangan warna">
          {Object.entries(trafficStatuses).map(([key, status]) => (
            <View key={key} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: status.color }]} />
              <Text style={styles.legendText}>{key === 'tanpa-data' ? 'Tanpa data' : status.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <BottomSheet snap={snap} onSnapChange={setSnap} contentKey={selectedId ?? layers.join(',')}>
        {selected ? (
          <TrafficDetail point={selected} onBack={() => setSelectedId(undefined)} />
        ) : (
          <View>
            <SectionTitle>Titik pantau terdekat</SectionTitle>
            {nearby.length === 0 ? (
              <EmptyNote title="Semua layer disembunyikan" body="Nyalakan Ruas, Simpang, atau Lainnya di atas peta." />
            ) : (
              <ListCard>
                {nearby.map(({ point, meters }) => {
                  const status = trafficStatuses[point.status];
                  return (
                    <ListRow
                      key={point.id}
                      leading={<IconTile icon={layerIcon(point.layer)} tone="neutral" />}
                      title={point.name}
                      subtitle={`${status.label} · ${formatDistance(meters)}`}
                      onPress={() => open(point)}
                      trailing={<View style={[styles.statusDot, { backgroundColor: status.color }]} />}
                    />
                  );
                })}
              </ListCard>
            )}
          </View>
        )}
      </BottomSheet>
    </View>
  );
}

function TrafficDetail({ point, onBack }: { point: TrafficPoint; onBack: () => void }) {
  const status = trafficStatuses[point.status];
  const layer = trafficLayers.find((l) => l.id === point.layer);
  const stale = (point.updatedMinutesAgo ?? 0) > TRAFFIC_STALE_AFTER_MINUTES;

  return (
    <View>
      <PanelHeader title={point.name} subtitle={`${layer?.label ?? ''} · ${point.area}`} onBack={onBack} />

      <View style={styles.statusCard}>
        <View style={[styles.statusBadge, { backgroundColor: status.color }]}>
          <Text style={styles.statusBadgeText}>{status.label}</Text>
        </View>
        {point.speed !== undefined && (
          <Text style={styles.speed}>
            {point.speed}
            <Text style={styles.speedUnit}> km/jam rata-rata</Text>
          </Text>
        )}
        {point.updatedMinutesAgo !== undefined && (
          <Text style={[styles.updated, stale && styles.updatedStale]}>
            {formatTrafficUpdated(point.updatedMinutesAgo)}
            {stale ? ' · data mungkin sudah berubah' : ''}
          </Text>
        )}
      </View>

      {point.volume ? (
        <>
          <SectionTitle>Volume kendaraan per jam</SectionTitle>
          <View style={styles.volumeCard}>
            {vehicleClasses.map((vehicle) => (
              <View key={vehicle.key} style={styles.volumeItem}>
                <Text style={styles.volumeValue}>
                  {point.volume![vehicle.key].toLocaleString('id-ID')}
                </Text>
                <Text style={styles.volumeLabel}>{vehicle.label}</Text>
              </View>
            ))}
          </View>
        </>
      ) : (
        <View style={styles.noData}>
          <EmptyNote
            title="Data belum tersedia"
            body="Titik pantau ini belum mengirim data. Kondisi lalu lintas akan tampil setelah data masuk."
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Brand.background,
  },
  topBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    gap: Spacing.two,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.two,
    paddingHorizontal: Gutter,
  },
  back: {
    ...IconButton,
    width: 48,
    height: 48,
    boxShadow: Shadow.softCard,
  },
  title: {
    ...PillInput,
    flex: 1,
    height: 48,
    minHeight: 48,
    justifyContent: 'center',
    boxShadow: Shadow.softCard,
  },
  titleText: {
    ...Type.label,
    fontSize: 15,
    color: Brand.text,
  },
  titleSub: {
    ...Type.caption,
    color: Brand.textSecondary,
  },
  chips: {
    gap: Spacing.two,
    paddingHorizontal: Gutter,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one + 2,
    height: 36,
    paddingHorizontal: Spacing.three - 4,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Brand.border,
    backgroundColor: Brand.surface,
    boxShadow: Shadow.softCard,
  },
  chipActive: {
    backgroundColor: Brand.text,
    borderColor: Brand.text,
  },
  chipText: {
    ...Type.label,
    color: Brand.text,
  },
  chipCount: {
    ...Type.caption,
    color: Brand.textSecondary,
  },
  chipTextActive: {
    color: Brand.textOnPrimary,
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.three - 4,
    alignSelf: 'flex-start',
    marginHorizontal: Gutter,
    paddingHorizontal: Spacing.two + 2,
    paddingVertical: Spacing.one,
    borderRadius: Radius.small,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: Radius.full,
  },
  legendText: {
    ...Type.caption,
    fontSize: 11,
    color: Brand.text,
  },
  pressed: {
    opacity: 0.7,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: Radius.full,
  },
  statusCard: {
    ...Card,
    marginHorizontal: Gutter,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.two + 2,
    paddingVertical: Spacing.one,
    borderRadius: Radius.small,
  },
  statusBadgeText: {
    ...Type.labelSmall,
    color: '#FFFFFF',
  },
  speed: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700',
    letterSpacing: -0.5,
    color: Brand.text,
    fontVariant: ['tabular-nums'],
  },
  speedUnit: {
    ...Type.body,
    color: Brand.textSecondary,
  },
  updated: {
    ...Type.caption,
    color: Brand.textSecondary,
  },
  updatedStale: {
    color: '#A16207',
    fontWeight: '700',
  },
  volumeCard: {
    ...Card,
    flexDirection: 'row',
    marginHorizontal: Gutter,
    paddingVertical: Spacing.three,
  },
  volumeItem: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  volumeValue: {
    ...Type.headlineSmall,
    color: Brand.text,
    fontVariant: ['tabular-nums'],
  },
  volumeLabel: {
    ...Type.caption,
    color: Brand.textSecondary,
  },
  noData: {
    marginTop: Spacing.three,
  },
});
