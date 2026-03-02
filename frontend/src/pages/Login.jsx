import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { getErrorMessage } from '../services/api';

const Login = () => {
  const [form,    setForm]    = useState({ email: '', motDePasse: '' });
  const [loading, setLoading] = useState(false);
  const [showPw,  setShowPw]  = useState(false);

  const { login }      = useAuth();
  const toast          = useToast();
  const navigate       = useNavigate();
  const [searchParams] = useSearchParams();

  // Alerte si session expirée via redirect
  useEffect(() => {
    if (searchParams.get('session') === 'expired') {
      toast.warning('Votre session a expiré. Veuillez vous reconnecter.');
    }
  }, []);

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.email)      { toast.error('Veuillez saisir votre adresse email.');  return; }
    if (!form.motDePasse) { toast.error('Veuillez saisir votre mot de passe.'); return; }

    setLoading(true);
    try {
      const data = await login(form.email, form.motDePasse);
      toast.success(`Bienvenue, ${data.user.nom.split(' ')[0]} ! 👋`);

      const role = data.user.role;
      if (role === 'ADMIN')       navigate('/admin/dashboard',       { replace: true });
      else if (role === 'CLIENT') navigate('/dashboard/client',      { replace: true });
      else                        navigate('/dashboard/prestataire', { replace: true });
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-br from-primary-900 via-primary-700 to-secondary-600 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-secondary-500 flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="font-extrabold text-2xl text-primary-600">Sama<span className="text-secondary-500">Job</span></span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Connexion</h1>
            <p className="text-gray-500 text-sm mt-1">Accédez à votre espace SamaJob</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label className="label">Adresse email</label>
              <input
                type="email" name="email" value={form.email}
                onChange={handleChange} autoComplete="email"
                className="input" placeholder="exemple@email.com"
              />
            </div>

            <div>
              <label className="label">Mot de passe</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  name="motDePasse" value={form.motDePasse}
                  onChange={handleChange} autoComplete="current-password"
                  className="input pr-10" placeholder="••••••••"
                />
                <button
                  type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d={showPw
                        ? "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        : "M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      }
                    />
                  </svg>
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-base">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Connexion en cours...
                </span>
              ) : 'Se connecter'}
            </button>
          </form>

          {/* Compte démo */}
          <div className="mt-5 p-3 rounded-xl bg-gray-50 border border-gray-100">
            <p className="text-xs text-gray-500 font-medium mb-1">Compte Admin de démonstration :</p>
            <p className="text-xs text-gray-600">📧 admin@samajob.sn &nbsp;·&nbsp; 🔑 Admin1234</p>
            <button
              type="button"
              onClick={() => setForm({ email: 'admin@samajob.sn', motDePasse: 'Admin1234' })}
              className="mt-1.5 text-xs text-primary-600 hover:underline"
            >
              Remplir automatiquement →
            </button>
          </div>

          <p className="text-center text-sm text-gray-500 mt-5">
            Pas encore de compte ?{' '}
            <Link to="/register" className="text-primary-600 font-semibold hover:text-primary-700">
              S'inscrire gratuitement
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
