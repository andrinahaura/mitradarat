import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { Brand, Card, Gutter, PillInput, PrimaryButton, Radius, Spacing, Type } from '@/constants/theme';
import {
  easeScale,
  ratingLabels,
  STORY_MAX,
  submitSurvey,
  type SurveyService,
  surveyServices,
} from '@/data/survey';

/**
 * Survei Kepuasan. v1 opened a web page with its own look (screenshots 52–53);
 * v2 is one native form with four short questions.
 */
export default function SurveyScreen() {
  const [rating, setRating] = useState(0);
  const [services, setServices] = useState<SurveyService[]>([]);
  const [ease, setEase] = useState(0);
  const [story, setStory] = useState('');
  const [showErrors, setShowErrors] = useState(false);

  const missing = {
    rating: rating === 0,
    ease: ease === 0,
  };
  const valid = !missing.rating && !missing.ease;

  const toggleService = (service: SurveyService) =>
    setServices((current) =>
      current.includes(service) ? current.filter((s) => s !== service) : [...current, service],
    );

  const submit = () => {
    if (!valid) {
      setShowErrors(true);
      return;
    }
    submitSurvey({ rating, services, ease, story: story.trim() });
    router.replace('/layanan/survei-terima-kasih');
  };

  return (
    <ScrollView
      style={styles.screen}
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
      automaticallyAdjustKeyboardInsets
      contentContainerStyle={styles.content}>
      <View style={styles.intro}>
        <Text style={styles.introText}>
          Bantu Ditjen Perhubungan Darat memperbaiki MitraDarat. 4 pertanyaan, sekitar 2 menit.
          Jawaban tidak dikaitkan dengan nama atau email.
        </Text>
      </View>

      <Question
        number={1}
        title="Secara umum, bagaimana pengalamanmu memakai MitraDarat?"
        error={showErrors && missing.rating ? 'Pilih salah satu nilai.' : undefined}>
        <View style={styles.stars} accessibilityRole="radiogroup">
          {ratingLabels.map((label, i) => {
            const value = i + 1;
            const filled = value <= rating;
            return (
              <Pressable
                key={label}
                onPress={() => setRating(value)}
                hitSlop={4}
                style={styles.star}
                accessibilityRole="radio"
                accessibilityState={{ checked: value === rating }}
                accessibilityLabel={`${value} dari 5, ${label}`}>
                <SymbolView
                  name={
                    filled
                      ? { ios: 'star.fill', android: 'star', web: 'star' }
                      : { ios: 'star', android: 'star_border', web: 'star_border' }
                  }
                  size={34}
                  tintColor={filled ? Brand.accent : Brand.textMuted}
                />
              </Pressable>
            );
          })}
        </View>
        <Text style={styles.scaleValue}>{rating ? ratingLabels[rating - 1] : 'Belum dipilih'}</Text>
      </Question>

      <Question number={2} title="Layanan apa yang paling sering kamu pakai?" hint="Boleh pilih lebih dari satu.">
        <View style={styles.chips}>
          {surveyServices.map((service) => {
            const active = services.includes(service);
            return (
              <Pressable
                key={service}
                onPress={() => toggleService(service)}
                style={[styles.chip, active && styles.chipActive]}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: active }}>
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{service}</Text>
              </Pressable>
            );
          })}
        </View>
      </Question>

      <Question
        number={3}
        title="Seberapa mudah menemukan informasi yang kamu cari?"
        error={showErrors && missing.ease ? 'Pilih salah satu nilai.' : undefined}>
        <View style={styles.scale} accessibilityRole="radiogroup">
          {easeScale.map((label, i) => {
            const value = i + 1;
            const active = value === ease;
            return (
              <Pressable
                key={label}
                onPress={() => setEase(value)}
                style={[styles.scaleItem, active && styles.scaleItemActive]}
                accessibilityRole="radio"
                accessibilityState={{ checked: active }}
                accessibilityLabel={label}>
                <Text style={[styles.scaleNumber, active && styles.scaleNumberActive]}>{value}</Text>
              </Pressable>
            );
          })}
        </View>
        <View style={styles.scaleEnds}>
          <Text style={styles.scaleEnd}>{easeScale[0]}</Text>
          <Text style={styles.scaleEnd}>{easeScale[easeScale.length - 1]}</Text>
        </View>
      </Question>

      <Question number={4} title="Ceritakan pengalamanmu" hint="Opsional. Apa yang paling membantu, atau yang perlu diperbaiki?">
        <TextInput
          value={story}
          onChangeText={setStory}
          placeholder="Tulis di sini"
          placeholderTextColor={Brand.textSecondary}
          multiline
          maxLength={STORY_MAX}
          textAlignVertical="top"
          style={styles.story}
          accessibilityLabel="Cerita pengalaman, opsional"
        />
        <Text style={styles.counter}>
          {story.length}/{STORY_MAX}
        </Text>
      </Question>

      <Pressable
        onPress={submit}
        style={({ pressed }) => [styles.submit, pressed && styles.pressed]}
        accessibilityRole="button">
        <Text style={styles.submitText}>Kirim survei</Text>
      </Pressable>
    </ScrollView>
  );
}

type QuestionProps = {
  number: number;
  title: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
};

function Question({ number, title, hint, error, children }: QuestionProps) {
  return (
    <View style={[styles.card, error && styles.cardError]}>
      <Text style={styles.number}>Pertanyaan {number} dari 4</Text>
      <Text style={styles.title}>{title}</Text>
      {hint && <Text style={styles.hint}>{hint}</Text>}
      <View style={styles.answer}>{children}</View>
      {error && <Text style={styles.error}>{error}</Text>}
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
    paddingVertical: Spacing.three,
    paddingBottom: Spacing.six + Spacing.five,
    gap: Spacing.three - 4,
  },
  intro: {
    marginBottom: Spacing.one,
  },
  introText: {
    ...Type.body,
    fontSize: 15,
    lineHeight: 22,
    color: Brand.text,
  },
  card: {
    ...Card,
    padding: Spacing.three,
    gap: Spacing.one,
  },
  cardError: {
    borderColor: '#B42318',
  },
  number: {
    ...Type.caption,
    color: Brand.textSecondary,
  },
  title: {
    ...Type.headlineSmall,
    color: Brand.text,
  },
  hint: {
    ...Type.bodySmall,
    color: Brand.textSecondary,
  },
  answer: {
    marginTop: Spacing.three - 4,
    gap: Spacing.two,
  },
  error: {
    ...Type.bodySmall,
    fontWeight: '600',
    color: '#B42318',
    marginTop: Spacing.one,
  },
  stars: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  star: {
    padding: Spacing.one,
  },
  scaleValue: {
    ...Type.label,
    color: Brand.text,
    textAlign: 'center',
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  chip: {
    height: 36,
    paddingHorizontal: Spacing.three - 2,
    justifyContent: 'center',
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Brand.border,
    backgroundColor: Brand.background,
  },
  chipActive: {
    backgroundColor: Brand.primary,
    borderColor: Brand.primary,
  },
  chipText: {
    ...Type.label,
    color: Brand.text,
  },
  chipTextActive: {
    color: Brand.textOnPrimary,
  },
  scale: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  scaleItem: {
    flex: 1,
    height: 44,
    borderRadius: Radius.medium,
    borderWidth: 1,
    borderColor: Brand.border,
    backgroundColor: Brand.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scaleItemActive: {
    backgroundColor: Brand.primary,
    borderColor: Brand.primary,
  },
  scaleNumber: {
    ...Type.headlineSmall,
    color: Brand.text,
  },
  scaleNumberActive: {
    color: Brand.textOnPrimary,
  },
  scaleEnds: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scaleEnd: {
    ...Type.caption,
    color: Brand.textSecondary,
  },
  story: {
    ...PillInput,
    minHeight: 120,
    paddingTop: Spacing.three - 4,
    borderRadius: Radius.large,
    fontSize: 16,
    color: Brand.text,
  },
  counter: {
    ...Type.caption,
    color: Brand.textSecondary,
    textAlign: 'right',
  },
  submit: {
    ...PrimaryButton,
    marginTop: Spacing.two,
  },
  submitText: {
    ...Type.label,
    fontSize: 16,
    color: Brand.textOnPrimary,
  },
  pressed: {
    opacity: 0.7,
  },
});
