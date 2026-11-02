import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { StatusBar } from 'expo-status-bar';
import { useRef, useState } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
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
  PrimaryButton,
  Radius,
  Shadow,
  Spacing,
  Type,
} from '@/constants/theme';
import {
  getMudikPoint,
  type MudikPoint,
  mudikPoints,
  mudikPointsByDistance,
  mudikPointType,
  type MudikPointType,
  mudikPointTypes,
  mudikRoutes,
} from '@/data/mudik';
import { distanceMeters, formatDistance, userLocation } from '@/data/transit';

const TOP_BAR_HEIGHT = 48 + Spacing.two + 34;

type Panel = { kind: 'list' } | { kind: 'routes' } | { kind: 'point'; id: string };

/** Peta Tematik (v1 screenshots 42–48): mudik routes with posts, workshops and ports. */
export default function ThematicMapScreen() {
  const insets = useSafeAreaInsets();
  const { half } = useSheetHeights();
  const map = useRef<ClusterMapHandle>(null);

  const [routeId, setRouteId] = useState<string>();
  const [type, setType] = useState<MudikPointType>('posko');
  const [panel, setPanel] = useState<Panel>({ kind: 'list' });
  const [snap, setSnap] = useState<SheetSnap>('half');

  const route = mudikRoutes.find((r) => r.id === routeId);
  const meta = mudikPointType(type);
  const visible = mudikPoints.filter(
    (point) => point.type === type && (!routeId || point.routeIds.includes(routeId)),
  );
  const nearby = mudikPointsByDistance(type, routeId, userLocation);
  const selected = panel.kind === 'point' ? getMudikPoint(panel.id) : undefined;

  const chooseRoute = (id: string | undefined) => {
    setRouteId(id);
    setPanel({ kind: 'list' });
    setSnap('half');
    const next = mudikRoutes.find((r) => r.id === id);
    if (next) map.current?.fit(next.line);
  };

  const openPoint = (point: MudikPoint) => {
    setPanel({ kind: 'point', id: point.id });
    setSnap('half');
    map.current?.focus(point.coordinate);
  };

  const openDirections = (point: MudikPoint) => {
    const { latitude, longitude } = point.coordinate;
    Linking.openURL(
      `http://maps.apple.com/?daddr=${latitude},${longitude}&q=${encodeURIComponent(point.name)}`,
    );
  };

  const top = insets.top + Spacing.two;

  let content;
  if (panel.kind === 'routes') {
    content = (
      <View>
        <PanelHeader title="Pilih rute mudik" onBack={() => setPanel({ kind: 'list' })} />
        <ListCard>
          <ListRow
            leading={<IconTile icon={{ ios: 'map', android: 'map', web: 'map' }} tone="neutral" />}
            title="Semua rute"
            subtitle="Tampilkan semua titik"
            onPress={() => chooseRoute(undefined)}
          />
          {mudikRoutes.map((r) => (
            <ListRow
              key={r.id}
              leading={<View style={[styles.routeSwatch, { backgroundColor: r.color }]} />}
              title={r.name}
              subtitle={`${r.from} – ${r.to}`}
              onPress={() => chooseRoute(r.id)}
            />
          ))}
        </ListCard>
      </View>
    );
  } else if (selected) {
    const selectedMeta = mudikPointType(selected.type);
    content = (
      <View>
        <PanelHeader
          title={selected.name}
          subtitle={selectedMeta.label}
          onBack={() => setPanel({ kind: 'list' })}
        />
        <View style={styles.detailCard}>
          <Fact label="Wilayah" value={selected.area} />
          <Fact label="Jam layanan" value={selected.hours} />
          <Fact
            label="Jarak dari lokasimu"
            value={formatDistance(distanceMeters(userLocation, selected.coordinate))}
          />
          <Fact
            label="Rute"
            value={selected.routeIds
              .map((id) => mudikRoutes.find((r) => r.id === id)?.name)
              .filter(Boolean)
              .join(', ')}
            last
          />
        </View>
        <SectionTitle>Layanan</SectionTitle>
        <View style={styles.services}>
          {selected.services.map((service) => (
            <View key={service} style={styles.service}>
              <Text style={styles.serviceText}>{service}</Text>
            </View>
          ))}
        </View>
        <Pressable
          onPress={() => openDirections(selected)}
          style={({ pressed }) => [styles.directions, pressed && styles.pressed]}
          accessibilityRole="button"
          accessibilityHint="Membuka aplikasi peta">
          <SymbolView
            name={{ ios: 'arrow.triangle.turn.up.right.diamond', android: 'directions', web: 'directions' }}
            size={18}
            tintColor={Brand.textOnPrimary}
          />
          <Text style={styles.directionsText}>Arahkan</Text>
        </Pressable>
      </View>
    );
  } else {
    content = (
      <View>
        <SectionTitle>
          {route ? `${meta.label} di ${route.name}` : `${meta.label} terdekat`}
        </SectionTitle>
        {nearby.length === 0 ? (
          <EmptyNote
            title={`Tidak ada ${meta.label.toLowerCase()} di rute ini`}
            body="Pilih kategori lain, atau tampilkan semua rute."
          />
        ) : (
          <ListCard>
            {nearby.map(({ point, meters }) => (
              <ListRow
                key={point.id}
                leading={<IconTile icon={meta.icon} />}
                title={point.name}
                subtitle={`${point.area} · ${formatDistance(meters)}`}
                onPress={() => openPoint(point)}
              />
            ))}
          </ListCard>
        )}
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <ClusterMap
        ref={map}
        points={visible}
        color={meta.color}
        icon={meta.icon}
        selectedId={selected?.id}
        line={route ? { coordinates: route.line, color: route.color } : undefined}
        padding={{ top: top + TOP_BAR_HEIGHT, bottom: half }}
        onPressPoint={(id) => {
          const point = getMudikPoint(id);
          if (point) openPoint(point);
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
          <Pressable
            onPress={() => {
              setPanel({ kind: 'routes' });
              setSnap('half');
            }}
            style={({ pressed }) => [styles.routePicker, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel={`Rute: ${route?.name ?? 'Semua rute'}. Ketuk untuk mengganti`}>
            {route && <View style={[styles.routeDot, { backgroundColor: route.color }]} />}
            <Text style={styles.routeText} numberOfLines={1}>
              {route?.name ?? 'Semua rute mudik'}
            </Text>
            <SymbolView
              name={{ ios: 'chevron.down', android: 'expand_more', web: 'expand_more' }}
              size={12}
              weight="semibold"
              tintColor={Brand.textSecondary}
            />
          </Pressable>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          {mudikPointTypes.map((item) => {
            const active = item.id === type;
            const count = mudikPoints.filter(
              (point) => point.type === item.id && (!routeId || point.routeIds.includes(routeId)),
            ).length;
            return (
              <Pressable
                key={item.id}
                onPress={() => {
                  setType(item.id);
                  setPanel({ kind: 'list' });
                }}
                style={[styles.chip, active && { backgroundColor: item.color, borderColor: item.color }]}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                accessibilityLabel={`${item.label}, ${count} lokasi`}>
                <SymbolView name={item.icon} size={14} tintColor={active ? '#FFFFFF' : item.color} />
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{item.label}</Text>
                <Text style={[styles.chipCount, active && styles.chipTextActive]}>{count}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <BottomSheet
        snap={snap}
        onSnapChange={setSnap}
        contentKey={`${panel.kind}:${panel.kind === 'point' ? panel.id : ''}:${type}:${routeId ?? ''}`}>
        {content}
      </BottomSheet>
    </View>
  );
}

function Fact({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <View style={[styles.fact, !last && styles.factBorder]}>
      <Text style={styles.factLabel}>{label}</Text>
      <Text style={styles.factValue}>{value}</Text>
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
  routePicker: {
    ...PillInput,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    height: 48,
    minHeight: 48,
    boxShadow: Shadow.softCard,
  },
  routeDot: {
    width: 10,
    height: 10,
    borderRadius: Radius.full,
  },
  routeText: {
    ...Type.label,
    flex: 1,
    fontSize: 15,
    color: Brand.text,
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
  pressed: {
    opacity: 0.7,
  },
  routeSwatch: {
    width: 40,
    height: 6,
    borderRadius: Radius.full,
  },
  detailCard: {
    ...Card,
    marginHorizontal: Gutter,
    paddingHorizontal: Spacing.three,
  },
  fact: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.three,
    paddingVertical: Spacing.three - 4,
  },
  factBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Brand.border,
  },
  factLabel: {
    ...Type.bodySmall,
    color: Brand.textSecondary,
  },
  factValue: {
    ...Type.label,
    flexShrink: 1,
    color: Brand.text,
    textAlign: 'right',
  },
  services: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    marginHorizontal: Gutter,
  },
  service: {
    paddingHorizontal: Spacing.three - 4,
    paddingVertical: Spacing.two,
    borderRadius: Radius.medium,
    backgroundColor: Brand.surface,
    borderWidth: 1,
    borderColor: Brand.border,
  },
  serviceText: {
    ...Type.bodySmall,
    color: Brand.text,
  },
  directions: {
    ...PrimaryButton,
    flexDirection: 'row',
    gap: Spacing.two,
    marginHorizontal: Gutter,
    marginTop: Spacing.three,
  },
  directionsText: {
    ...Type.label,
    fontSize: 16,
    color: Brand.textOnPrimary,
  },
});
