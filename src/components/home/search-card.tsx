import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { panelStyle } from '@/components/home/section';
import { Brand, Gutter, PrimaryButton, Radius, Spacing, Type } from '@/constants/theme';

type SearchCardProps = {
  onPress: () => void;
};

/**
 * First card on Beranda: one question, one field, one button. Both the field and
 * the button open the search in Lacak, where typing happens.
 */
export function SearchCard({ onPress }: SearchCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.text}>
        <View style={styles.titleRow}>
          <SymbolView
            name={{ ios: 'mappin.circle.fill', android: 'location_on', web: 'location_on' }}
            size={20}
            tintColor={Brand.danger}
          />
          <Text style={styles.title} accessibilityRole="header">
            Mau ke mana hari ini?
          </Text>
        </View>
        <Text style={styles.subtitle}>Cari halte atau rute, lalu lihat bus yang menuju ke sana.</Text>
      </View>

      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.field, pressed && styles.pressed]}
        accessibilityRole="search"
        accessibilityLabel="Cari halte, rute, atau kota">
        <SymbolView
          name={{ ios: 'magnifyingglass', android: 'search', web: 'search' }}
          size={18}
          tintColor={Brand.textSecondary}
        />
        <Text style={styles.placeholder}>Halte, rute, atau kota</Text>
      </Pressable>

      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.button, pressed && styles.pressed]}
        accessibilityRole="button">
        <Text style={styles.buttonText}>Cari</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    ...panelStyle,
    marginHorizontal: Gutter - Spacing.one,
    padding: Spacing.three,
    gap: Spacing.three - 4,
  },
  text: {
    gap: Spacing.one,
    marginBottom: Spacing.one,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  title: {
    ...Type.headline,
    color: Brand.text,
  },
  subtitle: {
    ...Type.bodySmall,
    color: Brand.textSecondary,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two + 2,
    height: 54,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.inner,
    backgroundColor: Brand.background,
  },
  placeholder: {
    ...Type.body,
    color: Brand.textSecondary,
  },
  button: {
    ...PrimaryButton,
    height: 52,
    borderRadius: Radius.inner,
  },
  buttonText: {
    ...Type.label,
    color: Brand.textOnPrimary,
  },
  pressed: {
    opacity: 0.7,
  },
});
