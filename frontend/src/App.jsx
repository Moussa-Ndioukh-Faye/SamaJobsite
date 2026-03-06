import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingSpinner from './components/LoadingSpinner';

// Pages publiques
import Home              from './pages/Home';
import Login             from './pages/Login';
import Register          from './pages/Register';
import Missions          from './pages/Missions';
import MissionDetail     from './pages/MissionDetail';
import Prestataires      from './pages/Prestataires';
import CommentCaMarche   from './pages/CommentCaMarche';
import Confidentialite   from './pages/Confidentialite';
import MentionsLegales   from './pages/MentionsLegales';
import CGU               from './pages/CGU';

// Pages protégées
import DashboardClient       from './pages/DashboardClient';
import DashboardPrestataire  from './pages/DashboardPrestataire';
import DashboardAdmin        from './pages/DashboardAdmin';
import CreateMission         from './pages/CreateMission';
import Profile               from './pages/Profile';
import AdminValidation       from './pages/AdminValidation';

const App = () => {
  const { loading, isAuthenticated, isClient, isPrestataire, isAdmin } = useAuth();

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Public */}
          <Route path="/"                  element={<Home />} />
          <Route path="/missions"          element={<Missions />} />
          <Route path="/missions/:id"      element={<MissionDetail />} />
          <Route path="/prestataires"      element={<Prestataires />} />
          <Route path="/comment-ca-marche" element={<CommentCaMarche />} />
          <Route path="/confidentialite"  element={<Confidentialite />} />
          <Route path="/mentions-legales" element={<MentionsLegales />} />
          <Route path="/cgu"              element={<CGU />} />

          {/* Auth – redirige si déjà connecté */}
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
          />
          <Route
            path="/register"
            element={isAuthenticated ? <Navigate to="/" replace /> : <Register />}
          />

          {/* Client */}
          <Route path="/dashboard/client" element={
            <ProtectedRoute roles={['CLIENT']}>
              <DashboardClient />
            </ProtectedRoute>
          } />
          <Route path="/missions/creer" element={
            <ProtectedRoute roles={['CLIENT']}>
              <CreateMission />
            </ProtectedRoute>
          } />

          {/* Prestataire */}
          <Route path="/dashboard/prestataire" element={
            <ProtectedRoute roles={['PRESTATAIRE']}>
              <DashboardPrestataire />
            </ProtectedRoute>
          } />

          {/* Admin */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute roles={['ADMIN']}>
              <DashboardAdmin />
            </ProtectedRoute>
          } />
          <Route path="/admin/validation" element={
            <ProtectedRoute roles={['ADMIN']}>
              <AdminValidation />
            </ProtectedRoute>
          } />

          {/* Profil (tous les connectés) */}
          <Route path="/profil" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
