const prisma = require('../db');
const { body } = require('express-validator');

// ─── Validations ──────────────────────────────────────────────────────────────

const candidatureValidation = [
  body('missionId').isInt({ min: 1 }).withMessage('ID de mission invalide'),
  body('message').trim().notEmpty().withMessage('Le message de candidature est requis'),
  body('propositionPrix').isFloat({ min: 0 }).withMessage('Prix invalide'),
];

// ─── Contrôleurs ──────────────────────────────────────────────────────────────

/**
 * POST /api/candidatures
 * Déposer une candidature (PRESTATAIRE validé uniquement)
 */
const createCandidature = async (req, res, next) => {
  try {
    const { missionId, message, propositionPrix } = req.body;

    // Vérifier que la mission existe et est ouverte
    const mission = await prisma.mission.findUnique({ where: { id: parseInt(missionId) } });
    if (!mission) return res.status(404).json({ message: 'Mission introuvable' });
    if (mission.statut !== 'OUVERTE') {
      return res.status(400).json({ message: 'Cette mission n\'est plus ouverte' });
    }

    // Un prestataire ne peut pas postuler à sa propre mission (impossible mais sécurité)
    if (mission.clientId === req.user.id) {
      return res.status(400).json({ message: 'Vous ne pouvez pas postuler à votre propre mission' });
    }

    // Vérifier si déjà candidaté
    const existing = await prisma.candidature.findUnique({
      where: { missionId_prestataireId: { missionId: parseInt(missionId), prestataireId: req.user.id } },
    });
    if (existing) return res.status(409).json({ message: 'Vous avez déjà postulé à cette mission' });

    const candidature = await prisma.candidature.create({
      data: {
        missionId: parseInt(missionId),
        prestataireId: req.user.id,
        message,
        propositionPrix: parseFloat(propositionPrix),
      },
      include: {
        mission: { select: { titre: true } },
        prestataire: { select: { id: true, nom: true } },
      },
    });

    res.status(201).json({ message: 'Candidature soumise avec succès', candidature });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/candidatures/mes-candidatures
 * Candidatures du prestataire connecté
 */
const getMesCandidatures = async (req, res, next) => {
  try {
    const candidatures = await prisma.candidature.findMany({
      where: { prestataireId: req.user.id },
      include: {
        mission: {
          include: {
            client: { select: { id: true, nom: true, photo: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ candidatures });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/candidatures/mission/:missionId
 * Candidatures d'une mission (CLIENT propriétaire uniquement)
 */
const getCandidaturesByMission = async (req, res, next) => {
  try {
    const missionId = parseInt(req.params.missionId);

    const mission = await prisma.mission.findUnique({ where: { id: missionId } });
    if (!mission) return res.status(404).json({ message: 'Mission introuvable' });

    if (mission.clientId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    const candidatures = await prisma.candidature.findMany({
      where: { missionId },
      include: {
        prestataire: {
          select: {
            id: true, nom: true, photo: true,
            domaine: true, competences: true, bio: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    res.json({ candidatures });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/candidatures/:id/statut
 * Accepter ou refuser une candidature (CLIENT propriétaire)
 */
const updateStatutCandidature = async (req, res, next) => {
  try {
    const candidatureId = parseInt(req.params.id);
    const { statut } = req.body;

    if (!['ACCEPTEE', 'REFUSEE'].includes(statut)) {
      return res.status(400).json({ message: 'Statut invalide' });
    }

    const candidature = await prisma.candidature.findUnique({
      where: { id: candidatureId },
      include: { mission: true },
    });

    if (!candidature) return res.status(404).json({ message: 'Candidature introuvable' });

    if (candidature.mission.clientId !== req.user.id) {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    const updated = await prisma.candidature.update({
      where: { id: candidatureId },
      data: { statut },
    });

    // Si acceptée, passer la mission en ATTRIBUEE
    if (statut === 'ACCEPTEE') {
      await prisma.mission.update({
        where: { id: candidature.missionId },
        data: { statut: 'ATTRIBUEE' },
      });

      // Refuser les autres candidatures
      await prisma.candidature.updateMany({
        where: {
          missionId: candidature.missionId,
          id: { not: candidatureId },
          statut: 'EN_ATTENTE',
        },
        data: { statut: 'REFUSEE' },
      });
    }

    res.json({ message: `Candidature ${statut.toLowerCase()}`, candidature: updated });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCandidature,
  getMesCandidatures,
  getCandidaturesByMission,
  updateStatutCandidature,
  candidatureValidation,
};
