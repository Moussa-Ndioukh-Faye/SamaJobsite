const bcrypt  = require('bcrypt');
const jwt     = require('jsonwebtoken');
const crypto  = require('crypto');
const prisma  = require('../db');
const { body } = require('express-validator');
const { sendVerificationEmail } = require('../utils/email');

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

    const tokenVerification = crypto.randomBytes(32).toString('hex');

    const user = await prisma.user.create({
      data: {
        nom,
        email,
        motDePasse: hashedPassword,
        role,
        statut,
        telephone,
        tokenVerification,
      },
      select: {
        id: true,
        nom: true,
        email: true,
        role: true,
        statut: true,
        emailVerifie: true,
        dateCreation: true,
      },
    });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    // Envoyer l'email de vérification (non bloquant)
    sendVerificationEmail({ to: user.email, nom: user.nom, token: tokenVerification }).catch(console.error);

    res.status(201).json({
      message: role === 'PRESTATAIRE'
        ? 'Compte créé. En attente de validation. Vérifiez votre email.'
        : 'Compte créé ! Vérifiez votre email pour activer votre compte.',
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
        documents: true,
        emailVerifie: true,
        dateCreation: true,
      },
    });

    res.json({ user });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/auth/verify-email?token=xxx
 * Vérifier l'email via le lien reçu
 */
const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.query;

    if (!token || typeof token !== 'string') {
      return res.status(400).json({ message: 'Token manquant' });
    }

    const user = await prisma.user.findUnique({
      where: { tokenVerification: token },
    });

    if (!user) {
      return res.status(400).json({ message: 'Lien invalide ou déjà utilisé' });
    }

    if (user.emailVerifie) {
      return res.json({ message: 'Email déjà vérifié' });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerifie: true, tokenVerification: null },
    });

    res.json({ message: 'Email vérifié avec succès !' });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/resend-verification
 * Renvoyer l'email de vérification
 */
const resendVerification = async (req, res, next) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Non authentifié' });

    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' });
    if (user.emailVerifie) return res.json({ message: 'Email déjà vérifié' });

    const token = crypto.randomBytes(32).toString('hex');
    await prisma.user.update({
      where: { id: user.id },
      data: { tokenVerification: token },
    });

    await sendVerificationEmail({ to: user.email, nom: user.nom, token });
    res.json({ message: 'Email de vérification renvoyé' });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getMe, verifyEmail, resendVerification, registerValidation, loginValidation };
