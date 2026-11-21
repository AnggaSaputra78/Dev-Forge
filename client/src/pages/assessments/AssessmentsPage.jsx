import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { assessmentService } from '../../services/assessment.service.js';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import { getErrorMessage } from '../../services/api.js';

export default function AssessmentsPage() {
  const [assessments, setAssessments] = useState([]);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    assessmentService
      .getAssessments()
      .then((r) => setAssessments(r.data.data))
      .finally(() => setLoading(false));
  }, []);

  const openAssessment = async (a) => {
    setSelected(a);
    setAnswers({});
    setResult(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selected) return;
    setSubmitting(true);
    try {
      const payload = Object.entries(answers).map(([qIndex, answer]) => ({
        questionIndex: Number(qIndex),
        answer,
      }));
      const res = await assessmentService.submitAttempt(selected._id, payload, 0);
      setResult(res.data.data);
      toast[res.data.success ? 'success' : 'error'](res.data.message);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner text="Memuat asesmen..." />;

  return (
    <div>
      <p className="eyebrow mb-2">Periksa pemahaman</p>
      <h1 className="page-title mb-6">Asesmen</h1>

      {!selected ? (
        <div className="grid md:grid-cols-2 gap-5">
          {assessments.map((a) => (
            <article key={a._id} className="card">
              <span className="chip">CHECKPOINT · {a.questions?.length || 0} PERTANYAAN</span>
              <h2 className="section-title mt-4">{a.title}</h2>
              <p className="muted text-smx mt-2">{a.description}</p>
              <button onClick={() => openAssessment(a)} className="btn primary mt-5">Mulai Asesmen</button>
            </article>
          ))}
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-5">
          <form onSubmit={handleSubmit} className="card lg:col-span-2 space-y-6">
            <h2 className="section-title">{selected.title}</h2>
            {selected.questions?.map((q, i) => (
              <fieldset key={i}>
                <legend className="font-semibold mb-3">{i + 1}. {q.question}</legend>
                {q.options?.map((opt) => (
                  <label key={opt} className="block text-smx mb-2">
                    <input
                      type="radio" name={`q${i}`} value={opt}
                      checked={answers[i] === opt}
                      onChange={() => setAnswers({ ...answers, [i]: opt })}
                      required
                    />{' '}
                    {opt}
                  </label>
                ))}
              </fieldset>
            ))}
            <button type="submit" className="btn primary" disabled={submitting}>
              {submitting ? 'Mengirim...' : 'Kirim jawaban'}
            </button>
            {result && (
              <div className="border-t line pt-4">
                <p className="font-bold">Skor Anda: {result.score}%</p>
                <p className={result.passed ? 'good text-smx mt-1' : 'warn text-smx mt-1'}>
                  {result.passed ? '✓ Lulus' : 'Belum lulus'}
                </p>
              </div>
            )}
          </form>

          <aside className="card h-fit">
            <h2 className="section-title">Petunjuk</h2>
            <p className="muted text-smx mt-3">
              Pilih jawaban untuk setiap pertanyaan, lalu kirim untuk melihat skor dan penjelasan.
            </p>
            <button onClick={() => setSelected(null)} className="btn small mt-4">← Kembali ke daftar</button>
          </aside>
        </div>
      )}
    </div>
  );
}