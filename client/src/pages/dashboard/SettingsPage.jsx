import { useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useTheme } from '../../contexts/ThemeContext.jsx';
import api from '../../services/api.js';
import { getErrorMessage } from '../../services/api.js';

export default function SettingsPage() {
  const { user, updateUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put('/users/me', { name, bio });
      updateUser(res.data.data);
      toast.success('Profil berhasil diperbarui');
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <p className="eyebrow mb-2">Preferensi workspace</p>
      <h1 className="page-title mb-6">Pengaturan</h1>

      <div className="grid lg:grid-cols-2 gap-5">
        <div className="card">
          <h2 className="section-title">Informasi profil</h2>
          <form onSubmit={handleSave} className="mt-5 space-y-4">
            <div>
              <label className="block mb-2 text-smx font-semibold">Nama tampilan</label>
              <input className="field" value={name} onChange={(e) => setName(e.target.value)} required maxLength={60} />
            </div>
            <div>
              <label className="block mb-2 text-smx font-semibold">Email</label>
              <input className="field" value={user?.email || ''} disabled />
            </div>
            <div>
              <label className="block mb-2 text-smx font-semibold">Bio</label>
              <textarea className="field" value={bio} onChange={(e) => setBio(e.target.value)} rows={3} maxLength={500} />
            </div>
            <button type="submit" className="btn primary small" disabled={saving}>
              {saving ? 'Menyimpan...' : 'Perbarui profil'}
            </button>
          </form>
        </div>

        <div className="card">
          <h2 className="section-title">Tampilan</h2>
          <p className="muted text-smx mt-2">Beralih antara mode gelap dan terang.</p>
          <button onClick={toggleTheme} className="btn small mt-4">
            Gunakan mode {theme === 'dark' ? 'terang' : 'gelap'}
          </button>
        </div>
      </div>
    </div>
  );
}