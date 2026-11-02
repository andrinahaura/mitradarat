import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { Brand, Card, Gutter, PillInput, PrimaryButton, Spacing } from '@/constants/theme';
import { profile } from '@/data/account';

const CONFIRM_WORD = 'HAPUS';

const removed = [
  'Profil: nama dan email',
  'Rute, halte, dan kendaraan tersimpan',
  'Pengaturan bahasa dan notifikasi',
];

export default function DeleteAccountScreen() {
  const [typed, setTyped] = useState('');
  const ready = typed.trim().toUpperCase() === CONFIRM_WORD;

  const remove = () =>
    // The prototype has no account backend, so nothing is actually deleted.
    Alert.alert('Prototipe', 'Di aplikasi asli, akun dihapus pada langkah ini.', [
      { text: 'OK', onPress: () => router.back() },
    ]);

  return (
    <ScrollView
      style={styles.screen}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled">
      <Text style={styles.lead}>
        Akun {profile.email} akan dihapus permanen dan tidak bisa dikembalikan.
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Yang ikut terhapus</Text>
        {removed.map((item) => (
          <Text key={item} style={styles.item}>
            • {item}
          </Text>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Laporan yang sudah dikirim</Text>
        <Text style={styles.item}>
          Laporan tetap disimpan tanpa nama dan email, supaya tindak lanjutnya tidak terputus.
        </Text>
      </View>

      <Text style={styles.label}>Ketik {CONFIRM_WORD} untuk melanjutkan</Text>
      <TextInput
        value={typed}
        onChangeText={setTyped}
        autoCapitalize="characters"
        autoCorrect={false}
        style={styles.input}
        accessibilityLabel={`Ketik ${CONFIRM_WORD} untuk melanjutkan`}
      />

      <Pressable
        onPress={remove}
        disabled={!ready}
        style={({ pressed }) => [styles.button, !ready && styles.buttonDisabled, pressed && styles.pressed]}
        accessibilityRole="button"
        accessibilityState={{ disabled: !ready }}>
        <Text style={styles.buttonText}>Hapus akun permanen</Text>
      </Pressable>
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
  lead: {
    fontSize: 16,
    lineHeight: 23,
    fontWeight: '700',
    color: Brand.text,
  },
  card: {
    padding: Spacing.three,
    ...Card,
    gap: Spacing.one + 2,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Brand.text,
  },
  item: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    color: Brand.text,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Brand.text,
    marginBottom: -Spacing.two,
  },
  input: {
    ...PillInput,
    fontSize: 16,
    fontWeight: '500',
    color: Brand.text,
  },
  button: {
    ...PrimaryButton,
    backgroundColor: '#B42318',
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  pressed: {
    opacity: 0.8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
