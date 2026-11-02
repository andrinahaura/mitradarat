import { Pressable, StyleSheet, Text, View } from 'react-native';

import { NewsThumb } from '@/components/news/news-thumb';
import { Brand, Spacing } from '@/constants/theme';
import { formatDate, type NewsArticle } from '@/data/news';

type NewsListProps = {
  items: NewsArticle[];
  onPressItem: (item: NewsArticle) => void;
};

export function NewsList({ items, onPressItem }: NewsListProps) {
  return (
    <View style={styles.card}>
      {items.map((item, i) => (
        <Pressable
          key={item.id}
          onPress={() => onPressItem(item)}
          style={({ pressed }) => [
            styles.row,
            i < items.length - 1 && styles.rowBorder,
            pressed && styles.pressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel={`${item.title}, ${formatDate(item.date)}`}>
          <NewsThumb category={item.category} />
          <View style={styles.text}>
            <Text style={styles.title} numberOfLines={2}>
              {item.title}
            </Text>
            <Text style={styles.meta}>
              {item.place} · {formatDate(item.date)}
            </Text>
          </View>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: Spacing.three,
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
  pressed: {
    opacity: 0.6,
  },
  text: {
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
});
