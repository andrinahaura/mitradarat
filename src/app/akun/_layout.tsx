import { Stack } from 'expo-router';

import { stackScreenOptions } from '@/constants/navigation';
import { Brand } from '@/constants/theme';

export const unstable_settings = {
  anchor: 'index',
};

/** Sign-in screens sit on white with an empty, borderless header. */
const authScreen = {
  title: '',
  headerShadowVisible: false,
  headerStyle: { backgroundColor: Brand.surface },
  contentStyle: { backgroundColor: Brand.surface },
};

export default function AccountLayout() {
  return (
    <Stack
      screenOptions={stackScreenOptions}>
      <Stack.Screen name="index" options={{ title: 'Akun', headerShown: false }} />
      <Stack.Screen name="laporan/index" options={{ title: 'Laporan saya' }} />
      <Stack.Screen name="laporan/[id]" options={{ title: 'Detail laporan' }} />
      <Stack.Screen name="tersimpan" options={{ title: 'Tersimpan' }} />
      <Stack.Screen name="bahasa" options={{ title: 'Bahasa' }} />
      <Stack.Screen name="kebijakan-privasi" options={{ title: 'Kebijakan Privasi' }} />
      <Stack.Screen name="syarat" options={{ title: 'Syarat & Ketentuan' }} />
      <Stack.Screen name="tentang" options={{ title: 'Tentang MitraDarat' }} />
      <Stack.Screen name="hapus-akun" options={{ title: 'Hapus akun' }} />
      <Stack.Screen name="lapor" options={{ title: 'Buat laporan' }} />
      <Stack.Screen name="masuk" options={authScreen} />
      <Stack.Screen name="daftar" options={authScreen} />
      <Stack.Screen name="lupa-sandi" options={authScreen} />
      <Stack.Screen
        name="lapor-terkirim"
        options={{ title: 'Laporan terkirim', headerBackVisible: false, gestureEnabled: false }}
      />
    </Stack>
  );
}
