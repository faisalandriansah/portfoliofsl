import galleryBootcamp from "@/assets/images/galery/acara bootcamp.webp";
import galleryDemo from "@/assets/images/galery/demo project.webp";
import galleryExpo from "@/assets/images/galery/expo project bersama dosen pembimbing.webp";
import galleryMentor from "@/assets/images/galery/kegiatan kumpul bersama pembimbing magang.webp";
import galleryInternship from "@/assets/images/galery/kegiatan magang.webp";
import galleryIndustry from "@/assets/images/galery/kunjungan industri.webp";
import gallerySeminar from "@/assets/images/galery/seminar hasil magang.webp";

export const navLinks = [
  { label: "About", href: "#tentang" },
  { label: "Project", href: "#proyek" },
  { label: "Journey", href: "#jejak" },
  { label: "Gallery", href: "#galeri" },
  { label: "GitHub", href: "#github" },
  { label: "Contact", href: "#kontak" },
];

export const heroMeta = {
  role: "Full Stack Developer",
  location: "Lumajang, Jawa Timur",
  status: "Becoming More",
};

export const aboutText =
  "I'm a technology enthusiast who enjoys solving problems, exploring new ideas, and building web applications that make a difference. I believe in continuous learning and growing through every challenge.";

export const IPK = 3.71;

export const stats = [
  {
    n: 11,
    suffix: "+",
    label: "Months of Industry Experience at the Inspectorate",
  },
  { n: 19, suffix: "", label: "Technologies in the Stack" },
  { n: 1, suffix: "", label: "LSP Competency Certification" },
];

export const projects = [
  {
    key: "careermate",
    bar: "careermate · analisis cv berbasis ai",
    sh: "38%",
    n: "01 — Personal Project",
    title: "CareerMate AI",
    desc: "Aplikasi web berbasis AI yang membantu pencari kerja menganalisis CV, mengevaluasi keterampilan, dan mendapatkan rekomendasi karier yang relevan.",
    tags: ["Laravel 12", "Vue 3", "AI", "MySQL", "Tailwind CSS"],
    detail: {
      category: "Personal Project · 2026",
      role: "Full Stack Developer",
      overview:
        "Platform pengembangan karier berbasis AI yang membantu pencari kerja mengevaluasi CV, memahami keterampilan yang dimiliki, dan menemukan peluang karier yang sesuai.",
      challenge:
        "Pencari kerja sering kesulitan mengevaluasi kualitas CV, mengenali keterampilan yang perlu ditingkatkan, dan menentukan arah karier yang sesuai.",
      solution:
        "Mengembangkan aplikasi web yang mengintegrasikan analisis CV berbasis AI, evaluasi keterampilan, rekomendasi karier, dan laporan hasil analisis.",
      features: [
        "Unggah dan pemrosesan CV",
        "Analisis CV berbasis AI",
        "Evaluasi keterampilan",
        "Rekomendasi karier",
        "Riwayat analisis dan dashboard",
        "Unduh laporan dalam format PDF",
      ],
      link: "https://github.com/faisalandriansah/careermate-teman-diskusi-karir",
      linkLabel: "View on GitHub",
    },
  },
  {
    key: "inspektorat",
    bar: "wbs · whistleblowing system",
    sh: "34%",
    n: "02 — Pemerintahan",
    title: "Whistleblowing System",
    desc: "Redesain dan pengembangan Whistleblowing System untuk Inspektorat Daerah Kabupaten Lumajang, dilanjutkan dengan integrasi chatbot berbasis AI.",
    tags: ["CodeIgniter 3", "PHP", "MySQL", "n8n", "AI", "Bootstrap 5"],
    detail: {
      category: "Tugas Akhir · Pemerintahan",
      role: "Web Developer & AI Integration",
      overview:
        "Pengembangan Whistleblowing System (WBS) untuk Inspektorat Daerah Kabupaten Lumajang, mulai dari redesain antarmuka dan alur sistem hingga penambahan chatbot berbasis AI sebagai bagian dari tugas akhir.",
      challenge:
        "Meningkatkan kemudahan penggunaan sistem pelaporan serta mempermudah akses informasi mengenai persyaratan dan prosedur pelaporan.",
      solution:
        "Melakukan redesain dan pengembangan WBS menggunakan CodeIgniter 3, PHP, dan MySQL, kemudian mengintegrasikan chatbot berbasis AI melalui workflow automation n8n.",
      features: [
        "Redesain antarmuka dan alur sistem WBS",
        "Pengembangan sistem pelaporan",
        "Informasi persyaratan dan prosedur pelaporan",
        "Chatbot berbasis AI dengan n8n",
        "Informasi dan pelacakan status laporan",
      ],
      link: "https://wbs.itdalumajang.id/",
      linkLabel: "Buka website",
    },
  },
  {
    key: "sppg",
    bar: "sppg wiratama · sistem informasi",
    sh: "32%",
    n: "03 — Sistem Informasi",
    title: "SPPG Wiratama",
    desc: "Pengembangan website dan sistem informasi untuk mendukung operasional, administrasi, serta pemantauan aktivitas SPPG Wiratama.",
    tags: ["CodeIgniter 3", "PHP", "MySQL", "Bootstrap 5"],
    detail: {
      category: "Sistem Informasi · Operasional",
      role: "Full Stack Developer",
      overview:
        "Platform web SPPG Wiratama yang mencakup landing page sebagai halaman informasi publik dan dashboard admin untuk pengelolaan data serta pemantauan aktivitas operasional.",
      challenge:
        "Informasi publik dan berbagai aktivitas operasional membutuhkan platform terpusat agar penyampaian informasi, administrasi, dan pemantauan data dapat dilakukan secara terstruktur.",
      solution:
        "Mengembangkan landing page dan sistem administrasi berbasis web menggunakan CodeIgniter 3, PHP, dan MySQL dengan modul pengelolaan data, presensi, penilaian, pengiriman, serta pengaduan.",
      features: [
        "Landing page informasi SPPG Wiratama",
        "Dashboard monitoring operasional",
        "Manajemen pengguna, relawan, dan sekolah",
        "Pencatatan serta laporan presensi",
        "Manajemen jadwal shift dan aktivitas luar tugas",
        "Penilaian relawan dan persetujuan",
        "Pengelolaan pengiriman",
        "Monitoring survei dan respons keluhan",
        "Pengaturan menu, hak akses, dan arsip",
      ],
      link: "https://sppgwiratama.com/",
      linkLabel: "Buka website",
    },
  },
  {
    key: "elibrary-spenyosi",
    bar: "e-library spenyosi · literasi digital",
    sh: "—",
    n: "04 — Pendidikan",
    title: "E-Library Spenyosi",
    desc: "Sistem perpustakaan digital untuk mencatat kunjungan dan aktivitas membaca siswa SMP Negeri 1 Yosowilangun, Lumajang.",
    tags: ["Laravel 11", "PHP", "MySQL", "Bootstrap 5"],
    detail: {
      category: "Sistem Informasi · Pendidikan",
      role: "Full Stack Developer",
      overview:
        "Platform perpustakaan digital SMP Negeri 1 Yosowilangun yang mencakup landing page publik, portal siswa untuk mencatat kunjungan dan buku yang dibaca, serta dashboard admin untuk mengelola data dan memantau aktivitas literasi.",
      challenge:
        "Pencatatan kunjungan perpustakaan dan aktivitas membaca siswa membutuhkan pengelolaan data yang terpusat agar lebih mudah dipantau, direkap, dan dilaporkan.",
      solution:
        "Mengembangkan aplikasi berbasis Laravel 11 dan MySQL dengan autentikasi admin dan siswa, pencatatan kehadiran, pengelolaan data siswa, dashboard statistik, serta ekspor laporan.",
      features: [
        "Landing page informasi perpustakaan",
        "Login siswa menggunakan NIS",
        "Dashboard siswa dan riwayat kunjungan",
        "Pencatatan kehadiran dan buku yang dibaca",
        "Dashboard admin dengan statistik aktivitas literasi",
        "Manajemen data siswa",
        "Import data siswa dari Excel",
        "Filter dan pencarian laporan kehadiran",
        "Ekspor laporan ke Excel dan PDF",
        "Monitoring aktivitas terkini siswa",
        "Hak akses admin dan siswa",
      ],
      link: "https://github.com/faisalandriansah/website-E-Library-Spenyosi",
      linkLabel: "View on GitHub",
    },
  },
  {
    key: "ypab",
    bar: "y-pab lumajang · web profil & cms",
    sh: "100%",
    n: "05 — Web Profil Organisasi",
    title: "Y-PAB Kabupaten Lumajang",
    desc: "Website profil Yayasan Peduli Anak Bangsa Kabupaten Lumajang dengan CMS untuk publikasi informasi, berita, kegiatan, dan program yayasan.",
    tags: ["CodeIgniter 3", "PHP", "MySQL", "Tailwind CSS"],
    detail: {
      category: "Web Profil Organisasi · CMS",
      role: "Full Stack Developer",
      overview:
        "Website profil Yayasan Peduli Anak Bangsa (Y-PAB) Kabupaten Lumajang yang menyajikan informasi organisasi dan publikasi kegiatan, dilengkapi CMS admin untuk mengelola konten secara terpusat.",
      challenge:
        "Informasi profil, program, kegiatan, dan publikasi yayasan membutuhkan platform terpusat yang mudah diakses masyarakat serta mudah diperbarui oleh pengurus.",
      solution:
        "Mengembangkan website berbasis CodeIgniter 3 dan MySQL dengan halaman publik responsif serta CMS admin untuk mengelola berita, artikel, kegiatan, dan publikasi, termasuk unggah gambar dan dokumen PDF.",
      features: [
        "Halaman profil dan informasi yayasan",
        "Informasi kepengurusan dan program",
        "Publikasi berita, artikel, dan kegiatan",
        "Manajemen publikasi gambar dan PDF",
        "Dashboard admin dengan statistik konten",
        "Autentikasi dan manajemen sesi pengguna",
        "Pencarian dan pagination konten",
        "Penghitung kunjungan berita",
        "Pratinjau brosur PDF",
        "Carousel kepengurusan",
        "Halaman donasi dan kontak",
        "Tampilan responsif dengan Tailwind CSS",
      ],
      link: "https://github.com/sangruh/ypablumajang",
      linkLabel: "View on GitHub",
    },
  },
  {
    key: "eksploramuda",
    bar: "eksplora muda · travel & tourism",
    sh: "100%",
    n: "06 — Landing Page",
    title: "Eksplora Muda Trip",
    desc: "Landing page agensi wisata untuk mempromosikan paket open trip dan private trip dengan alur pemesanan langsung melalui WhatsApp.",
    tags: ["React", "TypeScript", "Vite", "Tailwind CSS", "Framer Motion"],
    detail: {
      category: "Landing Page · Travel & Tourism",
      role: "Frontend Developer",
      overview:
        "Website pemasaran Eksplora Muda Trip yang menampilkan destinasi wisata, pilihan paket perjalanan, informasi harga, dan testimoni untuk membantu calon wisatawan menentukan perjalanan.",
      challenge:
        "Calon wisatawan membutuhkan informasi destinasi dan paket perjalanan yang jelas serta cara menghubungi penyedia trip tanpa proses pemesanan yang rumit.",
      solution:
        "Mengembangkan landing page responsif menggunakan React, TypeScript, dan Tailwind CSS dengan interaksi dinamis, detail paket wisata, serta integrasi WhatsApp untuk mempermudah calon pelanggan menghubungi penyedia trip.",
      features: [
        "Hero carousel destinasi wisata",
        "Pencarian paket berdasarkan tujuan, tanggal, dan tipe trip",
        "Filter destinasi populer",
        "Detail paket wisata melalui modal",
        "Informasi harga, fasilitas, dan promo",
        "Integrasi WhatsApp dengan pesan otomatis",
        "Testimoni dan rating pelanggan",
        "Animasi antarmuka dengan Framer Motion",
        "Optimasi SEO dan Open Graph",
        "Tampilan responsif untuk desktop dan mobile",
      ],
      link: "https://eksplora-muda.vercel.app/",
      linkLabel: "Buka website",
    },
  },
  {
    key: "deardeadline",
    bar: "deardeadline · academic services",
    sh: "100%",
    n: "07 — Landing Page",
    title: "DearDeadline",
    desc: "Landing page layanan asistensi akademik untuk siswa dan mahasiswa, dilengkapi kategori layanan, paket harga, testimoni, dan pemesanan melalui WhatsApp.",
    tags: ["React", "TypeScript", "Vite", "Tailwind CSS", "Framer Motion"],
    detail: {
      category: "Landing Page · Education Service",
      role: "Frontend Developer",
      overview:
        "Website pemasaran DearDeadline yang menyajikan informasi layanan asistensi akademik, pilihan paket harga, dan testimoni untuk membantu calon pengguna menemukan layanan yang sesuai.",
      challenge:
        "Calon pengguna membutuhkan informasi layanan dan harga yang mudah dipahami serta cara berkonsultasi dengan admin secara praktis.",
      solution:
        "Mengembangkan landing page responsif menggunakan React, TypeScript, dan Tailwind CSS dengan animasi interaktif, pemilihan layanan, dan integrasi WhatsApp untuk mempermudah konsultasi.",
      features: [
        "Hero section dengan animasi buku 3D",
        "Modal pemilihan layanan",
        "Navbar sticky dan menu mobile",
        "Enam kategori layanan akademik",
        "Tiga paket harga: Pelajar, Mahasiswa, dan Express",
        "Carousel testimoni dengan rating",
        "CTA dengan ilustrasi laptop animasi",
        "WhatsApp dengan pesan otomatis sesuai paket",
        "Animasi antarmuka menggunakan Framer Motion",
        "Tampilan responsif untuk desktop dan mobile",
      ],
      link: "https://deardeadlinejoki.vercel.app/",
      linkLabel: "Buka website",
    },
  },
  // {
  //   key: "github",
  //   bar: "github.com/faisalandriansah",
  //   sh: "30%",
  //   n: "08 — Open source",
  //   title: "Lebih banyak di GitHub",
  //   desc: "Kumpulan proyek dan eksperimen lainnya tersedia di profil GitHub.",
  //   tags: ["Open source", "Portfolio"],
  //   detail: {
  //     category: "Open Source",
  //     role: "Builder and Maintainer",
  //     overview:
  //       "Kumpulan proyek, eksperimen, dan pembelajaran yang saya bangun sepanjang proses menjadi developer.",
  //     challenge:
  //       "Menjaga proses belajar tetap konsisten melalui proyek nyata dan eksperimen kecil.",
  //     solution:
  //       "Mendokumentasikan eksplorasi teknologi dan membagikan hasilnya melalui GitHub.",
  //     features: [
  //       "Eksperimen teknologi",
  //       "Proyek web",
  //       "Reusable components",
  //       "Catatan pembelajaran",
  //     ],
  //     link: "https://github.com/faisalandriansah",
  //     linkLabel: "View on GitHub",
  //   },
  // },
];

export const timeline = [
  {
    date: "DEC 2025 — JUN 2026",
    title: "Junior Full Stack Developer",
    organization: "Project-Based · Inspektorat Daerah Kabupaten Lumajang",
    desc: "Contributed to web application development and workflow automation projects, transforming ideas and requirements into practical digital solutions.",
  },
  {
    date: "JUL — OCT 2025",
    title: "Full Stack Developer Intern",
    organization: "Inspektorat Daerah Kabupaten Lumajang",
    desc: "Gained hands-on experience in web development, contributing to internal applications and improving existing system interfaces and workflows.",
  },
  {
    date: "2023 — 2026",
    title: "D3 Information Technology",
    organization: "Politeknik Negeri Malang · PSDKU Lumajang",
    desc: "Built a foundation in software development, database management, information systems, and problem-solving.",
  },
  {
    date: "2020 — 2023",
    title: "Computer and Network Engineering",
    organization: "SMK Negeri 1 Lumajang",
    desc: "Developed foundational knowledge of computer systems, networking, hardware, and information technology.",
  },
];

export const gallery = [
  {
    image: galleryInternship,
    text: "Internship days",
  },
  {
    image: galleryMentor,
    text: "Learning with mentors",
  },
  {
    image: galleryDemo,
    text: "Project demonstration",
  },
  {
    image: galleryExpo,
    text: "Project exhibition",
  },
  {
    image: gallerySeminar,
    text: "Internship presentation",
  },
  {
    image: galleryBootcamp,
    text: "Bootcamp session",
  },
  {
    image: galleryIndustry,
    text: "Industry visit",
  },
];
