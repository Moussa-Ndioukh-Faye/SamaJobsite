import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import LoadingSpinner from '../components/LoadingSpinner';
import MissionCard from '../components/MissionCard';

const CANDIDATURE_STATUT = {
  EN_ATTENTE: { label: 'En attente', cls: 'badge-yellow' },
  ACCEPTEE:   { label: 'Acceptée',   cls: 'badge-green'  },
  REFUSEE:    { label: 'Refusée',    cls: 'badge-red'    },
};

const DashboardPrestataire = () => {
  const { user, isValide } = useAuth();
  const toast = useToast();
  const [tab,          setTab]          = useState('candidatures');
  const [candidatures, setCandidatures] = useState([]);
  const [missions,     setMissions]     = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [stats,        setStats]        = useState({ total: 0, acceptees: 0, refusees: 0, enAttente: 0 });

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [candRes, missRes] = await Promise.all([
          api.get('/candidatures/mes-candidatures'),
          api.get('/missions'),
        ]);
        const cands = candRes.data.candidatures;
        setCandidatures(cands);
        setMissions(missRes.data.missions);
        setStats({
          total:     cands.length,
          acceptees: cands.filter(c => c.statut === 'ACCEPTEE').length,
          refusees:  cands.filter(c => c.statut === 'REFUSEE').length,
          enAttente: cands.filter(c => c.statut === 'EN_ATTENTE').length,
        });
      } catch (err) {
        toast.error(err.friendlyMessage || 'Impossible de charger vos données.');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  return (
    <div className="fade-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-primary-600">
          Bonjour, {user?.nom?.split(' ')[0]} 👋
        </h1>
        <p className="text-gray-500 mt-0.5">Suivez vos candidatures et trouvez de nouvelles missions</p>
      </div>

      {/* Alerte si non validé */}
      {!isValide && (
        <div className="mb-6 p-4 rounded-xl bg-yellow-50 border border-yellow-200 flex items-start gap-3">
          <span className="text-2xl">⏳</span>
          <div>
            <div className="font-semibold text-yellow-800">Compte en attente de validation</div>
            <div className="text-sm text-yellow-700 mt-0.5">
              Un administrateur va examiner votre profil. Vous pourrez postuler une fois validé.
              Complétez votre <Link to="/profil" className="underline">profil</Link> en attendant.
            </div>
          </div>
        </div>
      )}

      {/* Profil rapide */}
      <div className="card mb-6 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-600 to-secondary-500 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
          {user?.nom?.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-gray-900">{user?.nom}</div>
          <div className="text-sm text-gray-500">{user?.domaine || 'Domaine non renseigné'}</div>
          {user?.competences?.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1.5">
              {user.competences.slice(0, 5).map(s => (
                <span key={s} className="badge badge-blue text-xs">{s}</span>
              ))}
            </div>
          )}
        </div>
        <Link to="/profil" className="btn-outline text-xs py-1.5 px-3 flex-shrink-0">
          Modifier profil
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Candidatures', value: stats.total,     icon: '📝', color: 'text-gray-700' },
          { label: 'En attente',   value: stats.enAttente, icon: '⏳', color: 'text-yellow-600' },
          { label: 'Acceptées',    value: stats.acceptees, icon: '✅', color: 'text-green-600' },
          { label: 'Refusées',     value: stats.refusees,  icon: '❌', color: 'text-red-500' },
        ].map(s => (
          <div key={s.label} className="card flex items-center gap-3">
            <div className="text-2xl">{s.icon}</div>
            <div>
              <div className={`text-2xl font-extrabold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-gray-500">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 rounded-xl p-1 w-fit">
        {[
          { key: 'candidatures', label: 'Mes candidatures' },
          { key: 'missions',     label: 'Missions disponibles' },
        ].map(t => (
          <button
            key={t.key} onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === t.key ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? <LoadingSpinner /> : (
        <>
          {/* Candidatures */}
          {tab === 'candidatures' && (
            <div className="space-y-4">
              {candidatures.length === 0 ? (
                <div className="card text-center py-16">
                  <div className="text-5xl mb-4">🎯</div>
                  <p className="text-gray-500 text-lg font-medium">Aucune candidature</p>
                  <p className="text-gray-400 text-sm mb-5">Explorez les missions disponibles et postulez !</p>
                  <button onClick={() => setTab('missions')} className="btn-primary">
                    Voir les missions
                  </button>
                </div>
              ) : candidatures.map(c => {
                const s = CANDIDATURE_STATUT[c.statut];
                return (
                  <div key={c.id} className="card flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`${s.cls} text-xs`}>{s.label}</span>
                        <span className="text-xs text-gray-400">{c.mission?.domaine}</span>
                      </div>
                      <h3 className="font-semibold text-gray-900">{c.mission?.titre}</h3>
                      <div className="flex flex-wrap gap-3 mt-1 text-sm text-gray-500">
                        <span>📍 {c.mission?.lieu}</span>
                        <span>💰 Ma proposition : {c.propositionPrix?.toLocaleString('fr-FR')} FCFA</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1 line-clamp-1">{c.message}</p>
                    </div>
                    <Link to={`/missions/${c.missionId}`} className="btn-outline text-xs py-1.5 px-3 flex-shrink-0">
                      Voir mission
                    </Link>
                  </div>
                );
              })}
            </div>
          )}

          {/* Missions disponibles */}
          {tab === 'missions' && (
            isValide ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {missions.slice(0, 9).map(m => <MissionCard key={m.id} mission={m} />)}
                {missions.length === 0 && (
                  <div className="col-span-3 text-center py-12 text-gray-400">Aucune mission disponible</div>
                )}
              </div>
            ) : (
              <div className="card text-center py-12 bg-yellow-50 border border-yellow-200">
                <p className="text-yellow-700 font-medium">Votre compte doit être validé pour postuler aux missions.</p>
              </div>
            )
          )}
        </>
      )}
    </div>
  );
};

export default DashboardPrestataire;
