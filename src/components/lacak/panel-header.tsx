import { SymbolView } from 'expo-symbols';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Brand, Gutter, IconButton, Spacing, Type } from '@/constants/theme';

type PanelHeaderProps = {
  title: string;
  subtitle?: string;
  leading?: ReactNode;
  saved?: boolean;
  /** Omit when the screen has its own back button, as Lacak does on the map. */
  onBack?: () => void;
  onToggleSave?: () => void;
};

export function PanelHeader({ title, subtitle, leading, saved, onBack, onToggleSave }: PanelHeaderProps) {
  return (
    <View style={styles.row}>
      {onBack && (
        <Pressable
          onPress={onBack}
          hitSlop={8}
          style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
          accessibilityRole="button"
          accessibilityLabel="Kembali">
          <SymbolView
            name={{ ios: 'chevron.left', android: 'arrow_back', web: 'arrow_back' }}
            size={16}
            weight="semibold"
            tintColor={Brand.text}
          />
        </Pressable>
      )}

      {leading}

      <View style={styles.text}>
        <Text style={styles.title} numberOfLines={2} accessibilityRole="header">
          {title}
        </Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>

      {onToggleSave && (
        <Pressable
          onPress={onToggleSave}
          hitSlop={8}
          style={({ pressed }) => [styles.iconButton, saved && styles.saved, pressed && styles.pressed]}
          accessibilityRole="button"
          accessibilityState={{ selected: saved }}
          accessibilityLabel={saved ? 'Hapus dari tersimpan' : 'Simpan'}>
          <SymbolView
            name={
              saved
                ? { ios: 'bookmark', android: 'bookmark', web: 'bookmark' }
                : { ios: 'bookmark', android: 'bookmark_border', web: 'bookmark_border' }
            }
            size={16}
            tintColor={saved ? Brand.textOnPrimary : Brand.primary}
          />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two + Spacing.one,
    paddingHorizontal: Gutter,
    paddingBottom: Spacing.two,
  },
  iconButton: {
    ...IconButton,
  },
  saved: {
    backgroundColor: Brand.primary,
  },
  pressed: {
    opacity: 0.6,
  },
  text: {
    flex: 1,
    gap: 2,
  },
  title: {
    ...Type.headline,
    color: Brand.text,
  },
  subtitle: {
    ...Type.bodySmall,
    color: Brand.textSecondary,
  },
});
