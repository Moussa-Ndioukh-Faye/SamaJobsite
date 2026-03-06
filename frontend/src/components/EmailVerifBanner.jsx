import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const EmailVerifBanner = () => {
  const { user, isAuthenticated } = useAuth();
  const [sent, setSent]     = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isAuthenticated || !user || user.emailVerifie) return null;

  const handleResend = async () => {
    setLoading(true);
    try {
      await api.post('/auth/resend-verification');
      setSent(true);
    } catch {
      // silence
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-amber-50 border-b border-amber-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm text-amber-800">
          <svg className="w-4 h-4 flex-shrink-0 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Vérifiez votre adresse email pour accéder à toutes les fonctionnalités.</span>
        </div>
        {sent ? (
          <span className="text-xs text-green-700 font-medium whitespace-nowrap">Email envoyé ✓</span>
        ) : (
          <button
            onClick={handleResend} disabled={loading}
            className="text-xs font-semibold text-amber-700 underline hover:text-amber-900 whitespace-nowrap disabled:opacity-50"
          >
            {loading ? 'Envoi...' : 'Renvoyer l\'email'}
          </button>
        )}
      </div>
    </div>
  );
};

export default EmailVerifBanner;
