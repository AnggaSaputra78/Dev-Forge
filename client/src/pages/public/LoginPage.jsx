import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { getErrorMessage } from '../../services/api.js';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login(email, password);
      toast.success('Login berhasil. Selamat datang kembali!');
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
        <p className="eyebrow mb-3">DevForge Academy · Masuk</p>
        <h1 className="page-title">Masuk ke workspace belajar</h1>
        <p className="muted text-smx mt-3">
          Gunakan akun yang sudah terdaftar untuk melanjutkan pembelajaran Anda.
        </p>

        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          <div>
            <label className="block mb-2 text-smx font-semibold" htmlFor="email">Alamat email</label>
            <input
              id="email" type="email" className="field" value={email}
              onChange={(e) => setEmail(e.target.value)} required placeholder="nama@email.com"
            />
          </div>
          <div>
            <label className="block mb-2 text-smx font-semibold" htmlFor="password">Kata sandi</label>
            <input
              id="password" type="password" className="field" value={password}
              onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••"
            />
          </div>
          <button type="submit" className="btn primary w-full" disabled={submitting}>
            {submitting ? 'Memproses...' : 'Masuk'}
          </button>
        </form>

        <div className="mt-5 text-smx muted">
          Belum punya akun? <Link to="/register" className="accent font-semibold">Daftar di sini</Link>
        </div>

        <Link to="/" className="mt-5 text-smx accent block">← Kembali ke beranda</Link>
      </div>
    </div>
  );
}