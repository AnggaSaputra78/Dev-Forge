import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { learningService } from '../../services/learning.service.js';
import { progressService } from '../../services/progress.service.js';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import ProgressBar from '../../components/common/ProgressBar.jsx';
import { ChevronDown } from 'lucide-react';

export default function CourseDetailPage() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [progress, setProgress] = useState(null);
  const [moduleLessons, setModuleLessons] = useState({});
  const [openModule, setOpenModule] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const courseRes = await learningService.getCourse(id);
        setCourse(courseRes.data.data);

        const progRes = await progressService.getCourseProgress(id).catch(() => null);
        if (progRes) setProgress(progRes.data.data);

        // Muat pelajaran modul pertama secara default
        const modules = courseRes.data.data.modules || [];
        if (modules.length > 0) {
          setOpenModule(modules[0]._id);
          const lessonRes = await learningService.getModuleLessons(modules[0]._id);
          setModuleLessons({ [modules[0]._id]: lessonRes.data.data });
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const toggleModule = async (moduleId) => {
    if (openModule === moduleId) {
      setOpenModule(null);
      return;
    }
    setOpenModule(moduleId);
    if (!moduleLessons[moduleId]) {
      const res = await learningService.getModuleLessons(moduleId);
      setModuleLessons((prev) => ({ ...prev, [moduleId]: res.data.data }));
    }
  };

  if (loading) return <LoadingSpinner text="Memuat kursus..." />;
  if (!course) return <p className="muted">Kursus tidak ditemukan.</p>;

  const completedIds = progress?.completedLessonIds || [];

  return (
    <div>
      <Link to="/courses" className="accent text-smx">← Kursus Saya</Link>
      <p className="eyebrow mt-4 mb-2">Level 01 · Ikhtisar kursus</p>
      <h1 className="page-title">{course.title}</h1>
      <p className="muted mt-3 max-w-2xl">{course.description}</p>

      <div className="flex flex-wrap gap-2 mt-5">
        <span className="chip">{course.level.toUpperCase()}</span>
        <span className="chip">{course.modules?.length || 0} MODUL</span>
        <span className="chip">~ {course.estimatedHours} JAM</span>
      </div>

      <div className="grid lg:grid-cols-3 gap-7 mt-7">
        <div className="lg:col-span-2">
          <h2 className="section-title mb-3">Modul kursus</h2>
          <div className="space-y-3">
            {course.modules?.map((m, i) => (
              <div key={m._id} className="card !p-0 overflow-hidden">
                <button
                  onClick={() => toggleModule(m._id)}
                  className="w-full text-left px-5 py-4 flex justify-between items-center font-semibold"
                >
                  <span>{String(i + 1).padStart(2, '0')} &nbsp;{m.title}</span>
                  <ChevronDown size={16} className="muted" />
                </button>

                {openModule === m._id && (
                  <div className="border-t line px-5 py-3">
                    {moduleLessons[m._id]?.length ? (
                      moduleLessons[m._id].map((lesson) => (
                        <Link
                          key={lesson._id}
                          to={`/lessons/${lesson._id}`}
                          className="nav-btn"
                        >
                          <span className={completedIds.includes(lesson._id) ? 'good' : 'muted'}>
                            {completedIds.includes(lesson._id) ? '✓' : '•'}
                          </span>
                          {lesson.title}
                        </Link>
                      ))
                    ) : (
                      <p className="muted text-smx">Belum ada pelajaran di modul ini.</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <aside className="space-y-4">
          <div className="card">
            <h2 className="section-title">Progres Anda</h2>
            <p className="accent text-2xl font-bold mt-3">{progress?.percent ?? 0}%</p>
            <div className="mt-3">
              <ProgressBar value={progress?.percent ?? 0} />
            </div>
          </div>

          <div className="card">
            <h2 className="section-title">Yang akan Anda pelajari</h2>
            <ul className="muted text-smx mt-3 space-y-2 list-disc pl-5">
              {course.objectives?.map((o, i) => <li key={i}>{o}</li>)}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}