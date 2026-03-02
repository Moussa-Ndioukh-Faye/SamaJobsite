import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const DOMAINES = [
  'Développement web', 'Design graphique', 'Rédaction', 'Marketing digital',
  'Traduction', 'Photographie', 'Assistance virtuelle', 'Saisie de données', 'Autre',
];

const CreateMission = () => {
  const [form, setForm] = useState({
    titre: '', description: '', domaine: '', budget: '',
    lieu: '', dateMission: '',
  });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (!form.titre || !form.description || !form.domaine || !form.budget || !form.lieu || !form.dateMission) {
      return setError('Veuillez remplir tous les champs obligatoires');
    }
    setLoading(true);
    try {
      const { data } = await api.post('/missions', form);
      navigate(`/missions/${data.mission.id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  };

  // Date minimum = aujourd'hui
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="fade-in max-w-2xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <Link to="/dashboard/client" className="text-sm text-primary-600 hover:underline flex items-center gap-1 mb-3">
          ← Retour au dashboard
        </Link>
        <h1 className="text-2xl font-extrabold text-primary-600">Publier une mission</h1>
        <p className="text-gray-500 mt-1 text-sm">Décrivez votre besoin pour trouver le prestataire idéal</p>
      </div>

      <div className="card">
        {error && (
          <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Titre */}
          <div>
            <label className="label">Titre de la mission *</label>
            <input
              type="text" name="titre" value={form.titre} onChange={handleChange}
              required maxLength={100}
              className="input" placeholder="Ex: Créer un site web vitrine pour mon restaurant"
            />
            <p className="text-xs text-gray-400 mt-1">{form.titre.length}/100 caractères</p>
          </div>

          {/* Domaine */}
          <div>
            <label className="label">Domaine *</label>
            <select name="domaine" value={form.domaine} onChange={handleChange} required className="input">
              <option value="">Sélectionner un domaine</option>
              {DOMAINES.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="label">Description détaillée *</label>
            <textarea
              name="description" value={form.description} onChange={handleChange}
              required rows={5} minLength={50}
              className="input resize-none"
              placeholder="Décrivez précisément votre mission : objectifs, livrables attendus, contraintes techniques, etc."
            />
            <p className="text-xs text-gray-400 mt-1">{form.description.length} caractères (min. 50)</p>
          </div>

          {/* Budget + Lieu */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Budget (FCFA) *</label>
              <input
                type="number" name="budget" value={form.budget} onChange={handleChange}
                required min="1000" step="500"
                className="input" placeholder="50000"
              />
            </div>
            <div>
              <label className="label">Lieu *</label>
              <input
                type="text" name="lieu" value={form.lieu} onChange={handleChange}
                required className="input" placeholder="Dakar, Thiès, Ziguinchor..."
              />
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="label">Date souhaitée *</label>
            <input
              type="date" name="dateMission" value={form.dateMission} onChange={handleChange}
              required min={today}
              className="input"
            />
          </div>

          {/* Aperçu budget */}
          {form.budget && (
            <div className="p-3 rounded-xl bg-primary-50 border border-primary-100 text-sm text-primary-700">
              💰 Budget indiqué : <strong>{parseInt(form.budget).toLocaleString('fr-FR')} FCFA</strong>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Link to="/dashboard/client" className="btn-outline flex-1 text-center">
              Annuler
            </Link>
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Publication...
                </span>
              ) : '🚀 Publier la mission'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateMission;
