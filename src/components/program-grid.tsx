import { Pressable, StyleSheet, Text, View } from 'react-native';

import { IconTile } from '@/components/icon-tile';
import { Brand, Card, Gutter, Spacing, Type } from '@/constants/theme';
import type { SymbolName } from '@/data/home';

export type GridItem = {
  id: string;
  label: string;
  icon: SymbolName;
};

type ProgramGridProps = {
  items: GridItem[];
  onPressItem: (id: string) => void;
};

const COLUMNS = 4;

/** Four-column icon grid on a white card; used for the bus programs in Lacak. */
export function ProgramGrid({ items, onPressItem }: ProgramGridProps) {
  return (
    <View style={styles.card}>
      {items.map((item) => (
        <Pressable
          key={item.id}
          onPress={() => onPressItem(item.id)}
          style={({ pressed }) => [styles.item, pressed && styles.pressed]}
          accessibilityRole="button"
          accessibilityLabel={item.label}>
          <IconTile icon={item.icon} size="large" tone="neutral" />
          <Text style={styles.label} numberOfLines={2}>
            {item.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: Gutter,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.one,
    rowGap: Spacing.three,
    ...Card,
  },
  item: {
    width: `${100 / COLUMNS}%`,
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.one,
  },
  pressed: {
    opacity: 0.6,
  },
  label: {
    ...Type.labelSmall,
    color: Brand.text,
    textAlign: 'center',
  },
});
