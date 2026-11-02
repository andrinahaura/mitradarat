import { useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { EmptyNote } from '@/components/list';
import { ReportStatusBadge, statusColor } from '@/components/report-status-badge';
import { Brand, Card, Gutter, Radius, Spacing } from '@/constants/theme';
import { currentStatus, getReport } from '@/data/account';

export default function ReportDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const report = getReport(id);

  if (!report) {
    return (
      <View style={styles.missing}>
        <EmptyNote title="Laporan tidak ditemukan" body="Kembali ke Laporan saya untuk melihat daftar laporan." />
      </View>
    );
  }

  // Newest event first, so the current status sits at the top of the timeline.
  const timeline = [...report.history].reverse();

  return (
    <ScrollView
      style={styles.screen}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <View style={styles.cardTop}>
          <Text style={styles.ticket}>{report.ticket}</Text>
          <ReportStatusBadge status={currentStatus(report)} />
        </View>
        <Text style={styles.title}>{report.title}</Text>
        <Text style={styles.description}>{report.description}</Text>

        <View style={styles.facts}>
          <Fact label="Kategori" value={report.category} />
          {report.plate && <Fact label="Nomor plat" value={report.plate} />}
          <Fact label="Dikirim" value={report.createdAt} />
        </View>
      </View>

      <Text style={styles.sectionTitle} accessibilityRole="header">
        Perkembangan
      </Text>
      <View style={styles.card}>
        {timeline.map((event, i) => {
          const color = statusColor(event.status);
          const last = i === timeline.length - 1;
          return (
            <View key={`${event.status}-${event.at}`} style={styles.event}>
              <View style={styles.rail}>
                <View style={[styles.dot, { backgroundColor: i === 0 ? color : Brand.border }]} />
                {!last && <View style={styles.line} />}
              </View>
              <View style={[styles.eventText, !last && styles.eventSpacing]}>
                <Text style={[styles.eventStatus, i === 0 && { color }]}>{event.status}</Text>
                <Text style={styles.eventAt}>{event.at}</Text>
                <Text style={styles.eventNote}>{event.note}</Text>
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.fact}>
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
    paddingBottom: Spacing.six + Spacing.five,
  },
  missing: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: Brand.background,
  },
  card: {
    padding: Spacing.three,
    ...Card,
    gap: Spacing.two,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ticket: {
    fontSize: 13,
    fontWeight: '600',
    color: Brand.textSecondary,
    fontVariant: ['tabular-nums'],
  },
  title: {
    fontSize: 19,
    fontWeight: '700',
    letterSpacing: -0.3,
    color: Brand.text,
  },
  description: {
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 22,
    color: Brand.text,
  },
  facts: {
    marginTop: Spacing.one,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Brand.border,
    paddingTop: Spacing.two,
    gap: Spacing.two,
  },
  fact: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.three,
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
    marginTop: Spacing.four,
    marginBottom: Spacing.two,
  },
  event: {
    flexDirection: 'row',
    gap: Spacing.three - 4,
  },
  rail: {
    width: 14,
    alignItems: 'center',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: Radius.full,
    marginTop: 4,
  },
  line: {
    flex: 1,
    width: 2,
    marginTop: Spacing.one,
    backgroundColor: Brand.border,
  },
  eventText: {
    flex: 1,
    gap: 2,
  },
  eventSpacing: {
    paddingBottom: Spacing.three,
  },
  eventStatus: {
    fontSize: 15,
    fontWeight: '700',
    color: Brand.text,
  },
  eventAt: {
    fontSize: 12,
    fontWeight: '500',
    color: Brand.textSecondary,
  },
  eventNote: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    color: Brand.text,
    marginTop: 2,
  },
});
