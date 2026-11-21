import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { progressService } from '../../services/progress.service.js';
import { learningService } from '../../services/learning.service.js';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import ProgressBar from '../../components/common/ProgressBar.jsx';
import { ArrowRight, Terminal, Braces, Sparkles, Blocks } from 'lucide-react';

export default function OverviewPage() {
  const { user } = useAuth();
  const [overview, setOverview] = useState(null);
  const [paths, setPaths] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      progressService.getOverview().then((r) => r.data.data).catch(() => null),
      learningService.getPaths().then((r) => r.data.data).catch(() => []),
    ])
      .then(([ov, pt]) => {
        setOverview(ov);
        setPaths(pt);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner text="Memuat dashboard..." />;

  const stats = overview?.user?.stats || {};
  const lessons = overview?.lessons || { total: 0, completed: 0, percent: 0 };

  return (
    <div>
      <div className="flex flex-wrap justify-between items-start gap-3 mb-7">
        <div>
          <p className="eyebrow mb-2">Workspace Anda</p>
          <h1 className="page-title">Selamat datang kembali, {user?.name?.split(' ')[0]}.</h1>
          <p className="muted text-smx mt-2">Satu langkah fokus hari ini membangun insting yang lebih baik besok.</p>
        </div>
        <span className="chip">LEVEL SAAT INI · DASAR</span>
      </div>

      {/* Statistik */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="card">
          <p className="muted text-smx">Pelajaran Selesai</p>
          <p className="text-2xl font-bold mt-3">{lessons.completed}</p>
          <p className="muted text-xs mt-2">dari {lessons.total} pelajaran</p>
        </div>
        <div className="card">
          <p className="muted text-smx">Tantangan Selesai</p>
          <p className="text-2xl font-bold mt-3">{overview?.challenges?.solved ?? stats.completedChallenges ?? 0}</p>
          <p className="muted text-xs mt-2">Terus berlatih</p>
        </div>
        <div className="card">
          <p className="muted text-smx">Rata-rata Asesmen</p>
          <p className="text-2xl font-bold mt-3">{overview?.assessments?.averageScore != null ? `${overview.assessments.averageScore}%` : '—'}</p>
          <p className="muted text-xs mt-2">Dari semua asesmen</p>
        </div>
        <div className="card">
          <p className="muted text-smx">Total Poin</p>
          <p className="text-2xl font-bold mt-3">{stats.totalPoints ?? 0}</p>
          <p className="muted text-xs mt-2">Poin terkumpul</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Lanjutkan belajar */}
        <div className="lg:col-span-2 space-y-5">
          <h2 className="section-title">Lanjutkan Belajar</h2>
          <article className="card">
            <div className="flex justify-between gap-3">
              <div>
                <span className="chip">LEVEL 01 · PEMULA</span>
                <h3 className="font-bold mt-3">Dasar-dasar Pemrograman</h3>
                <p className="muted text-smx mt-2">Modul saat ini: Berpikir dalam kode</p>
              </div>
              <span className="accent font-bold">{lessons.percent}%</span>
            </div>
            <div className="mt-6">
              <ProgressBar value={lessons.percent} />
            </div>
            <Link to="/courses" className="btn primary mt-5 inline-flex">Lanjutkan Belajar <ArrowRight size={16} /></Link>
          </article>

          <h2 className="section-title pt-2">Jalur Pembelajaran</h2>
          <div className="card">
            <div className="grid sm:grid-cols-2 gap-2 text-smx">
              {paths.slice(0, 8).map((p, i) => (
                <div key={p._id} className="muted py-1">
                  {String(i + 1).padStart(2, '0')} &nbsp;{p.title}
                </div>
              ))}
            </div>
            <Link to="/paths" className="btn small mt-5 inline-flex">Jelajahi semua level →</Link>
          </div>
        </div>

        {/* Akses cepat */}
        <div className="space-y-5">
          <h2 className="section-title">Langkah Berikutnya</h2>
          <div className="card">
            <p className="eyebrow">Rekomendasi</p>
            <h3 className="font-bold mt-3">
              {lessons.completed === 0 ? 'Mulai dari variabel' : 'Terapkan dengan tantangan'}
            </h3>
            <p className="muted text-smx mt-2">
              {lessons.completed === 0
                ? 'Pelajari bagaimana program menyimpan dan mengubah informasi.'
                : 'Uji pemahaman Anda dengan tantangan coding yang sesuai.'}
            </p>
            <Link to={lessons.completed === 0 ? '/courses' : '/challenges'} className="btn small mt-5 inline-flex">
              Buka pelajaran →
            </Link>
          </div>

          <h2 className="section-title pt-2">Akses Cepat</h2>
          <div className="card space-y-2">
            <Link to="/playground" className="btn w-full justify-start"><Terminal size={16} /> Playground</Link>
            <Link to="/challenges" className="btn w-full justify-start"><Braces size={16} /> Tantangan</Link>
            <Link to="/mentor" className="btn w-full justify-start"><Sparkles size={16} /> Mentor AI</Link>
            <Link to="/projects" className="btn w-full justify-start"><Blocks size={16} /> Proyek</Link>
          </div>
        </div>
      </div>
    </div>
  );
}