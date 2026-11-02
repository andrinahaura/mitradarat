import { router, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { IconTile } from '@/components/icon-tile';
import { EmptyNote } from '@/components/list';
import { Brand, Card, Gutter, PrimaryButton, Spacing, Type } from '@/constants/theme';
import { categoryIcon, getInboxItem, markRead, useInbox } from '@/data/inbox';

/**
 * Detail of one inbox item. In v1 a notification could not be opened at all
 * (screenshot 12); here a route change lists the skipped stops and links to the route.
 */
export default function InboxItemScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  // Subscribing keeps the screen in sync with the read state.
  useInbox();
  const item = getInboxItem(id);

  useEffect(() => {
    markRead(id);
  }, [id]);

  if (!item) {
    return (
      <View style={styles.missing}>
        <EmptyNote title="Pesan tidak ditemukan" body="Kembali ke Kotak Masuk untuk melihat pesan lain." />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.screen}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <IconTile icon={categoryIcon[item.category]} />
        <View style={styles.headerText}>
          <Text style={styles.category}>{item.category}</Text>
          <Text style={styles.time}>{item.sentAt}</Text>
        </View>
      </View>

      <Text style={styles.title} accessibilityRole="header">
        {item.title}
      </Text>

      <View style={styles.body}>
        {item.body.map((paragraph, i) => (
          <Text key={i} style={styles.paragraph}>
            {paragraph}
          </Text>
        ))}
      </View>

      {(item.validity || item.skippedStops) && (
        <View style={styles.card}>
          {item.validity && (
            <View style={[styles.fact, item.skippedStops && styles.factBorder]}>
              <Text style={styles.factLabel}>Berlaku</Text>
              <Text style={styles.factValue}>{item.validity}</Text>
            </View>
          )}
          {item.skippedStops && (
            <View style={styles.stops}>
              <Text style={styles.factLabel}>
                Halte yang tidak dilalui ({item.skippedStops.length})
              </Text>
              {item.skippedStops.map((stop) => (
                <Text key={stop} style={styles.stop}>
                  {stop}
                </Text>
              ))}
            </View>
          )}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three - 4,
  },
  headerText: {
    gap: 2,
  },
  category: {
    ...Type.label,
    color: Brand.text,
  },
  time: {
    ...Type.caption,
    color: Brand.textSecondary,
  },
  title: {
    ...Type.headlineLarge,
    color: Brand.text,
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
    paddingHorizontal: Spacing.three,
  },
  fact: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.three,
    paddingVertical: Spacing.three - 4,
  },
  factBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Brand.border,
  },
  factLabel: {
    ...Type.bodySmall,
    color: Brand.textSecondary,
  },
  factValue: {
    ...Type.label,
    flexShrink: 1,
    color: Brand.text,
    textAlign: 'right',
  },
  stops: {
    gap: Spacing.one + 2,
    paddingVertical: Spacing.three - 4,
  },
  stop: {
    ...Type.body,
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
