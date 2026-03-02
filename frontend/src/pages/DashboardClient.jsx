import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import LoadingSpinner from '../components/LoadingSpinner';

const STATUT_CONFIG = {
  OUVERTE:   { label: 'Ouverte',   cls: 'badge-green' },
  ATTRIBUEE: { label: 'Attribuée', cls: 'badge-blue' },
  TERMINEE:  { label: 'Terminée',  cls: 'badge-gray' },
};

const DashboardClient = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [missions, setMissions] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [stats,    setStats]    = useState({ total: 0, ouvertes: 0, attribuees: 0, terminees: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get('/missions/mes-missions');
        const ms = data.missions;
        setMissions(ms);
        setStats({
          total:      ms.length,
          ouvertes:   ms.filter(m => m.statut === 'OUVERTE').length,
          attribuees: ms.filter(m => m.statut === 'ATTRIBUEE').length,
          terminees:  ms.filter(m => m.statut === 'TERMINEE').length,
        });
      } catch (err) {
        toast.error(err.friendlyMessage || 'Impossible de charger vos missions.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleTerminer = async (id) => {
    try {
      await api.patch(`/missions/${id}/terminer`);
      setMissions(prev => prev.map(m => m.id === id ? { ...m, statut: 'TERMINEE' } : m));
      toast.success('Mission marquée comme terminée !');
    } catch (err) {
      toast.error(err.friendlyMessage || 'Impossible de terminer la mission.');
    }
  };

  return (
    <div className="fade-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-primary-600">
            Bonjour, {user?.nom?.split(' ')[0]} 👋
          </h1>
          <p className="text-gray-500 mt-0.5">Gérez vos missions et trouvez des prestataires</p>
        </div>
        <Link to="/missions/creer" className="btn-primary gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nouvelle mission
        </Link>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total',      value: stats.total,      color: 'text-gray-700',    bg: 'bg-gray-50',    icon: '📋' },
          { label: 'Ouvertes',   value: stats.ouvertes,   color: 'text-green-600',   bg: 'bg-green-50',   icon: '🟢' },
          { label: 'Attribuées', value: stats.attribuees, color: 'text-blue-600',    bg: 'bg-blue-50',    icon: '🔵' },
          { label: 'Terminées',  value: stats.terminees,  color: 'text-gray-500',    bg: 'bg-gray-100',   icon: '✅' },
        ].map(s => (
          <div key={s.label} className={`card ${s.bg} flex items-center gap-4`}>
            <div className="text-2xl">{s.icon}</div>
            <div>
              <div className={`text-2xl font-extrabold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-gray-500">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Liste missions */}
      {loading ? <LoadingSpinner /> : (
        <>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Mes missions</h2>
          {missions.length === 0 ? (
            <div className="card text-center py-16">
              <div className="text-5xl mb-4">🚀</div>
              <p className="text-gray-500 text-lg font-medium">Pas encore de mission</p>
              <p className="text-gray-400 text-sm mb-5">Publiez votre première mission pour trouver un prestataire</p>
              <Link to="/missions/creer" className="btn-primary">Créer une mission</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {missions.map(m => {
                const s = STATUT_CONFIG[m.statut];
                const prestaAccepte = m.candidatures?.find(c => c.statut === 'ACCEPTEE');
                return (
                  <div key={m.id} className="card flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`${s.cls} text-xs`}>{s.label}</span>
                        <span className="text-xs text-gray-400">{m.domaine}</span>
                      </div>
                      <h3 className="font-semibold text-gray-900">{m.titre}</h3>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                        <span>📍 {m.lieu}</span>
                        <span>💰 {m.budget?.toLocaleString('fr-FR')} FCFA</span>
                        <span>👥 {m._count?.candidatures || 0} candidat(s)</span>
                      </div>
                      {prestaAccepte && (
                        <div className="mt-1 text-xs text-green-600 font-medium">
                          ✓ Prestataire : {prestaAccepte.prestataire?.nom}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Link to={`/missions/${m.id}`} className="btn-outline text-xs py-1.5 px-3">
                        Voir détails
                      </Link>
                      {m.statut === 'ATTRIBUEE' && (
                        <button onClick={() => handleTerminer(m.id)} className="btn-secondary text-xs py-1.5 px-3">
                          ✓ Terminer
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DashboardClient;
