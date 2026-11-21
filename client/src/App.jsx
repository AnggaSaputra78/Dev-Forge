import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext.jsx';

// Layout
import PublicLayout from './components/layout/PublicLayout.jsx';
import DashboardLayout from './components/layout/DashboardLayout.jsx';

// Halaman Publik
import LandingPage from './pages/public/LandingPage.jsx';
import LoginPage from './pages/public/LoginPage.jsx';
import RegisterPage from './pages/public/RegisterPage.jsx';

// Halaman Dashboard
import OverviewPage from './pages/dashboard/OverviewPage.jsx';
import SettingsPage from './pages/dashboard/SettingsPage.jsx';

// Pembelajaran
import LearningPathsPage from './pages/learning/LearningPathsPage.jsx';
import CoursesPage from './pages/learning/CoursesPage.jsx';
import CourseDetailPage from './pages/learning/CourseDetailPage.jsx';
import LessonPage from './pages/learning/LessonPage.jsx';

// Coding
import PlaygroundPage from './pages/coding/PlaygroundPage.jsx';
import ChallengesPage from './pages/coding/ChallengesPage.jsx';

// Mentor
import MentorPage from './pages/mentor/MentorPage.jsx';

// Proyek
import ProjectsPage from './pages/projects/ProjectsPage.jsx';
import ProjectDetailPage from './pages/projects/ProjectDetailPage.jsx';

// Asesmen & Progres
import AssessmentsPage from './pages/assessments/AssessmentsPage.jsx';
import ProgressPage from './pages/progress/ProgressPage.jsx';
import HistoryPage from './pages/progress/HistoryPage.jsx';

// Admin
import AdminPage from './pages/admin/AdminPage.jsx';

// Wrapper route terproteksi
function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center">
        <p className="muted">Memuat...</p>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard" replace />;

  return children;
}

export default function App() {
  return (
    <Routes>
      {/* Area Publik */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Area Dashboard (Terproteksi) */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<OverviewPage />} />
        <Route path="/paths" element={<LearningPathsPage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/courses/:id" element={<CourseDetailPage />} />
        <Route path="/lessons/:id" element={<LessonPage />} />
        <Route path="/playground" element={<PlaygroundPage />} />
        <Route path="/challenges" element={<ChallengesPage />} />
        <Route path="/mentor" element={<MentorPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:id" element={<ProjectDetailPage />} />
        <Route path="/assessments" element={<AssessmentsPage />} />
        <Route path="/progress" element={<ProgressPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      {/* Area Admin */}
      <Route
        element={
          <ProtectedRoute adminOnly>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/admin" element={<AdminPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}