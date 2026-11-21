import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import Editor from '@monaco-editor/react';
import { codingService } from '../../services/coding.service.js';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import { getErrorMessage } from '../../services/api.js';

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState([]);
  const [selected, setSelected] = useState(null);
  const [code, setCode] = useState('');
  const [result, setResult] = useState('Jalankan tes untuk memeriksa solusi Anda.');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    codingService
      .getChallenges()
      .then((r) => {
        setChallenges(r.data.data);
        if (r.data.data.length) selectChallenge(r.data.data[0]);
      })
      .finally(() => setLoading(false));
  }, []);

  const selectChallenge = (c) => {
    setSelected(c);
    setCode(c.starterCode?.code || '');
    setResult('Jalankan tes untuk memeriksa solusi Anda.');
    setShowHint(false);
  };

  const handleSubmit = async () => {
    if (!selected) return;
    setSubmitting(true);
    try {
      const res = await codingService.submitSolution(selected._id, code);
      const sub = res.data.data;
      const lines = sub.testResults.map((t, i) =>
        `${t.passed ? 'PASS' : 'FAIL'} · Tes ${i + 1} · diharapkan ${JSON.stringify(t.expected)}, diterima ${JSON.stringify(t.actual)}${t.error ? ' · ' + t.error : ''}`
      );
      setResult(lines.join('\n') + `\n\n${sub.passedTests}/${sub.totalTests} tes lulus.`);
      toast[ res.data.success ? 'success' : 'error' ](res.data.message);
    } catch (error) {
      setResult('Error: ' + getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner text="Memuat tantangan..." />;

  return (
    <div>
      <p className="eyebrow mb-2">Berlatih dengan tujuan</p>
      <h1 className="page-title mb-5">Tantangan Coding</h1>

      <div className="flex flex-wrap gap-2 mb-5">
        {challenges.map((c, i) => (
          <button
            key={c._id}
            onClick={() => selectChallenge(c)}
            className={`btn small ${selected?._id === c._id ? 'primary' : ''}`}
          >
            {String(i + 1).padStart(2, '0')} · {c.title}
          </button>
        ))}
      </div>

      {selected && (
        <div className="grid lg:grid-cols-2 gap-5">
          <article className="card">
            <span className="chip">{selected.difficulty.toUpperCase()}</span>
            <h2 className="section-title mt-4">{selected.title}</h2>
            <p className="muted text-smx mt-3">{selected.description}</p>

            <h3 className="font-semibold mt-6">Batasan</h3>
            <p className="muted text-smx mt-2">{selected.constraints}</p>

            <h3 className="font-semibold mt-6">Contoh</h3>
            <pre className="code-preview mt-3">{selected.example?.input} → {selected.example?.output}</pre>

            <button onClick={() => setShowHint(!showHint)} className="btn small mt-5">
              {showHint ? 'Sembunyikan petunjuk' : 'Tampilkan petunjuk'}
            </button>
            {showHint && <p className="muted text-smx mt-3">{selected.hint}</p>}
          </article>

          <div className="surface rounded-xl overflow-hidden">
            <div className="surface2 px-4 py-3 mono text-smx">solution.js</div>
            <Editor
              height="300px"
              defaultLanguage="javascript"
              value={code}
              onChange={(v) => setCode(v || '')}
              theme="vs-dark"
              options={{ minimap: { enabled: false }, fontSize: 13 }}
            />
            <div className="flex gap-2 px-4 py-3 border-t line">
              <button onClick={handleSubmit} className="btn primary small" disabled={submitting}>
                {submitting ? 'Menjalankan...' : 'Jalankan Tes'}
              </button>
            </div>
            <div className="console">{result}</div>
          </div>
        </div>
      )}
    </div>
  );
}