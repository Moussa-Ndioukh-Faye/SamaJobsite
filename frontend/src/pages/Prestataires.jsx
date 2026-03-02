import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const DOMAINES = [
  'Informatique', 'Design', 'Marketing', 'Rédaction',
  'Traduction', 'Comptabilité', 'Droit', 'BTP', 'Autre',
];

const StarRating = ({ value }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map(i => (
      <svg key={i} className={`w-3.5 h-3.5 ${i <= Math.round(value) ? 'text-yellow-400' : 'text-gray-200'}`}
        fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ))}
  </div>
);

const Prestataires = () => {
  const [prestataires, setPrestataires] = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState('');
  const [search,       setSearch]       = useState('');
  const [domaine,      setDomaine]      = useState('');

  useEffect(() => {
    const fetchPrestataires = async () => {
      setLoading(true);
      setError('');
      try {
        const params = new URLSearchParams();
        if (search)  params.set('search',  search);
        if (domaine) params.set('domaine', domaine);
        const { data } = await api.get(`/users/prestataires?${params}`);
        setPrestataires(data.prestataires);
      } catch {
        setError('Impossible de charger les prestataires. Vérifiez votre connexion.');
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchPrestataires, 300);
    return () => clearTimeout(timer);
  }, [search, domaine]);

  return (
    <div className="fade-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-extrabold text-primary-600 mb-2">Nos prestataires</h1>
        <p className="text-gray-500 text-lg">Trouvez le professionnel idéal pour votre mission</p>
      </div>

      {/* Filtres */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher par nom, compétence, bio..."
            className="input pl-9"
          />
        </div>
        <select
          value={domaine}
          onChange={e => setDomaine(e.target.value)}
          className="input sm:w-52"
        >
          <option value="">Tous les domaines</option>
          {DOMAINES.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        {(search || domaine) && (
          <button
            onClick={() => { setSearch(''); setDomaine(''); }}
            className="btn-outline text-sm px-4 whitespace-nowrap"
          >
            Réinitialiser
          </button>
        )}
      </div>

      {/* Contenu */}
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="card text-center py-12 bg-red-50 border border-red-200">
          <p className="text-red-600 font-medium">{error}</p>
        </div>
      ) : prestataires.length === 0 ? (
        <div className="card text-center py-16">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-gray-500 text-lg font-medium">Aucun prestataire trouvé</p>
          <p className="text-gray-400 text-sm mt-1">
            {search || domaine ? 'Essayez avec d\'autres critères.' : 'Aucun prestataire validé pour l\'instant.'}
          </p>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-4">{prestataires.length} prestataire{prestataires.length > 1 ? 's' : ''} trouvé{prestataires.length > 1 ? 's' : ''}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {prestataires.map(p => {
              const notes = p.evaluationsDonnees?.map(e => e.note) || [];
              const noteMoyenne = notes.length ? notes.reduce((a, b) => a + b, 0) / notes.length : null;

              return (
                <div key={p.id} className="card hover:shadow-lg transition-shadow flex flex-col">
                  {/* Avatar + nom */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-600 to-secondary-500 flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
                      {p.nom?.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-gray-900 truncate">{p.nom}</div>
                      {p.domaine && (
                        <span className="text-xs badge badge-blue">{p.domaine}</span>
                      )}
                    </div>
                  </div>

                  {/* Note */}
                  {noteMoyenne !== null && (
                    <div className="flex items-center gap-1.5 mb-2">
                      <StarRating value={noteMoyenne} />
                      <span className="text-xs text-gray-500">{noteMoyenne.toFixed(1)} ({notes.length} avis)</span>
                    </div>
                  )}

                  {/* Bio */}
                  {p.bio && (
                    <p className="text-sm text-gray-500 line-clamp-2 mb-3">{p.bio}</p>
                  )}

                  {/* Compétences */}
                  {p.competences?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {p.competences.slice(0, 4).map(skill => (
                        <span key={skill} className="badge badge-blue text-xs">{skill}</span>
                      ))}
                      {p.competences.length > 4 && (
                        <span className="text-xs text-gray-400">+{p.competences.length - 4}</span>
                      )}
                    </div>
                  )}

                  {/* Footer */}
                  <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs text-gray-400">
                      Membre depuis {new Date(p.dateCreation).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                    </span>
                    <Link to="/missions" className="text-xs text-primary-600 font-semibold hover:underline">
                      Voir missions →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default Prestataires;
