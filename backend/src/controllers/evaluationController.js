const prisma           = require('../db');
const { body }         = require('express-validator');

const evaluationValidation = [
  body('missionId').isInt({ min: 1 }).withMessage('ID de mission invalide'),
  body('note').isInt({ min: 1, max: 5 }).withMessage('La note doit être entre 1 et 5'),
  body('commentaire').optional().trim(),
];

/**
 * POST /api/evaluations
 * Créer une évaluation après une mission terminée
 */
const createEvaluation = async (req, res, next) => {
  try {
    const { missionId, note, commentaire } = req.body;

    const mission = await prisma.mission.findUnique({ where: { id: parseInt(missionId) } });
    if (!mission) return res.status(404).json({ message: 'Mission introuvable' });
    if (mission.statut !== 'TERMINEE') {
      return res.status(400).json({ message: 'Vous ne pouvez évaluer qu\'une mission terminée' });
    }
    if (mission.clientId !== req.user.id) {
      return res.status(403).json({ message: 'Seul le client peut évaluer la mission' });
    }

    // Vérifier si déjà évalué
    const existing = await prisma.evaluation.findFirst({
      where: { missionId: parseInt(missionId), auteurId: req.user.id },
    });
    if (existing) return res.status(409).json({ message: 'Vous avez déjà évalué cette mission' });

    const evaluation = await prisma.evaluation.create({
      data: {
        missionId: parseInt(missionId),
        note: parseInt(note),
        commentaire,
        auteurId: req.user.id,
      },
    });

    res.status(201).json({ message: 'Évaluation soumise', evaluation });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/evaluations/mission/:missionId
 * Évaluations d'une mission
 */
const getEvaluationsByMission = async (req, res, next) => {
  try {
    const evaluations = await prisma.evaluation.findMany({
      where: { missionId: parseInt(req.params.missionId) },
      include: { auteur: { select: { id: true, nom: true, photo: true } } },
    });
    res.json({ evaluations });
  } catch (error) {
    next(error);
  }
};

module.exports = { createEvaluation, getEvaluationsByMission, evaluationValidation };
