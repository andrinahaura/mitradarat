import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { IconTile } from '@/components/icon-tile';
import { Brand, Radius, Spacing, Type } from '@/constants/theme';
import type { Service } from '@/data/home';

type ServiceGridProps = {
  services: Service[];
  onPressService: (service: Service) => void;
  onPressAll: () => void;
};

/**
 * Quick actions (reference 1, home): the main service as a wide blue action, the
 * rest as two-column tiles with a short hint, so each one says what it does.
 */
export function ServiceGrid({ services, onPressService, onPressAll }: ServiceGridProps) {
  const [main, ...rest] = services;

  return (
    <View style={styles.body}>
      {main && (
        <Pressable
          onPress={() => onPressService(main)}
          style={({ pressed }) => [styles.main, pressed && styles.mainPressed]}
          accessibilityRole="button"
          accessibilityLabel={`${main.label}. ${main.description}`}>
          <View style={styles.mainIcon}>
            <SymbolView name={main.icon} size={22} tintColor={Brand.textOnPrimary} />
          </View>
          <View style={styles.text}>
            <Text style={styles.mainLabel}>{main.label}</Text>
            <Text style={styles.mainDescription}>{main.description}</Text>
          </View>
          <SymbolView
            name={{ ios: 'arrow.right', android: 'arrow_forward', web: 'arrow_forward' }}
            size={16}
            weight="semibold"
            tintColor={Brand.textOnPrimary}
          />
        </Pressable>
      )}

      <View style={styles.grid}>
        {rest.map((service) => (
          <Tile
            key={service.id}
            icon={service.icon}
            label={service.label}
            description={service.description}
            onPress={() => onPressService(service)}
          />
        ))}
        <Tile
          icon={{ ios: 'square.grid.2x2', android: 'apps', web: 'apps' }}
          label="Semua layanan"
          description="Lihat daftar lengkap"
          onPress={onPressAll}
        />
      </View>
    </View>
  );
}

function Tile({
  icon,
  label,
  description,
  onPress,
}: {
  icon: Service['icon'];
  label: string;
  description: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.tile, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel={`${label}. ${description}`}>
      <IconTile icon={icon} />
      <View style={styles.tileText}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  body: {
    padding: Spacing.three,
    paddingTop: Spacing.two,
    gap: Spacing.two + 2,
  },
  main: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three - 4,
    padding: Spacing.three - 4,
    borderRadius: Radius.inner,
    backgroundColor: Brand.primary,
  },
  mainPressed: {
    backgroundColor: Brand.primaryPressed,
  },
  mainIcon: {
    width: 44,
    height: 44,
    borderRadius: Radius.control,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainLabel: {
    ...Type.headlineSmall,
    color: Brand.textOnPrimary,
  },
  mainDescription: {
    ...Type.bodySmall,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two + 2,
  },
  tile: {
    flexBasis: '47%',
    flexGrow: 1,
    gap: Spacing.two + 2,
    padding: Spacing.three - 4,
    borderRadius: Radius.inner,
    backgroundColor: Brand.background,
  },
  pressed: {
    opacity: 0.6,
  },
  text: {
    flex: 1,
    gap: 1,
  },
  tileText: {
    gap: 2,
  },
  label: {
    ...Type.label,
    color: Brand.text,
  },
  description: {
    ...Type.caption,
    color: Brand.textSecondary,
  },
});
