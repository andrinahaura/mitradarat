import { StyleSheet, Text, View } from 'react-native';

import { Radius } from '@/constants/theme';

type CorridorBadgeProps = {
  code: string;
  color: string;
  size?: 'small' | 'large';
};

/** Colored route code. The code text is always shown so routes are not told apart by color alone. */
export function CorridorBadge({ code, color, size = 'small' }: CorridorBadgeProps) {
  const large = size === 'large';
  return (
    <View
      style={[styles.badge, large && styles.badgeLarge, { backgroundColor: color }]}
      accessibilityLabel={`Koridor ${code}`}>
      <Text style={[styles.text, large && styles.textLarge]}>{code}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    minWidth: 28,
    height: 28,
    paddingHorizontal: 6,
    borderRadius: Radius.small,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeLarge: {
    minWidth: 40,
    height: 40,
    borderRadius: Radius.medium,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  textLarge: {
    fontSize: 17,
    fontWeight: '500',
  },
});
