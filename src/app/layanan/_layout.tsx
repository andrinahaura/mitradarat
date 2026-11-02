import { Stack } from 'expo-router';

import { stackScreenOptions } from '@/constants/navigation';

export const unstable_settings = {
  anchor: 'index',
};

export default function ServicesLayout() {
  return (
    <Stack
      screenOptions={stackScreenOptions}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="cek-laik" options={{ title: 'Cek Laik' }} />
      <Stack.Screen name="cek-laik-hasil" options={{ title: 'Hasil Cek Laik' }} />
      <Stack.Screen name="peta-prasarana" options={{ headerShown: false }} />
      <Stack.Screen name="peta-tematik" options={{ headerShown: false }} />
      <Stack.Screen name="lalu-lintas" options={{ headerShown: false }} />
      <Stack.Screen name="etiket/index" options={{ title: 'eTiket Terminal' }} />
      <Stack.Screen name="etiket/[kode]" options={{ title: 'E-tiket' }} />
      <Stack.Screen name="survei" options={{ title: 'Survei Kepuasan' }} />
      <Stack.Screen
        name="survei-terima-kasih"
        options={{ title: 'Survei terkirim', headerBackVisible: false, gestureEnabled: false }}
      />
      <Stack.Screen name="bantuan" options={{ title: 'Pusat Bantuan' }} />
      <Stack.Screen name="hubungi-cs" options={{ title: 'Hubungi layanan pelanggan' }} />
      <Stack.Screen name="media-sosial" options={{ title: 'Media sosial resmi' }} />
    </Stack>
  );
}
