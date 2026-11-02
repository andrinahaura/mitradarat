import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { Brand, Gutter, PillInput, PrimaryButton, Radius, Spacing } from '@/constants/theme';
import { addReport, type ReportCategory, reportCategories } from '@/data/account';
import type { SymbolName } from '@/data/home';
import { formatPlate } from '@/utils/plate';

const TITLE_MAX = 80;
const DESCRIPTION_MIN = 20;
const DESCRIPTION_MAX = 1000;
const PHOTO_MAX = 3;

const categoryIcon: Record<ReportCategory, SymbolName> = {
  'Teman Bus': { ios: 'bus', android: 'directions_bus', web: 'directions_bus' },
  'BRT Nusantara': { ios: 'bus.doubledecker', android: 'airport_shuttle', web: 'airport_shuttle' },
  BisKita: { ios: 'person.2', android: 'groups', web: 'groups' },
  KSPN: { ios: 'mountain.2', android: 'landscape', web: 'landscape' },
  Perintis: { ios: 'signpost.right', android: 'signpost', web: 'signpost' },
  'Cek Laik': { ios: 'checkmark.shield', android: 'verified_user', web: 'verified_user' },
  'Internal Hubdat': { ios: 'building.columns', android: 'account_balance', web: 'account_balance' },
  'Mudik Gratis': { ios: 'calendar', android: 'calendar_month', web: 'calendar_month' },
  'Masalah pada Aplikasi': { ios: 'iphone', android: 'smartphone', web: 'smartphone' },
  Lainnya: { ios: 'ellipsis.circle', android: 'more_horiz', web: 'more_horiz' },
};

export default function ReportFormScreen() {
  const [category, setCategory] = useState<ReportCategory>();
  const [plate, setPlate] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [showErrors, setShowErrors] = useState(false);

  const errors = {
    category: category ? undefined : 'Pilih kategori laporan.',
    title: title.trim() ? undefined : 'Tulis judul singkat.',
    description:
      description.trim().length >= DESCRIPTION_MIN
        ? undefined
        : `Ceritakan masalahnya minimal ${DESCRIPTION_MIN} karakter.`,
  };
  const valid = !errors.category && !errors.title && !errors.description;

  const pickPhotos = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      selectionLimit: PHOTO_MAX - photos.length,
      quality: 0.7,
    });
    if (!result.canceled) {
      setPhotos((current) => [...current, ...result.assets.map((asset) => asset.uri)].slice(0, PHOTO_MAX));
    }
  };

  const submit = () => {
    if (!valid || !category) {
      setShowErrors(true);
      return;
    }
    const report = addReport({
      category,
      title: title.trim(),
      description: description.trim(),
      plate: plate.trim() || undefined,
      photoCount: photos.length,
    });
    router.replace({ pathname: '/akun/lapor-terkirim', params: { id: report.id } });
  };

  return (
    <ScrollView
      style={styles.screen}
      contentInsetAdjustmentBehavior="automatic"
      automaticallyAdjustKeyboardInsets
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.content}>
      <Text style={styles.intro}>
        Laporan langsung mendapat nomor tiket. Statusnya bisa dipantau di Akun → Laporan saya.
      </Text>

      <Field label="Kategori" error={showErrors ? errors.category : undefined}>
        <View style={styles.categories} accessibilityRole="radiogroup">
          {reportCategories.map((item) => {
            const active = item === category;
            return (
              <Pressable
                key={item}
                onPress={() => setCategory(item)}
                style={({ pressed }) => [styles.category, active && styles.categoryActive, pressed && styles.pressed]}
                accessibilityRole="radio"
                accessibilityState={{ checked: active }}>
                <SymbolView
                  name={categoryIcon[item]}
                  size={18}
                  tintColor={active ? Brand.textOnPrimary : Brand.primary}
                />
                <Text style={[styles.categoryText, active && styles.categoryTextActive]} numberOfLines={2}>
                  {item}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </Field>

      <Field label="Nomor plat kendaraan" hint="Opsional. Isi jika laporan menyangkut kendaraan tertentu.">
        <TextInput
          value={plate}
          onChangeText={(text) => setPlate(formatPlate(text))}
          placeholder="Contoh: H 7191 OQ"
          placeholderTextColor={Brand.textSecondary}
          autoCapitalize="characters"
          autoCorrect={false}
          maxLength={11}
          style={styles.input}
          accessibilityLabel="Nomor plat kendaraan, opsional"
        />
      </Field>

      <Field
        label="Judul"
        counter={`${title.length}/${TITLE_MAX}`}
        error={showErrors ? errors.title : undefined}>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Contoh: Bus tidak berhenti di halte"
          placeholderTextColor={Brand.textSecondary}
          maxLength={TITLE_MAX}
          style={[styles.input, showErrors && errors.title && styles.inputError]}
          accessibilityLabel="Judul laporan"
        />
      </Field>

      <Field
        label="Ceritakan masalahnya"
        hint="Sebutkan lokasi, waktu, dan nomor koridor atau bus jika ada."
        counter={`${description.length}/${DESCRIPTION_MAX}`}
        error={showErrors ? errors.description : undefined}>
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Apa yang terjadi?"
          placeholderTextColor={Brand.textSecondary}
          maxLength={DESCRIPTION_MAX}
          multiline
          textAlignVertical="top"
          style={[styles.input, styles.multiline, showErrors && errors.description && styles.inputError]}
          accessibilityLabel="Isi laporan"
        />
      </Field>

      <Field label="Foto" hint={`Opsional, maksimal ${PHOTO_MAX} foto.`}>
        <View style={styles.photos}>
          {photos.map((uri) => (
            <View key={uri} style={styles.photo}>
              <Image source={{ uri }} style={StyleSheet.absoluteFill} contentFit="cover" />
              <Pressable
                onPress={() => setPhotos((current) => current.filter((item) => item !== uri))}
                hitSlop={6}
                style={styles.photoRemove}
                accessibilityRole="button"
                accessibilityLabel="Hapus foto">
                <SymbolView
                  name={{ ios: 'xmark', android: 'close', web: 'close' }}
                  size={10}
                  weight="bold"
                  tintColor="#FFFFFF"
                />
              </Pressable>
            </View>
          ))}
          {photos.length < PHOTO_MAX && (
            <Pressable
              onPress={pickPhotos}
              style={({ pressed }) => [styles.photo, styles.addPhoto, pressed && styles.pressed]}
              accessibilityRole="button"
              accessibilityLabel="Tambah foto">
              <SymbolView
                name={{ ios: 'camera', android: 'add_a_photo', web: 'add_a_photo' }}
                size={22}
                tintColor={Brand.primary}
              />
              <Text style={styles.addPhotoText}>Tambah</Text>
            </Pressable>
          )}
        </View>
      </Field>

      {showErrors && !valid && (
        <Text style={styles.summaryError}>Lengkapi bagian yang ditandai merah sebelum mengirim.</Text>
      )}

      <Pressable
        onPress={submit}
        style={({ pressed }) => [styles.submit, pressed && styles.pressed]}
        accessibilityRole="button">
        <Text style={styles.submitText}>Kirim laporan</Text>
      </Pressable>
    </ScrollView>
  );
}

type FieldProps = {
  label: string;
  hint?: string;
  counter?: string;
  error?: string;
  children: React.ReactNode;
};

function Field({ label, hint, counter, error, children }: FieldProps) {
  return (
    <View style={styles.field}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        {counter && <Text style={styles.counter}>{counter}</Text>}
      </View>
      {hint && <Text style={styles.hint}>{hint}</Text>}
      {children}
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
    gap: Spacing.four - 4,
    paddingBottom: Spacing.six + Spacing.five,
  },
  intro: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    color: Brand.textSecondary,
  },
  field: {
    gap: Spacing.two,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
    color: Brand.text,
  },
  counter: {
    fontSize: 12,
    fontWeight: '500',
    color: Brand.textSecondary,
    fontVariant: ['tabular-nums'],
  },
  hint: {
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
    color: Brand.textSecondary,
    marginTop: -Spacing.one,
  },
  error: {
    fontSize: 13,
    fontWeight: '600',
    color: '#B42318',
  },
  categories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  category: {
    width: '48.5%',
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three - 4,
    paddingVertical: Spacing.two,
    borderRadius: Radius.medium,
    borderWidth: 1,
    borderColor: Brand.border,
    backgroundColor: Brand.surface,
  },
  categoryActive: {
    backgroundColor: Brand.primary,
    borderColor: Brand.primary,
  },
  categoryText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: Brand.text,
  },
  categoryTextActive: {
    color: Brand.textOnPrimary,
  },
  input: {
    ...PillInput,
    paddingVertical: Spacing.three - 4,
    fontSize: 16,
    fontWeight: '500',
    color: Brand.text,
  },
  multiline: {
    minHeight: 140,
    paddingTop: Spacing.three,
    borderRadius: Radius.large,
  },
  inputError: {
    borderColor: '#B42318',
  },
  photos: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  photo: {
    width: 88,
    height: 88,
    borderRadius: Radius.medium,
    overflow: 'hidden',
    backgroundColor: Brand.primarySoft,
  },
  photoRemove: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 22,
    height: 22,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPhoto: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.one,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#C7D2FE',
  },
  addPhotoText: {
    fontSize: 12,
    fontWeight: '600',
    color: Brand.primary,
  },
  summaryError: {
    fontSize: 14,
    fontWeight: '600',
    color: '#B42318',
  },
  submit: {
    ...PrimaryButton,
  },
  submitText: {
    fontSize: 16,
    fontWeight: '700',
    color: Brand.textOnPrimary,
  },
  pressed: {
    opacity: 0.7,
  },
});
