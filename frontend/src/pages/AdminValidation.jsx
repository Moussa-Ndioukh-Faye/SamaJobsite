import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminValidation = () => {
  const [prestataires, setPrestataires] = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [feedback,     setFeedback]     = useState('');

  const fetchPrestataires = async () => {
    try {
      const { data } = await api.get('/admin/prestataires/en-attente');
      setPrestataires(data.prestataires);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPrestataires(); }, []);

  const handleAction = async (userId, statut) => {
    try {
      await api.patch(`/admin/users/${userId}/statut`, { statut });
      setPrestataires(prev => prev.filter(p => p.id !== userId));
      setFeedback(statut === 'VALIDE' ? '✓ Prestataire validé' : '✕ Prestataire rejeté');
      setTimeout(() => setFeedback(''), 3000);
    } catch (err) {
      setFeedback(err.response?.data?.message || 'Erreur');
    }
  };

  return (
    <div className="fade-in max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link to="/admin/dashboard" className="text-sm text-primary-600 hover:underline">← Dashboard admin</Link>
          <h1 className="text-2xl font-extrabold text-primary-600 mt-1">Validation des dossiers</h1>
          <p className="text-gray-500 text-sm">Prestataires en attente de validation</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 font-bold text-lg">
          {prestataires.length}
        </div>
      </div>

      {feedback && (
        <div className="mb-5 p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">{feedback}</div>
      )}

      {loading ? <LoadingSpinner /> : (
        prestataires.length === 0 ? (
          <div className="card text-center py-16">
            <div className="text-5xl mb-4">✅</div>
            <p className="text-gray-500 text-lg">Aucun dossier en attente</p>
            <p className="text-gray-400 text-sm">Tous les prestataires ont été traités</p>
          </div>
        ) : (
          <div className="space-y-5">
            {prestataires.map(p => (
              <div key={p.id} className="card border-l-4 border-yellow-400">
                {/* Header */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-600 to-secondary-500 flex items-center justify-center text-white text-lg font-bold">
                      {p.nom.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">{p.nom}</div>
                      <div className="text-sm text-gray-500">{p.email}</div>
                      {p.telephone && <div className="text-xs text-gray-400">📱 {p.telephone}</div>}
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">
                    Inscrit le {new Date(p.dateCreation).toLocaleDateString('fr-FR', { day:'numeric', month:'long', year:'numeric' })}
                  </div>
                </div>

                {/* Domaine & compétences */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-50 rounded-xl p-3">
                    <div className="text-xs text-gray-400 mb-1">Domaine</div>
                    <div className="font-medium text-gray-800">{p.domaine || 'Non renseigné'}</div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <div className="text-xs text-gray-400 mb-1">Compétences</div>
                    <div className="flex flex-wrap gap-1">
                      {p.competences?.length > 0 ? (
                        p.competences.map(c => <span key={c} className="badge badge-blue text-xs">{c}</span>)
                      ) : (
                        <span className="text-xs text-gray-400">Aucune compétence renseignée</span>
                      )}
                    </div>
                  </div>
                </div>

                {p.bio && (
                  <div className="mb-4 bg-blue-50 rounded-xl p-3">
                    <div className="text-xs text-blue-400 mb-1">Présentation</div>
                    <p className="text-sm text-blue-800">{p.bio}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => handleAction(p.id, 'VALIDE')}
                    className="btn-secondary flex-1"
                  >
                    ✓ Valider le dossier
                  </button>
                  <button
                    onClick={() => handleAction(p.id, 'REJETE')}
                    className="btn-danger flex-1"
                  >
                    ✕ Rejeter
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default AdminValidation;
