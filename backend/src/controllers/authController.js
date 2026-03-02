const bcrypt = require('bcrypt');
const jwt    = require('jsonwebtoken');
const prisma = require('../db');
const { body } = require('express-validator');

// ─── Validations ──────────────────────────────────────────────────────────────

const registerValidation = [
  body('nom').trim().notEmpty().withMessage('Le nom est requis'),
  body('email').isEmail().normalizeEmail().withMessage('Email invalide'),
  body('motDePasse')
    .isLength({ min: 6 })
    .withMessage('Le mot de passe doit faire au moins 6 caractères'),
  body('role')
    .optional()
    .isIn(['CLIENT', 'PRESTATAIRE'])
    .withMessage('Rôle invalide'),
];

const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Email invalide'),
  body('motDePasse').notEmpty().withMessage('Mot de passe requis'),
];

// ─── Contrôleurs ──────────────────────────────────────────────────────────────

/**
 * POST /api/auth/register
 * Inscription d'un nouvel utilisateur
 */
const register = async (req, res, next) => {
  try {
    const { nom, email, motDePasse, role = 'CLIENT', telephone } = req.body;

    // Vérifier si l'email existe déjà
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'Cet email est déjà utilisé' });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(motDePasse, 12);

    // Statut initial : CLIENT est VALIDE directement, PRESTATAIRE attend validation
    const statut = role === 'CLIENT' ? 'VALIDE' : 'EN_ATTENTE';

    const user = await prisma.user.create({
      data: {
        nom,
        email,
        motDePasse: hashedPassword,
        role,
        statut,
        telephone,
      },
      select: {
        id: true,
        nom: true,
        email: true,
        role: true,
        statut: true,
        dateCreation: true,
      },
    });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(201).json({
      message: role === 'PRESTATAIRE'
        ? 'Compte créé. En attente de validation par l\'administrateur.'
        : 'Compte créé avec succès.',
      token,
      user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/login
 * Connexion d'un utilisateur
 */
const login = async (req, res, next) => {
  try {
    const { email, motDePasse } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    const passwordMatch = await bcrypt.compare(motDePasse, user.motDePasse);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    if (user.statut === 'SUSPENDU') {
      return res.status(403).json({ message: 'Compte suspendu. Contactez l\'administration.' });
    }

    if (user.statut === 'REJETE') {
      return res.status(403).json({ message: 'Votre dossier a été rejeté. Contactez l\'administration.' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    const { motDePasse: _, ...userWithoutPassword } = user;

    res.json({
      message: 'Connexion réussie',
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/auth/me
 * Récupérer le profil de l'utilisateur connecté
 */
const getMe = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        nom: true,
        email: true,
        role: true,
        statut: true,
        telephone: true,
        domaine: true,
        competences: true,
        bio: true,
        photo: true,
        dateCreation: true,
      },
    });

    res.json({ user });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getMe, registerValidation, loginValidation };
