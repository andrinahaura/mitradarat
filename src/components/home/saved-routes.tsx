import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import { CorridorBadge } from '@/components/corridor-badge';
import { Brand, Radius, Spacing, Type } from '@/constants/theme';
import type { SavedRoute } from '@/data/home';

type SavedRoutesProps = {
  routes: SavedRoute[];
  onPressRoute: (route: SavedRoute) => void;
};

export function SavedRoutes({ routes, onPressRoute }: SavedRoutesProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.content}>
      {routes.map((route) => (
        <Pressable
          key={route.id}
          onPress={() => onPressRoute(route)}
          style={({ pressed }) => [styles.card, pressed && styles.pressed]}
          accessibilityRole="button"
          accessibilityLabel={`${route.operator} koridor ${route.corridor}, ${route.route}`}>
          <CorridorBadge code={route.corridor} color={route.corridorColor} />
          <Text style={styles.route} numberOfLines={2}>
            {route.route}
          </Text>
          <Text style={styles.operator} numberOfLines={1}>
            {route.operator}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.three,
    gap: Spacing.two,
  },
  card: {
    width: 152,
    borderRadius: Radius.inner,
    backgroundColor: Brand.background,
    padding: Spacing.three - 2,
    gap: Spacing.one,
    alignItems: 'flex-start',
  },
  pressed: {
    opacity: 0.7,
  },
  route: {
    ...Type.label,
    marginTop: Spacing.two,
    color: Brand.text,
  },
  operator: {
    ...Type.caption,
    color: Brand.textSecondary,
  },
});
