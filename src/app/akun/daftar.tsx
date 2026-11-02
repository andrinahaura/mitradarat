import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AuthButton, AuthError, AuthField, AuthLink, AuthScreen } from '@/components/auth/auth-form';
import { Brand, Radius, Spacing, Type } from '@/constants/theme';
import { signIn } from '@/data/session';

const PASSWORD_MIN = 8;

/** Create an account (reference 1, sign-up screen). */
export default function SignUpScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState<string>();

  const change = (set: (value: string) => void) => (value: string) => {
    set(value);
    setError(undefined);
  };

  const submit = () => {
    if (!name.trim() || !email.trim() || !password || !confirm) {
      setError('Lengkapi semua kolom.');
    } else if (password.length < PASSWORD_MIN) {
      setError(`Kata sandi minimal ${PASSWORD_MIN} karakter.`);
    } else if (password !== confirm) {
      setError('Konfirmasi kata sandi tidak sama.');
    } else if (!agreed) {
      setError('Setujui Syarat & Ketentuan dan Kebijakan Privasi untuk melanjutkan.');
    } else {
      signIn();
      router.dismissTo('/akun');
    }
  };

  return (
    <AuthScreen title="Buat akun" subtitle="Gratis. Satu akun untuk semua layanan MitraDarat.">
      <AuthField
        label="Nama lengkap"
        icon={{ ios: 'person', android: 'person', web: 'person' }}
        value={name}
        onChangeText={change(setName)}
        placeholder="Nama sesuai KTP"
        autoComplete="name"
        textContentType="name"
      />
      <AuthField
        label="Email"
        icon={{ ios: 'envelope', android: 'mail', web: 'mail' }}
        value={email}
        onChangeText={change(setEmail)}
        placeholder="nama@email.com"
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        textContentType="emailAddress"
        autoCorrect={false}
      />
      <AuthField
        label="Kata sandi"
        password
        value={password}
        onChangeText={change(setPassword)}
        placeholder="Buat kata sandi"
        hint={`Minimal ${PASSWORD_MIN} karakter.`}
        autoComplete="new-password"
        textContentType="newPassword"
      />
      <AuthField
        label="Konfirmasi kata sandi"
        password
        value={confirm}
        onChangeText={change(setConfirm)}
        placeholder="Ulangi kata sandi"
        autoComplete="new-password"
        textContentType="newPassword"
      />

      <View style={styles.agree}>
        <Pressable
          onPress={() => {
            setAgreed((a) => !a);
            setError(undefined);
          }}
          hitSlop={8}
          style={[styles.box, agreed && styles.boxOn]}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: agreed }}
          accessibilityLabel="Saya setuju dengan Syarat & Ketentuan dan Kebijakan Privasi">
          {agreed && (
            <SymbolView
              name={{ ios: 'checkmark', android: 'check', web: 'check' }}
              size={13}
              weight="bold"
              tintColor={Brand.textOnPrimary}
            />
          )}
        </Pressable>
        <Text style={styles.agreeText}>
          Saya setuju dengan{' '}
          <Text style={styles.link} onPress={() => router.push('/akun/syarat')}>
            Syarat & Ketentuan
          </Text>{' '}
          dan{' '}
          <Text style={styles.link} onPress={() => router.push('/akun/kebijakan-privasi')}>
            Kebijakan Privasi
          </Text>
          .
        </Text>
      </View>

      <AuthError>{error}</AuthError>
      <AuthButton label="Daftar" onPress={submit} />
      <AuthLink text="Sudah punya akun?" link="Masuk" onPress={() => router.replace('/akun/masuk')} />
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  agree: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.three - 4,
  },
  box: {
    width: 22,
    height: 22,
    marginTop: 1,
    borderRadius: Radius.small,
    borderWidth: 1.5,
    borderColor: Brand.inputBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxOn: {
    backgroundColor: Brand.primary,
    borderColor: Brand.primary,
  },
  agreeText: {
    ...Type.bodySmall,
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
    color: Brand.textSecondary,
  },
  link: {
    fontWeight: '600',
    color: Brand.primary,
  },
});
