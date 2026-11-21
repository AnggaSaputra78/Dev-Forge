import { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Play, RotateCcw, Save } from 'lucide-react';

const DEFAULT_CODE = `// Tulis kode JavaScript Anda di sini, lalu klik "Jalankan Kode"
const angka = [2, 4, 6];
const total = angka.reduce((jumlah, n) => jumlah + n, 0);
console.log("Total:", total);
`;

export default function PlaygroundPage() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [output, setOutput] = useState('Siap. Jalankan kode Anda untuk melihat output.');
  const [theme, setTheme] = useState('dark');

  // Jalankan kode di browser (lebih aman daripada di server untuk playground)
  const runCode = () => {
    const lines = [];
    const fakeConsole = {
      log: (...args) => lines.push(args.map(formatVal).join(' ')),
      error: (...args) => lines.push('ERROR: ' + args.map(formatVal).join(' ')),
      warn: (...args) => lines.push('WARN: ' + args.map(formatVal).join(' ')),
    };

    try {
      const fn = new Function('console', `"use strict";\n${code}`);
      fn(fakeConsole);
      setOutput(lines.length ? lines.join('\n') : 'Kode berjalan sukses tanpa output.');
    } catch (err) {
      setOutput('Error: ' + err.message);
    }
  };

  const formatVal = (v) => {
    if (typeof v === 'object' && v !== null) {
      try { return JSON.stringify(v); } catch { return String(v); }
    }
    return String(v);
  };

  const saveDraft = () => {
    sessionStorage.setItem('playground-draft', code);
    setOutput('Draft disimpan untuk sesi ini.');
  };

  const resetCode = () => {
    setCode(DEFAULT_CODE);
    setOutput('Editor dikembalikan ke kode awal.');
  };

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-3 mb-5">
        <div>
          <p className="eyebrow">Workspace latihan</p>
          <h1 className="page-title">Playground Kode</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={runCode} className="btn primary small"><Play size={14} /> Jalankan</button>
          <button onClick={resetCode} className="btn small"><RotateCcw size={14} /> Reset</button>
          <button onClick={saveDraft} className="btn small"><Save size={14} /> Simpan</button>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-5">
        <div className="lg:col-span-3 surface rounded-xl overflow-hidden">
          <div className="surface2 border-b line px-4 py-3 text-smx mono flex justify-between">
            <span>⌁ main.js</span>
            <span className="muted">JavaScript</span>
          </div>

          <Editor
            height="360px"
            defaultLanguage="javascript"
            value={code}
            onChange={(v) => setCode(v || '')}
            theme={theme === 'light' ? 'light' : 'vs-dark'}
            options={{ minimap: { enabled: false }, fontSize: 13, scrollBeyondLastLine: false }}
          />

          <div className="border-t line px-4 py-2 text-xs muted">OUTPUT KONSOL</div>
          <div className="console">{output}</div>
        </div>

        <aside className="card">
          <h2 className="section-title">Panduan workspace</h2>
          <p className="muted text-smx mt-3">
            Tulis JavaScript, periksa output, dan perbaiki pendekatan Anda. Kode dijalankan di browser Anda sendiri.
          </p>
          <div className="list-row text-smx mt-5">Berkas <span className="muted float-right">main.js</span></div>
          <div className="list-row text-smx">Runtime <span className="muted float-right">Browser</span></div>
          <p className="text-xs muted mt-5">
            Ini adalah sandbox belajar. Hindari menempelkan data pribadi.
          </p>
        </aside>
      </div>
    </div>
  );
}