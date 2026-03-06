import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../services/api';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('loading'); // loading | success | error

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) { setStatus('error'); return; }

    api.get(`/auth/verify-email?token=${token}`)
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'));
  }, []);

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-br from-primary-900 via-primary-700 to-secondary-600 px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-md w-full text-center">
        {status === 'loading' && (
          <>
            <svg className="w-12 h-12 animate-spin text-primary-600 mx-auto mb-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
            <p className="text-gray-600">Vérification en cours...</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Email vérifié !</h1>
            <p className="text-gray-500 mb-6">Votre adresse email a été confirmée. Votre compte est maintenant actif.</p>
            <Link to="/login" className="btn-primary w-full inline-block text-center">
              Se connecter
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Lien invalide</h1>
            <p className="text-gray-500 mb-6">Ce lien est invalide ou a déjà été utilisé. Connectez-vous et renvoyez un email depuis votre profil.</p>
            <Link to="/login" className="btn-primary w-full inline-block text-center">
              Se connecter
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
