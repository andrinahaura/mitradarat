import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AuthButton, AuthError, AuthField, AuthLink, AuthScreen } from '@/components/auth/auth-form';
import { Brand, Card, Radius, Spacing, Type } from '@/constants/theme';

/** Reset password (reference 1, forgot-password screen). */
export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [sentTo, setSentTo] = useState<string>();
  const [error, setError] = useState<string>();

  const submit = () => {
    if (!email.trim()) {
      setError('Isi email atau nomor HP akunmu.');
      return;
    }
    setSentTo(email.trim());
  };

  if (sentTo) {
    return (
      <AuthScreen title="Cek email kamu" subtitle="Ikuti tautan di email untuk membuat kata sandi baru.">
        <View style={styles.sent}>
          <View style={styles.sentIcon}>
            <SymbolView
              name={{ ios: 'envelope.badge', android: 'mark_email_unread', web: 'mark_email_unread' }}
              size={20}
              tintColor={Brand.primary}
            />
          </View>
          <Text style={styles.sentText}>
            Tautan dikirim ke <Text style={styles.sentTo}>{sentTo}</Text>. Tidak masuk? Periksa folder spam
            atau kirim ulang.
          </Text>
        </View>
        <AuthButton label="Kembali ke Masuk" onPress={() => router.back()} />
        <AuthLink text="Salah alamat?" link="Ubah email" onPress={() => setSentTo(undefined)} />
        <Text style={styles.note}>Prototipe: email tidak benar-benar dikirim.</Text>
      </AuthScreen>
    );
  }

  return (
    <AuthScreen
      title="Lupa kata sandi?"
      subtitle="Masukkan email atau nomor HP akunmu. Kami kirim tautan untuk membuat kata sandi baru.">
      <AuthField
        label="Email atau nomor HP"
        icon={{ ios: 'envelope', android: 'mail', web: 'mail' }}
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          setError(undefined);
        }}
        placeholder="nama@email.com"
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        autoCorrect={false}
        returnKeyType="send"
        onSubmitEditing={submit}
      />
      <AuthError>{error}</AuthError>
      <AuthButton label="Kirim tautan" onPress={submit} />
      <AuthLink text="Ingat kata sandi?" link="Kembali masuk" onPress={() => router.back()} />
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  sent: {
    ...Card,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.three - 4,
    padding: Spacing.three,
  },
  sentIcon: {
    width: 40,
    height: 40,
    borderRadius: Radius.control,
    backgroundColor: Brand.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sentText: {
    ...Type.body,
    flex: 1,
    color: Brand.text,
  },
  sentTo: {
    fontWeight: '600',
  },
  note: {
    ...Type.caption,
    color: Brand.textSecondary,
    textAlign: 'center',
  },
});
