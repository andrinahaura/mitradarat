import { SymbolView } from 'expo-symbols';
import type { Ref } from 'react';
import { Pressable, StyleSheet, TextInput, type TextInputInstance, View } from 'react-native';

import { Brand, PillInput, Shadow, Spacing } from '@/constants/theme';

type SearchBarProps = {
  ref?: Ref<TextInputInstance>;
  value: string;
  onChangeText: (text: string) => void;
  onFocus: () => void;
};

export function SearchBar({ ref, value, onChangeText, onFocus }: SearchBarProps) {
  return (
    <View style={styles.bar}>
      <SymbolView
        name={{ ios: 'magnifyingglass', android: 'search', web: 'search' }}
        size={18}
        tintColor={Brand.textSecondary}
      />
      <TextInput
        ref={ref}
        value={value}
        onChangeText={onChangeText}
        onFocus={onFocus}
        placeholder="Cari halte, rute, atau kota"
        placeholderTextColor={Brand.textSecondary}
        style={styles.input}
        returnKeyType="search"
        autoCorrect={false}
        clearButtonMode="never"
        accessibilityLabel="Cari halte, rute, atau kota"
      />
      {value.length > 0 && (
        <Pressable
          onPress={() => onChangeText('')}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Hapus pencarian">
          <SymbolView
            name={{ ios: 'xmark.circle', android: 'cancel', web: 'cancel' }}
            size={18}
            tintColor={Brand.textSecondary}
          />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    ...PillInput,
    // Floats over the map, so it keeps a shadow for contrast.
    boxShadow: Shadow.softCard,
    alignItems: 'center',
    flexDirection: 'row',
    gap: Spacing.two + 2,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    fontWeight: '500',
    color: Brand.text,
  },
});
