import { router, useLocalSearchParams } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Brand, Card, Gutter, PrimaryButton, Radius, SecondaryButton, Spacing } from '@/constants/theme';
import { toggleSavedVehicle, useSavedVehicles } from '@/data/account';
import type { SymbolName } from '@/data/home';
import { findInspection, type InspectionStatus } from '@/data/inspections';

type Verdict = {
  label: string;
  body: string;
  icon: SymbolName;
  color: string;
  background: string;
};

const verdicts: Record<InspectionStatus | 'tidak-ditemukan', Verdict> = {
  laik: {
    label: 'Laik jalan',
    body: 'Kendaraan lolos inspeksi keselamatan terakhir dan masih berlaku.',
    icon: { ios: 'checkmark.circle', android: 'check_circle', web: 'check_circle' },
    color: Brand.success,
    background: Brand.successSoft,
  },
  'tidak-laik': {
    label: 'Tidak laik jalan',
    body: 'Kendaraan tidak lolos inspeksi. Sebaiknya jangan dipakai sampai temuan di bawah diperbaiki.',
    icon: { ios: 'xmark.octagon', android: 'dangerous', web: 'dangerous' },
    color: '#B42318',
    background: '#FDECEC',
  },
  kedaluwarsa: {
    label: 'Masa berlaku habis',
    body: 'Hasil inspeksi terakhir sudah tidak berlaku. Minta operator menunjukkan hasil inspeksi terbaru.',
    icon: { ios: 'clock.badge.exclamationmark', android: 'schedule', web: 'schedule' },
    color: '#A16207',
    background: Brand.accentSoft,
  },
  'tidak-ditemukan': {
    label: 'Data tidak ditemukan',
    body: 'Belum ada hasil inspeksi untuk nomor plat ini. Periksa lagi penulisan plat, atau kendaraan belum pernah diinspeksi.',
    icon: { ios: 'questionmark.circle', android: 'help', web: 'help' },
    color: Brand.textSecondary,
    background: '#EEF2F7',
  },
};

export default function CheckResultScreen() {
  const { plat } = useLocalSearchParams<{ plat: string }>();
  const inspection = findInspection(plat);
  const verdict = verdicts[inspection?.status ?? 'tidak-ditemukan'];
  const saved = useSavedVehicles().some((vehicle) => vehicle.plate === plat);

  return (
    <ScrollView
      style={styles.screen}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.content}>
      <View style={[styles.verdict, { backgroundColor: verdict.background }]}>
        <SymbolView name={verdict.icon} size={44} tintColor={verdict.color} />
        <View style={styles.plate}>
          <Text style={styles.plateText}>{plat}</Text>
        </View>
        <Text style={[styles.verdictLabel, { color: verdict.color }]} accessibilityRole="header">
          {verdict.label}
        </Text>
        <Text style={styles.verdictBody}>{verdict.body}</Text>
      </View>

      {inspection ? (
        <>
          <View style={styles.card}>
            <Fact label="Jenis kendaraan" value={inspection.vehicle} />
            <Fact label="Operator" value={inspection.operator} />
            <Fact label="Tanggal inspeksi" value={inspection.inspectedAt} />
            <Fact label="Lokasi inspeksi" value={inspection.location} />
            <Fact label="Berlaku sampai" value={inspection.validUntil} last />
          </View>

          <Text style={styles.sectionTitle} accessibilityRole="header">
            Hasil pemeriksaan
          </Text>
          <View style={styles.card}>
            {inspection.checks.map((check, i) => (
              <View
                key={check.item}
                style={[styles.check, i < inspection.checks.length - 1 && styles.rowBorder]}
                accessibilityLabel={`${check.item}, ${check.passed ? 'lolos' : 'tidak lolos'}`}>
                <SymbolView
                  name={
                    check.passed
                      ? { ios: 'checkmark.circle', android: 'check_circle', web: 'check_circle' }
                      : { ios: 'xmark.circle', android: 'cancel', web: 'cancel' }
                  }
                  size={20}
                  tintColor={check.passed ? Brand.success : '#B42318'}
                />
                <View style={styles.checkText}>
                  <Text style={styles.checkItem}>{check.item}</Text>
                  {check.note && <Text style={styles.checkNote}>{check.note}</Text>}
                </View>
              </View>
            ))}
          </View>

          <Pressable
            onPress={() =>
              toggleSavedVehicle({
                plate: inspection.plate,
                label: inspection.vehicle,
                result: verdict.label,
                checkedAt: inspection.inspectedAt,
              })
            }
            style={({ pressed }) => [styles.secondary, saved && styles.secondaryActive, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityState={{ selected: saved }}>
            <SymbolView
              name={
                saved
                  ? { ios: 'bookmark', android: 'bookmark', web: 'bookmark' }
                  : { ios: 'bookmark', android: 'bookmark_border', web: 'bookmark_border' }
              }
              size={18}
              tintColor={saved ? Brand.textOnPrimary : Brand.primary}
            />
            <Text style={[styles.secondaryText, saved && styles.secondaryTextActive]}>
              {saved ? 'Tersimpan di Akun' : 'Simpan kendaraan'}
            </Text>
          </Pressable>
        </>
      ) : null}

      {inspection?.status !== 'laik' && (
        <Pressable
          onPress={() => router.navigate('/akun/lapor')}
          style={({ pressed }) => [styles.secondary, pressed && styles.pressed]}
          accessibilityRole="button">
          <SymbolView
            name={{ ios: 'exclamationmark.bubble', android: 'report', web: 'report' }}
            size={18}
            tintColor={Brand.primary}
          />
          <Text style={styles.secondaryText}>
            {inspection ? 'Laporkan kendaraan ini' : 'Laporkan jika datanya seharusnya ada'}
          </Text>
        </Pressable>
      )}

      <Pressable
        onPress={() => router.back()}
        style={({ pressed }) => [styles.primary, pressed && styles.pressed]}
        accessibilityRole="button">
        <Text style={styles.primaryText}>Cek kendaraan lain</Text>
      </Pressable>
    </ScrollView>
  );
}

function Fact({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <View style={[styles.fact, !last && styles.rowBorder]}>
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
  content: {
    paddingHorizontal: Gutter,
    paddingVertical: Spacing.three,
    gap: Spacing.three,
    paddingBottom: Spacing.six + Spacing.five,
  },
  verdict: {
    alignItems: 'center',
    padding: Spacing.four,
    borderRadius: Radius.card,
    gap: Spacing.two,
  },
  plate: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one + 2,
    borderRadius: Radius.small,
    backgroundColor: Brand.text,
  },
  plateText: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: Brand.textOnPrimary,
    fontVariant: ['tabular-nums'],
  },
  verdictLabel: {
    fontSize: 24,
    fontWeight: '700',
  },
  verdictBody: {
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 21,
    color: Brand.text,
    textAlign: 'center',
  },
  card: {
    paddingHorizontal: Spacing.three,
    ...Card,
  },
  rowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Brand.border,
  },
  fact: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.three,
    paddingVertical: Spacing.three - 4,
  },
  factLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Brand.textSecondary,
  },
  factValue: {
    flexShrink: 1,
    fontSize: 14,
    fontWeight: '600',
    color: Brand.text,
    textAlign: 'right',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Brand.text,
    marginBottom: -Spacing.two,
  },
  check: {
    flexDirection: 'row',
    gap: Spacing.three - 4,
    paddingVertical: Spacing.three - 4,
  },
  checkText: {
    flex: 1,
    gap: 2,
  },
  checkItem: {
    fontSize: 15,
    fontWeight: '500',
    color: Brand.text,
  },
  checkNote: {
    fontSize: 13,
    fontWeight: '600',
    color: '#B42318',
  },
  primary: {
    ...PrimaryButton,
  },
  primaryText: {
    fontSize: 16,
    fontWeight: '700',
    color: Brand.textOnPrimary,
  },
  secondary: {
    ...SecondaryButton,
    flexDirection: 'row',
    gap: Spacing.two,
  },
  secondaryActive: {
    backgroundColor: Brand.primary,
  },
  secondaryText: {
    fontSize: 15,
    fontWeight: '700',
    color: Brand.primary,
  },
  secondaryTextActive: {
    color: Brand.textOnPrimary,
  },
  pressed: {
    opacity: 0.7,
  },
});
