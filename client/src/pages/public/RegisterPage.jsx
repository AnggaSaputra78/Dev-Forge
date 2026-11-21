import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { getErrorMessage } from '../../services/api.js';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      toast.error('Konfirmasi kata sandi tidak cocok');
      return;
    }
    setSubmitting(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success('Akun berhasil dibuat. Selamat belajar!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-5 py-20">
      <div className="card">
        <p className="eyebrow mb-3">DevForge Academy · Daftar</p>
        <h1 className="page-title">Buat akun baru</h1>
        <p className="muted text-smx mt-3">Mulai perjalanan belajar rekayasa perangkat lunak Anda.</p>

        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          <div>
            <label className="block mb-2 text-smx font-semibold">Nama lengkap</label>
            <input name="name" className="field" value={form.name} onChange={handleChange} required placeholder="Nama Anda" />
          </div>
          <div>
            <label className="block mb-2 text-smx font-semibold">Alamat email</label>
            <input name="email" type="email" className="field" value={form.email} onChange={handleChange} required placeholder="nama@email.com" />
          </div>
          <div>
            <label className="block mb-2 text-smx font-semibold">Kata sandi</label>
            <input name="password" type="password" className="field" value={form.password} onChange={handleChange} required minLength={6} placeholder="Minimal 6 karakter" />
          </div>
          <div>
            <label className="block mb-2 text-smx font-semibold">Konfirmasi kata sandi</label>
            <input name="confirm" type="password" className="field" value={form.confirm} onChange={handleChange} required placeholder="Ulangi kata sandi" />
          </div>
          <button type="submit" className="btn primary w-full" disabled={submitting}>
            {submitting ? 'Memproses...' : 'Daftar'}
          </button>
        </form>

        <div className="mt-5 text-smx muted">
          Sudah punya akun? <Link to="/login" className="accent font-semibold">Masuk di sini</Link>
        </div>

        <Link to="/" className="mt-5 text-smx accent block">← Kembali ke beranda</Link>
      </div>
    </div>
  );
}