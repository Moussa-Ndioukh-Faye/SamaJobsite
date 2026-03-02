const prisma = require('../db');
const { body }  = require('express-validator');
const bcrypt    = require('bcrypt');

// ─── Validations ──────────────────────────────────────────────────────────────

const updateProfileValidation = [
  body('nom').optional().trim().notEmpty().withMessage('Le nom ne peut pas être vide'),
  body('telephone').optional().trim(),
  body('domaine').optional().trim(),
  body('bio').optional().trim(),
  body('competences').optional().isArray().withMessage('Les compétences doivent être un tableau'),
];

// ─── Contrôleurs ──────────────────────────────────────────────────────────────

/**
 * GET /api/users/prestataires
 * Lister les prestataires validés (public)
 */
const getPrestataires = async (req, res, next) => {
  try {
    const { domaine, search } = req.query;

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
    const user = await prisma.user.findUnique({
      where: { id: parseInt(req.params.id) },
      select: {
        id: true, nom: true, role: true, statut: true,
        domaine: true, competences: true, bio: true,
        photo: true, dateCreation: true,
        evaluationsDonnees: {
          select: { note: true, commentaire: true, createdAt: true },
        },
      },
    });

    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' });

    // Calcul de la note moyenne
    const notes = user.evaluationsDonnees.map(e => e.note);
    const noteMoyenne = notes.length ? notes.reduce((a, b) => a + b, 0) / notes.length : null;

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
        ...(photo       !== undefined && { photo }),
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

    if (nouveauMotDePasse.length < 6) {
      return res.status(400).json({ message: 'Le nouveau mot de passe doit faire au moins 6 caractères' });
    }

    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
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
