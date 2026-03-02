import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { getErrorMessage } from '../services/api';

const DOMAINES = [
  'Développement web', 'Design graphique', 'Rédaction', 'Marketing digital',
  'Traduction', 'Photographie', 'Assistance virtuelle', 'Saisie de données', 'Autre',
];

const Register = () => {
  const [searchParams] = useSearchParams();
  const initialRole    = searchParams.get('role') || 'CLIENT';

  const [form, setForm] = useState({
    nom: '', email: '', motDePasse: '', confirmPass: '',
    role: initialRole, telephone: '', domaine: '',
  });
  const [showPw,  setShowPw]  = useState(false);
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const toast        = useToast();
  const navigate     = useNavigate();

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const validate = () => {
    if (!form.nom.trim()) {
      toast.error('Le nom complet est requis.'); return false;
    }
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      toast.error('Veuillez saisir une adresse email valide.'); return false;
    }
    if (form.motDePasse.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères.'); return false;
    }
    if (form.motDePasse !== form.confirmPass) {
      toast.error('Les mots de passe ne correspondent pas.'); return false;
    }
    if (form.role === 'PRESTATAIRE' && !form.domaine) {
      toast.error('Veuillez sélectionner votre domaine principal.'); return false;
    }
    return true;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const data = await register({
        nom: form.nom, email: form.email,
        motDePasse: form.motDePasse, role: form.role,
        telephone: form.telephone,
        ...(form.role === 'PRESTATAIRE' && { domaine: form.domaine }),
      });

      if (form.role === 'PRESTATAIRE') {
        toast.info('Compte créé ! Votre dossier est en attente de validation (24-48h).');
      } else {
        toast.success(`Bienvenue sur SamaJob, ${form.nom.split(' ')[0]} ! 🎉`);
      }

      const role = data.user.role;
      if (role === 'CLIENT')       navigate('/dashboard/client');
      else if (role === 'ADMIN')   navigate('/admin/dashboard');
      else                         navigate('/dashboard/prestataire');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const pwStrength = pw => {
    if (!pw) return { level: 0, label: '', color: '' };
    if (pw.length < 4)  return { level: 1, label: 'Faible',  color: 'bg-red-400' };
    if (pw.length < 8)  return { level: 2, label: 'Moyen',   color: 'bg-yellow-400' };
    return               { level: 3, label: 'Fort',   color: 'bg-green-400' };
  };
  const strength = pwStrength(form.motDePasse);

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-br from-primary-900 via-primary-700 to-secondary-600 px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-7">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-secondary-500 flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="font-extrabold text-2xl text-primary-600">Sama<span className="text-secondary-500">Job</span></span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Créer un compte</h1>
            <p className="text-gray-500 text-sm mt-1">Rejoignez la plateforme SamaJob</p>
          </div>

          {/* Sélection rôle */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {['CLIENT', 'PRESTATAIRE'].map(r => (
              <button key={r} type="button"
                onClick={() => setForm(prev => ({ ...prev, role: r }))}
                className={`py-3 px-4 rounded-xl border-2 text-sm font-semibold transition-all ${
                  form.role === r ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                {r === 'CLIENT' ? '🏢 Je suis Client' : '👨‍💻 Je suis Prestataire'}
              </button>
            ))}
          </div>

          {form.role === 'PRESTATAIRE' && (
            <div className="mb-5 p-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 text-xs flex items-start gap-2">
              <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Votre profil sera examiné par un administrateur avant validation (24-48h).
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Nom complet *</label>
                <input type="text" name="nom" value={form.nom} onChange={handleChange}
                  className="input" placeholder="Mamadou Diallo" />
              </div>
              <div>
                <label className="label">Téléphone</label>
                <input type="tel" name="telephone" value={form.telephone} onChange={handleChange}
                  className="input" placeholder="+221 77 000 00 00" />
              </div>
            </div>

            <div>
              <label className="label">Email *</label>
              <input type="email" name="email" value={form.email} onChange={handleChange}
                autoComplete="email" className="input" placeholder="exemple@email.com" />
            </div>

            {form.role === 'PRESTATAIRE' && (
              <div>
                <label className="label">Domaine principal *</label>
                <select name="domaine" value={form.domaine} onChange={handleChange} className="input">
                  <option value="">Choisir un domaine</option>
                  {DOMAINES.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Mot de passe *</label>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'} name="motDePasse"
                    value={form.motDePasse} onChange={handleChange}
                    autoComplete="new-password" className="input pr-10" placeholder="Min. 6 caractères"
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" tabIndex={-1}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d={showPw
                          ? "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                          : "M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"}
                      />
                    </svg>
                  </button>
                </div>
                {form.motDePasse && (
                  <div className="mt-1.5 flex items-center gap-1">
                    {[1,2,3].map(i => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${
                        i <= strength.level ? strength.color : 'bg-gray-200'
                      }`} />
                    ))}
                    <span className="text-xs text-gray-400 ml-1">{strength.label}</span>
                  </div>
                )}
              </div>
              <div>
                <label className="label">Confirmer *</label>
                <input
                  type="password" name="confirmPass" value={form.confirmPass}
                  onChange={handleChange} autoComplete="new-password"
                  className={`input ${form.confirmPass && form.confirmPass !== form.motDePasse ? 'border-red-300' : ''}`}
                  placeholder="Répéter"
                />
                {form.confirmPass && form.confirmPass !== form.motDePasse && (
                  <p className="text-xs text-red-500 mt-1">Les mots de passe ne correspondent pas</p>
                )}
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base mt-2">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Création en cours...
                </span>
              ) : 'Créer mon compte'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            Déjà un compte ?{' '}
            <Link to="/login" className="text-primary-600 font-semibold hover:text-primary-700">Se connecter</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
