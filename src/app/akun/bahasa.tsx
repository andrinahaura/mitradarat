import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Brand, Card, Gutter, Spacing } from '@/constants/theme';
import { languages } from '@/data/account';

/** v1 sent people to iOS Settings for this (screenshot 72); v2 keeps the choice in the app. */
export default function LanguageScreen() {
  const [selected, setSelected] = useState('id');

  return (
    <ScrollView
      style={styles.screen}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.content}>
      <View style={styles.card} accessibilityRole="radiogroup">
        {languages.map((language, i) => {
          const active = language.id === selected;
          return (
            <Pressable
              key={language.id}
              onPress={() => setSelected(language.id)}
              style={({ pressed }) => [
                styles.row,
                i < languages.length - 1 && styles.rowBorder,
                pressed && styles.pressed,
              ]}
              accessibilityRole="radio"
              accessibilityState={{ checked: active }}>
              <View style={styles.text}>
                <Text style={styles.name}>{language.native}</Text>
                {language.native !== language.name && <Text style={styles.subtitle}>{language.name}</Text>}
              </View>
              {active && (
                <SymbolView
                  name={{ ios: 'checkmark', android: 'check', web: 'check' }}
                  size={16}
                  weight="bold"
                  tintColor={Brand.primary}
                />
              )}
            </Pressable>
          );
        })}
      </View>
      <Text style={styles.note}>
        Bahasa berlaku untuk menu dan tombol. Isi berita mengikuti bahasa aslinya.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Brand.background,
  },
  content: {
    paddingHorizontal: Gutter,
    paddingVertical: Spacing.three,
  },
  card: {
    paddingHorizontal: Spacing.three,
    ...Card,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 56,
    paddingVertical: Spacing.two,
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
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: Brand.text,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '500',
    color: Brand.textSecondary,
  },
  note: {
    marginTop: Spacing.two + Spacing.one,
    marginHorizontal: Spacing.one,
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
    color: Brand.textSecondary,
  },
});
