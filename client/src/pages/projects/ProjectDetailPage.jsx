import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { projectService } from '../../services/project.service.js';
import { progressService } from '../../services/progress.service.js';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import ProgressBar from '../../components/common/ProgressBar.jsx';

export default function ProjectDetailPage() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [progress, setProgress] = useState({ status: 'not_started', completedMilestones: [], progress: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    projectService
      .getProject(id)
      .then((r) => {
        setProject(r.data.data.project);
        setProgress(r.data.data.progress);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const toggleMilestone = async (index, checked) => {
    try {
      const res = await progressService.updateMilestone(id, index, checked);
      setProgress(res.data.data);
      toast.success('Milestone diperbarui');
    } catch {
      toast.error('Gagal memperbarui milestone');
    }
  };

  if (loading) return <LoadingSpinner text="Memuat proyek..." />;
  if (!project) return <p className="muted">Proyek tidak ditemukan.</p>;

  return (
    <div>
      <Link to="/projects" className="accent text-smx">← Lab Proyek</Link>
      <p className="eyebrow mt-4 mb-2">Ringkasan proyek</p>
      <h1 className="page-title">{project.title}</h1>
      <p className="muted mt-3">{project.description}</p>

      <div className="grid lg:grid-cols-2 gap-7 mt-7">
        <div className="space-y-4">
          <div className="card">
            <h2 className="section-title">Kebutuhan & spesifikasi teknis</h2>
            <p className="muted text-smx mt-3">{project.requirements}</p>
          </div>
          {project.technicalSpecs && (
            <div className="card">
              <h2 className="section-title">Spesifikasi teknis</h2>
              <p className="muted text-smx mt-3">{project.technicalSpecs}</p>
            </div>
          )}
        </div>

        <aside className="space-y-4">
          <div className="card">
            <h2 className="section-title">Milestone implementasi</h2>
            <div className="mt-4 space-y-3">
              {project.milestones?.sort((a, b) => a.order - b.order).map((m) => (
                <label key={m.order} className="flex gap-2 items-start text-smx">
                  <input
                    type="checkbox"
                    checked={progress.completedMilestones?.includes(m.order) || false}
                    onChange={(e) => toggleMilestone(m.order, e.target.checked)}
                  />
                  <span>{m.title}</span>
                </label>
              ))}
            </div>
            <div className="mt-4">
              <ProgressBar value={progress.progress} />
            </div>
            <p className="muted text-xs mt-2">{progress.progress}% selesai</p>
          </div>
        </aside>
      </div>
    </div>
  );
}