import { Stack } from 'expo-router';

import { stackScreenOptions } from '@/constants/navigation';

// Opening an article from Beranda still puts the list under it, so Back works.
export const unstable_settings = {
  anchor: 'index',
};

export default function NewsLayout() {
  return (
    <Stack
      screenOptions={stackScreenOptions}>
      <Stack.Screen name="index" options={{ title: 'Berita', headerShown: false }} />
      <Stack.Screen name="[id]" options={{ title: '' }} />
    </Stack>
  );
}
