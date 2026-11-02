import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { EmptyNote } from '@/components/list';
import { ReportStatusBadge } from '@/components/report-status-badge';
import { Brand, Card, Gutter, PrimaryButton, Spacing } from '@/constants/theme';
import { currentStatus, useReports } from '@/data/account';

export default function ReportsScreen() {
  const reports = useReports();

  return (
    <ScrollView
      style={styles.screen}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.content}>
      <Pressable
        onPress={() => router.push('/akun/lapor')}
        style={({ pressed }) => [styles.newButton, pressed && styles.pressed]}
        accessibilityRole="button">
        <SymbolView
          name={{ ios: 'square.and.pencil', android: 'edit_note', web: 'edit_note' }}
          size={18}
          tintColor={Brand.textOnPrimary}
        />
        <Text style={styles.newButtonText}>Buat laporan baru</Text>
      </Pressable>

      <Text style={styles.intro}>
        Setiap laporan punya nomor tiket. Kamu akan menerima notifikasi setiap kali statusnya berubah.
      </Text>

      {reports.length === 0 ? (
        <EmptyNote
          title="Belum ada laporan"
          body="Laporan yang kamu kirim lewat menu Lapor akan muncul di sini beserta statusnya."
        />
      ) : (
        reports.map((report) => {
          const latest = report.history.at(-1);
          return (
            <Pressable
              key={report.id}
              onPress={() => router.push({ pathname: '/akun/laporan/[id]', params: { id: report.id } })}
              style={({ pressed }) => [styles.card, pressed && styles.pressed]}
              accessibilityRole="button"
              accessibilityLabel={`${report.title}, status ${currentStatus(report)}`}>
              <View style={styles.cardTop}>
                <Text style={styles.ticket}>{report.ticket}</Text>
                <ReportStatusBadge status={currentStatus(report)} />
              </View>
              <Text style={styles.title}>{report.title}</Text>
              <Text style={styles.meta}>
                {report.category} · Dikirim {report.createdAt}
              </Text>
              {latest && (
                <Text style={styles.latest} numberOfLines={2}>
                  {latest.note}
                </Text>
              )}
            </Pressable>
          );
        })
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
    paddingHorizontal: Gutter,
    paddingVertical: Spacing.three,
    gap: Spacing.two + Spacing.one,
    paddingBottom: Spacing.six + Spacing.five,
  },
  newButton: {
    ...PrimaryButton,
    flexDirection: 'row',
    gap: Spacing.two,
  },
  newButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: Brand.textOnPrimary,
  },
  intro: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    color: Brand.textSecondary,
  },
  card: {
    padding: Spacing.three,
    ...Card,
    gap: Spacing.one + 2,
  },
  pressed: {
    opacity: 0.7,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ticket: {
    fontSize: 12,
    fontWeight: '600',
    color: Brand.textSecondary,
    fontVariant: ['tabular-nums'],
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: Brand.text,
  },
  meta: {
    fontSize: 13,
    fontWeight: '500',
    color: Brand.textSecondary,
  },
  latest: {
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
    color: Brand.text,
    marginTop: Spacing.one,
  },
});
