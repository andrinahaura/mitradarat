import { SymbolView } from 'expo-symbols';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { IconTile } from '@/components/icon-tile';
import { ListCard, ListRow } from '@/components/list';
import { Brand, Gutter, Radius, Spacing, Type } from '@/constants/theme';
import type { ContactChannel } from '@/data/help';

type ChannelListScreenProps = {
  intro: string;
  channels: ContactChannel[];
  footer?: string;
};

/**
 * Hubungi CS and Media sosial share this layout. Rows are not tappable yet: the
 * official numbers and accounts still have to come from Ditjen Hubdat.
 */
export function ChannelListScreen({ intro, channels, footer }: ChannelListScreenProps) {
  return (
    <ScrollView
      style={styles.screen}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.content}>
      <View style={styles.notice}>
        <SymbolView
          name={{ ios: 'info.circle', android: 'info', web: 'info' }}
          size={16}
          tintColor="#A16207"
        />
        <Text style={styles.noticeText}>
          Kanal resmi belum diisi di prototipe. Nomor dan akun akan diambil dari data resmi Ditjen
          Perhubungan Darat.
        </Text>
      </View>

      <Text style={styles.intro}>{intro}</Text>

      <ListCard>
        {channels.map((channel) => (
          <ListRow
            key={channel.id}
            leading={<IconTile icon={channel.icon} />}
            title={channel.title}
            subtitle={channel.description}
            trailing={<Text style={styles.soon}>Segera</Text>}
          />
        ))}
      </ListCard>

      {footer && <Text style={styles.footer}>{footer}</Text>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Brand.background,
  },
  content: {
    paddingVertical: Spacing.three,
    paddingBottom: Spacing.six + Spacing.five,
    gap: Spacing.three,
  },
  notice: {
    flexDirection: 'row',
    gap: Spacing.two,
    marginHorizontal: Gutter,
    padding: Spacing.three - 4,
    borderRadius: Radius.large,
    backgroundColor: Brand.accentSoft,
  },
  noticeText: {
    ...Type.bodySmall,
    flex: 1,
    color: '#713F12',
  },
  intro: {
    ...Type.body,
    fontSize: 15,
    lineHeight: 22,
    color: Brand.text,
    marginHorizontal: Gutter,
  },
  soon: {
    ...Type.caption,
    color: Brand.textSecondary,
  },
  footer: {
    ...Type.bodySmall,
    color: Brand.textSecondary,
    marginHorizontal: Gutter,
  },
});
