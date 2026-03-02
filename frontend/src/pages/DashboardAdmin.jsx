import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const DashboardAdmin = () => {
  const [stats,    setStats]    = useState(null);
  const [users,    setUsers]    = useState([]);
  const [missions, setMissions] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [tab,      setTab]      = useState('stats');
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [statsRes, usersRes, missionsRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/users'),
          api.get('/admin/missions'),
        ]);
        setStats(statsRes.data.stats);
        setUsers(usersRes.data.users);
        setMissions(missionsRes.data.missions);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleStatutUser = async (userId, statut) => {
    try {
      await api.patch(`/admin/users/${userId}/statut`, { statut });
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, statut } : u));
      setFeedback(`Compte ${statut.toLowerCase()} avec succès`);
      setTimeout(() => setFeedback(''), 3000);
    } catch (err) {
      setFeedback(err.response?.data?.message || 'Erreur');
    }
  };

  const handleDeleteMission = async (id) => {
    if (!confirm('Supprimer cette mission ?')) return;
    try {
      await api.delete(`/admin/missions/${id}`);
      setMissions(prev => prev.filter(m => m.id !== id));
      setFeedback('Mission supprimée');
      setTimeout(() => setFeedback(''), 3000);
    } catch {}
  };

  const TABS = [
    { key: 'stats',    label: 'Statistiques',   icon: '📊' },
    { key: 'users',    label: 'Utilisateurs',   icon: '👥' },
    { key: 'missions', label: 'Missions',        icon: '📋' },
    { key: 'valid',    label: 'Validations',     icon: '⏳' },
  ];

  const prestatairesEnAttente = users.filter(u => u.role === 'PRESTATAIRE' && u.statut === 'EN_ATTENTE');

  return (
    <div className="fade-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-primary-600">Dashboard Administrateur</h1>
        <p className="text-gray-500 mt-0.5">Gérez la plateforme SamaJob</p>
      </div>

      {/* Feedback */}
      {feedback && (
        <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
          {feedback}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 rounded-xl p-1 overflow-x-auto">
        {TABS.map(t => (
          <button
            key={t.key} onClick={() => setTab(t.key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              tab === t.key ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t.icon} {t.label}
            {t.key === 'valid' && prestatairesEnAttente.length > 0 && (
              <span className="ml-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                {prestatairesEnAttente.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {loading ? <LoadingSpinner /> : (
        <>
          {/* STATS */}
          {tab === 'stats' && stats && (
            <div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                {[
                  { label: 'Total utilisateurs',    value: stats.totalUsers,          icon: '👥', bg: 'bg-blue-50',    color: 'text-blue-600'   },
                  { label: 'Clients',               value: stats.totalClients,        icon: '🏢', bg: 'bg-indigo-50',  color: 'text-indigo-600' },
                  { label: 'Prestataires validés',  value: stats.totalPrestataires,   icon: '👨‍💻', bg: 'bg-green-50',   color: 'text-green-600'  },
                  { label: 'En attente validation', value: stats.prestataireEnAttente,icon: '⏳', bg: 'bg-yellow-50',  color: 'text-yellow-600' },
                  { label: 'Total missions',        value: stats.totalMissions,       icon: '📋', bg: 'bg-purple-50',  color: 'text-purple-600' },
                  { label: 'Missions ouvertes',     value: stats.missionsOuvertes,    icon: '🟢', bg: 'bg-emerald-50', color: 'text-emerald-600'},
                  { label: 'Total candidatures',    value: stats.totalCandidatures,   icon: '📝', bg: 'bg-rose-50',    color: 'text-rose-600'   },
                ].map(s => (
                  <div key={s.label} className={`card ${s.bg} flex items-center gap-4`}>
                    <div className="text-3xl">{s.icon}</div>
                    <div>
                      <div className={`text-3xl font-extrabold ${s.color}`}>{s.value}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="card bg-gradient-to-r from-primary-600 to-secondary-500 text-white text-center py-8">
                <div className="text-4xl font-extrabold">SamaJob</div>
                <div className="text-white/80 mt-1">Plateforme active et en croissance 🚀</div>
              </div>
            </div>
          )}

          {/* UTILISATEURS */}
          {tab === 'users' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-gray-900">Tous les utilisateurs ({users.length})</h2>
              </div>
              {users.map(u => (
                <div key={u.id} className="card flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-sm flex-shrink-0">
                    {u.nom.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900">{u.nom}</div>
                    <div className="text-xs text-gray-500">{u.email} · {u.role} · {u.domaine || '—'}</div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`badge text-xs ${
                      u.statut === 'VALIDE'     ? 'badge-green'  :
                      u.statut === 'SUSPENDU'   ? 'badge-red'    :
                      u.statut === 'REJETE'     ? 'badge-red'    : 'badge-yellow'
                    }`}>{u.statut}</span>
                    {u.statut !== 'VALIDE'    && <button onClick={() => handleStatutUser(u.id, 'VALIDE')}   className="btn-secondary text-xs py-1 px-2">Valider</button>}
                    {u.statut !== 'SUSPENDU'  && <button onClick={() => handleStatutUser(u.id, 'SUSPENDU')} className="btn-danger text-xs py-1 px-2">Suspendre</button>}
                    {u.statut !== 'REJETE'    && u.role === 'PRESTATAIRE' && (
                      <button onClick={() => handleStatutUser(u.id, 'REJETE')} className="text-xs py-1 px-2 rounded-lg border border-red-300 text-red-500 hover:bg-red-50">Rejeter</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* MISSIONS */}
          {tab === 'missions' && (
            <div className="space-y-3">
              <h2 className="font-bold text-gray-900 mb-4">Toutes les missions ({missions.length})</h2>
              {missions.map(m => (
                <div key={m.id} className="card flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`badge text-xs ${
                        m.statut === 'OUVERTE' ? 'badge-green' : m.statut === 'ATTRIBUEE' ? 'badge-blue' : 'badge-gray'
                      }`}>{m.statut}</span>
                      <span className="text-xs text-gray-400">{m.domaine}</span>
                    </div>
                    <div className="font-semibold text-gray-900">{m.titre}</div>
                    <div className="text-xs text-gray-500 mt-0.5">Client : {m.client?.nom} · {m._count?.candidatures || 0} candidature(s)</div>
                  </div>
                  <div className="flex gap-2">
                    <Link to={`/missions/${m.id}`} className="btn-outline text-xs py-1.5 px-3">Voir</Link>
                    <button onClick={() => handleDeleteMission(m.id)} className="btn-danger text-xs py-1.5 px-3">Supprimer</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* VALIDATIONS */}
          {tab === 'valid' && (
            <div>
              <h2 className="font-bold text-gray-900 mb-4">
                Prestataires en attente ({prestatairesEnAttente.length})
              </h2>
              {prestatairesEnAttente.length === 0 ? (
                <div className="card text-center py-12">
                  <div className="text-4xl mb-3">✅</div>
                  <p className="text-gray-500">Aucun prestataire en attente</p>
                </div>
              ) : prestatairesEnAttente.map(u => (
                <div key={u.id} className="card mb-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-secondary-100 flex items-center justify-center text-secondary-600 text-lg font-bold">
                        {u.nom.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">{u.nom}</div>
                        <div className="text-sm text-gray-500">{u.email}</div>
                        {u.telephone && <div className="text-xs text-gray-400">📱 {u.telephone}</div>}
                      </div>
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(u.dateCreation).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                  {u.domaine && (
                    <div className="mt-3 flex items-center gap-2">
                      <span className="badge badge-blue text-xs">{u.domaine}</span>
                    </div>
                  )}
                  {u.bio && <p className="text-sm text-gray-600 mt-2 bg-gray-50 rounded-lg p-2">{u.bio}</p>}
                  <div className="flex gap-3 mt-4">
                    <button onClick={() => handleStatutUser(u.id, 'VALIDE')} className="btn-secondary flex-1 text-sm">
                      ✓ Valider le profil
                    </button>
                    <button onClick={() => handleStatutUser(u.id, 'REJETE')} className="btn-danger flex-1 text-sm">
                      ✕ Rejeter
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DashboardAdmin;
