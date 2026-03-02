import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import MissionCard from '../components/MissionCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';

const DOMAINES = [
  'Tous', 'Développement web', 'Design graphique', 'Rédaction',
  'Marketing digital', 'Traduction', 'Photographie', 'Assistance virtuelle', 'Saisie de données',
];

const Missions = () => {
  const [missions, setMissions] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [filters,  setFilters]  = useState({ domaine: '', search: '', budgetMin: '', budgetMax: '' });
  const { isAuthenticated, isClient } = useAuth();

  const fetchMissions = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.domaine   && filters.domaine !== 'Tous') params.set('domaine',   filters.domaine);
      if (filters.search)    params.set('search',    filters.search);
      if (filters.budgetMin) params.set('budgetMin', filters.budgetMin);
      if (filters.budgetMax) params.set('budgetMax', filters.budgetMax);

      const { data } = await api.get(`/missions?${params}`);
      setMissions(data.missions);
    } catch {
      setMissions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMissions(); }, []);

  const handleSearch = e => {
    e.preventDefault();
    fetchMissions();
  };

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-900 to-primary-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-extrabold">Missions disponibles</h1>
              <p className="text-white/70 mt-1">Trouvez la mission idéale parmi {missions.length} offres</p>
            </div>
            {isAuthenticated && isClient && (
              <Link to="/missions/creer" className="btn-secondary hidden md:inline-flex gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Publier une mission
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtres */}
        <div className="bg-white rounded-2xl shadow-card p-5 mb-8">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label className="label">Rechercher</label>
              <input
                type="text" placeholder="Ex: développement site web..."
                value={filters.search}
                onChange={e => setFilters(p => ({ ...p, search: e.target.value }))}
                className="input"
              />
            </div>
            <div>
              <label className="label">Domaine</label>
              <select
                value={filters.domaine}
                onChange={e => setFilters(p => ({ ...p, domaine: e.target.value }))}
                className="input"
              >
                {DOMAINES.map(d => <option key={d} value={d === 'Tous' ? '' : d}>{d}</option>)}
              </select>
            </div>
            <div className="flex items-end">
              <button type="submit" className="btn-primary w-full py-2.5">
                Rechercher
              </button>
            </div>
          </form>

          {/* Budget */}
          <div className="grid grid-cols-2 gap-3 mt-3">
            <div>
              <label className="label text-xs">Budget min (FCFA)</label>
              <input
                type="number" placeholder="0" min="0"
                value={filters.budgetMin}
                onChange={e => setFilters(p => ({ ...p, budgetMin: e.target.value }))}
                className="input text-sm"
              />
            </div>
            <div>
              <label className="label text-xs">Budget max (FCFA)</label>
              <input
                type="number" placeholder="1 000 000" min="0"
                value={filters.budgetMax}
                onChange={e => setFilters(p => ({ ...p, budgetMax: e.target.value }))}
                className="input text-sm"
              />
            </div>
          </div>
        </div>

        {/* Résultats */}
        {loading ? (
          <LoadingSpinner />
        ) : missions.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-lg font-medium">Aucune mission trouvée</p>
            <p className="text-sm mt-1">Modifiez vos filtres ou revenez plus tard</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {missions.map(m => <MissionCard key={m.id} mission={m} />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default Missions;
