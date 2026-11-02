import { DocumentPage } from '@/components/document-page';
import { appVersion } from '@/data/account';

export default function AboutScreen() {
  return (
    <DocumentPage
      intro="MitraDarat adalah aplikasi informasi angkutan darat dari Direktorat Jenderal Perhubungan Darat, Kementerian Perhubungan."
      sections={[
        {
          heading: 'Yang bisa kamu lakukan',
          paragraphs: [
            'Melacak bus kota dan melihat perkiraan kedatangan di halte.',
            'Mengecek kelaikan kendaraan dan bus pariwisata.',
            'Melihat terminal, pelabuhan, jembatan timbang, jalur mudik, dan kondisi lalu lintas.',
            'Membaca berita resmi dan mengirim laporan.',
          ],
        },
        {
          heading: 'Versi',
          paragraphs: [`MitraDarat ${appVersion}`],
        },
      ]}
    />
  );
}
