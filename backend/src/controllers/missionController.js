const prisma = require('../db');
const { body } = require('express-validator');

// ─── Validations ──────────────────────────────────────────────────────────────

const missionValidation = [
  body('titre').trim().notEmpty().withMessage('Le titre est requis'),
  body('description').trim().notEmpty().withMessage('La description est requise'),
  body('domaine').trim().notEmpty().withMessage('Le domaine est requis'),
  body('budget').isFloat({ min: 0 }).withMessage('Budget invalide'),
  body('lieu').trim().notEmpty().withMessage('Le lieu est requis'),
  body('dateMission').isISO8601().withMessage('Date invalide'),
];

// ─── Contrôleurs ──────────────────────────────────────────────────────────────

/**
 * GET /api/missions
 * Lister toutes les missions ouvertes (avec filtres optionnels)
 */
const getMissions = async (req, res, next) => {
  try {
    const { domaine, lieu, budgetMin, budgetMax, search } = req.query;

    const where = {
      statut: 'OUVERTE',
      ...(domaine && { domaine }),
      ...(lieu    && { lieu: { contains: lieu, mode: 'insensitive' } }),
      ...(search  && {
        OR: [
          { titre: { contains: search, mode: 'insensitive' } },
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
 */
const getMissionById = async (req, res, next) => {
  try {
    const mission = await prisma.mission.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        client: { select: { id: true, nom: true, photo: true, telephone: true } },
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

    if (!mission) {
      return res.status(404).json({ message: 'Mission introuvable' });
    }

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
 * Modifier une mission (propriétaire uniquement)
 */
const updateMission = async (req, res, next) => {
  try {
    const missionId = parseInt(req.params.id);

    const existing = await prisma.mission.findUnique({ where: { id: missionId } });
    if (!existing) return res.status(404).json({ message: 'Mission introuvable' });

    if (existing.clientId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    const { titre, description, domaine, budget, lieu, dateMission, statut } = req.body;

    const mission = await prisma.mission.update({
      where: { id: missionId },
      data: {
        ...(titre       && { titre }),
        ...(description && { description }),
        ...(domaine     && { domaine }),
        ...(budget      && { budget: parseFloat(budget) }),
        ...(lieu        && { lieu }),
        ...(dateMission && { dateMission: new Date(dateMission) }),
        ...(statut      && { statut }),
      },
    });

    res.json({ message: 'Mission mise à jour', mission });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/missions/:id
 * Supprimer une mission
 */
const deleteMission = async (req, res, next) => {
  try {
    const missionId = parseInt(req.params.id);

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
