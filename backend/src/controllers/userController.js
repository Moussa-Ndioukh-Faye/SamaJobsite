const prisma = require('../db');
const { body }  = require('express-validator');
const bcrypt    = require('bcrypt');

// ─── Validations ──────────────────────────────────────────────────────────────

const updateProfileValidation = [
  body('nom').optional().trim().notEmpty().isLength({ max: 100 }).withMessage('Nom invalide (100 caractères max)'),
  body('telephone').optional().trim().isLength({ max: 20 }).withMessage('Téléphone invalide'),
  body('domaine').optional().trim().isLength({ max: 100 }),
  body('bio').optional().trim().isLength({ max: 1000 }).withMessage('Bio trop longue (1000 caractères max)'),
  body('competences')
    .optional()
    .isArray({ max: 50 })
    .withMessage('Les compétences doivent être un tableau (50 max)'),
  body('competences.*')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Chaque compétence est limitée à 100 caractères'),
  // La photo doit être une URL http(s) valide ou vide
  body('photo')
    .optional({ nullable: true })
    .trim()
    .custom(val => {
      if (!val) return true;
      try { new URL(val); } catch { throw new Error('URL de photo invalide'); }
      if (!/^https?:\/\//i.test(val)) throw new Error("L'URL de photo doit commencer par http(s)://");
      return true;
    }),
];

// ─── Utilitaire ───────────────────────────────────────────────────────────────

const parseId = (value) => {
  const id = parseInt(value, 10);
  return Number.isNaN(id) || id < 1 ? null : id;
};

// ─── Contrôleurs ──────────────────────────────────────────────────────────────

/**
 * GET /api/users/prestataires
 * Lister les prestataires validés (public)
 */
const getPrestataires = async (req, res, next) => {
  try {
    const { domaine } = req.query;
    const search = typeof req.query.search === 'string'
      ? req.query.search.slice(0, 100)
      : undefined;

    const prestataires = await prisma.user.findMany({
      where: {
        role: 'PRESTATAIRE',
        statut: 'VALIDE',
        ...(domaine && { domaine }),
        ...(search  && {
          OR: [
            { nom: { contains: search, mode: 'insensitive' } },
            { bio: { contains: search, mode: 'insensitive' } },
          ],
        }),
      },
      select: {
        id: true, nom: true, domaine: true, competences: true,
        bio: true, photo: true, dateCreation: true,
        // email et telephone exclus (données privées)
      },
    });

    res.json({ prestataires });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/users/:id
 * Profil public d'un utilisateur
 */
const getUserById = async (req, res, next) => {
  try {
    const userId = parseId(req.params.id);
    if (!userId) return res.status(400).json({ message: 'ID utilisateur invalide' });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true, nom: true, role: true, statut: true,
        domaine: true, competences: true, bio: true,
        photo: true, dateCreation: true,
        // email et telephone exclus (données privées)
        evaluationsDonnees: {
          select: { note: true, commentaire: true, createdAt: true },
        },
      },
    });

    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' });

    const notes = user.evaluationsDonnees.map(e => e.note);
    const noteMoyenne = notes.length
      ? Math.round((notes.reduce((a, b) => a + b, 0) / notes.length) * 10) / 10
      : null;

    res.json({ user: { ...user, noteMoyenne } });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/users/profil
 * Mettre à jour son propre profil
 */
const updateProfile = async (req, res, next) => {
  try {
    const { nom, telephone, domaine, bio, competences, photo } = req.body;

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        ...(nom         !== undefined && { nom }),
        ...(telephone   !== undefined && { telephone }),
        ...(domaine     !== undefined && { domaine }),
        ...(bio         !== undefined && { bio }),
        ...(competences !== undefined && { competences }),
        ...(photo       !== undefined && { photo: photo || null }),
      },
      select: {
        id: true, nom: true, email: true, role: true, statut: true,
        telephone: true, domaine: true, competences: true, bio: true, photo: true,
      },
    });

    res.json({ message: 'Profil mis à jour', user });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/users/mot-de-passe
 * Changer son mot de passe
 */
const changePassword = async (req, res, next) => {
  try {
    const { ancienMotDePasse, nouveauMotDePasse } = req.body;

    if (!ancienMotDePasse || !nouveauMotDePasse) {
      return res.status(400).json({ message: 'Les deux mots de passe sont requis' });
    }

    if (typeof nouveauMotDePasse !== 'string' || nouveauMotDePasse.length < 6) {
      return res.status(400).json({ message: 'Le nouveau mot de passe doit faire au moins 6 caractères' });
    }

    if (nouveauMotDePasse.length > 128) {
      return res.status(400).json({ message: 'Le mot de passe est trop long (128 caractères max)' });
    }

    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' });

    const match = await bcrypt.compare(ancienMotDePasse, user.motDePasse);
    if (!match) {
      return res.status(401).json({ message: 'Ancien mot de passe incorrect' });
    }

    const hashed = await bcrypt.hash(nouveauMotDePasse, 12);
    await prisma.user.update({
      where: { id: req.user.id },
      data: { motDePasse: hashed },
    });

    res.json({ message: 'Mot de passe modifié avec succès' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPrestataires,
  getUserById,
  updateProfile,
  changePassword,
  updateProfileValidation,
};
