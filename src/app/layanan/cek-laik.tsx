import { router, Stack, useLocalSearchParams } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { IconTile } from '@/components/icon-tile';
import { Brand, Card, Gutter, PillInput, PrimaryButton, Radius, Spacing } from '@/constants/theme';
import { useSavedVehicles } from '@/data/account';
import { samplePlates } from '@/data/inspections';
import { formatPlate, isCompletePlate } from '@/utils/plate';

/**
 * One form for both v1 entries: Tools → Cek Laik (screenshot 36) and the
 * Bus Pariwisata card (screenshot 22). `?jenis=pariwisata` only changes the copy.
 */
export default function CheckFormScreen() {
  const { jenis } = useLocalSearchParams<{ jenis?: string }>();
  const touristBus = jenis === 'pariwisata';
  const saved = useSavedVehicles();
  const [plate, setPlate] = useState('');
  const complete = isCompletePlate(plate);

  const check = (value: string) =>
    router.push({ pathname: '/layanan/cek-laik-hasil', params: { plat: value } });

  return (
    <ScrollView
      style={styles.screen}
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
      automaticallyAdjustKeyboardInsets
      contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: touristBus ? 'Cek Laik Bus Pariwisata' : 'Cek Laik' }} />

      <View style={styles.hero}>
        <IconTile
          size="large"
          icon={
              touristBus
                ? { ios: 'bus', android: 'directions_bus', web: 'directions_bus' }
                : { ios: 'checkmark.shield', android: 'verified_user', web: 'verified_user' }
          }
        />
        <Text style={styles.title} accessibilityRole="header">
          {touristBus ? 'Pastikan bus sewaanmu laik jalan' : 'Cek hasil inspeksi kendaraan'}
        </Text>
        <Text style={styles.body}>
          {touristBus
            ? 'Masukkan nomor plat bus pariwisata sebelum berangkat. Kamu akan melihat hasil inspeksi keselamatan terakhirnya.'
            : 'Masukkan nomor plat untuk melihat hasil inspeksi keselamatan terakhir dan masa berlakunya.'}
        </Text>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Nomor plat</Text>
        <TextInput
          value={plate}
          onChangeText={(text) => setPlate(formatPlate(text))}
          placeholder="H 7191 OQ"
          placeholderTextColor="#94A3B8"
          autoCapitalize="characters"
          autoCorrect={false}
          maxLength={11}
          returnKeyType="search"
          onSubmitEditing={() => complete && check(plate)}
          style={styles.plateInput}
          accessibilityLabel="Nomor plat kendaraan"
        />
        <Text style={styles.hint}>Huruf kode wilayah, angka, lalu huruf akhir. Spasi diisi otomatis.</Text>
      </View>

      <Pressable
        onPress={() => check(plate)}
        disabled={!complete}
        style={({ pressed }) => [styles.button, !complete && styles.buttonDisabled, pressed && styles.pressed]}
        accessibilityRole="button"
        accessibilityState={{ disabled: !complete }}>
        <Text style={styles.buttonText}>Cek kelaikan</Text>
      </Pressable>

      {saved.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Kendaraan tersimpan</Text>
          <View style={styles.chips}>
            {saved.map((vehicle) => (
              <Pressable
                key={vehicle.plate}
                onPress={() => check(vehicle.plate)}
                style={({ pressed }) => [styles.chip, pressed && styles.pressed]}
                accessibilityRole="button"
                accessibilityLabel={`Cek ${vehicle.plate}`}>
                <Text style={styles.chipPlate}>{vehicle.plate}</Text>
                <Text style={styles.chipLabel}>{vehicle.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}

      <Pressable
        onPress={() => router.push({ pathname: '/layanan/bantuan', params: { topik: 'cek-laik' } })}
        style={({ pressed }) => [styles.faq, pressed && styles.pressed]}
        accessibilityRole="button">
        <SymbolView
          name={{ ios: 'questionmark.circle', android: 'help', web: 'help' }}
          size={22}
          tintColor={Brand.primary}
        />
        <View style={styles.faqText}>
          <Text style={styles.faqTitle}>Pertanyaan seputar Cek Laik</Text>
          <Text style={styles.faqBody}>Data dari mana, arti hasil, dan jika kendaraan tidak ditemukan</Text>
        </View>
        <SymbolView
          name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
          size={14}
          weight="semibold"
          tintColor={Brand.textSecondary}
        />
      </Pressable>

      <View style={styles.sample}>
        <Text style={styles.sampleTitle}>Data contoh untuk mencoba prototipe</Text>
        <Text style={styles.sampleBody}>
          {samplePlates.join(' · ')}. Plat lain akan menampilkan hasil &ldquo;tidak ditemukan&rdquo;.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Brand.background,
  },
  content: {
    paddingHorizontal: Gutter,
    paddingVertical: Spacing.three,
    gap: Spacing.three,
    paddingBottom: Spacing.six + Spacing.five,
  },
  hero: {
    gap: Spacing.two,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: Brand.text,
  },
  body: {
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 22,
    color: Brand.textSecondary,
  },
  field: {
    gap: Spacing.two,
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
    color: Brand.text,
  },
  plateInput: {
    ...PillInput,
    minHeight: 64,
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: 2,
    textAlign: 'center',
    color: Brand.text,
    fontVariant: ['tabular-nums'],
  },
  hint: {
    fontSize: 13,
    fontWeight: '500',
    color: Brand.textSecondary,
  },
  button: {
    ...PrimaryButton,
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: Brand.textOnPrimary,
  },
  pressed: {
    opacity: 0.7,
  },
  section: {
    gap: Spacing.two,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Brand.text,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  chip: {
    paddingHorizontal: Spacing.three - 4,
    paddingVertical: Spacing.two,
    borderRadius: Radius.medium,
    backgroundColor: Brand.surface,
    gap: 2,
  },
  chipPlate: {
    fontSize: 15,
    fontWeight: '700',
    color: Brand.text,
    fontVariant: ['tabular-nums'],
  },
  chipLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: Brand.textSecondary,
  },
  faq: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three - 4,
    padding: Spacing.three,
    ...Card,
  },
  faqText: {
    flex: 1,
    gap: 2,
  },
  faqTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Brand.text,
  },
  faqBody: {
    fontSize: 13,
    fontWeight: '500',
    color: Brand.textSecondary,
  },
  sample: {
    padding: Spacing.three - 4,
    borderRadius: Radius.medium,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: Brand.border,
    gap: Spacing.one,
  },
  sampleTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Brand.textSecondary,
  },
  sampleBody: {
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
    color: Brand.textSecondary,
  },
});
