import { useEffect, useState } from 'react';
import { mentorService } from '../../services/mentor.service.js';

const ACTIONS = ['Jelaskan Kode', 'Asisten Debug', 'Buat Petunjuk', 'Tinjauan Kode', 'Penjelasan Konsep'];

export default function MentorPage() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Apa yang ingin Anda pahami? Ajukan pertanyaan atau pilih alat belajar di bawah.' },
  ]);
  const [input, setInput] = useState('');
  const [action, setAction] = useState('Pertanyaan Bebas');
  const [status, setStatus] = useState(null);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    mentorService.getStatus().then((r) => setStatus(r.data.data)).catch(() => {});
  }, []);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = input;
    setMessages((m) => [...m, { role: 'user', content: userMsg }]);
    setInput('');
    setSending(true);
    try {
      const res = await mentorService.chat(action, userMsg, '', 'Mode Mandiri');
      setMessages((m) => [...m, { role: 'assistant', content: res.data.data.response }]);
    } catch {
      setMessages((m) => [...m, { role: 'assistant', content: 'Terjadi kesalahan. Coba lagi.' }]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      <p className="eyebrow mb-2">Demo terbimbing · bukan layanan AI terhubung</p>
      <h1 className="page-title">Mentor AI</h1>
      <p className="muted text-smx mt-2 mb-5">
        Gunakan petunjuk terbimbing untuk memperkuat penalaran Anda sendiri.
        {!status?.isConfigured && ' Respons menggunakan template pembelajaran statis.'}
      </p>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="card lg:col-span-2">
          <div className="space-y-4 min-h-[300px] max-h-[420px] overflow-auto text-smx pr-2">
            {messages.map((m, i) => (
              <div key={i} className={m.role === 'user' ? 'surface2 p-4 rounded-lg ml-8' : 'surface p-4 rounded-lg mr-8 border line'}>
                {m.role === 'assistant' && <p className="accent text-xs font-bold mb-1">Mentor</p>}
                <p className="whitespace-pre-wrap">{m.content}</p>
              </div>
            ))}
            {sending && <p className="muted text-smx">Mentor sedang merespons...</p>}
          </div>

          <form onSubmit={sendMessage} className="flex gap-2 mt-5">
            <input
              className="field" value={input} onChange={(e) => setInput(e.target.value)}
              placeholder="Ajukan pertanyaan atau tempel potongan kode pendek..."
            />
            <button className="btn primary" type="submit" disabled={sending || !input.trim()}>Kirim</button>
          </form>

          <div className="flex gap-2 flex-wrap mt-4">
            {ACTIONS.map((a) => (
              <button key={a} onClick={() => setAction(a)} className={`btn small ${action === a ? 'primary' : ''}`}>
                {a}
              </button>
            ))}
          </div>
        </div>

        <aside className="card">
          <h2 className="section-title">Mode belajar</h2>
          <p className="muted text-smx mt-4">
            Kerjakan masalah secara mandiri, gunakan petunjuk terstruktur, atau tinjau kode yang sudah Anda tulis.
          </p>
          <p className="text-xs muted mt-7">
            Untuk percakapan AI nyata, diperlukan kunci API di backend. Demo ini tidak mengirim kode Anda ke mana pun.
          </p>
        </aside>
      </div>
    </div>
  );
}