import { SymbolView } from 'expo-symbols';
import { StatusBar } from 'expo-status-bar';
import type { ReactNode } from 'react';
import { Pressable, ScrollView, type ScrollViewProps, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Brand, Gutter, IconButton, Radius, Spacing, Type } from '@/constants/theme';
import type { SymbolName } from '@/data/home';

/** Secondary text and icons on the blue header. */
export const ON_BLUE_MUTED = 'rgba(255, 255, 255, 0.75)';

/** How far the blue runs below the header; the first card sits half on it. */
const BLUE_RUN_IN = 56;

type TabHeaderProps = {
  /** `blue` is only for Beranda; the other tabs use the plain white header. */
  variant?: 'blue' | 'plain';
  /** Replaces the title, e.g. the city picker on Beranda. */
  left?: ReactNode;
  title?: string;
  subtitle?: string;
  right?: ReactNode;
};

/** Header of every tab root: blue on Beranda, plain white on Layanan, Berita and Akun. */
export function TabHeader({ variant = 'plain', left, title, subtitle, right }: TabHeaderProps) {
  const insets = useSafeAreaInsets();
  const plain = variant === 'plain';
  return (
    <View style={[styles.header, plain && styles.headerPlain, { paddingTop: insets.top + Spacing.two }]}>
      <View style={styles.left}>
        {left ?? (
          <>
            <Text style={[styles.title, plain && styles.titlePlain]} accessibilityRole="header">
              {title}
            </Text>
            {subtitle && <Text style={[styles.subtitle, plain && styles.subtitlePlain]}>{subtitle}</Text>}
          </>
        )}
      </View>
      {right}
    </View>
  );
}

/** Round translucent button for the blue header, with an optional unread dot. */
export function HeaderIconButton({
  icon,
  label,
  dot,
  onPress,
}: {
  icon: SymbolName;
  label: string;
  dot?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.iconButton, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel={label}>
      <SymbolView name={icon} size={20} tintColor={Brand.textOnPrimary} />
      {dot && <View style={styles.dot} />}
    </Pressable>
  );
}

type TabPageProps = TabHeaderProps &
  Omit<ScrollViewProps, 'style'> & {
    children: ReactNode;
  };

/**
 * A tab root with a fixed header. The blue variant (Beranda) adds a short blue band
 * that the content scrolls over; the plain variant is a white bar with a hairline.
 */
export function TabPage({
  variant = 'plain',
  left,
  title,
  subtitle,
  right,
  children,
  contentContainerStyle,
  ...scroll
}: TabPageProps) {
  const blue = variant === 'blue';
  return (
    <View style={styles.screen}>
      <StatusBar style={blue ? 'light' : 'dark'} />
      <TabHeader variant={variant} left={left} title={title} subtitle={subtitle} right={right} />
      <View style={styles.body}>
        {blue && <View style={styles.band} />}
        <ScrollView
          {...scroll}
          style={styles.body}
          contentInsetAdjustmentBehavior="never"
          contentContainerStyle={[styles.content, !blue && styles.contentPlain, contentContainerStyle]}>
          {children}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Brand.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    minHeight: 44,
    paddingHorizontal: Gutter,
    paddingBottom: Spacing.three,
    backgroundColor: Brand.primary,
    zIndex: 1,
  },
  headerPlain: {
    backgroundColor: Brand.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Brand.border,
  },
  left: {
    flex: 1,
    gap: 2,
  },
  title: {
    ...Type.headlineLarge,
    color: Brand.textOnPrimary,
  },
  titlePlain: {
    ...Type.display,
    color: Brand.text,
  },
  subtitle: {
    ...Type.bodySmall,
    color: ON_BLUE_MUTED,
  },
  subtitlePlain: {
    color: Brand.textSecondary,
  },
  iconButton: {
    ...IconButton,
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    borderColor: 'transparent',
  },
  dot: {
    position: 'absolute',
    top: 10,
    right: 11,
    width: 8,
    height: 8,
    borderRadius: Radius.full,
    backgroundColor: Brand.accent,
  },
  pressed: {
    opacity: 0.6,
  },
  body: {
    flex: 1,
  },
  band: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: BLUE_RUN_IN,
    backgroundColor: Brand.primary,
    borderBottomLeftRadius: Radius.card,
    borderBottomRightRadius: Radius.card,
  },
  content: {
    paddingTop: Spacing.one,
    paddingBottom: Spacing.six + Spacing.five,
  },
  contentPlain: {
    paddingTop: Spacing.three,
  },
});
