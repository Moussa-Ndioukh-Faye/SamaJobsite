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

const CLOUD_NAME    = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const Profile = () => {
  const { user, updateUser, isPrestataire } = useAuth();
  const [form, setForm] = useState({
    nom: '', telephone: '', domaine: '', bio: '', competences: [],
  });
  const [pwForm, setPwForm] = useState({ ancienMotDePasse: '', nouveauMotDePasse: '', confirm: '' });
  const [competenceInput, setCompetenceInput] = useState('');
  const [saving, setSaving]     = useState(false);
  const [pwSaving, setPwSaving] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', text: '' });
  const [tab, setTab]           = useState('profil');
  const [documents, setDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [docNom, setDocNom]       = useState('');

  useEffect(() => {
    if (user) {
      setForm({
        nom:        user.nom         || '',
        telephone:  user.telephone   || '',
        domaine:    user.domaine     || '',
        bio:        user.bio         || '',
        competences: user.competences || [],
      });
      // Charger les documents existants
      const docs = (user.documents || []).map(d => {
        try { return JSON.parse(d); } catch { return { url: d, nom: 'Document' }; }
      });
      setDocuments(docs);
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

  const handleUploadDocument = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const ACCEPTED = ['application/pdf', 'image/jpeg', 'image/png',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!ACCEPTED.includes(file.type)) {
      return showFeedback('error', 'Format non accepté. Utilisez PDF, JPG, PNG ou DOCX.');
    }
    if (file.size > 5 * 1024 * 1024) {
      return showFeedback('error', 'Fichier trop volumineux (5 Mo max).');
    }
    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      return showFeedback('error', 'Configuration Cloudinary manquante. Contactez l\'administrateur.');
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', UPLOAD_PRESET);
      formData.append('folder', 'samajob/documents');

      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`, {
        method: 'POST', body: formData,
      });
      if (!res.ok) throw new Error('Erreur lors de l\'upload');
      const data = await res.json();

      const nom = docNom.trim() || file.name.replace(/\.[^.]+$/, '').slice(0, 80);
      const { data: saved } = await api.post('/users/documents', { url: data.secure_url, nom });

      const parsed = saved.documents.map(d => {
        try { return JSON.parse(d); } catch { return { url: d, nom: 'Document' }; }
      });
      setDocuments(parsed);
      setDocNom('');
      e.target.value = '';
      showFeedback('success', 'Document ajouté avec succès !');
    } catch (err) {
      showFeedback('error', err.response?.data?.message || 'Erreur lors de l\'upload');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteDocument = async (index) => {
    try {
      const { data } = await api.delete('/users/documents', { data: { index } });
      const parsed = data.documents.map(d => {
        try { return JSON.parse(d); } catch { return { url: d, nom: 'Document' }; }
      });
      setDocuments(parsed);
      showFeedback('success', 'Document supprimé.');
    } catch (err) {
      showFeedback('error', err.response?.data?.message || 'Erreur');
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
          ...(isPrestataire ? [{ key: 'documents', label: 'Documents' }] : []),
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

      {/* DOCUMENTS */}
      {tab === 'documents' && isPrestataire && (
        <div className="card space-y-6">
          <div>
            <h3 className="font-bold text-gray-900 mb-1">Mes documents</h3>
            <p className="text-xs text-gray-500">CV, portfolio, diplômes — PDF, JPG, PNG, DOCX (5 Mo max)</p>
          </div>

          {/* Zone d'upload */}
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-5 space-y-3">
            <div>
              <label className="label">Nom du document <span className="text-gray-400">(optionnel)</span></label>
              <input
                type="text" value={docNom}
                onChange={e => setDocNom(e.target.value)}
                className="input text-sm" placeholder="ex: CV 2026, Portfolio design..."
                maxLength={80}
              />
            </div>
            <div>
              <label className={`flex items-center justify-center gap-2 cursor-pointer w-full py-3 rounded-lg border border-primary-300 text-primary-600 text-sm font-medium hover:bg-primary-50 transition-colors ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                {uploading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    Upload en cours...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    Choisir un fichier
                  </>
                )}
                <input
                  type="file" className="hidden" disabled={uploading}
                  accept=".pdf,.jpg,.jpeg,.png,.docx"
                  onChange={handleUploadDocument}
                />
              </label>
            </div>
          </div>

          {/* Liste des documents */}
          {documents.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">Aucun document déposé</p>
          ) : (
            <ul className="space-y-2">
              {documents.map((doc, i) => (
                <li key={i} className="flex items-center justify-between gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{doc.nom}</p>
                      <a
                        href={doc.url} target="_blank" rel="noopener noreferrer"
                        className="text-xs text-primary-600 hover:underline"
                      >Voir le fichier →</a>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteDocument(i)}
                    className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                    title="Supprimer"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}

          <p className="text-xs text-gray-400">{documents.length}/10 documents</p>
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
