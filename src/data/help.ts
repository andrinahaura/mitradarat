/**
 * Help content for Pusat Bantuan. v1 had two separate FAQs (screenshots 37 and
 * 55–57); v2 keeps one, grouped by topic. Answers are written for the prototype and
 * need review by Ditjen Hubdat. Contact channels are placeholders on purpose: the
 * prototype must not show phone numbers or accounts that were never confirmed.
 */

import type { SymbolName } from '@/data/home';

export type HelpTopicId = 'lacak' | 'mudik' | 'cek-laik' | 'laporan' | 'akun';

export type HelpTopic = {
  id: HelpTopicId;
  title: string;
  questions: { q: string; a: string }[];
};

export const helpTopics: HelpTopic[] = [
  {
    id: 'lacak',
    title: 'Lacak bus',
    questions: [
      {
        q: 'Kenapa posisi bus berlabel "Tertunda"?',
        a: 'Posisi bus terakhir diterima lebih dari 2 menit lalu. Bus mungkin sudah bergerak, jadi perkiraan tiba disembunyikan sampai data baru masuk.',
      },
      {
        q: 'Kenapa bus tidak bergerak di peta?',
        a: 'Bus sedang berhenti di halte atau terminal, atau perangkat GPS di bus belum mengirim data. Lihat waktu "Diperbarui" di bawah posisi bus.',
      },
      {
        q: 'Apakah rute bus bisa berubah?',
        a: 'Bisa, misalnya karena acara atau perbaikan jalan. Perubahan rute dikirim lewat Kotak Masuk beserta halte yang tidak dilalui.',
      },
      {
        q: 'Kenapa operator di kota saya tidak muncul?',
        a: 'Hanya operator yang terhubung dengan MitraDarat yang tampil. Kirim laporan dengan kategori Lainnya untuk mengusulkan operator baru.',
      },
    ],
  },
  {
    id: 'mudik',
    title: 'Mudik gratis',
    questions: [
      {
        q: 'Bagaimana cara mendaftar mudik gratis?',
        a: 'Buka nusantara.kemenhub.go.id, pilih Daftar Mudik Gratis, lalu Mudik Gratis Angkutan Jalan dengan penyelenggara Ditjen Perhubungan Darat. Registrasi dilanjutkan di aplikasi MitraDarat.',
      },
      {
        q: 'Kapan pendaftaran mudik gratis dibuka?',
        a: 'Jadwal diumumkan menjelang masa mudik lewat Pengumuman di Beranda dan tab Berita.',
      },
    ],
  },
  {
    id: 'cek-laik',
    title: 'Cek Laik',
    questions: [
      {
        q: 'Apa itu Cek Laik?',
        a: 'Cek Laik menampilkan hasil inspeksi keselamatan terakhir sebuah kendaraan angkutan umum berdasarkan nomor platnya.',
      },
      {
        q: 'Dari mana datanya?',
        a: 'Dari hasil inspeksi keselamatan yang dicatat petugas Ditjen Perhubungan Darat, misalnya di terminal.',
      },
      {
        q: 'Apa arti "Tidak laik jalan"?',
        a: 'Kendaraan tidak lolos satu atau lebih pemeriksaan. Temuan yang tidak lolos ditampilkan di halaman hasil.',
      },
      {
        q: 'Apa arti "Masa berlaku habis"?',
        a: 'Kendaraan pernah lolos inspeksi, tetapi hasilnya sudah melewati tanggal berlaku. Minta operator menunjukkan hasil terbaru.',
      },
      {
        q: 'Kenapa kendaraan tidak ditemukan?',
        a: 'Nomor plat mungkin salah ketik, atau kendaraan belum pernah diinspeksi. Jika yakin datanya seharusnya ada, kirim laporan.',
      },
    ],
  },
  {
    id: 'laporan',
    title: 'Laporan',
    questions: [
      {
        q: 'Bagaimana memantau laporan saya?',
        a: 'Buka Akun → Laporan saya. Setiap laporan punya nomor tiket dan status: Diterima, Diproses, lalu Selesai atau Ditolak.',
      },
      {
        q: 'Kenapa laporan saya ditolak?',
        a: 'Alasannya tertulis di detail laporan, misalnya laporan yang sama sudah tercatat dengan nomor tiket lain.',
      },
      {
        q: 'Apakah foto wajib dilampirkan?',
        a: 'Tidak. Foto opsional, maksimal 3, tetapi membantu petugas memahami masalahnya.',
      },
    ],
  },
  {
    id: 'akun',
    title: 'Akun',
    questions: [
      {
        q: 'Apakah harus masuk akun untuk melacak bus?',
        a: 'Tidak. Akun hanya dibutuhkan untuk mengirim laporan dan menyimpan rute, halte, atau kendaraan.',
      },
      {
        q: 'Bagaimana mengganti bahasa?',
        a: 'Buka Akun → Bahasa, lalu pilih Bahasa Indonesia atau English.',
      },
    ],
  },
];

export type ContactChannel = {
  id: string;
  title: string;
  description: string;
  icon: SymbolName;
};

export const contactChannels: ContactChannel[] = [
  {
    id: 'telepon',
    title: 'Telepon',
    description: 'Untuk pertanyaan yang perlu dijawab langsung',
    icon: { ios: 'phone', android: 'call', web: 'call' },
  },
  {
    id: 'whatsapp',
    title: 'Pesan WhatsApp',
    description: 'Tanya jawab lewat chat',
    icon: { ios: 'message', android: 'chat', web: 'chat' },
  },
  {
    id: 'email',
    title: 'Email',
    description: 'Untuk pertanyaan dengan lampiran dokumen',
    icon: { ios: 'envelope', android: 'mail', web: 'mail' },
  },
];

export const socialChannels: ContactChannel[] = [
  {
    id: 'instagram',
    title: 'Instagram',
    description: 'Info layanan dan kegiatan',
    icon: { ios: 'camera', android: 'photo_camera', web: 'photo_camera' },
  },
  {
    id: 'x',
    title: 'X',
    description: 'Info cepat, termasuk gangguan layanan',
    icon: { ios: 'at', android: 'alternate_email', web: 'alternate_email' },
  },
  {
    id: 'youtube',
    title: 'YouTube',
    description: 'Video edukasi keselamatan',
    icon: { ios: 'play.rectangle', android: 'smart_display', web: 'smart_display' },
  },
  {
    id: 'facebook',
    title: 'Facebook',
    description: 'Info layanan dan pengumuman',
    icon: { ios: 'person.2', android: 'groups', web: 'groups' },
  },
];
