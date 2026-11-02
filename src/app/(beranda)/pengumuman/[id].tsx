import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { EmptyNote } from '@/components/list';
import { Brand, Card, Gutter, PrimaryButton, Radius, Spacing, Type } from '@/constants/theme';
import { getAnnouncement } from '@/data/home';

/**
 * Detail of one announcement. The v1 banners (screenshots 02–04) were images that
 * did not open; here each one has its full text, a checklist and the next step.
 */
export default function AnnouncementScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const item = getAnnouncement(id);

  if (!item) {
    return (
      <View style={styles.missing}>
        <EmptyNote title="Pengumuman tidak ditemukan" body="Kembali ke Beranda untuk melihat pengumuman lain." />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.screen}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.content}>
      <Text style={styles.meta}>
        {item.category} · {item.postedAt}
      </Text>
      <Text style={styles.title} accessibilityRole="header">
        {item.title}
      </Text>

      <View style={styles.body}>
        {item.paragraphs.map((paragraph, i) => (
          <Text key={i} style={styles.paragraph}>
            {paragraph}
          </Text>
        ))}
      </View>

      {item.steps && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Yang perlu kamu lakukan</Text>
          {item.steps.map((step, i) => (
            <View key={step} style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{i + 1}</Text>
              </View>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </View>
      )}

      {item.action && (
        <Pressable
          onPress={() => router.navigate(item.action!.href)}
          style={({ pressed }) => [styles.button, pressed && styles.pressed]}
          accessibilityRole="button">
          <Text style={styles.buttonText}>{item.action.label}</Text>
        </Pressable>
      )}
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
    paddingBottom: Spacing.six + Spacing.five,
    gap: Spacing.three,
  },
  missing: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: Brand.background,
  },
  meta: {
    ...Type.label,
    color: Brand.primary,
  },
  title: {
    ...Type.headlineLarge,
    color: Brand.text,
    marginTop: -Spacing.two,
  },
  body: {
    gap: Spacing.two,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
    color: Brand.text,
  },
  card: {
    ...Card,
    padding: Spacing.three,
    gap: Spacing.three - 4,
  },
  cardTitle: {
    ...Type.headlineSmall,
    color: Brand.text,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.three - 4,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: Radius.small,
    backgroundColor: Brand.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    ...Type.labelSmall,
    color: Brand.primary,
  },
  stepText: {
    ...Type.body,
    flex: 1,
    color: Brand.text,
  },
  button: {
    ...PrimaryButton,
  },
  buttonText: {
    ...Type.label,
    fontSize: 16,
    color: Brand.textOnPrimary,
  },
  pressed: {
    opacity: 0.7,
  },
});
