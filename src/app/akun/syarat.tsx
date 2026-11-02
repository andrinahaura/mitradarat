import { DocumentPage } from '@/components/document-page';

export default function TermsScreen() {
  return (
    <DocumentPage
      draftNotice="Teks contoh untuk prototipe. Teks resmi menunggu Ditjen Perhubungan Darat."
      intro="Syarat ini berlaku saat kamu memakai aplikasi MitraDarat dari Direktorat Jenderal Perhubungan Darat, Kementerian Perhubungan."
      sections={[
        {
          heading: 'Layanan',
          paragraphs: [
            'MitraDarat menyediakan informasi angkutan darat: posisi dan kedatangan bus, prasarana, peta tematik, berita, serta saluran laporan.',
          ],
        },
        {
          heading: 'Ketepatan informasi',
          paragraphs: [
            'Posisi bus dan perkiraan tiba bergantung pada data dari operator. Aplikasi selalu menampilkan waktu data diperbarui.',
          ],
        },
        {
          heading: 'Laporan pengguna',
          paragraphs: [
            'Laporan harus benar dan tidak mengandung informasi pribadi orang lain. Laporan yang sama atau tidak sesuai bisa ditolak dengan alasan.',
          ],
        },
      ]}
    />
  );
}
