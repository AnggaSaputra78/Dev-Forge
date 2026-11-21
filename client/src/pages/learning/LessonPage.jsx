import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { learningService } from '../../services/learning.service.js';
import { progressService } from '../../services/progress.service.js';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import { getErrorMessage } from '../../services/api.js';

export default function LessonPage() {
  const { id } = useParams();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    learningService
      .getLesson(id)
      .then((r) => setLesson(r.data.data))
      .finally(() => setLoading(false));
  }, [id]);

  const handleComplete = async () => {
    setCompleting(true);
    try {
      await progressService.completeLesson(id, 0);
      setCompleted(true);
      toast.success('Pelajaran ditandai selesai. +5 poin!');
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setCompleting(false);
    }
  };

  if (loading) return <LoadingSpinner text="Memuat pelajaran..." />;
  if (!lesson) return <p className="muted">Pelajaran tidak ditemukan.</p>;

  return (
    <div className="grid lg:grid-cols-3 gap-5">
      <article className="card lg:col-span-2">
        <p className="eyebrow mb-3">{lesson.course?.title} · {lesson.module?.title}</p>
        <h1 className="page-title">{lesson.title}</h1>
        <div className="border-t line mt-6 pt-6">
          <h2 className="section-title">Tujuan pembelajaran</h2>
          <ul className="muted text-smx list-disc pl-5 mt-3 space-y-2">
            {lesson.objectives?.map((o, i) => <li key={i}>{o}</li>)}
          </ul>
        </div>

        <div className="mt-7">
          <h2 className="section-title">Materi</h2>
          <p className="muted leading-relaxed mt-3">{lesson.content}</p>

          {lesson.codeExample?.code && (
            <>
              <h2 className="section-title mt-7">Contoh kode</h2>
              <pre className="code-preview mt-4">{lesson.codeExample.code}</pre>
            </>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mt-8 pt-5 border-t line">
          <button onClick={handleComplete} className="btn primary" disabled={completing || completed}>
            {completed ? '✓ Sudah selesai' : completing ? 'Menyimpan...' : 'Tandai pelajaran selesai'}
          </button>
        </div>
      </article>

      <aside className="card">
        <h2 className="section-title">Konsep kunci</h2>
        <div className="flex flex-wrap gap-2 mt-3">
          <span className="chip">Variabel</span>
          <span className="chip">Nilai</span>
          <span className="chip">Penamaan</span>
        </div>

        <h2 className="section-title mt-7">Navigasi cepat</h2>
        <a href="/playground" className="btn small mt-3 w-full">Coba di Playground</a>
        <a href="/mentor" className="btn small mt-2 w-full">Tanya Mentor AI</a>
      </aside>
    </div>
  );
}