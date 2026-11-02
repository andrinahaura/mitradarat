import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { panelStyle } from '@/components/home/section';
import { Brand, Gutter, Spacing, Type } from '@/constants/theme';
import type { City } from '@/data/cities';
import type { Operator } from '@/data/transit';

type CityBusCardProps = {
  city: City;
  operators: Operator[];
  onPressOperator: (operator: Operator) => void;
};

/**
 * Takes the place of the live route card when the chosen city has no bus the
 * person is riding or has saved: the city's operators, one tap from their routes.
 */
export function CityBusCard({ city, operators, onPressOperator }: CityBusCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Bus kota di {city.name}</Text>
        <Text style={styles.subtitle}>Pilih operator untuk melihat rute dan posisi bus.</Text>
      </View>
      {operators.map((operator) => (
        <Pressable
          key={operator.id}
          onPress={() => onPressOperator(operator)}
          style={({ pressed }) => [styles.row, pressed && styles.pressed]}
          accessibilityRole="button"
          accessibilityLabel={`${operator.name}${operator.routeCount ? `, ${operator.routeCount} rute` : ''}`}>
          <View style={styles.rowText}>
            <Text style={styles.operator}>{operator.name}</Text>
            {operator.routeCount ? <Text style={styles.meta}>{operator.routeCount} rute</Text> : null}
          </View>
          <SymbolView
            name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
            size={13}
            weight="semibold"
            tintColor={Brand.textMuted}
          />
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    ...panelStyle,
    marginHorizontal: Gutter - Spacing.one,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.one,
  },
  header: {
    gap: 2,
    paddingBottom: Spacing.two,
  },
  title: {
    ...Type.headline,
    color: Brand.text,
  },
  subtitle: {
    ...Type.bodySmall,
    color: Brand.textSecondary,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    paddingVertical: Spacing.three - 4,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Brand.border,
  },
  rowText: {
    flex: 1,
    gap: 2,
  },
  operator: {
    ...Type.label,
    fontSize: 15,
    color: Brand.text,
  },
  meta: {
    ...Type.caption,
    color: Brand.textSecondary,
  },
  pressed: {
    opacity: 0.6,
  },
});
