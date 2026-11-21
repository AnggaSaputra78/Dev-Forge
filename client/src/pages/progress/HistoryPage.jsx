import { useEffect, useState } from 'react';
import { progressService } from '../../services/progress.service.js';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';

export default function HistoryPage() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    progressService
      .getActivities()
      .then((r) => setActivities(r.data.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner text="Memuat riwayat..." />;

  return (
    <div>
      <p className="eyebrow mb-2">Linimasa Anda</p>
      <h1 className="page-title mb-6">Riwayat Belajar</h1>

      {activities.length === 0 ? (
        <EmptyState
          title="Belum ada aktivitas"
          description="Pelajaran dan tantangan yang Anda selesaikan akan muncul di sini."
        />
      ) : (
        <div className="card">
          {activities.map((a) => (
            <div key={a._id} className="list-row flex justify-between items-center gap-3">
              <div>
                <p className="font-semibold text-smx">{a.title}</p>
                <p className="muted text-xs mt-1">
                  {new Date(a.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
              {a.metadata?.points > 0 && <span className="accent text-smx">+{a.metadata.points} poin</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}