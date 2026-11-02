import { SymbolView } from 'expo-symbols';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Brand, Gutter, Radius, Spacing } from '@/constants/theme';

export type DocumentSection = {
  heading: string;
  paragraphs: string[];
};

type DocumentPageProps = {
  intro: string;
  sections: DocumentSection[];
  /** Shown as a notice at the top while the official text is not in yet. */
  draftNotice?: string;
};

/** Native page for long texts that v1 showed as web pages (screenshots 66–71). */
export function DocumentPage({ intro, sections, draftNotice }: DocumentPageProps) {
  return (
    <ScrollView
      style={styles.screen}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.content}>
      {draftNotice && (
        <View style={styles.notice}>
          <SymbolView
            name={{ ios: 'info.circle', android: 'info', web: 'info' }}
            size={16}
            tintColor="#A16207"
          />
          <Text style={styles.noticeText}>{draftNotice}</Text>
        </View>
      )}

      <Text style={styles.intro}>{intro}</Text>

      {sections.map((section) => (
        <View key={section.heading} style={styles.section}>
          <Text style={styles.heading} accessibilityRole="header">
            {section.heading}
          </Text>
          {section.paragraphs.map((paragraph, i) => (
            <Text key={i} style={styles.paragraph}>
              {paragraph}
            </Text>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Brand.surface,
  },
  content: {
    paddingHorizontal: Gutter,
    paddingVertical: Spacing.three,
    paddingBottom: Spacing.six + Spacing.five,
    gap: Spacing.three,
  },
  notice: {
    flexDirection: 'row',
    gap: Spacing.two,
    padding: Spacing.three - 4,
    borderRadius: Radius.medium,
    backgroundColor: Brand.accentSoft,
  },
  noticeText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
    color: '#713F12',
  },
  intro: {
    fontSize: 17,
    lineHeight: 26,
    fontWeight: '700',
    letterSpacing: -0.3,
    color: Brand.text,
  },
  section: {
    gap: Spacing.two,
  },
  heading: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
    color: Brand.text,
  },
  paragraph: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 25,
    color: Brand.text,
  },
});
