import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { CorridorBadge } from '@/components/corridor-badge';
import { EmptyNote, ListCard, ListRow, SectionTitle } from '@/components/list';
import { Brand, Radius, Spacing } from '@/constants/theme';
import { useSavedVehicles } from '@/data/account';
import { getRoute, type Route, savedRouteIds } from '@/data/transit';

export default function SavedScreen() {
  const savedVehicles = useSavedVehicles();
  const routes = savedRouteIds.map(getRoute).filter((route): route is Route => route !== undefined);

  return (
    <ScrollView
      style={styles.screen}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.content}>
      <SectionTitle>Rute</SectionTitle>
      {routes.length === 0 ? (
        <EmptyNote title="Belum ada rute tersimpan" body="Ketuk ikon simpan di detail rute pada tab Lacak." />
      ) : (
        <ListCard>
          {routes.map((route) => (
            <ListRow
              key={route.id}
              leading={<CorridorBadge code={route.corridor} color={route.color} />}
              title={`${route.from} – ${route.to}`}
              subtitle={`${route.operator} · ${route.city}`}
              onPress={() =>
                router.navigate({ pathname: '/lacak', params: { rute: route.id, t: String(Date.now()) } })
              }
            />
          ))}
        </ListCard>
      )}

      <SectionTitle>Halte</SectionTitle>
      <EmptyNote title="Belum ada halte tersimpan" body="Ketuk ikon simpan di detail halte pada tab Lacak." />

      <SectionTitle>Kendaraan</SectionTitle>
      {savedVehicles.length === 0 ? (
        <EmptyNote title="Belum ada kendaraan tersimpan" body="Simpan kendaraan dari halaman hasil Cek Laik." />
      ) : (
        <ListCard>
          {savedVehicles.map((vehicle) => (
            <ListRow
              key={vehicle.plate}
              leading={
                <View style={styles.plate}>
                  <Text style={styles.plateText}>{vehicle.plate}</Text>
                </View>
              }
              title={vehicle.label}
              subtitle={`${vehicle.result} · dicek ${vehicle.checkedAt}`}
              onPress={() =>
                router.navigate({ pathname: '/layanan/cek-laik-hasil', params: { plat: vehicle.plate } })
              }
            />
          ))}
        </ListCard>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Brand.background,
  },
  content: {
    paddingBottom: Spacing.six + Spacing.five,
  },
  plate: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one + 2,
    borderRadius: Radius.small,
    backgroundColor: Brand.text,
  },
  plateText: {
    fontSize: 13,
    fontWeight: '700',
    color: Brand.textOnPrimary,
    fontVariant: ['tabular-nums'],
  },
});
