import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000, // 10 secondes max
});

// ─── Messages d'erreur HTTP lisibles en français ───────────────────────────────
const HTTP_ERRORS = {
  400: 'Données invalides. Vérifiez les informations saisies.',
  401: 'Session expirée. Veuillez vous reconnecter.',
  403: 'Accès refusé. Vous n\'avez pas les droits nécessaires.',
  404: 'Ressource introuvable.',
  409: 'Conflit : cette ressource existe déjà.',
  422: 'Les données envoyées sont incorrectes.',
  429: 'Trop de requêtes. Attendez un moment avant de réessayer.',
  500: 'Erreur interne du serveur. Réessayez dans quelques instants.',
  502: 'Le serveur est temporairement indisponible.',
  503: 'Service indisponible. Veuillez réessayer plus tard.',
};

/**
 * Extrait un message d'erreur lisible depuis une réponse Axios
 */
export const getErrorMessage = (error) => {
  // Pas de connexion réseau / serveur éteint
  if (!error.response) {
    if (error.code === 'ECONNABORTED') {
      return 'La requête a pris trop de temps. Vérifiez votre connexion internet.';
    }
    return 'Impossible de joindre le serveur. Vérifiez que le backend est démarré sur http://localhost:5000';
  }

  const { status, data } = error.response;

  // Message renvoyé par l'API (priorité maximale)
  if (data?.message) return data.message;

  // Erreurs de validation détaillées
  if (data?.errors?.length > 0) {
    return data.errors.map(e => e.message).join(' • ');
  }

  // Message HTTP générique
  return HTTP_ERRORS[status] || `Erreur inattendue (code ${status})`;
};

// ─── Intercepteur requêtes : injection du token JWT ───────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('samajob_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Intercepteur réponses : gestion centralisée des erreurs ──────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Token expiré → déconnexion automatique
    if (error.response?.status === 401) {
      localStorage.removeItem('samajob_token');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login?session=expired';
      }
    }

    // Enrichir l'erreur avec un message lisible
    error.friendlyMessage = getErrorMessage(error);

    return Promise.reject(error);
  }
);

export default api;
