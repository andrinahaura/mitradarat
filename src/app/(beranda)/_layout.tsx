import { Stack } from 'expo-router';

import { stackScreenOptions } from '@/constants/navigation';

export const unstable_settings = {
  anchor: 'index',
};

export default function HomeLayout() {
  return (
    <Stack
      screenOptions={stackScreenOptions}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="kotak-masuk/index" options={{ title: 'Kotak Masuk' }} />
      <Stack.Screen name="kotak-masuk/[id]" options={{ title: '' }} />
      <Stack.Screen name="pengumuman/[id]" options={{ title: 'Pengumuman' }} />
      <Stack.Screen name="pilih-kota" options={{ title: 'Pilih kota', presentation: 'modal' }} />
    </Stack>
  );
}
