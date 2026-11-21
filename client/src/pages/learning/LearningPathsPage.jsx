import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { learningService } from '../../services/learning.service.js';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';

export default function LearningPathsPage() {
  const [paths, setPaths] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    learningService
      .getPaths()
      .then((r) => setPaths(r.data.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner text="Memuat jalur pembelajaran..." />;

  return (
    <div>
      <p className="eyebrow mb-2">Peta jalan Anda</p>
      <h1 className="page-title">Jalur Pembelajaran</h1>
      <p className="muted mt-2 mb-7 text-smx">
        Sepuluh level, satu perjalanan terhubung. Selesaikan fondasi sebelum melangkah maju.
      </p>

      <div className="space-y-3">
        {paths.map((p, i) => (
          <article key={p._id} className="card flex flex-wrap items-center gap-4">
            <span className="mono muted text-smx">{String(i + 1).padStart(2, '0')}</span>
            <div className="flex-1 min-w-[200px]">
              <h2 className="font-bold">{p.title}</h2>
              <p className="muted text-smx mt-1">{p.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="chip">{p.level.toUpperCase()}</span>
              <span className="muted text-xs">{p.estimatedHours} jam</span>
            </div>
            <Link to="/courses" className="btn small">Buka →</Link>
          </article>
        ))}
      </div>
    </div>
  );
}