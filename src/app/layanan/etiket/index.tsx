import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { IconTile } from '@/components/icon-tile';
import { ListCard, ListRow, SectionTitle } from '@/components/list';
import { Brand, Gutter, PillInput, PrimaryButton, Radius, Spacing, Type } from '@/constants/theme';
import {
  findTicket,
  getTicket,
  normalizeCode,
  sampleTicketQueries,
  saveTicket,
  type Ticket,
  useSavedTickets,
} from '@/data/tickets';

const CODE_MIN = 6;

/**
 * eTiket Terminal (v1 screenshot 54). v1 opened a web page with its own header;
 * v2 is a native form, and found tickets stay on the device.
 */
export default function TicketSearchScreen() {
  const savedCodes = useSavedTickets();
  const saved = savedCodes.map(getTicket).filter((t): t is Ticket => t !== undefined);
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [notFound, setNotFound] = useState(false);

  const ready = code.length >= CODE_MIN && name.trim().length >= 3;

  const open = (ticket: Ticket) =>
    router.push({ pathname: '/layanan/etiket/[kode]', params: { kode: ticket.code } });

  const search = () => {
    const ticket = findTicket(code, name);
    if (!ticket) {
      setNotFound(true);
      return;
    }
    setNotFound(false);
    saveTicket(ticket.code);
    open(ticket);
  };

  return (
    <ScrollView
      style={styles.screen}
      contentInsetAdjustmentBehavior="automatic"
      keyboardShouldPersistTaps="handled"
      automaticallyAdjustKeyboardInsets
      contentContainerStyle={styles.content}>
      <View style={styles.form}>
        <Text style={styles.lead}>
          Masukkan kode booking dan nama salah satu penumpang untuk menampilkan e-tiket check-in dan
          boarding.
        </Text>

        <View style={styles.field}>
          <Text style={styles.label}>Kode booking</Text>
          <TextInput
            value={code}
            onChangeText={(text) => {
              setCode(normalizeCode(text));
              setNotFound(false);
            }}
            placeholder="Contoh: TOS7K2M9"
            placeholderTextColor={Brand.textSecondary}
            autoCapitalize="characters"
            autoCorrect={false}
            style={[styles.input, styles.codeInput]}
            accessibilityLabel="Kode booking"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Nama penumpang</Text>
          <TextInput
            value={name}
            onChangeText={(text) => {
              setName(text);
              setNotFound(false);
            }}
            placeholder="Sesuai nama di tiket"
            placeholderTextColor={Brand.textSecondary}
            autoCapitalize="words"
            autoCorrect={false}
            returnKeyType="search"
            onSubmitEditing={() => ready && search()}
            style={styles.input}
            accessibilityLabel="Nama penumpang"
          />
        </View>

        {notFound && (
          <Text style={styles.error}>
            Tiket tidak ditemukan. Periksa kode booking dan tulis nama persis seperti di tiket.
          </Text>
        )}

        <Pressable
          onPress={search}
          disabled={!ready}
          style={({ pressed }) => [styles.button, !ready && styles.buttonDisabled, pressed && styles.pressed]}
          accessibilityRole="button"
          accessibilityState={{ disabled: !ready }}>
          <Text style={styles.buttonText}>Cari tiket</Text>
        </Pressable>
      </View>

      {saved.length > 0 && (
        <View>
          <SectionTitle>Tiket tersimpan</SectionTitle>
          <ListCard>
            {saved.map((ticket) => (
              <ListRow
                key={ticket.code}
                leading={<IconTile icon={{ ios: 'ticket', android: 'confirmation_number', web: 'confirmation_number' }} />}
                title={`${ticket.from.split(',')[1]?.trim() ?? ticket.from} → ${ticket.to.split(',')[1]?.trim() ?? ticket.to}`}
                subtitle={`${ticket.date} · ${ticket.departure} · ${ticket.code}`}
                onPress={() => open(ticket)}
              />
            ))}
          </ListCard>
        </View>
      )}

      <View style={styles.sample}>
        <Text style={styles.sampleTitle}>Data contoh untuk mencoba prototipe</Text>
        {sampleTicketQueries.map((sample) => (
          <Text key={sample.code} style={styles.sampleBody}>
            {sample.code} · {sample.name}
          </Text>
        ))}
      </View>
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
  form: {
    paddingHorizontal: Gutter,
    gap: Spacing.three,
  },
  lead: {
    ...Type.body,
    fontSize: 15,
    lineHeight: 22,
    color: Brand.text,
  },
  field: {
    gap: Spacing.two,
  },
  label: {
    ...Type.label,
    fontSize: 15,
    color: Brand.text,
  },
  input: {
    ...PillInput,
    fontSize: 16,
    color: Brand.text,
  },
  codeInput: {
    fontWeight: '700',
    letterSpacing: 1.5,
    fontVariant: ['tabular-nums'],
  },
  error: {
    ...Type.bodySmall,
    fontWeight: '600',
    color: '#B42318',
  },
  button: {
    ...PrimaryButton,
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  buttonText: {
    ...Type.label,
    fontSize: 16,
    color: Brand.textOnPrimary,
  },
  pressed: {
    opacity: 0.7,
  },
  sample: {
    marginHorizontal: Gutter,
    padding: Spacing.three - 4,
    borderRadius: Radius.large,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: Brand.border,
    gap: 2,
  },
  sampleTitle: {
    ...Type.labelSmall,
    color: Brand.textSecondary,
    marginBottom: 2,
  },
  sampleBody: {
    ...Type.bodySmall,
    color: Brand.textSecondary,
  },
});
