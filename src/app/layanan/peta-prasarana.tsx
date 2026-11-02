import { router, useLocalSearchParams } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { StatusBar } from 'expo-status-bar';
import { useRef, useState } from 'react';
import {
  Keyboard,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { IconTile } from '@/components/icon-tile';
import { BottomSheet, type SheetSnap, useSheetHeights } from '@/components/lacak/bottom-sheet';
import { PanelHeader } from '@/components/lacak/panel-header';
import { ClusterMap, type ClusterMapHandle } from '@/components/map/cluster-map';
import { EmptyNote, ListCard, ListRow, SectionTitle } from '@/components/list';
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
  type Facility,
  facilities,
  facilitiesByDistance,
  facilityType,
  type FacilityType,
  facilityTypes,
} from '@/data/facilities';
import { distanceMeters, formatDistance, userLocation } from '@/data/transit';

const TOP_BAR_HEIGHT = 48 + Spacing.two + 34;

/** Peta Prasarana (v1 screenshots 38–41): terminals, ports and weigh stations. */
export default function FacilityMapScreen() {
  const insets = useSafeAreaInsets();
  const { half } = useSheetHeights();
  const map = useRef<ClusterMapHandle>(null);

  // `?jenis=` opens a filter directly, e.g. from the ODOL announcement.
  const { jenis } = useLocalSearchParams<{ jenis?: string }>();
  const [type, setType] = useState<FacilityType>(
    () => facilityTypes.find((item) => item.id === jenis)?.id ?? 'terminal',
  );
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Facility>();
  const [snap, setSnap] = useState<SheetSnap>('half');

  const meta = facilityType(type);
  const q = query.trim().toLowerCase();
  const nearby = facilitiesByDistance(type, userLocation).filter(
    ({ facility }) => !q || `${facility.name} ${facility.area}`.toLowerCase().includes(q),
  );

  const select = (facility: Facility) => {
    Keyboard.dismiss();
    setSelected(facility);
    setSnap('half');
    map.current?.focus(facility.coordinate);
  };

  const changeType = (next: FacilityType) => {
    setType(next);
    setSelected(undefined);
  };

  const openDirections = (facility: Facility) => {
    const { latitude, longitude } = facility.coordinate;
    Linking.openURL(
      `http://maps.apple.com/?daddr=${latitude},${longitude}&q=${encodeURIComponent(facility.name)}`,
    );
  };

  const top = insets.top + Spacing.two;

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <ClusterMap
        ref={map}
        points={facilities.filter((facility) => facility.type === type)}
        color={meta.color}
        icon={meta.icon}
        selectedId={selected?.id}
        padding={{ top: top + TOP_BAR_HEIGHT, bottom: half }}
        onPressPoint={(id) => {
          const facility = facilities.find((f) => f.id === id);
          if (facility) select(facility);
        }}
      />

      <View style={[styles.topBar, { top }]}>
        <View style={styles.searchRow}>
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
          <View style={styles.search}>
            <SymbolView
              name={{ ios: 'magnifyingglass', android: 'search', web: 'search' }}
              size={18}
              tintColor={Brand.textSecondary}
            />
            <TextInput
              value={query}
              onChangeText={(text) => {
                setQuery(text);
                setSelected(undefined);
              }}
              onFocus={() => setSnap('full')}
              placeholder={`Cari ${meta.label.toLowerCase()}`}
              placeholderTextColor={Brand.textSecondary}
              style={styles.searchInput}
              autoCorrect={false}
              accessibilityLabel={`Cari ${meta.label}`}
            />
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          {facilityTypes.map((item) => {
            const active = item.id === type;
            const count = facilities.filter((f) => f.type === item.id).length;
            return (
              <Pressable
                key={item.id}
                onPress={() => changeType(item.id)}
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
        contentKey={selected ? selected.id : `${type}:${q}`}>
        {selected ? (
          <View>
            <PanelHeader
              title={selected.name}
              subtitle={facilityType(selected.type).label}
              onBack={() => setSelected(undefined)}
            />
            <View style={styles.detailCard}>
              <Fact label="Wilayah" value={selected.area} />
              <Fact
                label="Jarak dari lokasimu"
                value={formatDistance(distanceMeters(userLocation, selected.coordinate))}
                last
              />
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
        ) : (
          <View>
            <SectionTitle>{q ? `Hasil untuk “${query.trim()}”` : `${meta.label} terdekat`}</SectionTitle>
            {nearby.length === 0 ? (
              <EmptyNote
                title={`Tidak ada ${meta.label.toLowerCase()} yang cocok`}
                body="Coba nama kota atau provinsi, atau pilih kategori lain."
              />
            ) : (
              <ListCard>
                {nearby.map(({ facility, meters }) => (
                  <ListRow
                    key={facility.id}
                    leading={<IconTile icon={meta.icon} />}
                    title={facility.name}
                    subtitle={`${facility.area} · ${formatDistance(meters)}`}
                    onPress={() => select(facility)}
                  />
                ))}
              </ListCard>
            )}
          </View>
        )}
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
  searchRow: {
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
  search: {
    ...PillInput,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two + 2,
    height: 48,
    minHeight: 48,
    boxShadow: Shadow.softCard,
  },
  searchInput: {
    ...Type.body,
    flex: 1,
    height: '100%',
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
