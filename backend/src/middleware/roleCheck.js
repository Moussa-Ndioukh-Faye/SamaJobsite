/**
 * Middleware de vérification des rôles
 * Usage : authorize('ADMIN') ou authorize('CLIENT', 'ADMIN')
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Non authentifié' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Accès refusé. Rôle requis : ${roles.join(' ou ')}`,
      });
    }

    next();
  };
};

/**
 * Middleware pour vérifier que le prestataire est validé
 */
const requireValidated = (req, res, next) => {
  if (req.user.role === 'PRESTATAIRE' && req.user.statut !== 'VALIDE') {
    return res.status(403).json({
      message: 'Votre profil prestataire est en attente de validation par un administrateur.',
    });
  }
  next();
};

module.exports = { authorize, requireValidated };
