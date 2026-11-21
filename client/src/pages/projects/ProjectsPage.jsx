import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { projectService } from '../../services/project.service.js';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    projectService
      .getProjects()
      .then((r) => setProjects(r.data.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner text="Memuat proyek..." />;

  return (
    <div>
      <p className="eyebrow mb-2">Bangun untuk memahami</p>
      <h1 className="page-title mb-2">Lab Proyek</h1>
      <p className="muted text-smx mb-6">Ikuti milestone dari kebutuhan hingga verifikasi.</p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((p) => (
          <article key={p._id} className="card">
            <span className="chip">{p.level.toUpperCase()}</span>
            <h2 className="section-title mt-4">{p.title}</h2>
            <p className="muted text-smx mt-2">{p.description}</p>
            <p className="text-xs muted mt-5">{p.milestones?.length || 0} milestone</p>
            <Link to={`/projects/${p._id}`} className="btn small mt-5 inline-flex">Lihat Proyek →</Link>
          </article>
        ))}
      </div>
    </div>
  );
}