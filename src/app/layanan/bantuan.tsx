import { router, useLocalSearchParams } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Reanimated from 'react-native-reanimated';

import { IconTile } from '@/components/icon-tile';
import { EmptyNote, ListCard, ListRow } from '@/components/list';
import { Motion } from '@/constants/motion';
import { Brand, Card, Gutter, PillInput, Radius, Spacing, Type } from '@/constants/theme';
import { type HelpTopicId, helpTopics } from '@/data/help';

type Filter = HelpTopicId | 'semua';

/** One FAQ for every service (v1 had two, one with a broken image). `?topik=` preselects a topic. */
export default function HelpCenterScreen() {
  const { topik } = useLocalSearchParams<{ topik?: string }>();
  const initial = helpTopics.some((t) => t.id === topik) ? (topik as HelpTopicId) : 'semua';
  const [filter, setFilter] = useState<Filter>(initial);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState<string | null>(null);

  const q = query.trim().toLowerCase();
  const topics = helpTopics
    .filter((topic) => filter === 'semua' || topic.id === filter)
    .map((topic) => ({
      ...topic,
      questions: q
        ? topic.questions.filter((item) => `${item.q} ${item.a}`.toLowerCase().includes(q))
        : topic.questions,
    }))
    .filter((topic) => topic.questions.length > 0);

  return (
    <ScrollView
      style={styles.screen}
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      contentContainerStyle={styles.content}>
      <View style={styles.search}>
        <SymbolView
          name={{ ios: 'magnifyingglass', android: 'search', web: 'search' }}
          size={18}
          tintColor={Brand.textSecondary}
        />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Cari pertanyaan"
          placeholderTextColor={Brand.textSecondary}
          style={styles.searchInput}
          autoCorrect={false}
          accessibilityLabel="Cari pertanyaan"
        />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
        {[{ id: 'semua' as Filter, title: 'Semua' }, ...helpTopics].map((topic) => {
          const active = topic.id === filter;
          return (
            <Pressable
              key={topic.id}
              onPress={() => setFilter(topic.id)}
              style={[styles.chip, active && styles.chipActive]}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}>
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{topic.title}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {topics.length === 0 && (
        <EmptyNote
          title="Pertanyaan tidak ditemukan"
          body="Coba kata lain, atau hubungi kami lewat salah satu kanal di bawah."
        />
      )}

      {topics.map((topic) => (
        <Reanimated.View key={topic.id} style={styles.card} layout={Motion.layout} entering={Motion.enter}>
          <Text style={styles.topicTitle} accessibilityRole="header">
            {topic.title}
          </Text>
          {topic.questions.map((item) => {
            const key = `${topic.id}:${item.q}`;
            const expanded = open === key;
            return (
              <Reanimated.View key={key} style={styles.question} layout={Motion.layout}>
                <Pressable
                  onPress={() => setOpen(expanded ? null : key)}
                  style={({ pressed }) => [styles.questionRow, pressed && styles.pressed]}
                  accessibilityRole="button"
                  accessibilityState={{ expanded }}>
                  <Text style={styles.questionText}>{item.q}</Text>
                  <SymbolView
                    name={
                      expanded
                        ? { ios: 'chevron.up', android: 'expand_less', web: 'expand_less' }
                        : { ios: 'chevron.down', android: 'expand_more', web: 'expand_more' }
                    }
                    size={13}
                    weight="semibold"
                    tintColor={Brand.textSecondary}
                  />
                </Pressable>
                {expanded && (
                  <Reanimated.Text style={styles.answer} entering={Motion.enter} exiting={Motion.exit}>
                    {item.a}
                  </Reanimated.Text>
                )}
              </Reanimated.View>
            );
          })}
        </Reanimated.View>
      ))}

      <Text style={styles.moreTitle} accessibilityRole="header">
        Masih butuh bantuan?
      </Text>
      <ListCard>
        <ListRow
          leading={<IconTile icon={{ ios: 'headphones', android: 'support_agent', web: 'support_agent' }} />}
          title="Hubungi layanan pelanggan"
          subtitle="Telepon, WhatsApp, atau email"
          onPress={() => router.push('/layanan/hubungi-cs')}
        />
        <ListRow
          leading={<IconTile icon={{ ios: 'at', android: 'alternate_email', web: 'alternate_email' }} />}
          title="Media sosial resmi"
          subtitle="Info terbaru dan pengumuman"
          onPress={() => router.push('/layanan/media-sosial')}
        />
        <ListRow
          leading={<IconTile icon={{ ios: 'exclamationmark.bubble', android: 'report', web: 'report' }} />}
          title="Kirim laporan"
          subtitle="Untuk masalah layanan atau aplikasi"
          onPress={() => router.navigate('/akun/lapor')}
        />
      </ListCard>
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
    paddingBottom: Spacing.six + Spacing.five,
    gap: Spacing.three,
  },
  search: {
    ...PillInput,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two + 2,
    marginHorizontal: Gutter,
    height: 48,
    minHeight: 48,
  },
  searchInput: {
    ...Type.body,
    flex: 1,
    height: '100%',
    color: Brand.text,
  },
  chips: {
    gap: Spacing.two,
    paddingHorizontal: Gutter,
  },
  chip: {
    height: 36,
    paddingHorizontal: Spacing.three - 2,
    justifyContent: 'center',
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Brand.border,
    backgroundColor: Brand.surface,
  },
  chipActive: {
    backgroundColor: Brand.primary,
    borderColor: Brand.primary,
  },
  chipText: {
    ...Type.label,
    color: Brand.text,
  },
  chipTextActive: {
    color: Brand.textOnPrimary,
  },
  card: {
    ...Card,
    marginHorizontal: Gutter,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.one,
  },
  topicTitle: {
    ...Type.headlineSmall,
    color: Brand.text,
    marginBottom: Spacing.one,
  },
  question: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Brand.border,
  },
  questionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    minHeight: 52,
    paddingVertical: Spacing.three - 4,
  },
  pressed: {
    opacity: 0.6,
  },
  questionText: {
    ...Type.label,
    flex: 1,
    fontSize: 15,
    lineHeight: 20,
    color: Brand.text,
  },
  answer: {
    ...Type.body,
    fontSize: 15,
    lineHeight: 22,
    color: Brand.textSecondary,
    paddingBottom: Spacing.three,
  },
  moreTitle: {
    ...Type.headlineSmall,
    color: Brand.text,
    marginHorizontal: Gutter,
    marginTop: Spacing.two,
    marginBottom: -Spacing.two,
  },
});
