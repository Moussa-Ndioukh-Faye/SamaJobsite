import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
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
  const [searchParams] = useSearchParams();

  const fetchMissions = async (f = filters) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (f.domaine   && f.domaine !== 'Tous') params.set('domaine',   f.domaine);
      if (f.search)    params.set('search',    f.search);
      if (f.budgetMin) params.set('budgetMin', f.budgetMin);
      if (f.budgetMax) params.set('budgetMax', f.budgetMax);

      const { data } = await api.get(`/missions?${params}`);
      setMissions(data.missions);
    } catch {
      setMissions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const domaineParam = searchParams.get('domaine');
    const initialFilters = { domaine: domaineParam || '', search: '', budgetMin: '', budgetMax: '' };
    if (domaineParam) setFilters(initialFilters);
    fetchMissions(initialFilters);
  }, []);

  const handleSearch = e => {
    e.preventDefault();
    fetchMissions();
  };

  const handleDomaineChip = domaine => {
    const newFilters = { ...filters, domaine: domaine === 'Tous' ? '' : domaine };
    setFilters(newFilters);
    fetchMissions(newFilters);
  };

  const resetFilters = () => {
    const empty = { domaine: '', search: '', budgetMin: '', budgetMax: '' };
    setFilters(empty);
    fetchMissions(empty);
  };

  const activeFilters = filters.domaine || filters.search || filters.budgetMin || filters.budgetMax;

  return (
    <div className="fade-in">

      {/* Header */}
      <div className="bg-gradient-to-r from-primary-900 to-primary-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-extrabold">Missions disponibles</h1>
              <p className="text-white/70 mt-1">
                {loading
                  ? 'Chargement…'
                  : `${missions.length} offre${missions.length > 1 ? 's' : ''} disponible${missions.length > 1 ? 's' : ''}`
                }
              </p>
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

        {/* Chips domaines */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          {DOMAINES.map(d => {
            const isActive = d === 'Tous' ? !filters.domaine : filters.domaine === d;
            return (
              <button
                key={d}
                onClick={() => handleDomaineChip(d)}
                className={isActive ? 'chip-active' : 'chip-inactive'}
              >
                {d}
              </button>
            );
          })}
        </div>

        {/* Filtres recherche + budget */}
        <div className="bg-white rounded-2xl shadow-card p-5 mb-8">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Rechercher une mission..."
                value={filters.search}
                onChange={e => setFilters(p => ({ ...p, search: e.target.value }))}
                className="input pl-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <input
                type="number" placeholder="Budget min"
                value={filters.budgetMin}
                onChange={e => setFilters(p => ({ ...p, budgetMin: e.target.value }))}
                className="input w-32 text-sm"
                min="0"
              />
              <input
                type="number" placeholder="Budget max"
                value={filters.budgetMax}
                onChange={e => setFilters(p => ({ ...p, budgetMax: e.target.value }))}
                className="input w-32 text-sm"
                min="0"
              />
              <button type="submit" className="btn-primary whitespace-nowrap">
                Rechercher
              </button>
            </div>
          </form>
        </div>

        {/* Résultats */}
        {loading ? (
          <LoadingSpinner />
        ) : missions.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-lg font-semibold text-gray-700">Aucune mission trouvée</p>
            <p className="text-sm text-gray-400 mt-1">Essayez de modifier vos filtres ou revenez plus tard</p>
            {activeFilters && (
              <button onClick={resetFilters} className="mt-4 btn-outline text-sm">
                Réinitialiser les filtres
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {missions.map(m => <MissionCard key={m.id} mission={m} />)}
          </div>
        )}

        {/* FAB mobile - publier */}
        {isAuthenticated && isClient && (
          <Link
            to="/missions/creer"
            className="md:hidden fixed bottom-6 right-6 w-14 h-14 rounded-full bg-secondary-500 text-white shadow-lg flex items-center justify-center hover:bg-secondary-600 transition-colors z-30"
            aria-label="Publier une mission"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Missions;
