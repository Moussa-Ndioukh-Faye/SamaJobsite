import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const DOMAINES = [
  'Développement web', 'Design graphique', 'Rédaction', 'Marketing digital',
  'Traduction', 'Photographie', 'Assistance virtuelle', 'Saisie de données', 'Autre',
];

const COMPETENCES_SUGGESTIONS = [
  'React', 'Node.js', 'Python', 'WordPress', 'Figma', 'Photoshop', 'Excel',
  'Rédaction web', 'SEO', 'Traduction', 'Community management', 'Comptabilité',
];

const Profile = () => {
  const { user, updateUser, isPrestataire } = useAuth();
  const [form, setForm] = useState({
    nom: '', telephone: '', domaine: '', bio: '', competences: [],
  });
  const [pwForm, setPwForm] = useState({ ancienMotDePasse: '', nouveauMotDePasse: '', confirm: '' });
  const [competenceInput, setCompetenceInput] = useState('');
  const [saving, setSaving]   = useState(false);
  const [pwSaving, setPwSaving] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', text: '' });
  const [tab, setTab] = useState('profil');

  useEffect(() => {
    if (user) {
      setForm({
        nom:        user.nom         || '',
        telephone:  user.telephone   || '',
        domaine:    user.domaine     || '',
        bio:        user.bio         || '',
        competences: user.competences || [],
      });
    }
  }, [user]);

  const showFeedback = (type, text) => {
    setFeedback({ type, text });
    setTimeout(() => setFeedback({ type: '', text: '' }), 4000);
  };

  const handleSaveProfil = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.put('/users/profil', form);
      updateUser(data.user);
      showFeedback('success', 'Profil mis à jour avec succès !');
    } catch (err) {
      showFeedback('error', err.response?.data?.message || 'Erreur');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePw = async e => {
    e.preventDefault();
    if (pwForm.nouveauMotDePasse !== pwForm.confirm) {
      return showFeedback('error', 'Les mots de passe ne correspondent pas');
    }
    setPwSaving(true);
    try {
      await api.put('/users/mot-de-passe', pwForm);
      showFeedback('success', 'Mot de passe modifié !');
      setPwForm({ ancienMotDePasse: '', nouveauMotDePasse: '', confirm: '' });
    } catch (err) {
      showFeedback('error', err.response?.data?.message || 'Erreur');
    } finally {
      setPwSaving(false);
    }
  };

  const addCompetence = (c) => {
    const val = c.trim();
    if (val && !form.competences.includes(val)) {
      setForm(p => ({ ...p, competences: [...p.competences, val] }));
    }
    setCompetenceInput('');
  };

  const removeCompetence = (c) => {
    setForm(p => ({ ...p, competences: p.competences.filter(x => x !== c) }));
  };

  const STATUT_BADGE = {
    EN_ATTENTE: <span className="badge badge-yellow">En attente de validation</span>,
    VALIDE:     <span className="badge badge-green">Compte validé ✓</span>,
    REJETE:     <span className="badge badge-red">Dossier rejeté</span>,
    SUSPENDU:   <span className="badge badge-red">Compte suspendu</span>,
  };

  return (
    <div className="fade-in max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-extrabold text-primary-600 mb-6">Mon profil</h1>

      {/* Carte identité */}
      <div className="card mb-6 flex items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-600 to-secondary-500 flex items-center justify-center text-white text-2xl font-extrabold flex-shrink-0">
          {user?.nom?.charAt(0).toUpperCase()}
        </div>
        <div>
          <div className="font-bold text-gray-900 text-lg">{user?.nom}</div>
          <div className="text-sm text-gray-500">{user?.email}</div>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="badge badge-blue text-xs">{user?.role}</span>
            {STATUT_BADGE[user?.statut]}
          </div>
        </div>
      </div>

      {/* Feedback */}
      {feedback.text && (
        <div className={`mb-5 p-3 rounded-lg text-sm ${
          feedback.type === 'success' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'
        }`}>{feedback.text}</div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 rounded-xl p-1">
        {[
          { key: 'profil',    label: 'Informations' },
          { key: 'securite',  label: 'Sécurité' },
        ].map(t => (
          <button
            key={t.key} onClick={() => setTab(t.key)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === t.key ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >{t.label}</button>
        ))}
      </div>

      {/* PROFIL */}
      {tab === 'profil' && (
        <div className="card">
          <form onSubmit={handleSaveProfil} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Nom complet</label>
                <input type="text" value={form.nom} onChange={e => setForm(p => ({ ...p, nom: e.target.value }))} className="input" required />
              </div>
              <div>
                <label className="label">Téléphone</label>
                <input type="tel" value={form.telephone} onChange={e => setForm(p => ({ ...p, telephone: e.target.value }))} className="input" placeholder="+221 77 000 00 00" />
              </div>
            </div>

            {isPrestataire && (
              <>
                <div>
                  <label className="label">Domaine principal</label>
                  <select value={form.domaine} onChange={e => setForm(p => ({ ...p, domaine: e.target.value }))} className="input">
                    <option value="">Choisir</option>
                    {DOMAINES.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>

                <div>
                  <label className="label">Compétences</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {form.competences.map(c => (
                      <span key={c} className="badge badge-blue text-xs flex items-center gap-1">
                        {c}
                        <button type="button" onClick={() => removeCompetence(c)} className="ml-1 text-blue-400 hover:text-blue-700">✕</button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text" value={competenceInput}
                      onChange={e => setCompetenceInput(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addCompetence(competenceInput); } }}
                      className="input flex-1 text-sm" placeholder="Ajouter une compétence..."
                    />
                    <button type="button" onClick={() => addCompetence(competenceInput)} className="btn-outline text-sm px-3">
                      Ajouter
                    </button>
                  </div>
                  {/* Suggestions */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {COMPETENCES_SUGGESTIONS.filter(s => !form.competences.includes(s)).slice(0, 8).map(s => (
                      <button
                        key={s} type="button"
                        onClick={() => addCompetence(s)}
                        className="text-xs px-2 py-0.5 rounded-full border border-gray-300 text-gray-500 hover:border-primary-400 hover:text-primary-600 transition-colors"
                      >+ {s}</button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="label">Bio / Présentation</label>
                  <textarea
                    value={form.bio}
                    onChange={e => setForm(p => ({ ...p, bio: e.target.value }))}
                    rows={4} className="input resize-none"
                    placeholder="Présentez-vous en quelques lignes : votre expérience, vos points forts..."
                  />
                </div>
              </>
            )}

            <button type="submit" disabled={saving} className="btn-primary w-full">
              {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </button>
          </form>
        </div>
      )}

      {/* SÉCURITÉ */}
      {tab === 'securite' && (
        <div className="card">
          <h3 className="font-bold text-gray-900 mb-5">Changer le mot de passe</h3>
          <form onSubmit={handleChangePw} className="space-y-4">
            <div>
              <label className="label">Mot de passe actuel</label>
              <input type="password" value={pwForm.ancienMotDePasse} onChange={e => setPwForm(p => ({ ...p, ancienMotDePasse: e.target.value }))} required className="input" />
            </div>
            <div>
              <label className="label">Nouveau mot de passe</label>
              <input type="password" value={pwForm.nouveauMotDePasse} onChange={e => setPwForm(p => ({ ...p, nouveauMotDePasse: e.target.value }))} required minLength={6} className="input" />
            </div>
            <div>
              <label className="label">Confirmer le nouveau mot de passe</label>
              <input type="password" value={pwForm.confirm} onChange={e => setPwForm(p => ({ ...p, confirm: e.target.value }))} required className="input" />
            </div>
            <button type="submit" disabled={pwSaving} className="btn-primary w-full">
              {pwSaving ? 'Enregistrement...' : 'Modifier le mot de passe'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Profile;
