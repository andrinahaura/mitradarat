import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Reanimated from 'react-native-reanimated';

import { EmptyNote } from '@/components/list';
import { NewsThumb } from '@/components/news/news-thumb';
import { TabPage } from '@/components/tab-header';
import { Motion } from '@/constants/motion';
import { Brand, Card, Gutter, PillInput, Radius, Spacing } from '@/constants/theme';
import {
  categoryIcon,
  formatDate,
  formatMonth,
  news,
  type NewsArticle,
  type NewsCategory,
  newsCategories,
} from '@/data/news';

type Filter = NewsCategory | 'Semua';

/** Articles grouped under "Oktober 2026"-style headers; `news` is already newest first. */
function groupByMonth(items: NewsArticle[]) {
  const groups: { month: string; items: NewsArticle[] }[] = [];
  for (const item of items) {
    const month = formatMonth(item.date);
    const last = groups.at(-1);
    if (last?.month === month) last.items.push(item);
    else groups.push({ month, items: [item] });
  }
  return groups;
}

export default function NewsScreen() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('Semua');

  const q = query.trim().toLowerCase();
  const shown = news.filter(
    (item) =>
      (filter === 'Semua' || item.category === filter) &&
      (!q || `${item.title} ${item.summary} ${item.place}`.toLowerCase().includes(q)),
  );
  const [featured, ...rest] = filter === 'Semua' && !q ? shown : [undefined, ...shown];

  return (
    <TabPage
      title="Berita"
      subtitle="Kabar terbaru perhubungan darat"
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag">
      <View style={styles.search}>
        <SymbolView
          name={{ ios: 'magnifyingglass', android: 'search', web: 'search' }}
          size={18}
          tintColor={Brand.textSecondary}
        />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Cari berita"
          placeholderTextColor={Brand.textSecondary}
          style={styles.searchInput}
          returnKeyType="search"
          clearButtonMode="while-editing"
          autoCorrect={false}
          accessibilityLabel="Cari berita"
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chips}>
        {(['Semua', ...newsCategories] as Filter[]).map((category) => {
          const active = category === filter;
          return (
            <Pressable
              key={category}
              onPress={() => setFilter(category)}
              style={[styles.chip, active && styles.chipActive]}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}>
              <Text style={[styles.chipText, active && styles.chipTextActive]}>{category}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {featured && (
        <Pressable
          onPress={() => router.push({ pathname: '/berita/[id]', params: { id: featured.id } })}
          style={({ pressed }) => [styles.featured, pressed && styles.pressed]}
          accessibilityRole="button"
          accessibilityLabel={`${featured.title}, ${formatDate(featured.date)}`}>
          <View style={styles.featuredImage}>
            <SymbolView name={categoryIcon[featured.category]} size={32} tintColor={Brand.primary} />
          </View>
          <View style={styles.featuredBody}>
            <Text style={styles.meta}>
              Terbaru · {featured.category} · {formatDate(featured.date)}
            </Text>
            <Text style={styles.featuredTitle}>{featured.title}</Text>
            <Text style={styles.summary} numberOfLines={3}>
              {featured.summary}
            </Text>
          </View>
        </Pressable>
      )}

      {shown.length === 0 && (
        <View style={styles.emptyWrap}>
          <EmptyNote
            title="Tidak ada berita yang cocok"
            body="Coba kata kunci lain atau pilih kategori Semua."
          />
        </View>
      )}

      {groupByMonth(rest.filter((item): item is NewsArticle => item !== undefined)).map((group) => (
        <Reanimated.View key={group.month} layout={Motion.layout} entering={Motion.enter} exiting={Motion.exit}>
          <Text style={styles.month} accessibilityRole="header">
            {group.month}
          </Text>
          <View style={styles.card}>
            {group.items.map((item, i) => (
              <Pressable
                key={item.id}
                onPress={() => router.push({ pathname: '/berita/[id]', params: { id: item.id } })}
                style={({ pressed }) => [
                  styles.row,
                  i < group.items.length - 1 && styles.rowBorder,
                  pressed && styles.pressed,
                ]}
                accessibilityRole="button"
                accessibilityLabel={`${item.title}, ${formatDate(item.date)}`}>
                <NewsThumb category={item.category} />
                <View style={styles.rowText}>
                  <Text style={styles.title} numberOfLines={3}>
                    {item.title}
                  </Text>
                  <Text style={styles.meta}>
                    {item.place} · {formatDate(item.date)}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        </Reanimated.View>
      ))}

      {shown.length > 0 && (
        <Text style={styles.end}>Semua berita sudah ditampilkan</Text>
      )}
    </TabPage>
  );
}

const styles = StyleSheet.create({
  search: {
    ...PillInput,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two + 2,
    marginHorizontal: Gutter,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: Brand.text,
  },
  chips: {
    gap: Spacing.two,
    paddingHorizontal: Gutter,
    paddingTop: Spacing.three - 4,
    paddingBottom: Spacing.two,
  },
  chip: {
    paddingHorizontal: Spacing.three - 2,
    height: 36,
    justifyContent: 'center',
    borderRadius: Radius.full,
    backgroundColor: Brand.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Brand.border,
  },
  chipActive: {
    backgroundColor: Brand.primary,
    borderColor: Brand.primary,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
    color: Brand.text,
  },
  chipTextActive: {
    color: Brand.textOnPrimary,
  },
  featured: {
    marginHorizontal: Gutter,
    marginTop: Spacing.two,
    ...Card,
    overflow: 'hidden',
  },
  featuredImage: {
    height: 148,
    backgroundColor: Brand.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featuredBody: {
    padding: Spacing.three,
    gap: Spacing.one + 2,
  },
  featuredTitle: {
    fontSize: 19,
    lineHeight: 25,
    fontWeight: '700',
    letterSpacing: -0.3,
    color: Brand.text,
  },
  summary: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    color: Brand.textSecondary,
  },
  pressed: {
    opacity: 0.7,
  },
  emptyWrap: {
    marginTop: Spacing.three,
  },
  month: {
    fontSize: 15,
    fontWeight: '700',
    color: Brand.text,
    marginHorizontal: Gutter,
    marginTop: Spacing.four,
    marginBottom: Spacing.two,
  },
  card: {
    marginHorizontal: Gutter,
    paddingHorizontal: Spacing.three,
    ...Card,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three - 4,
    paddingVertical: Spacing.three - 2,
  },
  rowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Brand.border,
  },
  rowText: {
    flex: 1,
    gap: Spacing.one,
  },
  title: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '700',
    color: Brand.text,
  },
  meta: {
    fontSize: 12,
    fontWeight: '500',
    color: Brand.textSecondary,
  },
  end: {
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '500',
    color: Brand.textSecondary,
    marginTop: Spacing.four,
  },
});
