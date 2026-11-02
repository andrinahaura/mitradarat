import { SymbolView } from 'expo-symbols';
import { StyleSheet, View } from 'react-native';

import { Brand, Radius } from '@/constants/theme';
import type { SymbolName } from '@/data/home';

const sizes = {
  /** Leading icon of a list row. */
  medium: { box: 40, icon: 20 },
  /** Icon of a grid tile. */
  large: { box: 48, icon: 22 },
} as const;

type IconTileProps = {
  icon: SymbolName;
  size?: keyof typeof sizes;
  /** `brand` is blue on a blue tint; `neutral` is ink on a slate tint (design.md category-tile). */
  tone?: 'brand' | 'neutral';
  /** Overrides the icon color, e.g. red for a destructive row. */
  color?: string;
};

/** The one icon container used across lists and grids, so every icon has the same size. */
export function IconTile({ icon, size = 'medium', tone = 'brand', color }: IconTileProps) {
  const { box, icon: iconSize } = sizes[size];
  return (
    <View
      style={[
        styles.tile,
        { width: box, height: box },
        tone === 'neutral' ? styles.neutral : styles.brand,
      ]}>
      <SymbolView
        name={icon}
        size={iconSize}
        tintColor={color ?? (tone === 'neutral' ? Brand.text : Brand.primary)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    borderRadius: Radius.medium,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brand: {
    backgroundColor: Brand.primarySoft,
  },
  neutral: {
    backgroundColor: Brand.neutralTint,
  },
});
