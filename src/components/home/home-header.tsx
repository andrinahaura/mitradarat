import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HeaderIconButton, ON_BLUE_MUTED } from '@/components/tab-header';
import { Brand, Gutter, Radius, Spacing, Type } from '@/constants/theme';

type HomeHeaderProps = {
  /** Null when signed out. */
  name: string | null;
  city: string;
  unreadCount: number;
  onPressCity: () => void;
  onPressInbox: () => void;
  onPressAvatar: () => void;
};

/**
 * Fixed blue header of Beranda (like Livin' by Mandiri): avatar, name and city on
 * the left, inbox on the right. Content scrolls under it.
 */
export function HomeHeader({
  name,
  city,
  unreadCount,
  onPressCity,
  onPressInbox,
  onPressAvatar,
}: HomeHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, { paddingTop: insets.top + Spacing.two }]}>
      <Pressable
        onPress={onPressAvatar}
        style={({ pressed }) => [styles.avatar, pressed && styles.pressed]}
        accessibilityRole="button"
        accessibilityLabel={name ? `Akun ${name}` : 'Masuk ke akun'}>
        {name ? (
          <Text style={styles.avatarText}>{name.charAt(0)}</Text>
        ) : (
          <SymbolView
            name={{ ios: 'person', android: 'person', web: 'person' }}
            size={20}
            tintColor={Brand.primary}
          />
        )}
      </Pressable>

      <View style={styles.text}>
        <Text style={styles.name} numberOfLines={1} accessibilityRole="header">
          {name ?? 'Selamat datang'}
        </Text>
        <Pressable
          onPress={onPressCity}
          hitSlop={6}
          style={({ pressed }) => [styles.city, pressed && styles.pressed]}
          accessibilityRole="button"
          accessibilityLabel={`Kota ${city}. Ketuk untuk mengganti`}>
          <SymbolView
            name={{ ios: 'location', android: 'near_me', web: 'near_me' }}
            size={13}
            tintColor={ON_BLUE_MUTED}
          />
          <Text style={styles.cityName}>{city}</Text>
          <SymbolView
            name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
            size={11}
            weight="semibold"
            tintColor={ON_BLUE_MUTED}
          />
        </Pressable>
      </View>

      <HeaderIconButton
        icon={{ ios: 'bell', android: 'notifications', web: 'notifications' }}
        label={`Kotak masuk, ${unreadCount} belum dibaca`}
        dot={unreadCount > 0}
        onPress={onPressInbox}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three - 4,
    paddingHorizontal: Gutter,
    paddingBottom: Spacing.three,
    backgroundColor: Brand.primary,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: Radius.full,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    backgroundColor: Brand.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 19,
    fontWeight: '700',
    color: Brand.primary,
  },
  text: {
    flex: 1,
    gap: 2,
  },
  name: {
    ...Type.headline,
    color: Brand.textOnPrimary,
  },
  city: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  cityName: {
    ...Type.labelSmall,
    color: ON_BLUE_MUTED,
  },
  pressed: {
    opacity: 0.6,
  },
});
