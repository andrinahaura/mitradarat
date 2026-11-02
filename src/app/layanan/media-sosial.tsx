import { ChannelListScreen } from '@/components/channel-list-screen';
import { socialChannels } from '@/data/help';

export default function SocialScreen() {
  return (
    <ChannelListScreen
      intro="Ikuti akun resmi Direktorat Jenderal Perhubungan Darat untuk info layanan, gangguan, dan kegiatan terbaru."
      channels={socialChannels}
      footer="Hanya akun dengan tanda verifikasi yang resmi. Ditjen Hubdat tidak pernah meminta data pribadi lewat pesan langsung."
    />
  );
}
