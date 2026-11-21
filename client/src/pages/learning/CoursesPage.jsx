import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { learningService } from '../../services/learning.service.js';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    learningService
      .getCourses()
      .then((r) => setCourses(r.data.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner text="Memuat kursus..." />;

  return (
    <div>
      <p className="eyebrow mb-2">Perpustakaan Anda</p>
      <h1 className="page-title mb-6">Kursus Saya</h1>

      {courses.length === 0 ? (
        <EmptyState title="Belum ada kursus" description="Jalankan seed untuk mengisi data kursus." />
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {courses.map((c) => (
            <article key={c._id} className="card">
              <span className="chip">{c.level.toUpperCase()}</span>
              <h2 className="section-title mt-4">{c.title}</h2>
              <p className="muted text-smx mt-2">{c.description}</p>
              <div className="flex flex-wrap gap-2 mt-4">
                {c.tags?.map((t) => <span key={t} className="chip">{t}</span>)}
              </div>
              <Link to={`/courses/${c._id}`} className="btn primary mt-5 inline-flex">Lihat Kursus</Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}