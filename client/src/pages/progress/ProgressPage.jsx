import { useEffect, useState } from 'react';
import { progressService } from '../../services/progress.service.js';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import ProgressBar from '../../components/common/ProgressBar.jsx';

export default function ProgressPage() {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    progressService
      .getOverview()
      .then((r) => setOverview(r.data.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner text="Memuat laporan..." />;

  const lessons = overview?.lessons || { total: 0, completed: 0, percent: 0 };
  const stats = overview?.user?.stats || {};

  const skills = [
    { name: 'Dasar pemrograman', value: Math.min(100, lessons.completed * 25) },
    { name: 'Pemecahan masalah', value: Math.min(100, (overview?.challenges?.solved || 0) * 40) },
    { name: 'JavaScript', value: Math.min(100, lessons.completed * 15 + (overview?.challenges?.solved || 0) * 15) },
  ];

  return (
    <div>
      <p className="eyebrow mb-2">Analitik belajar</p>
      <h1 className="page-title mb-6">Laporan Progres</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <div className="card">
          <p className="muted text-smx">Progres keseluruhan</p>
          <p className="text-2xl font-bold mt-3">{lessons.percent}%</p>
        </div>
        <div className="card">
          <p className="muted text-smx">Pelajaran selesai</p>
          <p className="text-2xl font-bold mt-3">{lessons.completed}</p>
        </div>
        <div className="card">
          <p className="muted text-smx">Tantangan diselesaikan</p>
          <p className="text-2xl font-bold mt-3">{overview?.challenges?.solved || 0}</p>
        </div>
        <div className="card">
          <p className="muted text-smx">Total poin</p>
          <p className="text-2xl font-bold mt-3">{stats.totalPoints || 0}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <div className="card">
          <h2 className="section-title mb-5">Kemahiran keterampilan</h2>
          <div className="space-y-5">
            {skills.map((s) => (
              <div key={s.name}>
                <div className="flex justify-between text-smx mb-2">
                  <span>{s.name}</span>
                  <span className="muted">{s.value}%</span>
                </div>
                <ProgressBar value={s.value} />
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="section-title">Area untuk diperkuat</h2>
          <p className="muted text-smx mt-3">
            {lessons.completed === 0
              ? 'Mulai kursus dasar untuk menemukan area yang perlu difokuskan.'
              : 'Terjemahkan konsep menjadi kode dengan tantangan singkat.'}
          </p>
        </div>
      </div>
    </div>
  );
}