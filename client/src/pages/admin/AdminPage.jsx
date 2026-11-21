import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { adminService } from '../../services/admin.service.js';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import { getErrorMessage } from '../../services/api.js';

export default function AdminPage() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      adminService.getStats().then((r) => r.data.data),
      adminService.getUsers().then((r) => r.data.data),
    ])
      .then(([s, u]) => {
        setStats(s);
        setUsers(u);
      })
      .finally(() => setLoading(false));
  }, []);

  const toggleActive = async (id) => {
    try {
      await adminService.toggleUserActive(id);
      setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, isActive: !u.isActive } : u)));
      toast.success('Status pengguna diperbarui');
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  if (loading) return <LoadingSpinner text="Memuat data admin..." />;

  return (
    <div>
      <p className="eyebrow mb-2">Antarmuka manajemen</p>
      <h1 className="page-title mb-6">Dashboard Admin</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="card"><p className="muted text-smx">Total Pengguna</p><p className="text-2xl font-bold mt-3">{stats?.totalUsers}</p></div>
        <div className="card"><p className="muted text-smx">Total Kursus</p><p className="text-2xl font-bold mt-3">{stats?.totalCourses}</p></div>
        <div className="card"><p className="muted text-smx">Total Pelajaran</p><p className="text-2xl font-bold mt-3">{stats?.totalLessons}</p></div>
        <div className="card"><p className="muted text-smx">Total Tantangan</p><p className="text-2xl font-bold mt-3">{stats?.totalChallenges}</p></div>
      </div>

      <div className="card overflow-x-auto">
        <h2 className="section-title mb-4">Manajemen pengguna</h2>
        <table className="w-full text-left text-smx" style={{ minWidth: '600px' }}>
          <thead className="muted">
            <tr>
              <th className="py-3">Nama</th>
              <th>Email</th>
              <th>Peran</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-t line">
                <td className="py-3">{u.name}</td>
                <td>{u.email}</td>
                <td><span className="chip">{u.role.toUpperCase()}</span></td>
                <td className={u.isActive ? 'good' : 'muted'}>{u.isActive ? 'Aktif' : 'Nonaktif'}</td>
                <td>
                  <button onClick={() => toggleActive(u._id)} className="btn small">
                    {u.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}