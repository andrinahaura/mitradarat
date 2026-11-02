import { SymbolView } from 'expo-symbols';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { IconTile } from '@/components/icon-tile';
import { Brand, Spacing } from '@/constants/theme';
import type { SymbolName } from '@/data/home';

type HelpItem = {
  id: string;
  title: string;
  subtitle: string;
  icon: SymbolName;
};

const items: HelpItem[] = [
  {
    id: 'faq',
    title: 'Pertanyaan umum',
    subtitle: 'Jawaban seputar pelacakan bus, Cek Laik, dan mudik',
    icon: { ios: 'questionmark.circle', android: 'help', web: 'help' },
  },
  {
    id: 'cs',
    title: 'Hubungi layanan pelanggan',
    subtitle: 'Telepon, WhatsApp, atau email',
    icon: { ios: 'headphones', android: 'support_agent', web: 'support_agent' },
  },
  {
    id: 'sosmed',
    title: 'Media sosial resmi',
    subtitle: 'Akun resmi Ditjen Perhubungan Darat',
    icon: { ios: 'at', android: 'alternate_email', web: 'alternate_email' },
  },
];

type HelpCardProps = {
  onPressItem: (id: string) => void;
};

export function HelpCard({ onPressItem }: HelpCardProps) {
  return (
    <View style={styles.card}>
      {items.map((item, i) => (
        <Pressable
          key={item.id}
          onPress={() => onPressItem(item.id)}
          style={({ pressed }) => [
            styles.row,
            i < items.length - 1 && styles.rowBorder,
            pressed && styles.pressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel={item.title}>
          <IconTile icon={item.icon} />
          <View style={styles.text}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
          </View>
          <SymbolView
            name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
            size={14}
            weight="semibold"
            tintColor={Brand.textSecondary}
          />
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: Spacing.three,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three - 4,
    paddingVertical: Spacing.three - 2,
  },
  rowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Brand.border,
  },
  pressed: {
    opacity: 0.6,
  },
  text: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: Brand.text,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '500',
    color: Brand.textSecondary,
  },
});
