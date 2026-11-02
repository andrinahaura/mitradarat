import { SymbolView } from 'expo-symbols';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Brand, Gutter, Radius, Spacing, Type } from '@/constants/theme';
import type { SymbolName } from '@/data/home';

type SectionProps = {
  title: string;
  icon?: SymbolName;
  actionLabel?: string;
  onAction?: () => void;
  children: ReactNode;
};

/** Beranda panel (reference 4): white, borderless, its title inside with an optional icon. */
export function Section({ title, icon, actionLabel, onAction, children }: SectionProps) {
  return (
    <View style={styles.panel}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          {icon && <SymbolView name={icon} size={18} tintColor={Brand.primary} />}
          <Text style={styles.title} accessibilityRole="header">
            {title}
          </Text>
        </View>
        {actionLabel && (
          <Pressable onPress={onAction} hitSlop={8} style={({ pressed }) => pressed && styles.pressed}>
            <Text style={styles.action}>{actionLabel}</Text>
          </Pressable>
        )}
      </View>
      {children}
    </View>
  );
}

/** Same white panel without a title, for cards that bring their own heading. */
export const panelStyle = {
  backgroundColor: Brand.surface,
  borderRadius: Radius.panel,
  boxShadow: '0 2px 12px rgba(16, 24, 40, 0.06)',
} as const;

const styles = StyleSheet.create({
  panel: {
    ...panelStyle,
    marginHorizontal: Gutter - Spacing.one,
    paddingTop: Spacing.three,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.three,
    marginBottom: Spacing.one,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  title: {
    ...Type.headlineSmall,
    color: Brand.text,
  },
  action: {
    ...Type.label,
    color: Brand.primary,
  },
  pressed: {
    opacity: 0.6,
  },
});
