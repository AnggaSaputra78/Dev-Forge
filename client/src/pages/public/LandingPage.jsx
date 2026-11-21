import { Link } from 'react-router-dom';
import { BookOpen, Terminal, Blocks, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  const features = [
    {
      icon: BookOpen,
      title: 'Pembelajaran terstruktur',
      desc: 'Beranjak dari dasar hingga desain sistem melalui urutan yang jelas.',
    },
    {
      icon: Terminal,
      title: 'Berlatih dalam konteks',
      desc: 'Terapkan pelajaran lewat tantangan terfokus dan playground JavaScript.',
    },
    {
      icon: Blocks,
      title: 'Bangun proyek nyata',
      desc: 'Ubah konsep menjadi milestone, pengujian, dan portofolio.',
    },
  ];

  return (
    <div>
      <section className="max-w-[1180px] mx-auto px-6 pt-24 pb-16">
        <p className="eyebrow mb-5">Jalur yang lebih jelas menuju rekayasa perangkat lunak</p>
        <h1 className="font-bold leading-[1.08] max-w-[960px]" style={{ fontSize: 'clamp(35px,5vw,67px)', letterSpacing: '-0.06em' }}>
          Bangun Keterampilan. Pahami Kode. Rekayasa Perangkat Lunak yang Lebih Baik.
        </h1>
        <p className="muted mt-7 max-w-2xl leading-relaxed">
          Pelajari konsep, berlatih di editor, dan bangun proyek yang menghubungkan teori dengan pekerjaan rekayasa nyata.
        </p>

        <div className="flex flex-wrap gap-3 mt-8">
          <Link to="/register" className="btn primary">Mulai Belajar <ArrowRight size={16} /></Link>
          <Link to="/paths" className="btn">Jelajahi Jalur Pembelajaran</Link>
        </div>

        <div className="flex flex-wrap gap-5 mt-14 pt-6 border-t line muted text-smx">
          <span>01 / Belajar dengan sengaja</span>
          <span>02 / Berlatih secara teratur</span>
          <span>03 / Bangun dengan percaya diri</span>
        </div>
      </section>

      <section className="max-w-[1180px] mx-auto px-6 pb-20">
        <p className="eyebrow mb-4">Dirancang untuk cara pengembang belajar</p>
        <div className="grid md:grid-cols-3 gap-4">
          {features.map(({ icon: Icon, title, desc }) => (
            <article key={title} className="card">
              <Icon size={22} className="accent" />
              <h2 className="section-title mt-4">{title}</h2>
              <p className="muted text-smx mt-2">{desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t line">
        <div className="max-w-[1180px] mx-auto px-6 py-16 grid md:grid-cols-2 gap-8">
          <div>
            <p className="eyebrow mb-4">Metodologi kami</p>
            <h2 className="page-title">Pahami → terapkan → refleksikan.</h2>
            <p className="muted mt-4 leading-relaxed">
              Setiap jalur menghubungkan penjelasan ringkas dengan praktik langsung dan progres yang terukur.
              Petunjuk terbimbing mendukung penalaran Anda, bukan menggantikannya.
            </p>
          </div>
          <div className="card">
            <p className="eyebrow mb-3">Pratinjau jalur</p>
            <p className="font-semibold">Dasar-dasar Pemrograman</p>
            <p className="muted text-smx mt-2">
              Mulai dari variabel, fungsi, dan model mental di balik kode yang baik.
            </p>
            <Link to="/register" className="btn small mt-5">Lihat semua level →</Link>
          </div>
        </div>
      </section>
    </div>
  );
}