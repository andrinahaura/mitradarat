import { ChannelListScreen } from '@/components/channel-list-screen';
import { contactChannels } from '@/data/help';

export default function ContactScreen() {
  return (
    <ChannelListScreen
      intro="Pilih kanal yang paling nyaman. Untuk masalah layanan bus atau aplikasi, kirim laporan supaya kamu mendapat nomor tiket."
      channels={contactChannels}
      footer="Layanan pelanggan menjawab pertanyaan umum. Pengaduan tetap dicatat lewat menu Lapor."
    />
  );
}
