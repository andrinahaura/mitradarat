import { router, Stack, useLocalSearchParams } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';

import { EmptyNote } from '@/components/list';
import { NewsThumb } from '@/components/news/news-thumb';
import { Brand, Card, Gutter, Radius, Spacing } from '@/constants/theme';
import { categoryIcon, formatDate, getArticle, news } from '@/data/news';

const RELATED_COUNT = 3;

export default function ArticleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const article = getArticle(id);

  if (!article) {
    return (
      <View style={styles.missing}>
        <EmptyNote title="Berita tidak ditemukan" body="Berita ini mungkin sudah dihapus. Kembali ke daftar berita." />
      </View>
    );
  }

  const related = news
    .filter((item) => item.id !== article.id && item.category === article.category)
    .slice(0, RELATED_COUNT);

  const share = () => Share.share({ message: `${article.title} — MitraDarat` });

  return (
    <ScrollView
      style={styles.screen}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.content}>
      <Stack.Screen
        options={{
          headerRight: () => (
            <Pressable onPress={share} hitSlop={8} accessibilityRole="button" accessibilityLabel="Bagikan berita">
              <SymbolView
                name={{ ios: 'square.and.arrow.up', android: 'share', web: 'share' }}
                size={20}
                tintColor={Brand.text}
              />
            </Pressable>
          ),
        }}
      />

      <View style={styles.hero}>
        <SymbolView name={categoryIcon[article.category]} size={36} tintColor={Brand.primary} />
      </View>

      <View style={styles.body}>
        <View style={styles.categoryChip}>
          <Text style={styles.categoryText}>{article.category}</Text>
        </View>
        <Text style={styles.title} accessibilityRole="header">
          {article.title}
        </Text>
        <Text style={styles.meta}>
          {article.place} · {formatDate(article.date)} · {article.author}
        </Text>

        <Text style={styles.lead}>{article.summary}</Text>
        {article.body.map((paragraph, i) => (
          <Text key={i} style={styles.paragraph}>
            {paragraph}
          </Text>
        ))}
      </View>

      {related.length > 0 && (
        <View>
          <Text style={styles.relatedTitle} accessibilityRole="header">
            Berita terkait
          </Text>
          <View style={styles.card}>
            {related.map((item, i) => (
              <Pressable
                key={item.id}
                onPress={() => router.push({ pathname: '/berita/[id]', params: { id: item.id } })}
                style={({ pressed }) => [
                  styles.row,
                  i < related.length - 1 && styles.rowBorder,
                  pressed && styles.pressed,
                ]}
                accessibilityRole="button"
                accessibilityLabel={`${item.title}, ${formatDate(item.date)}`}>
                <NewsThumb category={item.category} />
                <View style={styles.rowText}>
                  <Text style={styles.rowTitle} numberOfLines={2}>
                    {item.title}
                  </Text>
                  <Text style={styles.rowMeta}>{formatDate(item.date)}</Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>
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
    paddingBottom: Spacing.six + Spacing.five,
  },
  missing: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: Brand.background,
  },
  hero: {
    height: 200,
    backgroundColor: Brand.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    padding: Spacing.three,
    gap: Spacing.three - 4,
    backgroundColor: Brand.surface,
  },
  categoryChip: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.two + 2,
    paddingVertical: Spacing.one,
    borderRadius: Radius.small,
    backgroundColor: Brand.primarySoft,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '700',
    color: Brand.primary,
  },
  title: {
    fontSize: 24,
    lineHeight: 31,
    fontWeight: '700',
    color: Brand.text,
  },
  meta: {
    fontSize: 13,
    fontWeight: '500',
    color: Brand.textSecondary,
  },
  lead: {
    marginTop: Spacing.two,
    fontSize: 17,
    lineHeight: 26,
    fontWeight: '700',
    letterSpacing: -0.3,
    color: Brand.text,
  },
  paragraph: {
    fontSize: 17,
    fontWeight: '500',
    lineHeight: 27,
    color: Brand.text,
  },
  relatedTitle: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.3,
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
    paddingVertical: Spacing.three - 4,
  },
  rowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Brand.border,
  },
  rowText: {
    flex: 1,
    gap: 2,
  },
  rowTitle: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '700',
    color: Brand.text,
  },
  rowMeta: {
    fontSize: 12,
    fontWeight: '500',
    color: Brand.textSecondary,
  },
  pressed: {
    opacity: 0.6,
  },
});
