import { DocumentPage } from '@/components/document-page';

export default function PrivacyScreen() {
  return (
    <DocumentPage
      draftNotice="Teks contoh untuk prototipe. Teks resmi menunggu Ditjen Perhubungan Darat."
      intro="Kebijakan ini menjelaskan data apa yang dikumpulkan MitraDarat, untuk apa, dan bagaimana kamu mengaturnya."
      sections={[
        {
          heading: 'Data yang kami kumpulkan',
          paragraphs: [
            'Nama dan email saat kamu membuat akun.',
            'Lokasi perangkat, hanya saat aplikasi dipakai dan hanya jika kamu mengizinkan. Lokasi dipakai untuk menampilkan halte terdekat.',
            'Isi laporan, nomor plat, dan foto yang kamu kirim lewat menu Lapor.',
          ],
        },
        {
          heading: 'Untuk apa data dipakai',
          paragraphs: [
            'Menampilkan informasi perjalanan yang relevan, menindaklanjuti laporan, dan meningkatkan layanan.',
          ],
        },
        {
          heading: 'Hak kamu',
          paragraphs: [
            'Kamu bisa melihat dan menghapus data tersimpan dari menu Akun. Kamu juga bisa menghapus akun kapan saja.',
          ],
        },
      ]}
    />
  );
}
