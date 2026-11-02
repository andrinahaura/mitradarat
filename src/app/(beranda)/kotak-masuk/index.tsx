import { router, Stack } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Reanimated from 'react-native-reanimated';

import { IconTile } from '@/components/icon-tile';
import { EmptyNote } from '@/components/list';
import { Motion } from '@/constants/motion';
import { Brand, Card, Gutter, Radius, Spacing, Type } from '@/constants/theme';
import {
  categoryIcon,
  type InboxItem,
  type InboxTab,
  markAllRead,
  unreadCount,
  useInbox,
} from '@/data/inbox';

type Filter = 'semua' | InboxTab;

const filters: { id: Filter; label: string; empty: string }[] = [
  { id: 'semua', label: 'Semua', empty: 'Pemberitahuan dan pesan akan muncul di sini.' },
  {
    id: 'notifikasi',
    label: 'Notifikasi',
    empty: 'Perubahan rute dan perkembangan laporan akan muncul di sini.',
  },
  { id: 'pesan', label: 'Pesan', empty: 'Balasan petugas untuk laporanmu akan muncul di sini.' },
];

const DAY_MS = 24 * 60 * 60 * 1000;

/** "Hari ini", "Kemarin", "7 hari terakhir" or "Lebih lama", from the local calendar day. */
function dayGroup(sentOn: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [y, m, d] = sentOn.split('-').map(Number);
  const days = Math.round((today.getTime() - new Date(y, m - 1, d).getTime()) / DAY_MS);
  if (days <= 0) return 'Hari ini';
  if (days === 1) return 'Kemarin';
  if (days < 7) return '7 hari terakhir';
  return 'Lebih lama';
}

/**
 * v1 Inbox (screenshots 11–12) as a timeline (references 1–3): filter chips, then
 * items grouped by day, each on its own card. Items open into a detail screen.
 */
export default function InboxScreen() {
  const items = useInbox();
  const [filter, setFilter] = useState<Filter>('semua');
  const shown = items
    .filter((item) => filter === 'semua' || item.tab === filter)
    .sort((a, b) => b.sentOn.localeCompare(a.sentOn));
  const unreadShown = shown.filter((item) => !item.read).length;
  const current = filters.find((f) => f.id === filter) ?? filters[0];

  const groups: { label: string; items: InboxItem[] }[] = [];
  for (const item of shown) {
    const label = dayGroup(item.sentOn);
    const group = groups.at(-1);
    if (group?.label === label) group.items.push(item);
    else groups.push({ label, items: [item] });
  }

  const markShownRead = () => {
    if (filter === 'semua') {
      markAllRead('notifikasi');
      markAllRead('pesan');
    } else {
      markAllRead(filter);
    }
  };

  return (
    <ScrollView
      style={styles.screen}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.content}>
      <Stack.Screen
        options={{
          headerRight: () =>
            unreadShown > 0 ? (
              <Pressable onPress={markShownRead} hitSlop={8} accessibilityRole="button">
                <Text style={styles.markAll}>Tandai dibaca</Text>
              </Pressable>
            ) : null,
        }}
      />

      <View style={styles.chips} accessibilityRole="tablist">
        {filters.map((f) => {
          const active = f.id === filter;
          const unread = f.id === 'semua' ? unreadCount(items) : unreadCount(items, f.id);
          return (
            <Pressable
              key={f.id}
              onPress={() => setFilter(f.id)}
              style={[styles.chip, active && styles.chipActive]}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
              accessibilityLabel={unread > 0 ? `${f.label}, ${unread} belum dibaca` : f.label}>
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{f.label}</Text>
              {unread > 0 && (
                <View style={[styles.count, active && styles.countActive]}>
                  <Text style={[styles.countText, active && styles.countTextActive]}>{unread}</Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </View>

      {shown.length === 0 ? (
        <EmptyNote title={`Belum ada ${current.label.toLowerCase()}`} body={current.empty} />
      ) : (
        groups.map((group) => (
          <Reanimated.View
            key={group.label}
            style={styles.group}
            layout={Motion.layout}
            entering={Motion.enter}
            exiting={Motion.exit}>
            <Text style={styles.groupLabel} accessibilityRole="header">
              {group.label}
            </Text>
            {group.items.map((item) => (
              <Reanimated.View key={item.id} layout={Motion.layout} entering={Motion.enter} exiting={Motion.exit}>
                <InboxCard item={item} showTimeOnly={group.label === 'Hari ini' || group.label === 'Kemarin'} />
              </Reanimated.View>
            ))}
          </Reanimated.View>
        ))
      )}
    </ScrollView>
  );
}

function InboxCard({ item, showTimeOnly }: { item: InboxItem; showTimeOnly: boolean }) {
  const time = showTimeOnly ? (item.sentAt.split(', ')[1] ?? item.sentAt) : item.sentAt;
  return (
    <Pressable
      onPress={() => router.push({ pathname: '/kotak-masuk/[id]', params: { id: item.id } })}
      style={({ pressed }) => [styles.card, !item.read && styles.cardUnread, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel={`${item.read ? '' : 'Belum dibaca. '}${item.title}. ${item.sentAt}`}>
      <IconTile icon={categoryIcon[item.category]} tone={item.read ? 'neutral' : 'brand'} />
      <View style={styles.cardText}>
        <Text style={[styles.title, !item.read && styles.titleUnread]} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.summary} numberOfLines={2}>
          {item.summary}
        </Text>
        <View style={styles.meta}>
          <SymbolView
            name={{ ios: 'clock', android: 'schedule', web: 'schedule' }}
            size={12}
            tintColor={Brand.textSecondary}
          />
          <Text style={styles.metaText}>
            {item.category} · {time}
          </Text>
        </View>
      </View>
      {!item.read && <View style={styles.unreadDot} />}
    </Pressable>
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
  markAll: {
    ...Type.label,
    color: Brand.primary,
  },
  chips: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one + 2,
    height: 36,
    paddingHorizontal: Spacing.three - 2,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Brand.inputBorder,
    backgroundColor: Brand.surface,
  },
  chipActive: {
    backgroundColor: Brand.primary,
    borderColor: Brand.primary,
  },
  chipText: {
    ...Type.labelSmall,
    fontSize: 14,
    color: Brand.text,
  },
  chipTextActive: {
    color: Brand.textOnPrimary,
  },
  count: {
    minWidth: 20,
    height: 20,
    paddingHorizontal: 5,
    borderRadius: Radius.full,
    backgroundColor: Brand.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countActive: {
    backgroundColor: Brand.surface,
  },
  countText: {
    fontSize: 12,
    fontWeight: '600',
    color: Brand.textOnPrimary,
  },
  countTextActive: {
    color: Brand.primary,
  },
  group: {
    gap: Spacing.two,
  },
  groupLabel: {
    ...Type.labelSmall,
    color: Brand.textSecondary,
    marginTop: Spacing.one,
  },
  card: {
    ...Card,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.three - 4,
    padding: Spacing.three - 2,
  },
  cardUnread: {
    borderColor: '#D3DEFC',
  },
  pressed: {
    opacity: 0.7,
  },
  cardText: {
    flex: 1,
    gap: Spacing.one,
  },
  title: {
    ...Type.label,
    color: Brand.text,
  },
  titleUnread: {
    fontWeight: '700',
  },
  summary: {
    ...Type.bodySmall,
    color: Brand.textSecondary,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    marginTop: 2,
  },
  metaText: {
    ...Type.caption,
    color: Brand.textSecondary,
  },
  unreadDot: {
    width: 8,
    height: 8,
    marginTop: 6,
    borderRadius: Radius.full,
    backgroundColor: Brand.primary,
  },
});
