import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Brand, Card, Gutter, PrimaryButton, Radius, SecondaryButton, Spacing, Type } from '@/constants/theme';
import { easeScale, ratingLabels, useSubmittedSurvey } from '@/data/survey';

export default function SurveyThanksScreen() {
  const answers = useSubmittedSurvey();

  return (
    <ScrollView
      style={styles.screen}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <View style={styles.check}>
          <SymbolView
            name={{ ios: 'checkmark', android: 'check', web: 'check' }}
            size={26}
            weight="bold"
            tintColor="#FFFFFF"
          />
        </View>
        <Text style={styles.title} accessibilityRole="header">
          Terima kasih
        </Text>
        <Text style={styles.body}>
          Jawabanmu sudah terkirim dan dipakai untuk memperbaiki layanan MitraDarat.
        </Text>
      </View>

      {answers && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Jawabanmu</Text>
          <Fact label="Penilaian umum" value={`${answers.rating}/5 · ${ratingLabels[answers.rating - 1]}`} />
          <Fact
            label="Layanan yang dipakai"
            value={answers.services.length ? answers.services.join(', ') : 'Tidak dipilih'}
          />
          <Fact label="Kemudahan mencari info" value={easeScale[answers.ease - 1]} last={!answers.story} />
          {answers.story ? <Text style={styles.story}>“{answers.story}”</Text> : null}
        </View>
      )}

      <Pressable
        onPress={() => router.dismissTo('/layanan')}
        style={({ pressed }) => [styles.primary, pressed && styles.pressed]}
        accessibilityRole="button">
        <Text style={styles.primaryText}>Kembali ke Layanan</Text>
      </Pressable>
      <Pressable
        onPress={() => router.navigate('/akun/lapor')}
        style={({ pressed }) => [styles.secondary, pressed && styles.pressed]}
        accessibilityRole="button">
        <Text style={styles.secondaryText}>Ada masalah? Kirim laporan</Text>
      </Pressable>
    </ScrollView>
  );
}

function Fact({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <View style={[styles.fact, !last && styles.factBorder]}>
      <Text style={styles.factLabel}>{label}</Text>
      <Text style={styles.factValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Brand.background,
  },
  content: {
    paddingHorizontal: Gutter,
    paddingVertical: Spacing.four,
    paddingBottom: Spacing.six + Spacing.five,
    gap: Spacing.three,
  },
  hero: {
    alignItems: 'center',
    gap: Spacing.two,
  },
  check: {
    width: 60,
    height: 60,
    borderRadius: Radius.full,
    backgroundColor: Brand.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.one,
  },
  title: {
    ...Type.headlineLarge,
    color: Brand.text,
  },
  body: {
    ...Type.body,
    fontSize: 15,
    lineHeight: 22,
    color: Brand.textSecondary,
    textAlign: 'center',
    maxWidth: 300,
  },
  card: {
    ...Card,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.three,
  },
  cardTitle: {
    ...Type.headlineSmall,
    color: Brand.text,
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
  story: {
    ...Type.body,
    fontStyle: 'italic',
    color: Brand.text,
    paddingBottom: Spacing.three,
  },
  primary: {
    ...PrimaryButton,
  },
  primaryText: {
    ...Type.label,
    fontSize: 16,
    color: Brand.textOnPrimary,
  },
  secondary: {
    ...SecondaryButton,
  },
  secondaryText: {
    ...Type.label,
    fontSize: 15,
    color: Brand.primary,
  },
  pressed: {
    opacity: 0.7,
  },
});
