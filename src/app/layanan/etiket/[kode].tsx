import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

import { EmptyNote } from '@/components/list';
import { Brand, Card, Gutter, Radius, Spacing, Type } from '@/constants/theme';
import { getTicket } from '@/data/tickets';

/** The e-ticket shown at check-in and boarding. */
export default function TicketScreen() {
  const { kode } = useLocalSearchParams<{ kode: string }>();
  const ticket = getTicket(kode);

  if (!ticket) {
    return (
      <View style={styles.missing}>
        <EmptyNote title="Tiket tidak ditemukan" body="Kembali dan cari ulang dengan kode booking." />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.screen}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.content}>
      <View style={styles.ticket}>
        <View style={styles.top}>
          <View style={styles.status}>
            <View style={[styles.statusDot, ticket.checkedIn && styles.statusDotDone]} />
            <Text style={styles.statusText}>
              {ticket.checkedIn ? 'Sudah check-in' : 'Belum check-in'}
            </Text>
          </View>
          <Text style={styles.operator}>
            {ticket.operator} · {ticket.busClass}
          </Text>

          <View style={styles.route}>
            <View style={styles.stop}>
              <Text style={styles.time}>{ticket.departure}</Text>
              <Text style={styles.place}>{ticket.from}</Text>
            </View>
            <View style={styles.stop}>
              <Text style={styles.time}>{ticket.arrival}</Text>
              <Text style={styles.place}>{ticket.to}</Text>
            </View>
          </View>
          <Text style={styles.date}>{ticket.date}</Text>
        </View>

        {/* Perforation between trip details and the boarding code. */}
        <View style={styles.perforation} />

        <View style={styles.qrBlock}>
          <QRCode value={`MITRADARAT-TOS:${ticket.code}`} size={168} color={Brand.text} backgroundColor="#FFFFFF" />
          <Text style={styles.code}>{ticket.code}</Text>
          <Text style={styles.qrHint}>Tunjukkan kode ini saat check-in dan boarding.</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Fact label="Penumpang" value={ticket.passengers.join(', ')} />
        <Fact label="Kursi" value={ticket.seats.join(', ')} />
        <Fact label="Jalur keberangkatan" value={ticket.platform} last />
      </View>
    </ScrollView>
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
  content: {
    paddingHorizontal: Gutter,
    paddingVertical: Spacing.three,
    paddingBottom: Spacing.six + Spacing.five,
    gap: Spacing.three,
  },
  missing: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: Brand.background,
  },
  ticket: {
    ...Card,
    overflow: 'hidden',
  },
  top: {
    padding: Spacing.three,
    gap: Spacing.two,
  },
  status: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one + 2,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: Radius.full,
    backgroundColor: Brand.accent,
  },
  statusDotDone: {
    backgroundColor: Brand.success,
  },
  statusText: {
    ...Type.labelSmall,
    color: Brand.text,
  },
  operator: {
    ...Type.bodySmall,
    color: Brand.textSecondary,
  },
  route: {
    gap: Spacing.three - 4,
    marginTop: Spacing.one,
  },
  stop: {
    flexDirection: 'row',
    gap: Spacing.three,
    alignItems: 'baseline',
  },
  time: {
    ...Type.headline,
    width: 56,
    color: Brand.text,
    fontVariant: ['tabular-nums'],
  },
  place: {
    ...Type.body,
    flex: 1,
    fontSize: 15,
    color: Brand.text,
  },
  date: {
    ...Type.label,
    color: Brand.primary,
  },
  perforation: {
    borderTopWidth: 2,
    borderStyle: 'dashed',
    borderColor: Brand.border,
    marginHorizontal: Spacing.three,
  },
  qrBlock: {
    alignItems: 'center',
    padding: Spacing.four,
    gap: Spacing.two,
  },
  code: {
    ...Type.headline,
    letterSpacing: 2,
    color: Brand.text,
    fontVariant: ['tabular-nums'],
  },
  qrHint: {
    ...Type.bodySmall,
    color: Brand.textSecondary,
    textAlign: 'center',
  },
  card: {
    ...Card,
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
});
