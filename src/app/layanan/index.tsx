import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import Reanimated from 'react-native-reanimated';

import { IconTile } from '@/components/icon-tile';
import { EmptyNote, ListCard, ListRow, SectionTitle } from '@/components/list';
import { TabPage } from '@/components/tab-header';
import { Motion } from '@/constants/motion';
import { Brand, Gutter, PillInput, Spacing } from '@/constants/theme';
import { type MenuItem, menuGroups } from '@/data/menu';

function openItem(item: MenuItem) {
  const { target } = item;
  if (target.kind === 'program') {
    router.navigate({
      pathname: '/lacak',
      params: { program: target.programId, t: String(Date.now()) },
    });
  } else if (target.kind === 'route') {
    router.navigate(target.href);
  }
}

export default function ServicesScreen() {
  const [filter, setFilter] = useState('');

  const q = filter.trim().toLowerCase();
  const groups = menuGroups
    .map((group) => ({
      ...group,
      items: q
        ? group.items.filter((item) => `${item.title} ${item.description}`.toLowerCase().includes(q))
        : group.items,
    }))
    .filter((group) => group.items.length > 0);

  return (
    <TabPage
      title="Layanan"
      subtitle="Semua menu MitraDarat di satu tempat"
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag">
      <View style={styles.filter}>
        <SymbolView
          name={{ ios: 'magnifyingglass', android: 'search', web: 'search' }}
          size={18}
          tintColor={Brand.textSecondary}
        />
        <TextInput
          value={filter}
          onChangeText={setFilter}
          placeholder="Cari layanan, misalnya Cek Laik"
          placeholderTextColor={Brand.textSecondary}
          style={styles.filterInput}
          autoCorrect={false}
          accessibilityLabel="Cari layanan"
        />
      </View>

      {groups.length === 0 && (
        <EmptyNote
          title={`Tidak ada layanan “${filter.trim()}”`}
          body="Coba kata lain, misalnya bus, peta, tiket, atau lapor."
        />
      )}

      {groups.map((group) => (
        <Reanimated.View key={group.id} layout={Motion.layout} entering={Motion.enter} exiting={Motion.exit}>
          <SectionTitle>{group.title}</SectionTitle>
          <ListCard>
            {group.items.map((item) => (
              <ListRow
                key={item.id}
                leading={
                  <IconTile icon={item.icon} />
                }
                title={item.title}
                subtitle={item.description}
                onPress={item.target.kind === 'soon' ? undefined : () => openItem(item)}
                trailing={
                  item.target.kind === 'soon' ? <Text style={styles.soon}>Segera</Text> : undefined
                }
              />
            ))}
          </ListCard>
        </Reanimated.View>
      ))}
    </TabPage>
  );
}

const styles = StyleSheet.create({
  filter: {
    ...PillInput,
    alignItems: 'center',
    flexDirection: 'row',
    gap: Spacing.two + 2,
    marginHorizontal: Gutter,
  },
  filterInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    fontWeight: '500',
    color: Brand.text,
  },
  soon: {
    fontSize: 12,
    fontWeight: '600',
    color: Brand.textSecondary,
  },
});
