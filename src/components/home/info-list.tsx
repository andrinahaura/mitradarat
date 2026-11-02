import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Brand, Spacing, Type } from '@/constants/theme';
import type { Announcement } from '@/data/home';

type InfoListProps = {
  items: Announcement[];
  onPressItem: (item: Announcement) => void;
};

/**
 * Announcements as a plain list. No placeholder artwork: until real images exist,
 * a title and one line of text say more than a colored block.
 */
export function InfoList({ items, onPressItem }: InfoListProps) {
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
          accessibilityLabel={`${item.title}. ${item.body}`}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.body} numberOfLines={2}>
            {item.body}
          </Text>
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
    paddingVertical: Spacing.three - 2,
    gap: 2,
  },
  rowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Brand.border,
  },
  pressed: {
    opacity: 0.6,
  },
  title: {
    ...Type.headlineSmall,
    color: Brand.text,
  },
  body: {
    ...Type.body,
    color: Brand.textSecondary,
  },
});
