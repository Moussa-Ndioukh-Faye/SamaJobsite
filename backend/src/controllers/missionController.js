const prisma = require('../db');
const { body } = require('express-validator');

// ─── Validations ──────────────────────────────────────────────────────────────

const missionValidation = [
  body('titre').trim().notEmpty().isLength({ max: 200 }).withMessage('Titre requis (200 caractères max)'),
  body('description').trim().notEmpty().isLength({ max: 5000 }).withMessage('Description requise (5000 caractères max)'),
  body('domaine').trim().notEmpty().withMessage('Le domaine est requis'),
  body('budget').isFloat({ min: 0, max: 100_000_000 }).withMessage('Budget invalide'),
  body('lieu').trim().notEmpty().isLength({ max: 200 }).withMessage('Lieu requis (200 caractères max)'),
  body('dateMission').isISO8601().withMessage('Date invalide'),
];

// ─── Utilitaire ───────────────────────────────────────────────────────────────

const parseId = (value) => {
  const id = parseInt(value, 10);
  return Number.isNaN(id) || id < 1 ? null : id;
};

// ─── Contrôleurs ──────────────────────────────────────────────────────────────

/**
 * GET /api/missions
 * Lister toutes les missions ouvertes (avec filtres optionnels)
 */
const getMissions = async (req, res, next) => {
  try {
    const { domaine, lieu, budgetMin, budgetMax, statut } = req.query;
    // Limite la longueur de la recherche pour éviter les requêtes abusives
    const search = typeof req.query.search === 'string'
      ? req.query.search.slice(0, 100)
      : undefined;

    const where = {
      statut: statut || 'OUVERTE',
      ...(domaine && { domaine }),
      ...(lieu    && { lieu: { contains: lieu.slice(0, 100), mode: 'insensitive' } }),
      ...(search  && {
        OR: [
          { titre:       { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      }),
      ...(budgetMin || budgetMax ? {
        budget: {
          ...(budgetMin && { gte: parseFloat(budgetMin) }),
          ...(budgetMax && { lte: parseFloat(budgetMax) }),
        },
      } : {}),
    };

    const missions = await prisma.mission.findMany({
      where,
      include: {
        client: { select: { id: true, nom: true, photo: true } },
        _count: { select: { candidatures: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ missions });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/missions/:id
 * Détail d'une mission
 * NB : le numéro de téléphone du client n'est PAS exposé ici (données publiques)
 */
const getMissionById = async (req, res, next) => {
  try {
    const missionId = parseId(req.params.id);
    if (!missionId) return res.status(400).json({ message: 'ID de mission invalide' });

    const mission = await prisma.mission.findUnique({
      where: { id: missionId },
      include: {
        // telephone exclu volontairement : donnée privée non nécessaire publiquement
        client: { select: { id: true, nom: true, photo: true } },
        candidatures: {
          include: {
            prestataire: { select: { id: true, nom: true, photo: true, domaine: true, competences: true } },
          },
        },
        evaluations: {
          include: { auteur: { select: { id: true, nom: true } } },
        },
        _count: { select: { candidatures: true } },
      },
    });

    if (!mission) return res.status(404).json({ message: 'Mission introuvable' });

    res.json({ mission });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/missions
 * Créer une mission (CLIENT uniquement)
 */
const createMission = async (req, res, next) => {
  try {
    const { titre, description, domaine, budget, lieu, dateMission } = req.body;

    const mission = await prisma.mission.create({
      data: {
        titre,
        description,
        domaine,
        budget: parseFloat(budget),
        lieu,
        dateMission: new Date(dateMission),
        clientId: req.user.id,
      },
      include: {
        client: { select: { id: true, nom: true } },
      },
    });

    res.status(201).json({ message: 'Mission créée avec succès', mission });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/missions/:id
 * Modifier une mission (propriétaire ou ADMIN)
 * Note : seul un ADMIN peut modifier le statut directement
 */
const updateMission = async (req, res, next) => {
  try {
    const missionId = parseId(req.params.id);
    if (!missionId) return res.status(400).json({ message: 'ID de mission invalide' });

    const existing = await prisma.mission.findUnique({ where: { id: missionId } });
    if (!existing) return res.status(404).json({ message: 'Mission introuvable' });

    if (existing.clientId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    const { titre, description, domaine, budget, lieu, dateMission, statut } = req.body;

    // Seul un ADMIN peut modifier le statut directement
    const statutAllowed = req.user.role === 'ADMIN' && statut
      ? { statut }
      : {};

    const mission = await prisma.mission.update({
      where: { id: missionId },
      data: {
        ...(titre       && { titre:       String(titre).slice(0, 200) }),
        ...(description && { description: String(description).slice(0, 5000) }),
        ...(domaine     && { domaine }),
        ...(budget      && { budget: parseFloat(budget) }),
        ...(lieu        && { lieu:         String(lieu).slice(0, 200) }),
        ...(dateMission && { dateMission: new Date(dateMission) }),
        ...statutAllowed,
      },
    });

    res.json({ message: 'Mission mise à jour', mission });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/missions/:id
 * Supprimer une mission (propriétaire ou ADMIN)
 */
const deleteMission = async (req, res, next) => {
  try {
    const missionId = parseId(req.params.id);
    if (!missionId) return res.status(400).json({ message: 'ID de mission invalide' });

    const existing = await prisma.mission.findUnique({ where: { id: missionId } });
    if (!existing) return res.status(404).json({ message: 'Mission introuvable' });

    if (existing.clientId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    await prisma.mission.delete({ where: { id: missionId } });

    res.json({ message: 'Mission supprimée' });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/missions/mes-missions
 * Missions du client connecté
 */
const getMesMissions = async (req, res, next) => {
  try {
    const missions = await prisma.mission.findMany({
      where: { clientId: req.user.id },
      include: {
        _count: { select: { candidatures: true } },
        candidatures: {
          where: { statut: 'ACCEPTEE' },
          include: {
            prestataire: { select: { id: true, nom: true, photo: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ missions });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMissions,
  getMissionById,
  createMission,
  updateMission,
  deleteMission,
  getMesMissions,
  missionValidation,
};
