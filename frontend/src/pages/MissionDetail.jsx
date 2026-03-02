import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const StarRating = ({ value }) => (
  <div className="flex gap-0.5">
    {[1,2,3,4,5].map(i => (
      <svg key={i} className={`w-4 h-4 ${i <= value ? 'text-yellow-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ))}
  </div>
);

const STATUT_CONFIG = {
  OUVERTE:   { label: 'Ouverte',   cls: 'badge-green' },
  ATTRIBUEE: { label: 'Attribuée', cls: 'badge-blue' },
  TERMINEE:  { label: 'Terminée',  cls: 'badge-gray' },
};

const MissionDetail = () => {
  const { id }  = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isPrestataire, isClient, isAdmin } = useAuth();

  const [mission,    setMission]    = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [messages,   setMessages]   = useState([]);
  const [candidatureForm, setCandidatureForm] = useState({ message: '', propositionPrix: '' });
  const [evalForm,   setEvalForm]   = useState({ note: 5, commentaire: '' });
  const [msgText,    setMsgText]    = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback,   setFeedback]   = useState({ type: '', text: '' });
  const [tab, setTab]               = useState('info'); // info | messages

  const fetchMission = async () => {
    try {
      const { data } = await api.get(`/missions/${id}`);
      setMission(data.mission);
    } catch {
      navigate('/missions');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      const { data } = await api.get(`/messages/mission/${id}`);
      setMessages(data.messages);
    } catch {}
  };

  useEffect(() => { fetchMission(); }, [id]);
  useEffect(() => {
    if (isAuthenticated && mission) fetchMessages();
  }, [mission, isAuthenticated]);

  const handleCandidature = async e => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/candidatures', {
        missionId: parseInt(id),
        message: candidatureForm.message,
        propositionPrix: parseFloat(candidatureForm.propositionPrix),
      });
      setFeedback({ type: 'success', text: 'Candidature soumise avec succès !' });
      fetchMission();
    } catch (err) {
      setFeedback({ type: 'error', text: err.response?.data?.message || 'Erreur' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleTerminer = async () => {
    try {
      await api.patch(`/missions/${id}/terminer`);
      fetchMission();
      setFeedback({ type: 'success', text: 'Mission marquée comme terminée !' });
    } catch (err) {
      setFeedback({ type: 'error', text: err.response?.data?.message || 'Erreur' });
    }
  };

  const handleEvaluation = async e => {
    e.preventDefault();
    try {
      await api.post('/evaluations', { missionId: parseInt(id), ...evalForm });
      setFeedback({ type: 'success', text: 'Évaluation soumise !' });
      fetchMission();
    } catch (err) {
      setFeedback({ type: 'error', text: err.response?.data?.message || 'Erreur' });
    }
  };

  const handleSendMessage = async e => {
    e.preventDefault();
    if (!msgText.trim()) return;
    try {
      await api.post('/messages', { missionId: parseInt(id), contenu: msgText });
      setMsgText('');
      fetchMessages();
    } catch {}
  };

  const handleSelectCandidature = async (candidatureId, statut) => {
    try {
      await api.patch(`/candidatures/${candidatureId}/statut`, { statut });
      fetchMission();
      setFeedback({ type: 'success', text: statut === 'ACCEPTEE' ? 'Prestataire sélectionné !' : 'Candidature refusée.' });
    } catch (err) {
      setFeedback({ type: 'error', text: err.response?.data?.message || 'Erreur' });
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;
  if (!mission) return null;

  const isOwner      = user?.id === mission.clientId;
  const statut       = STATUT_CONFIG[mission.statut];
  const alreadyApplied = mission.candidatures?.some(c => c.prestataireId === user?.id);
  const hasEvaluation  = mission.evaluations?.some(e => e.auteurId === user?.id);
  const canChat = isOwner || mission.candidatures?.some(c => c.prestataireId === user?.id && c.statut === 'ACCEPTEE');

  return (
    <div className="fade-in max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Feedback banner */}
      {feedback.text && (
        <div className={`mb-5 p-3 rounded-lg text-sm flex items-center gap-2 ${
          feedback.type === 'success' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'
        }`}>
          {feedback.text}
          <button onClick={() => setFeedback({ type: '', text: '' })} className="ml-auto text-xs opacity-70 hover:opacity-100">✕</button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Colonne principale ── */}
        <div className="lg:col-span-2 space-y-5">
          {/* Header mission */}
          <div className="card">
            <div className="flex items-start justify-between gap-3 mb-4">
              <span className={`${statut.cls} text-xs`}>{statut.label}</span>
              <span className="badge bg-blue-50 text-blue-600 text-xs">{mission.domaine}</span>
            </div>
            <h1 className="text-2xl font-extrabold text-primary-600 mb-3">{mission.titre}</h1>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">{mission.description}</p>

            {/* Infos */}
            <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { icon: '📍', label: 'Lieu',   value: mission.lieu },
                { icon: '📅', label: 'Date',   value: new Date(mission.dateMission).toLocaleDateString('fr-FR', { day:'numeric', month:'long', year:'numeric' }) },
                { icon: '👥', label: 'Candidats', value: `${mission._count?.candidatures || 0}` },
              ].map(i => (
                <div key={i.label} className="bg-gray-50 rounded-xl p-3">
                  <div className="text-xs text-gray-400 mb-0.5">{i.icon} {i.label}</div>
                  <div className="font-semibold text-gray-800 text-sm">{i.value}</div>
                </div>
              ))}
            </div>

            {/* Client */}
            <div className="mt-4 flex items-center gap-3 pt-4 border-t border-gray-100">
              <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold">
                {mission.client?.nom?.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="text-xs text-gray-400">Publié par</div>
                <div className="font-semibold text-gray-800 text-sm">{mission.client?.nom}</div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          {isAuthenticated && canChat && (
            <div className="flex gap-2 border-b border-gray-200">
              {['info','messages'].map(t => (
                <button
                  key={t} onClick={() => setTab(t)}
                  className={`px-4 py-2 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
                    tab === t ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {t === 'info' ? 'Candidatures' : 'Messages'}
                  {t === 'messages' && messages.length > 0 && (
                    <span className="ml-1.5 badge bg-primary-100 text-primary-600">{messages.length}</span>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Candidatures (client propriétaire) */}
          {tab === 'info' && isOwner && mission.candidatures?.length > 0 && (
            <div className="card">
              <h2 className="font-bold text-gray-900 mb-4">Candidatures reçues ({mission.candidatures.length})</h2>
              <div className="space-y-4">
                {mission.candidatures.map(c => (
                  <div key={c.id} className="border border-gray-100 rounded-xl p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-secondary-100 flex items-center justify-center text-secondary-600 font-bold">
                          {c.prestataire?.nom?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800">{c.prestataire?.nom}</div>
                          <div className="text-xs text-gray-400">{c.prestataire?.domaine}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-primary-600">{c.propositionPrix?.toLocaleString('fr-FR')} FCFA</div>
                        <span className={`badge text-xs mt-1 ${
                          c.statut === 'ACCEPTEE' ? 'badge-green' : c.statut === 'REFUSEE' ? 'badge-red' : 'badge-yellow'
                        }`}>{c.statut}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-2 bg-gray-50 rounded-lg p-2">{c.message}</p>
                    {c.statut === 'EN_ATTENTE' && mission.statut === 'OUVERTE' && (
                      <div className="flex gap-2 mt-3">
                        <button onClick={() => handleSelectCandidature(c.id, 'ACCEPTEE')} className="btn-secondary text-xs py-1.5 px-3">
                          ✓ Sélectionner
                        </button>
                        <button onClick={() => handleSelectCandidature(c.id, 'REFUSEE')} className="btn-danger text-xs py-1.5 px-3">
                          ✕ Refuser
                        </button>
                      </div>
                    )}
                    {c.prestataire?.competences?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {c.prestataire.competences.slice(0,4).map(skill => (
                          <span key={skill} className="badge badge-blue text-xs">{skill}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Actions client */}
              {mission.statut === 'ATTRIBUEE' && (
                <button onClick={handleTerminer} className="btn-primary mt-4 w-full">
                  ✓ Valider la fin de mission
                </button>
              )}
            </div>
          )}

          {/* Chat messages */}
          {tab === 'messages' && canChat && (
            <div className="card">
              <h2 className="font-bold text-gray-900 mb-4">Messages de la mission</h2>
              <div className="space-y-3 max-h-80 overflow-y-auto mb-4 pr-1">
                {messages.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-4">Aucun message pour l'instant</p>
                ) : messages.map(m => {
                  const isMine = m.expediteurId === user?.id;
                  return (
                    <div key={m.id} className={`flex gap-2 ${isMine ? 'flex-row-reverse' : ''}`}>
                      <div className="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-xs font-bold flex-shrink-0">
                        {m.expediteur?.nom?.charAt(0).toUpperCase()}
                      </div>
                      <div className={`max-w-xs px-3 py-2 rounded-xl text-sm ${isMine ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-800'}`}>
                        <div className="text-xs opacity-70 mb-0.5">{m.expediteur?.nom}</div>
                        {m.contenu}
                      </div>
                    </div>
                  );
                })}
              </div>
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text" value={msgText}
                  onChange={e => setMsgText(e.target.value)}
                  placeholder="Écrire un message..."
                  className="input flex-1 text-sm"
                />
                <button type="submit" className="btn-primary px-4">Envoyer</button>
              </form>
            </div>
          )}

          {/* Évaluations */}
          {mission.evaluations?.length > 0 && (
            <div className="card">
              <h2 className="font-bold text-gray-900 mb-4">Évaluations</h2>
              {mission.evaluations.map(ev => (
                <div key={ev.id} className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
                  <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 font-bold text-sm">
                    {ev.auteur?.nom?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{ev.auteur?.nom}</span>
                      <StarRating value={ev.note} />
                    </div>
                    {ev.commentaire && <p className="text-sm text-gray-500 mt-1">{ev.commentaire}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Colonne latérale ── */}
        <div className="space-y-5">
          {/* Budget */}
          <div className="card text-center">
            <div className="text-sm text-gray-500 mb-1">Budget proposé</div>
            <div className="text-3xl font-extrabold text-primary-600">
              {mission.budget?.toLocaleString('fr-FR')}
            </div>
            <div className="text-sm text-gray-400">FCFA</div>
          </div>

          {/* Postuler (PRESTATAIRE validé) */}
          {isAuthenticated && isPrestataire && mission.statut === 'OUVERTE' && !alreadyApplied && !isOwner && (
            <div className="card">
              <h3 className="font-bold text-gray-900 mb-4">Postuler à cette mission</h3>
              <form onSubmit={handleCandidature} className="space-y-3">
                <div>
                  <label className="label text-xs">Votre proposition de prix (FCFA) *</label>
                  <input
                    type="number" min="0" required
                    value={candidatureForm.propositionPrix}
                    onChange={e => setCandidatureForm(p => ({ ...p, propositionPrix: e.target.value }))}
                    className="input text-sm"
                    placeholder={mission.budget}
                  />
                </div>
                <div>
                  <label className="label text-xs">Message de motivation *</label>
                  <textarea
                    required rows={4}
                    value={candidatureForm.message}
                    onChange={e => setCandidatureForm(p => ({ ...p, message: e.target.value }))}
                    className="input text-sm resize-none"
                    placeholder="Présentez-vous et expliquez pourquoi vous êtes le meilleur candidat..."
                  />
                </div>
                <button type="submit" disabled={submitting} className="btn-primary w-full">
                  {submitting ? 'Envoi...' : 'Envoyer ma candidature'}
                </button>
              </form>
            </div>
          )}

          {alreadyApplied && (
            <div className="card bg-green-50 border border-green-200 text-center">
              <span className="text-green-600 font-medium text-sm">✓ Candidature déjà soumise</span>
            </div>
          )}

          {/* Évaluer (client, mission terminée) */}
          {isOwner && mission.statut === 'TERMINEE' && !hasEvaluation && (
            <div className="card">
              <h3 className="font-bold text-gray-900 mb-4">Évaluer le prestataire</h3>
              <form onSubmit={handleEvaluation} className="space-y-3">
                <div>
                  <label className="label text-xs">Note (1-5 étoiles) *</label>
                  <div className="flex gap-2 mt-1">
                    {[1,2,3,4,5].map(n => (
                      <button key={n} type="button" onClick={() => setEvalForm(p => ({ ...p, note: n }))}>
                        <svg className={`w-7 h-7 transition-colors ${n <= evalForm.note ? 'text-yellow-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="label text-xs">Commentaire (optionnel)</label>
                  <textarea
                    rows={3}
                    value={evalForm.commentaire}
                    onChange={e => setEvalForm(p => ({ ...p, commentaire: e.target.value }))}
                    className="input text-sm resize-none"
                    placeholder="Partagez votre expérience..."
                  />
                </div>
                <button type="submit" className="btn-secondary w-full text-sm">
                  ★ Soumettre l'évaluation
                </button>
              </form>
            </div>
          )}

          {/* Lien retour */}
          <Link to="/missions" className="block text-center text-sm text-primary-600 hover:underline">
            ← Retour aux missions
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MissionDetail;
