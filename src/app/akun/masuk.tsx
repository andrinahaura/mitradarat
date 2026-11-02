import { router } from 'expo-router';
import { useState } from 'react';
import { Text } from 'react-native';

import {
  AuthButton,
  AuthError,
  AuthField,
  AuthLink,
  AuthScreen,
  authStyles,
} from '@/components/auth/auth-form';
import { signIn } from '@/data/session';

/** Sign in (reference 1, login screen). The prototype accepts any filled-in form. */
export default function SignInScreen() {
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string>();

  const submit = () => {
    if (!account.trim() || !password) {
      setError('Isi email atau nomor HP, dan kata sandi.');
      return;
    }
    signIn();
    router.dismissTo('/akun');
  };

  return (
    <AuthScreen title="Masuk ke MitraDarat" subtitle="Simpan rute dan pantau laporanmu di semua perangkat.">
      <AuthField
        label="Email atau nomor HP"
        icon={{ ios: 'envelope', android: 'mail', web: 'mail' }}
        value={account}
        onChangeText={(text) => {
          setAccount(text);
          setError(undefined);
        }}
        placeholder="nama@email.com"
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="username"
        textContentType="username"
        autoCorrect={false}
      />
      <AuthField
        label="Kata sandi"
        password
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          setError(undefined);
        }}
        placeholder="Masukkan kata sandi"
        autoComplete="current-password"
        textContentType="password"
        returnKeyType="go"
        onSubmitEditing={submit}
      />
      <Text
        style={[authStyles.link, { alignSelf: 'flex-end' }]}
        onPress={() => router.push('/akun/lupa-sandi')}
        accessibilityRole="link">
        Lupa kata sandi?
      </Text>

      <AuthError>{error}</AuthError>
      <AuthButton label="Masuk" onPress={submit} />
      <AuthLink text="Belum punya akun?" link="Daftar" onPress={() => router.replace('/akun/daftar')} />
    </AuthScreen>
  );
}
