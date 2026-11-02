import { StyleSheet, Text, View } from 'react-native';

import { Brand, Radius, Spacing } from '@/constants/theme';
import type { ReportStatus } from '@/data/account';

const statusColors: Record<ReportStatus, { background: string; text: string }> = {
  Diterima: { background: Brand.primarySoft, text: Brand.primary },
  Diproses: { background: Brand.accentSoft, text: '#A16207' },
  Selesai: { background: Brand.successSoft, text: Brand.success },
  Ditolak: { background: '#FDECEC', text: '#B42318' },
};

export function statusColor(status: ReportStatus) {
  return statusColors[status].text;
}

export function ReportStatusBadge({ status }: { status: ReportStatus }) {
  const colors = statusColors[status];
  return (
    <View style={[styles.badge, { backgroundColor: colors.background }]}>
      <Text style={[styles.text, { color: colors.text }]}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.two + 2,
    paddingVertical: Spacing.one,
    borderRadius: Radius.small,
  },
  text: {
    fontSize: 12,
    fontWeight: '700',
  },
});
