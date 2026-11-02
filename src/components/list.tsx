import { SymbolView } from 'expo-symbols';
import { Children, type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Brand, Card, Gutter, Spacing } from '@/constants/theme';

export function SectionTitle({ children }: { children: string }) {
  return (
    <Text style={styles.sectionTitle} accessibilityRole="header">
      {children}
    </Text>
  );
}

/** White card that draws a hairline between its rows. */
export function ListCard({ children }: { children: ReactNode }) {
  const rows = Children.toArray(children);
  return (
    <View style={styles.card}>
      {rows.map((row, i) => (
        <View key={i} style={i < rows.length - 1 && styles.rowBorder}>
          {row}
        </View>
      ))}
    </View>
  );
}

type ListRowProps = {
  leading?: ReactNode;
  title: string;
  subtitle?: string;
  trailing?: ReactNode;
  onPress?: () => void;
  accessibilityLabel?: string;
};

export function ListRow({ leading, title, subtitle, trailing, onPress, accessibilityLabel }: ListRowProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={accessibilityLabel ?? title}>
      {leading}
      <View style={styles.text}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      {trailing ??
        (onPress && (
          <SymbolView
            name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
            size={14}
            weight="semibold"
            tintColor={Brand.textSecondary}
          />
        ))}
    </Pressable>
  );
}

export function EmptyNote({ title, body }: { title: string; body: string }) {
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyBody}>{body}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600',
    color: Brand.text,
    marginHorizontal: Gutter,
    marginTop: Spacing.three,
    marginBottom: Spacing.two,
  },
  card: {
    marginHorizontal: Gutter,
    paddingHorizontal: Spacing.three,
    ...Card,
  },
  rowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Brand.border,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three - 4,
    paddingVertical: Spacing.three - 4,
    minHeight: 56,
  },
  pressed: {
    opacity: 0.6,
  },
  text: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: Brand.text,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '400',
    color: Brand.textSecondary,
  },
  empty: {
    marginHorizontal: Gutter,
    padding: Spacing.three,
    ...Card,
    gap: Spacing.one,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Brand.text,
  },
  emptyBody: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    color: Brand.textSecondary,
  },
});
