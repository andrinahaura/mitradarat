import { router, Stack } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { IconTile } from '@/components/icon-tile';
import { EmptyNote, ListCard, ListRow, SectionTitle } from '@/components/list';
import { Brand, Gutter, PillInput, Spacing } from '@/constants/theme';
import {
  cities,
  type City,
  cityOperators,
  CURRENT_CITY_ID,
  getCity,
  selectCity,
  useSelectedCity,
} from '@/data/cities';

/**
 * City picker for Beranda. v1 had no way to change city: the header city did nothing.
 * The list holds every city with a city bus operator in MitraDarat.
 */
export default function CityPickerScreen() {
  const selected = useSelectedCity();
  const [query, setQuery] = useState('');
  const current = getCity(CURRENT_CITY_ID);

  const q = query.trim().toLowerCase();
  const matches = cities.filter((city) => {
    if (!q) return true;
    const operators = cityOperators(city).map((operator) => operator.name);
    return [city.name, city.province, ...operators].join(' ').toLowerCase().includes(q);
  });

  const choose = (city: City) => {
    selectCity(city.id);
    router.back();
  };

  const check = (city: City) =>
    city.id === selected.id ? (
      <SymbolView
        name={{ ios: 'checkmark', android: 'check', web: 'check' }}
        size={16}
        weight="semibold"
        tintColor={Brand.primary}
      />
    ) : (
      <View />
    );

  return (
    <ScrollView
      style={styles.screen}
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
      automaticallyAdjustKeyboardInsets
      contentContainerStyle={styles.content}>
      <Stack.Screen
        options={{
          headerRight: () => (
            <Pressable onPress={() => router.back()} hitSlop={8} accessibilityRole="button">
              <Text style={styles.close}>Tutup</Text>
            </Pressable>
          ),
        }}
      />

      <View style={styles.searchWrap}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Cari kota, provinsi, atau operator"
          placeholderTextColor={Brand.textSecondary}
          autoCorrect={false}
          clearButtonMode="while-editing"
          returnKeyType="search"
          style={styles.search}
          accessibilityLabel="Cari kota"
        />
      </View>

      {!q && current && (
        <View>
          <SectionTitle>Lokasi saat ini</SectionTitle>
          <ListCard>
            <ListRow
              leading={
                <IconTile icon={{ ios: 'location', android: 'near_me', web: 'near_me' }} tone="brand" />
              }
              title={current.name}
              subtitle="Berdasarkan lokasi perangkat"
              trailing={check(current)}
              onPress={() => choose(current)}
              accessibilityLabel={`Gunakan lokasi saat ini, ${current.name}`}
            />
          </ListCard>
        </View>
      )}

      <View>
        <SectionTitle>{q ? `Hasil (${matches.length})` : 'Semua kota'}</SectionTitle>
        {matches.length === 0 ? (
          <EmptyNote
            title="Kota tidak ditemukan"
            body="Belum ada bus kota yang terpantau MitraDarat di kota ini."
          />
        ) : (
          <ListCard>
            {matches.map((city) => (
              <ListRow
                key={city.id}
                title={city.name}
                subtitle={`${city.province} · ${cityOperators(city)
                  .map((operator) => operator.name)
                  .join(', ')}`}
                trailing={check(city)}
                onPress={() => choose(city)}
                accessibilityLabel={`${city.name}, ${city.province}${city.id === selected.id ? ', dipilih' : ''}`}
              />
            ))}
          </ListCard>
        )}
      </View>

      <Text style={styles.note}>
        Kota menentukan bus yang tampil di Beranda. Lacak tetap bisa mencari rute di kota lain.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Brand.background,
  },
  content: {
    paddingVertical: Spacing.three,
    paddingBottom: Spacing.six,
    gap: Spacing.four,
  },
  searchWrap: {
    paddingHorizontal: Gutter,
  },
  search: {
    ...PillInput,
    fontSize: 16,
    color: Brand.text,
  },
  close: {
    fontSize: 17,
    fontWeight: '600',
    color: Brand.primary,
  },
  note: {
    fontSize: 13,
    lineHeight: 18,
    color: Brand.textSecondary,
    marginHorizontal: Gutter,
  },
});
