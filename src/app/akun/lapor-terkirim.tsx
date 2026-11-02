import { router, useLocalSearchParams } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { EmptyNote } from '@/components/list';
import { Brand, Card, Gutter, PrimaryButton, Radius, SecondaryButton, Spacing } from '@/constants/theme';
import { getReport } from '@/data/account';

const nextSteps = [
  { status: 'Diterima', text: 'Laporan masuk dan tercatat. Kamu sudah di tahap ini.' },
  { status: 'Diproses', text: 'Petugas meneruskan laporan ke unit atau operator terkait.' },
  { status: 'Selesai atau Ditolak', text: 'Kamu menerima jawaban beserta alasannya.' },
];

export default function ReportSentScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const report = getReport(id);

  if (!report) {
    return (
      <View style={styles.missing}>
        <EmptyNote title="Laporan tidak ditemukan" body="Buka Akun → Laporan saya untuk melihat laporanmu." />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.screen}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <View style={styles.check}>
          <SymbolView
            name={{ ios: 'checkmark', android: 'check', web: 'check' }}
            size={30}
            weight="bold"
            tintColor="#FFFFFF"
          />
        </View>
        <Text style={styles.title} accessibilityRole="header">
          Laporan terkirim
        </Text>
        <Text style={styles.subtitle}>Simpan nomor tiket ini untuk menanyakan perkembangan laporan.</Text>
        <View style={styles.ticket}>
          <Text style={styles.ticketLabel}>Nomor tiket</Text>
          <Text style={styles.ticketValue} selectable>
            {report.ticket}
          </Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Apa selanjutnya</Text>
        {nextSteps.map((step, i) => (
          <View key={step.status} style={styles.step}>
            <View style={[styles.stepNumber, i === 0 && styles.stepNumberActive]}>
              <Text style={[styles.stepNumberText, i === 0 && styles.stepNumberTextActive]}>{i + 1}</Text>
            </View>
            <View style={styles.stepText}>
              <Text style={styles.stepStatus}>{step.status}</Text>
              <Text style={styles.stepBody}>{step.text}</Text>
            </View>
          </View>
        ))}
        <Text style={styles.notify}>Kamu akan menerima notifikasi setiap kali status berubah.</Text>
      </View>

      <Pressable
        onPress={() => router.replace({ pathname: '/akun/laporan/[id]', params: { id: report.id } })}
        style={({ pressed }) => [styles.primary, pressed && styles.pressed]}
        accessibilityRole="button">
        <Text style={styles.primaryText}>Lihat status laporan</Text>
      </Pressable>
      <Pressable
        onPress={() => {
          router.dismissAll();
          router.navigate('/');
        }}
        style={({ pressed }) => [styles.secondary, pressed && styles.pressed]}
        accessibilityRole="button">
        <Text style={styles.secondaryText}>Kembali ke Beranda</Text>
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
  missing: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: Brand.background,
  },
  hero: {
    alignItems: 'center',
    gap: Spacing.two,
    paddingVertical: Spacing.three,
  },
  check: {
    width: 72,
    height: 72,
    borderRadius: Radius.full,
    backgroundColor: Brand.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.one,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Brand.text,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 21,
    color: Brand.textSecondary,
    textAlign: 'center',
    maxWidth: 300,
  },
  ticket: {
    marginTop: Spacing.two,
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.three - 4,
    borderRadius: Radius.medium,
    backgroundColor: Brand.surface,
    borderWidth: 1,
    borderColor: Brand.border,
    borderStyle: 'dashed',
  },
  ticketLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: Brand.textSecondary,
  },
  ticketValue: {
    fontSize: 20,
    fontWeight: '700',
    color: Brand.text,
    fontVariant: ['tabular-nums'],
    letterSpacing: 0.5,
  },
  card: {
    padding: Spacing.three,
    ...Card,
    gap: Spacing.three - 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Brand.text,
  },
  step: {
    flexDirection: 'row',
    gap: Spacing.three - 4,
  },
  stepNumber: {
    width: 26,
    height: 26,
    borderRadius: Radius.full,
    backgroundColor: Brand.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberActive: {
    backgroundColor: Brand.primary,
  },
  stepNumberText: {
    fontSize: 13,
    fontWeight: '700',
    color: Brand.textSecondary,
  },
  stepNumberTextActive: {
    color: Brand.textOnPrimary,
  },
  stepText: {
    flex: 1,
    gap: 2,
  },
  stepStatus: {
    fontSize: 15,
    fontWeight: '700',
    color: Brand.text,
  },
  stepBody: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    color: Brand.textSecondary,
  },
  notify: {
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
    color: Brand.textSecondary,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Brand.border,
    paddingTop: Spacing.three - 4,
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
  },
  secondaryText: {
    fontSize: 16,
    fontWeight: '700',
    color: Brand.primary,
  },
  pressed: {
    opacity: 0.7,
  },
});
