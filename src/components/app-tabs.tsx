import { NativeTabs } from 'expo-router/native-tabs';

import { Brand } from '@/constants/theme';

export default function AppTabs() {
  return (
    <NativeTabs
      tintColor={Brand.primary}
      labelStyle={{ selected: { color: Brand.primary } }}>
      <NativeTabs.Trigger name="(beranda)">
        <NativeTabs.Trigger.Label>Beranda</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: 'house', selected: 'house.fill' }} md="home" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="lacak">
        <NativeTabs.Trigger.Label>Lacak</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf={{ default: 'bus', selected: 'bus.fill' }} md="directions_bus" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="layanan">
        <NativeTabs.Trigger.Label>Layanan</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'square.grid.2x2', selected: 'square.grid.2x2.fill' }}
          md="apps"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="berita">
        <NativeTabs.Trigger.Label>Berita</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'newspaper', selected: 'newspaper.fill' }}
          md="newspaper"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="akun">
        <NativeTabs.Trigger.Label>Akun</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'person.crop.circle', selected: 'person.crop.circle.fill' }}
          md="account_circle"
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
