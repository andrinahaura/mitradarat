import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { IconTile } from '@/components/icon-tile';
import { ListCard, ListRow, SectionTitle } from '@/components/list';
import { TabPage } from '@/components/tab-header';
import {
  Brand,
  Card,
  Gutter,
  PrimaryButton,
  Radius,
  SecondaryButton,
  Spacing,
  Type,
} from '@/constants/theme';
import type { SymbolName } from '@/data/home';
import { appVersion, currentStatus, profile, useReports, useSavedVehicles } from '@/data/account';
import { signOut, useSignedIn } from '@/data/session';
import { savedRouteIds } from '@/data/transit';

function RowIcon({ icon, color }: { icon: SymbolName; color?: string }) {
  return <IconTile icon={icon} tone={color ? 'neutral' : 'brand'} color={color} />;
}

function RowValue({ children }: { children: string }) {
  return (
    <View style={styles.rowValue}>
      <Text style={styles.rowValueText}>{children}</Text>
      <SymbolView
        name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }}
        size={14}
        weight="semibold"
        tintColor={Brand.textSecondary}
      />
    </View>
  );
}

/**
 * Akun (references 1 and 3, profile screens): blue header like Beranda, a profile
 * card over it, two counters, then grouped menus with icons.
 */
export default function AccountScreen() {
  const signedIn = useSignedIn();
  const reports = useReports();
  const savedVehicles = useSavedVehicles();
  const openReports = reports.filter((report) => {
    const status = currentStatus(report);
    return status === 'Diterima' || status === 'Diproses';
  }).length;
  const savedCount = savedRouteIds.length + savedVehicles.length;

  const confirmLogout = () =>
    Alert.alert('Keluar dari akun?', 'Rute dan laporan tetap tersimpan di akun. Kamu bisa masuk lagi kapan saja.', [
      { text: 'Batal', style: 'cancel' },
      { text: 'Keluar', style: 'destructive', onPress: signOut },
    ]);

  return (
    <TabPage title="Akun" subtitle="Profil, laporan, dan pengaturan">
      {signedIn ? (
        <View style={styles.profile}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{profile.name.charAt(0)}</Text>
          </View>
          <Text style={styles.name}>{profile.name}</Text>
          <Text style={styles.email}>{profile.email}</Text>
          <Text style={styles.joined}>Bergabung {profile.joined}</Text>
        </View>
      ) : (
        <View style={styles.profile}>
          <View style={[styles.avatar, styles.avatarEmpty]}>
            <SymbolView
              name={{ ios: 'person', android: 'person', web: 'person' }}
              size={30}
              tintColor={Brand.textSecondary}
            />
          </View>
          <Text style={styles.name}>Belum masuk</Text>
          <Text style={[styles.email, styles.centered]}>
            Masuk untuk menyimpan rute dan memantau laporan dari perangkat mana pun.
          </Text>
          <View style={styles.authButtons}>
            <Pressable
              onPress={() => router.push('/akun/masuk')}
              style={({ pressed }) => [styles.primary, pressed && styles.pressed]}
              accessibilityRole="button">
              <Text style={styles.primaryText}>Masuk</Text>
            </Pressable>
            <Pressable
              onPress={() => router.push('/akun/daftar')}
              style={({ pressed }) => [styles.secondary, pressed && styles.pressed]}
              accessibilityRole="button">
              <Text style={styles.secondaryText}>Daftar</Text>
            </Pressable>
          </View>
        </View>
      )}

      {signedIn && (
        <View style={styles.stats}>
          <Stat
            icon={{ ios: 'exclamationmark.bubble', android: 'report', web: 'report' }}
            value={openReports}
            label="Laporan berjalan"
            onPress={() => router.push('/akun/laporan')}
          />
          <Stat
            icon={{ ios: 'bookmark', android: 'bookmark', web: 'bookmark' }}
            value={savedCount}
            label="Item tersimpan"
            onPress={() => router.push('/akun/tersimpan')}
          />
        </View>
      )}

      <SectionTitle>Aktivitas</SectionTitle>
      <ListCard>
        <ListRow
          leading={<RowIcon icon={{ ios: 'square.and.pencil', android: 'edit_note', web: 'edit_note' }} />}
          title="Buat laporan"
          subtitle="Laporkan masalah layanan atau aplikasi"
          onPress={() => router.push('/akun/lapor')}
        />
        <ListRow
          leading={<RowIcon icon={{ ios: 'exclamationmark.bubble', android: 'report', web: 'report' }} />}
          title="Laporan saya"
          subtitle="Pantau status laporan dan pengaduan"
          onPress={() => router.push('/akun/laporan')}
        />
        <ListRow
          leading={<RowIcon icon={{ ios: 'bookmark', android: 'bookmark', web: 'bookmark' }} />}
          title="Tersimpan"
          subtitle="Rute, halte, dan kendaraan"
          onPress={() => router.push('/akun/tersimpan')}
        />
      </ListCard>

      <SectionTitle>Pengaturan</SectionTitle>
      <ListCard>
        <ListRow
          leading={<RowIcon icon={{ ios: 'globe', android: 'language', web: 'language' }} />}
          title="Bahasa"
          onPress={() => router.push('/akun/bahasa')}
          trailing={<RowValue>Indonesia</RowValue>}
        />
      </ListCard>

      <SectionTitle>Informasi</SectionTitle>
      <ListCard>
        <ListRow
          leading={<RowIcon icon={{ ios: 'lock.shield', android: 'shield', web: 'shield' }} />}
          title="Kebijakan Privasi"
          onPress={() => router.push('/akun/kebijakan-privasi')}
        />
        <ListRow
          leading={<RowIcon icon={{ ios: 'doc.text', android: 'description', web: 'description' }} />}
          title="Syarat & Ketentuan"
          onPress={() => router.push('/akun/syarat')}
        />
        <ListRow
          leading={<RowIcon icon={{ ios: 'info.circle', android: 'info', web: 'info' }} />}
          title="Tentang MitraDarat"
          onPress={() => router.push('/akun/tentang')}
        />
        <ListRow
          leading={<RowIcon icon={{ ios: 'star', android: 'star', web: 'star' }} />}
          title="Beri ulasan di App Store"
          subtitle="Bantu kami lewat penilaian dan masukan"
          trailing={<Text style={styles.soon}>Segera</Text>}
        />
      </ListCard>

      {signedIn && (
        <>
          <SectionTitle>Akun</SectionTitle>
          <ListCard>
            <ListRow
              leading={
                <RowIcon
                  icon={{ ios: 'rectangle.portrait.and.arrow.right', android: 'logout', web: 'logout' }}
                  color={Brand.text}
                />
              }
              title="Keluar"
              onPress={confirmLogout}
              trailing={<View />}
            />
            <ListRow
              leading={<RowIcon icon={{ ios: 'trash', android: 'delete', web: 'delete' }} color="#B42318" />}
              title="Hapus akun"
              subtitle="Menghapus akun dan data pribadi secara permanen"
              onPress={() => router.push('/akun/hapus-akun')}
            />
          </ListCard>
        </>
      )}

      <Text style={styles.version}>MitraDarat versi {appVersion}</Text>
    </TabPage>
  );
}

function Stat({
  icon,
  value,
  label,
  onPress,
}: {
  icon: SymbolName;
  value: number;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.stat, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel={`${label}, ${value}`}>
      <IconTile icon={icon} />
      <View>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  profile: {
    ...Card,
    alignItems: 'center',
    marginHorizontal: Gutter,
    paddingVertical: Spacing.four,
    paddingHorizontal: Spacing.three,
    gap: 2,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: Radius.full,
    backgroundColor: Brand.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.two,
  },
  avatarEmpty: {
    backgroundColor: Brand.background,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '700',
    color: Brand.primary,
  },
  name: {
    ...Type.headline,
    color: Brand.text,
  },
  email: {
    ...Type.body,
    color: Brand.textSecondary,
  },
  centered: {
    textAlign: 'center',
    marginTop: Spacing.one,
  },
  joined: {
    ...Type.caption,
    color: Brand.textSecondary,
    marginTop: Spacing.one,
  },
  authButtons: {
    alignSelf: 'stretch',
    gap: Spacing.two,
    marginTop: Spacing.three,
  },
  primary: {
    ...PrimaryButton,
  },
  primaryText: {
    ...Type.label,
    color: Brand.textOnPrimary,
  },
  secondary: {
    ...SecondaryButton,
  },
  secondaryText: {
    ...Type.label,
    color: Brand.primary,
  },
  stats: {
    flexDirection: 'row',
    gap: Spacing.two + 2,
    marginHorizontal: Gutter,
    marginTop: Spacing.two + 2,
  },
  stat: {
    ...Card,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three - 4,
    padding: Spacing.three - 2,
  },
  statValue: {
    ...Type.headline,
    color: Brand.text,
    fontVariant: ['tabular-nums'],
  },
  statLabel: {
    ...Type.caption,
    color: Brand.textSecondary,
  },
  pressed: {
    opacity: 0.7,
  },
  rowValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one + 2,
  },
  rowValueText: {
    ...Type.body,
    fontSize: 14,
    color: Brand.textSecondary,
  },
  soon: {
    ...Type.caption,
    fontWeight: '600',
    color: Brand.textSecondary,
  },
  version: {
    ...Type.caption,
    textAlign: 'center',
    color: Brand.textSecondary,
    marginTop: Spacing.four,
  },
});
